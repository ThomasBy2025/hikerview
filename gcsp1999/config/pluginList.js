let detailp = _getPath(["plugin", "details.json"], "_cache", 1);
let selectp = _getPath(["plugin", "selects.json"], "_cache", 1);

getTopImage({
    url: "hiker://empty",
});
d.push({
    title: "新增插件",
    url: $("#noLoading#").lazyRule((url1, url2, url3) => {
        if (!fileExist(url1)) {
            saveFile(url1, fetch(url2));
        }
        return "editFile://" + url1 + "@js=" + $.toString((url3) => {
            input = "file://" + input;
            url3 += $.require(input).platform + '.js';
            saveFile(url3, readFile(input));
            deleteFile(input);
            clearMyVar('pluginInitialization');
            refreshPage();
            return 'toast://保存成功';
        }, url3);
    }, _getPath(["pluginExample.js"], "_cache", 1), getGitHub(["pluginExample.js"]), _getPath(["plugin", "plugins", ""], 0, 1)),
    col_type: 'text_2',
    extra: {
        pageTitle: "新插件",
        longClick: [{
            title: '删除缓存',
            js: $.toString((url) => {
                deleteFile(url);
                return 'toast://删除成功';
            }, _getPath(["pluginExample.js"], "_cache", 1))
        }, {
            title: '插件初始化',
            js: $.toString(() => {
                clearMyVar("pluginInitialization");
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
        // 准备分享的插件
        let selectp = _getPath(["plugin", "selects.json"], "_cache", 1);
        let selects = JSON.parse(readFile(selectp) || "[]") || [];
        selects = selects.map(platform => {
            return _getPath(["plugin", "plugins", platform + ".js"], 0, 1);
        });
        selects = selects.filter(p => fileExist(p));
        if (selects.length === 0) return "toast://没有选中的插件";
        return getShareText(selects, "plugin", 0, selectp);
    }),
    extra: {
        longClick: [{
            title: '选中全部',
            js: $.toString((p1, p2) => {
                let arr = JSON.parse(readFile(p2) || "[]") || [];
                arr = arr.map(_ => _.platform);
                saveFile(p1, JSON.stringify(arr));
                refreshPage();
                return "hiker://empty";
            }, selectp, detailp)
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



// 确定使用的插件
let enableds = _getPath(["plugin", "enableds.json"]) || {};

// 代理劫持的插件
let hijacking = _getPath(["plugin", "hijacking.json"]) || {};

// 精简的插件信息
let details = JSON.parse(readFile(detailp) || "[]") || [];


// 准备分享的插件
let selects = JSON.parse(readFile(selectp) || "[]") || [];



if (details.length == 0) d.push({
    title: Rich(Color("没有插件数据").bold().big()),
    desc: Rich("点我刷新".small()),
    url: $("#noLoading#").lazyRule(() => {
        clearMyVar('pluginInitialization');
        refreshPage(false);
        return 'hiker://empty';
    }),
    col_type: 'text_center_1',
    extra: {
        lineVisible: false
    }
});
else details.map((_, i) => {
    let _id = _.platform;
    let isH = hijacking[_id];
    let isS = selects.indexOf(_id) != -1;

    d.push({
        title: (isS ? Color(_.title) : _.title).bold(),
        desc: _.type || "未知",
        url: $("#noLoading#").lazyRule((_, i, hObj, eObj) => {
                require(config.preRule);
                const hikerPop = $.require("http://123.56.105.145/weisyr/js/hikerPop.js");
                hikerPop.selectCenterIcon({
                    iconList: [{
                        title: "更新插件",
                        icon: getImageUrl("update.svg")
                    }, {
                        title: "编辑插件",
                        icon: getImageUrl("edit.svg")
                    }, {
                        title: "分享插件",
                        icon: getImageUrl("share.svg")
                    }, {
                        title: "解析管理",
                        icon: getImageUrl("proxy.svg")
                    }, {
                        title: "卸载插件",
                        icon: getImageUrl("uninstall.svg")
                    }, {
                        title: "用户变量",
                        icon: getImageUrl("account.svg")
                    }, {
                        title: "资源导入",
                        icon: getImageUrl("import.svg")
                    }, hObj, eObj, {
                        title: "位置排序",
                        icon: getImageUrl("sorted.svg")
                    }],
                    title: _.title + "(" + _.version + ")",
                    extraMenu: new hikerPop.IconExtraMenu(() => {
                        if (Array.isArray(_.description) && _.description.length)
                            hikerPop.updateRecordsBottom(_.description);
                        else
                            return "toast://没有简介";
                    }),
                    columns: 2,
                    // position: 0,
                    click(a) {
                        let pluginPath = _getPath(["plugin", "plugins", _.platform + ".js"], 0, 1);
                        switch (a) {
                            case '资源导入':
                                if (_.import_url) {
                                    hikerPop.inputAutoRow({
                                        hint: "填写正确的资源链接",
                                        title: "导入资源",
                                        defaultValue: "",
                                        //hideCancel: true,
                                        noAutoSoft: true, //不自动打开输入法
                                        confirm(urlLike) {
                                            hikerPop.runOnNewThread(() => {
                                                showLoading('获取资源详情');
                                                urlLike = function(s_t2) {
                                                    try { // 获取重定向链接
                                                        let s_t2_1 = !/antiserver.kuwo.cn/i.test(s_t2) && JSON.parse(fetch(s_t2, {
                                                            redirect: false,
                                                            onlyHeaders: true,
                                                            timeout: 3000
                                                        })).headers.location || "";
                                                        return (s_t2_1[0].split("/").length > 4 ? s_t2_1[0] : s_t2) || s_t2;
                                                    } catch (noFetch) {};
                                                    return s_t2;
                                                }(urlLike);
                                                let mediaItem = false;
                                                try {
                                                    mediaItem = $.require(pluginPath).import_url(urlLike);
                                                } catch (e) {}
                                                hideLoading();
                                                if (mediaItem) {
                                                    hikerPop.confirm({
                                                        content: mediaItem.title + "\n" + (mediaItem.artist || ""),
                                                        title: "获取「" + ["歌曲", "歌曲", "歌单", "榜单", "专辑", "歌手", "用户", "电台", "播客", "视频", "歌词", "评论"][mediaItem.type] + "」成功",
                                                        okTitle: "确定导入",
                                                        cancelTitle: "算了算了",
                                                        hideCancel: false, //隐藏取消按钮
                                                        confirm() {
                                                            hikerPop.runOnNewThread(() => {
                                                                return setCollectionData(mediaItem);
                                                            });
                                                        },
                                                        cancel() {
                                                            return "hiker://empty";
                                                        }
                                                    });
                                                    return "hiker://empty";
                                                }
                                                if (mediaItem === undefined) {
                                                    return "toast://链接格式未收录";
                                                }
                                                return "toast://资源获取失败";
                                            });
                                        },
                                        cancel() {
                                            return "hiker://empty";
                                        }
                                    });
                                    return "hiker://empty";
                                } else {
                                    return "toast://该插件没有写资源导入函数";
                                }
                                break;
                            case '更新插件':
                                if (_.srcUrl) {
                                    hikerPop.runOnNewThread(() => {
                                        let newPath = _getPath(["plugin", "newPlatform.js"], "_cache", 1);
                                        try {
                                            let newPlatform = fetch(_.srcUrl);
                                            log(_.srcUrl);
                                            log(newPlatform);
                                            if (newPlatform && newPlatform != "") {
                                                saveFile(newPath, newPlatform);
                                                newPath = $.require(newPath);
                                                if (newPath.platform == _.platform) {
                                                    let v1 = String(_.version || "0");
                                                    let v2 = String(newPath.version || "0");
                                                    let v3 = v1 != v2; // 版本是否一致
                                                    if (v3) {
                                                        v1 = v1.split(".");
                                                        v2 = v2.split(".");
                                                        v3 = false;
                                                        for (let v4 in v1) {
                                                            if (v1[v4] < v2[v4]) {
                                                                v3 = true;
                                                                break;
                                                            }
                                                        }
                                                        if (v3) {
                                                            saveFile(pluginPath, newPlatform);
                                                            clearMyVar('pluginInitialization');
                                                            refreshPage(false);
                                                            return 'toast://插件更新成功\n' + v1.join(".") + "=>" + v2.join(".");
                                                        }
                                                    }
                                                    return 'toast://插件没有更新';
                                                } else {
                                                    return 'toast://插件标识不一致';
                                                }
                                            } else {
                                                return 'toast://无法获取插件数据';
                                            }
                                        } catch (e) {
                                            return "toast://无法更新";
                                        }
                                    });
                                } else {
                                    return "toast://该插件不支持在线更新";
                                }
                                break;
                            case '编辑插件':
                                return "editFile://" + pluginPath + "@js=" + $.toString((platform, platformPath, platformCode) => {
                                    input = "file://" + input;
                                    clearMyVar('pluginInitialization');
                                    refreshPage(false);
                                    try {
                                        if ($.require(input).platform == platform) {
                                            return 'hiker://empty';
                                        }
                                    } catch (e) {}
                                    saveFile(platformPath, platformCode);
                                    return 'toast://参数异常，无法保存';
                                }, _.platform, pluginPath, readFile(pluginPath));
                                break;
                            case '分享插件':
                                return getShareText([pluginPath], "plugin");
                                break;
                            case '解析管理':
                                return _.platformProxy ? buildUrl("hiker://page/home", {
                                    p: "nopage",
                                    t: "proxyList",
                                    s: "#immersiveTheme##noHistory##noRecordHistory#",
                                    platform: _.platform,
                                    pageTitle: _.title + " - 解析管理",
                                    rule: MY_RULE.title,
                                }) : "toast://该插件不支持解析代理";
                                break;
                            case '卸载插件':
                                let fruit = ["删除解析文件", "清除账号数据", "注销用户变量"];
                                let checkedName = [];
                                hikerPop.multiChoice({
                                    title: "确定删除插件「" + _.title + "」吗？此操作不可逆，谨慎选择",
                                    options: fruit,
                                    checkedIndexs: [2],
                                    onChoice(i, isChecked) {
                                        // log(i + ":" + isChecked);
                                    },
                                    rightTitle: "#确认#",
                                    rightClick(options, checked) {
                                        options = options.filter((v, i) => checked[i]);
                                        if (options.includes("注销用户变量") && Array.isArray(_.userVariables) && _.userVariables.length) {
                                            _.userVariables.map(__ => {
                                                let _key = _.platform + "@userVariables@" + __.key;
                                                clearItem(_key);
                                            });
                                        }
                                        if (options.includes("删除解析文件")) {

                                        }
                                        deleteFile(pluginPath);
                                        clearMyVar('pluginInitialization');
                                        refreshPage(false);
                                        return "toast://删除插件「" + _.title + "」，同时" + options.join(",");
                                    },
                                    leftTitle: "算了",
                                    leftClick() {
                                        toast("好的");
                                    },
                                    // centerTitle: "取消",
                                });
                                break;
                            case '用户变量':
                                if (Array.isArray(_.userVariables) && _.userVariables.length) {
                                    let SettingItem = hikerPop.selectBottomSettingMenu.SettingItem;
                                    let options = [SettingItem("登录"), SettingItem()];
                                    let hintMap = {};
                                    _.userVariables.map(__ => {
                                        hintMap[__.key] = __.hint;
                                        let tit = __.name + "\r\n\n\n" + __.key;
                                        let val = getItem(_.platform + "@userVariables@" + __.key, "") || __.hint;
                                        options.push(SettingItem(tit, val.slice(0, 16)));
                                    });
                                    hikerPop.selectBottomSettingMenu({
                                        options,
                                        click(s, officeItem, change) {
                                            if ("登录" == s) return "toast://完善中";
                                            let [_title, _key] = s.split("\r\n\n\n");
                                            let _key2 = _.platform + "@userVariables@" + _key;
                                            hikerPop.inputAutoRow({
                                                hint: hintMap[_key],
                                                title: _title,
                                                defaultValue: getItem(_key2, ""),
                                                //hideCancel: true,
                                                noAutoSoft: true, //不自动打开输入法
                                                confirm(text) {
                                                    setItem(_key2, text);
                                                    officeItem.setDesc((text && text.slice(0, 16)) || hintMap[_key]);
                                                    change();
                                                    return "toast://保存了\n" + text;
                                                },
                                                cancel() {
                                                    return "toast://取消";
                                                }
                                            });
                                            change();
                                        },
                                        onDismiss() {
                                            refreshPage(false);
                                        }
                                    });
                                } else {
                                    return "toast://该插件不支持用户变量";
                                }
                                break;

                            case '取消劫持':
                                let hijackp = _getPath(["plugin", "hijacking.json"], 0, 1);
                                let hijacks = JSON.parse(readFile(hijackp) || "{}") || {};
                                delete hijacks[_.platform];
                                saveFile(hijackp, JSON.stringify(hijacks));
                                refreshPage();
                                return "hiker://empty";
                                break;
                            case '劫持代理':
                                let hijackd = _getPath(["plugin", "details.json"], "_cache", 1);
                                let hijackm = JSON.parse(readFile(hijackd) || "[]") || [];
                                hijackm.splice(i, 1);
                                return $(hijackm, 2, '使用 [选择的插件] 解析资源').select((set, list, _platform) => {
                                    let i = list.map(_ => _.title).indexOf(input);
                                    let data = JSON.parse(readFile(set) || "{}") || {};
                                    data[_platform] = list[i].platform;
                                    saveFile(set, JSON.stringify(data, 0, 1));
                                    refreshPage();
                                    return "hiker://empty";
                                }, _getPath(["plugin", "hijacking.json"], 0, 1), hijackm, _.platform);
                                break;
                            case '选中插件':
                            case '取消选中':
                                let selectp = _getPath(["plugin", "selects.json"], "_cache", 1);
                                let selects = JSON.parse(readFile(selectp) || "[]") || [];
                                let selecti = selects.indexOf(_.platform);
                                if (selecti == -1) {
                                    selects.push(_.platform);
                                } else {
                                    selects.splice(selecti, 1);
                                }
                                saveFile(selectp, JSON.stringify(selects));
                                refreshPage(false);
                                return "hiker://empty";
                                break;
                            case '位置排序':
                                let detailp = _getPath(["plugin", "details.json"], "_cache", 1);
                                let details = JSON.parse(readFile(detailp) || "[]") || [];
                                details.splice(i, 1);
                                return $(details.concat({
                                    title: '最后面'
                                }), 2, '插件移动到').select((set, list, i1, set2) => {
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
                                    let data2 = data.map(_ => _.platform + ".js");
                                    saveFile(set2, JSON.stringify(data2));
                                    refreshPage();
                                    return "toast://更改成功";
                                }, detailp, details, i, _getPath(["plugin", "sorted.json"], 0, 1));
                                return "hiker://empty";
                                break;
                        }
                        return "hiker://empty";
                    }
                });
                return "hiker://empty";
            }, _, i, isH ? {
                title: "取消劫持",
                icon: getImageUrl("unhijack.svg")
            } : {
                title: "劫持代理",
                icon: getImageUrl("hijack.svg")
            },
            isS ? {
                title: "取消选中",
                icon: getImageUrl("unselected.svg")
            } : {
                title: "选中插件",
                icon: getImageUrl("selected.svg")
            }),
        col_type: 'avatar',
        pic_url: _.icon
    });
    d.push({
        title: [
            "标识: " + (isH ? "<s>" + _id + "</s> " + isH : _id),
            "版本: " + (_.version || "0"),
            "作者: " + (_.author || "未知")
        ].join("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;").small(),
        url: $('#noLoading#').lazyRule((_id) => {
            require(config.preRule);
            let enableds = _getPath(["plugin", "enableds.json"]) || {};
            enableds[_id] = !enableds[_id];
            saveFile(_getPath(["plugin", "enableds.json"], 0, 1), JSON.stringify(enableds));
            refreshPage(false);
            return 'hiker://empty';
        }, _id),
        col_type: 'text_icon',
        pic_url: getImageUrl(enableds[_id] ? "open.svg" : "shut.svg"),
        extra: {
            lineVisible: false
        }
    });
    d.push({
        col_type: 'line'
    });
});
setResult(d);