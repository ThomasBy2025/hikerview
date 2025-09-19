// 对应的解析列表
let jx_platform = getParam("platform", "");
let jx_list = _getPath(["proxy", jx_platform, "details.json"], "_cache", 1);
let selectp = _getPath(["proxy", "selects.json"], "_cache", 1);



getTopImage({
    url: "hiker://empty"
});
d.push({
    title: "新增解析",
    url: $("#noLoading#").lazyRule((url1, url2, url3) => {
        if (!fileExist(url1)) {
            saveFile(url1, fetch(url2));
        }
        return "editFile://" + url1 + "@js=" + $.toString((url3) => {
            input = "file://" + input;
            let {
                platform,
                srcUrl
            } = $.require(input);
            if (platform && srcUrl) {
                url3 = url3.replace("#platform#", platform) + md5(srcUrl) + '.js';
                saveFile(url3, readFile(input));
                deleteFile(input);
                clearMyVar('proxyInitialization');
                refreshPage();
                return 'toast://保存成功';
            } else {
                return 'toast://参数异常';
            }
        }, url3);
    }, _getPath(["proxyExample.js"], "_cache", 1), getGitHub(["proxyExample.js"]), _getPath(["proxy", getParam("platform", "#platform#"), "proxys", ""], 0, 1)),
    col_type: 'text_2',
    extra: {
        pageTitle: "新解析",
        longClick: [{
            title: '删除缓存',
            js: $.toString((url) => {
                deleteFile(url);
                return 'toast://删除成功'
            }, _getPath(["proxyExample.js"], "_cache", 1))
        }, {
            title: '解析初始化',
            js: $.toString(() => {
                clearMyVar("proxyInitialization");
                refreshPage();
                return "hiker://empty";
            })
        }]
    }
});
d.push({
    title: '分享选中',
    col_type: 'text_2',
    url: $("#noLoading#").lazyRule(() => {
        require(config.preRule);
        // 准备分享的解析
        let selectp = _getPath(["proxy", "selects.json"], "_cache", 1);
        let selects = JSON.parse(readFile(selectp) || "[]") || [];
        selects = selects.filter(p => fileExist(p));
        if (selects.length === 0) return "toast://没有选中的解析";
        return getShareText(selects, "proxy", 0, selectp);
    }),
    extra: {
        longClick: [{
            title: '选中全部',
            js: $.toString((p1, p2) => {
                let arr = JSON.parse(readFile(p2) || "[]") || [];
                arr = arr.map(_ => _.path);
                saveFile(p1, JSON.stringify(arr));
                refreshPage();
                return "hiker://empty";
            }, selectp, jx_list)
        }, {
            title: '取消选中',
            js: $.toString((url) => {
                deleteFile(url);
                refreshPage();
                return "hiker://empty";
            }, selectp)
        }]
    }
});
d.push({
    col_type: 'line'
});



// 对应的解析列表
jx_list = _getPath(jx_list) || [];

// 确定使用的解析
let enableds = _getPath(["proxy", jx_platform, "open.json"]) || {};

// 准备分享的解析
let selects = _getPath(selectp) || [];



if (jx_list.length == 0) {
    d.push({
        title: Rich(Color("没有解析数据").bold().big()),
        desc: Rich("点我刷新".small()),
        url: $("#noLoading#").lazyRule(() => {
            clearMyVar('proxyInitialization');
            refreshPage(false);
            return 'hiker://empty';
        }),
        col_type: 'text_center_1',
        extra: {
            lineVisible: false
        }
    });
} else {
    jx_list.map((_, i) => {
        let _id = _.path;
        let isS = selects.indexOf(_id) != -1;
        let qualitys = _.supportedQualityType;
        let desc1 = ["low", "standard", "high", "super"].map(quality => qualitys.includes(quality) ? '★' : '☆').join("");
        d.push({
            title: (isS ? Color(_.title) : _.title).bold() + ("(" + _.version + ")").small().small(),
            desc: Color(desc1, "#2E5D8E"),
            pic_url: _.icon,
            col_type: 'avatar',
            url: $("#noLoading#").lazyRule((_, i, _id, sObj) => {
                require(config.preRule);
                const hikerPop = $.require("http://123.56.105.145/weisyr/js/hikerPop.js");
                hikerPop.selectCenterIcon({
                    iconList: [{
                        title: "分享解析",
                        icon: getImageUrl("share.svg")
                    }, {
                        title: "编辑解析",
                        icon: getImageUrl("edit.svg")
                    }, {
                        title: "删除解析",
                        icon: getImageUrl("uninstall.svg")
                    }, {
                        title: "位置排序",
                        icon: getImageUrl("sorted.svg")
                    }, sObj, {
                        title: "测试解析",
                        icon: getImageUrl("hijack.svg")
                    }],
                    title: _.title + "(" + _.version + ")",
                    extraMenu: new hikerPop.IconExtraMenu(() => {
                        if (Array.isArray(_.desc) && _.desc.length)
                            hikerPop.updateRecordsBottom(_.desc);
                        else
                            return "toast://没有简介";
                    }),
                    columns: 2,
                    // position: 0,
                    click(a) {
                        switch (a) {
                            case '编辑解析':
                                return "editFile://" + _.path + "@js=" + $.toString((platform, platformPath, platformCode) => {
                                    input = "file://" + input;
                                    clearMyVar('proxyInitialization');
                                    refreshPage(false);
                                    try {
                                        if ($.require(input).platform == platform) {
                                            return 'hiker://empty';
                                        }
                                    } catch (e) {}
                                    saveFile(platformPath, platformCode);
                                    return 'toast://参数异常，无法保存';
                                }, _.platform, _.path, readFile(_.path));
                                break;
                            case '测试解析':
                                let _Jiexi = $.require(_.path);
                                let QualityNames = _Jiexi.supportedQualityType.map(quality => {
                                    let name = {
                                        low: "标准音质",
                                        standard: "高品音质",
                                        high: "无损音质",
                                        super: "高品无损"
                                    } [quality];
                                    return name + " > " + quality;
                                });
                                hikerPop.selectCenterIcon({
                                    iconList: QualityNames.map(title => ({
                                        icon: "hiker://images/rule_type_audio",
                                        title: title
                                    })),
                                    title: "选择测试音质",
                                    columns: 1,
                                    click(a, i) {
                                        let quality = a.split(" > ")[1];
                                        try {
                                            let _Platform = _getPlatform(_.platform);
                                            let musicItem = _Platform.debug_musicItem;
                                            if (musicItem) {
                                                if (musicItem.qualities && musicItem.qualities[quality]) {
                                                    hikerPop.runOnNewThread(() => {
                                                        let _Jiexi_url = _Jiexi.getMediaSource(musicItem, quality);
                                                        hikerPop.confirm({
                                                            content: JSON.stringify(_Jiexi_url).replace(/^"|"$/g, "") || "没有链接",
                                                            title: "解析成功",
                                                            okTitle: "播放看看",
                                                            cancelTitle: "我知道了",
                                                            hideCancel: false, //隐藏取消按钮
                                                            confirm() {
                                                                if (_Jiexi_url.url && !(Array.isArray(_Jiexi_url.urls) && _Jiexi_url.urls.length)) {
                                                                    _Jiexi_url.urls = [_Jiexi_url.url];
                                                                }
                                                                return JSON.stringify(_Jiexi_url).replace(/^"|"$/g, "") || "toast://解析失败，没有链接";
                                                            },
                                                            cancel() {
                                                                return "hiker://empty";
                                                            }
                                                        });
                                                    });
                                                } else {
                                                    return "toast://插件的debug_musicItem.qualities不存在" + quality + "参数";
                                                }
                                            } else {
                                                return "toast://插件的debug_musicItem参数不存在";
                                            }
                                        } catch (e) {
                                            return "toast://未知异常";
                                        }
                                    }
                                });
                                break;
                            case '分享解析':
                                return getShareText([_.path], "proxy");
                                break;
                            case '删除解析':
                                return $("确定删除解析 " + _.title + " 吗？\n此操作不可逆，请谨慎选择。").confirm((path) => {
                                    deleteFile(path);
                                    clearMyVar("proxyInitialization");
                                    refreshPage();
                                    return "hiker://empty";
                                }, _.path);
                                break;
                            case '选中解析':
                            case '取消选中':
                                let selectp = _getPath(["proxy", "selects.json"], "_cache", 1);
                                let selects = JSON.parse(readFile(selectp) || "[]") || [];
                                let selecti = selects.indexOf(_id);
                                if (selecti == -1) {
                                    selects.push(_id);
                                } else {
                                    selects.splice(selecti, 1);
                                }
                                saveFile(selectp, JSON.stringify(selects));
                                refreshPage(false);
                                return "hiker://empty";
                                break;
                            case '位置排序':
                                let detailp = _getPath(["proxy", _.platform, "details.json"], "_cache", 1);
                                let details = JSON.parse(readFile(detailp) || "[]") || [];
                                details.splice(i, 1);
                                return $(details.concat({
                                    title: '最后面'
                                }), 2, '解析移动到').select((set, list, i1, set2) => {
                                    let i2
                                    if (input == '最后面') {
                                        i2 = list.length;
                                    } else {
                                        i2 = list.map(_ => _.title).indexOf(input);
                                    }
                                    let data = JSON.parse(readFile(set) || "[]") || [];
                                    let i3 = data[i1];
                                    data.splice(i1, 1);
                                    data.splice(i2, 0, i3);
                                    saveFile(set, JSON.stringify(data, 0, 1));
                                    let data2 = data.map(_ => md5(_.srcUrl) + ".js");
                                    saveFile(set2, JSON.stringify(data2));
                                    refreshPage();
                                    return "toast://更改成功";
                                }, detailp, details, i, _getPath(["proxy", _.platform, "sort.json"], 0, 1));
                                return "hiker://empty";
                                break;
                        }
                        return "hiker://empty";
                    }
                });
                return "hiker://empty";
            }, _, i, _id, isS ? {
                title: "取消选中",
                icon: getImageUrl("unselected.svg")
            } : {
                title: "选中解析",
                icon: getImageUrl("selected.svg")
            })
        });
        d.push({
            title: [_.platform, _.type, _.srcUrl].join("┃"),
            url: $('#noLoading#').lazyRule((jx_platform, _id) => {
                require(config.preRule);
                let enableds = _getPath(["proxy", jx_platform, "open.json"]) || {};
                enableds[_id] = !enableds[_id];
                saveFile(_getPath(["proxy", jx_platform, "open.json"], 0, 1), JSON.stringify(enableds));
                refreshPage(false);
                return 'hiker://empty';
            }, jx_platform, _id),
            col_type: 'text_icon',
            img: getImageUrl(enableds[_id] ? "open.svg" : "shut.svg"),
            extra: {
                lineVisible: false
            }
        });
        d.push({
            col_type: 'line'
        });
    });
}
setResult(d);