let detailp = _getPath(["source", "details.json"], "_cache", 1);
let selectp = _getPath(["source", "selects.json"], "_cache", 1);

getTopImage({
    url: $('#noLoading#').lazyRule((_, url) => {
        if (_.back)
            return back(true), 'hiker://empty';
        else
            return url;
    }, MY_PARAMS, MY_URL.replace("sourceList", "pluginList")),
    extra: {
        pageTitle: "插件管理",
        back: MY_PARAMS.back ? 0 : 1
    }
});
d.push({
    title: "导入音源",
    url: $("#noLoading#").lazyRule((furl) => {
        const hikerPop = $.require("http://123.56.105.145/weisyr/js/hikerPop.js");
        hikerPop.inputAutoRow({
            hint: "填写链接在线导入\n点击取消本地导入",
            title: "导入落雪音源",
            noAutoSoft: true,
            confirm(input) {
                hikerPop.runOnNewThread(() => {
                    try {
                        let scriptRaw = fetch(input);
                        if (!scriptRaw) return "toast://没有内容";
                        if (!scriptRaw.match(/\/\*[*!]([\s\S]*?)\*\//)) {
                            return "toast://格式错误？";
                        }
                        saveFile(furl + md5(Date.now() + "") + ".js", scriptRaw);
                        putMyVar('sourceInitialization', '3');
                        refreshPage();
                        return 'toast://导入成功';
                    } catch (e) {
                        return "toast://导入失败\n" + e.toString();
                    }
                });
            },
            cancel() {
                return "fileSelect://" + $.toString((furl) => {
                    let scriptRaw = readFile("file://" + input);
                    if (!scriptRaw) return "toast://没有内容";
                    if (!scriptRaw.match(/\/\*[*!]([\s\S]*?)\*\//)) {
                        return "toast://格式错误？";
                    }
                    saveFile(furl + md5(Date.now() + "") + ".js", scriptRaw);
                    putMyVar('sourceInitialization', '3');
                    refreshPage();
                    return 'toast://导入成功';
                }, furl);
            }
        });
        return "hiker://empty";
    }, _getPath(["source", "node_sources", ""], 0, 1)),
    col_type: 'text_2',
    extra: {
        pageTitle: "新音源",
        longClick: [{
            title: '音源初始化',
            js: $.toString(() => {
                clearMyVar("sourceInitialization");
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
        let selectp = _getPath(["source", "selects.json"], "_cache", 1);
        let selects = JSON.parse(readFile(selectp) || "[]") || [];
        selects = selects.map(sourceId => {
            return _getPath(["source", "node_sources", sourceId], 0, 1);
        });
        selects = selects.filter(p => fileExist(p));
        if (selects.length === 0) return "toast://没有选中的插件";
        return getShareText(selects, "source", 0, selectp);
    }),
    extra: {
        longClick: [{
            title: '选中全部',
            js: $.toString((p1, p2) => {
                let arr = JSON.parse(readFile(p2) || "[]") || [];
                arr = arr.map(_ => _.id);
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
let enableds = _getPath(["source", "enableds.json"]) || {};

// 精简的插件信息
let details = JSON.parse(readFile(detailp) || "[]") || [];

// 准备分享的插件
let selects = JSON.parse(readFile(selectp) || "[]") || [];



// 分组过滤
let groups = ["全部", "启用", "禁用"];
let group = getMyVar("source_filter", "全部");
details = details.filter(_ => {
    switch (group) {
        case "全部":
            return true;
            break;
        case "启用":
            return enableds[_.id];
            break;
        case "禁用":
            return !enableds[_.id];
            break;
        default:
            return _.id == group;
            break
    }
});
d.push({
    col_type: "big_blank_block"
});
groups.map((name, ii) => {
    d.push({
        title: Rich(Color(name, group != name && "Gray").bold()),
        url: $('#noLoading#').lazyRule((s_type) => {
            putMyVar('source_filter', s_type);
            refreshPage();
            return 'hiker://empty';
        }, name),
        col_type: 'scroll_button',
    });
});
if (!fetch("hiker://home@nodejs")) {
    d.push({
        title: Rich(Color("依赖程序缺失", "red").bold()),
        url: $("hiker://empty").lazyRule(() => {
            return "download://" + getItem("ghproxy", "") + "https://raw.githubusercontent.com/JMWpower/qdzhiyuan/refs/heads/main/nodejs.hk%E5%B0%8F%E7%A8%8B%E5%BA%8F.3.8.hkzip";
        }),
        col_type: 'scroll_button',
        extra: {
            pageTitle: "nodejs小程序.hkzip"
        }
    });
} else d.push({
    title: Rich((_getPath(["source", "lxserver.js"], "rules") ? Color("程序环境正常", "Gray") : Color("音源环境缺失", "red")).bold()),
    url: $("hiker://empty").lazyRule((targetDir, zipurl) => {
        confirm({
            title: '音源环境管理',
            content: '点击确定 更新/导入 音源环境',
            confirm: $.toString((targetDir, zipurl) => {
                showLoading('导入音源环境中...');
                var newInstance = java.lang.reflect.Array.newInstance;
                var zis = new java.util.zip.ZipInputStream(fetch(zipurl, {
                    inputStream: true
                }));
                var entry;
                while ((entry = zis.getNextEntry()) !== null) {
                    var f = new java.io.File(targetDir, entry.getName());
                    if (entry.isDirectory()) {
                        f.mkdirs();
                    } else {
                        f.getParentFile().mkdirs();
                        var fos = new java.io.FileOutputStream(f);
                        var wbuf = new newInstance(java.lang.Byte.TYPE, 1024);
                        var wlen;
                        while ((wlen = zis.read(wbuf)) > 0) fos.write(wbuf, 0, wlen);
                        fos.close();
                    }
                    zis.closeEntry();
                }
                zis.close();
                hideLoading();
                refreshPage();
                return "toast://导入成功";
            }, targetDir, zipurl)
        });
        return "hiker://empty";
    }, getPath(_getPath(["source", ""], 0, 1)).replace("file://", ""), getGitHub(["lxsource.zip"])),
    col_type: 'scroll_button',
});
d.push({
    col_type: "big_blank_block"
});




if (details.length == 0) d.push({
    title: Rich(Color("没有音源数据").bold().big()),
    desc: Rich("点我刷新".small()),
    url: $("#noLoading#").lazyRule(() => {
        clearMyVar('sourceInitialization');
        refreshPage();
        return 'hiker://empty';
    }),
    col_type: 'text_center_1',
    extra: {
        lineVisible: false
    }
});
else details.map((_, i) => {
    let _id = _.id;
    let isS = selects.indexOf(_id) != -1;

    d.push({
        title: Color(_.title + (" v" + _.version.replace(/^v/i, "")).small().small(), !isS && "#777777").bold(),
        desc: ("By " + (_.author || "佚名")).small().small().bold(),
        url: $("#noLoading#").lazyRule((_, i, isS) => {
            require(config.preRule);
            const hikerPop = $.require("http://123.56.105.145/weisyr/js/hikerPop.js");
            hikerPop.selectCenterIcon({
                iconList: [{
                    title: "更新音源",
                    icon: getImageUrl("update.svg")
                }, {
                    title: "编辑音源",
                    icon: getImageUrl("edit.svg")
                }, {
                    title: "分享音源",
                    icon: getImageUrl("share.svg")
                }, {
                    title: "发布页面",
                    icon: getImageUrl("account.svg")
                }, {
                    title: "卸载音源",
                    icon: getImageUrl("uninstall.svg")
                }, {
                    title: "获取链接", // 劫持代理
                    icon: getImageUrl("hijack.svg")
                }, (isS ? {
                    title: "取消选中",
                    icon: getImageUrl("unselected.svg")
                } : {
                    title: "选中音源",
                    icon: getImageUrl("selected.svg")
                }), {
                    title: "位置排序",
                    icon: getImageUrl("sorted.svg")
                }],
                title: _.title + " v" + _.version.replace(/^v/i, ""),
                extraMenu: new hikerPop.IconExtraMenu(() => {
                    hikerPop.updateRecordsBottom([{
                        "title": _.title,
                        "records": [
                            "版本: v" + _.version.replace(/^v/i, ""),
                            "作者: " + (_.author || "佚名"),
                            "发布: " + (_.homepage || "未知"),
                            "简介:\n\t\t\t\t" + (_.desc || "")
                        ]
                    }]);
                }),
                columns: 2,
                // position: 0,
                click(a) {
                    let sourcePath = _getPath(["source", "node_sources", _.id], 0, 1);
                    switch (a) {
                        case '更新音源':
                            hikerPop.runOnNewThread(() => {
                                try {
                                    showLoading('查看音源是否更新...');
                                    let res = JSON.parse(post("http://0.0.0.0:1999/lxmusic", {
                                        "body": JSON.stringify({
                                            "type": "update",
                                            "scriptId": _.id
                                        })
                                    }));
                                    hideLoading();
                                    if (!res.updateUrl) {
                                        return "toast://音源已经是最新版了";
                                    }
                                    hikerPop.confirm({
                                        content: res.log || "没有更新内容",
                                        title: "获取成功",
                                        okTitle: "立即更新",
                                        cancelTitle: "算了算了",
                                        hideCancel: false, //隐藏取消按钮
                                        confirm() {
                                            hikerPop.runOnNewThread(() => {
                                                showLoading('获取音源更新...');
                                                let raw = fetch(res.updateUrl);
                                                hideLoading();
                                                if (raw && raw.length) {
                                                    saveFile(sourcePath, raw);
                                                    // 注销音源更新内容，并挂载音源
                                                    post("http://0.0.0.0:1999/lxmusic", {
                                                        "body": JSON.stringify({
                                                            "type": "delete",
                                                            "scriptId": _.id
                                                        })
                                                    });
                                                    putMyVar('sourceInitialization', '3');
                                                    refreshPage(false);
                                                    return "toast://更新成功";
                                                } else {
                                                    return "toast://更新失败";
                                                }
                                            });
                                        },
                                        cancel() {
                                            return "hiker://empty";
                                        }
                                    });
                                } catch (e) {
                                    return "toast://更新失败\n" + e.toString();
                                }
                            });
                            break;
                        case '编辑音源':
                            return "editFile://" + sourcePath;
                            break;
                        case '分享音源':
                            return getShareText([sourcePath], "source");
                            break;
                        case '发布页面':
                            if (_.homepage) {
                                return buildUrl("hiker://page/home", {
                                    p: "nopage",
                                    t: "loginRule",
                                    s: "#noHistory##noRecordHistory#",
                                    platform: encodeURIComponent(_.id),
                                    loginUrl: encodeURIComponent(_.homepage),
                                    pageTitle: _.title + " - 发布页",
                                    rule: MY_RULE.title,
                                });
                            } else {
                                return "toast://该音源没有发布页";
                            }
                            break;
                        case '卸载音源':
                            hikerPop.multiChoice({
                                title: "确定删除音源「" + _.title + "」吗？此操作不可逆，谨慎选择",
                                options: ["我已阅读并理解"],
                                rightTitle: "确认删除",
                                rightClick(options, checked) {
                                    if (checked[0]) {
                                        deleteFile(sourcePath);
                                        putMyVar('sourceInitialization', '3');
                                        refreshPage(false);
                                        return "toast://已删除音源「" + _.title + "」";
                                    } else {
                                        return "toast://请勾选";
                                    }
                                },
                                leftTitle: "算了算了",
                                leftClick() {
                                    return "hiker://empty";
                                },
                            });
                            break;
                        case '获取链接':
                            let hijacks = _getPath(_getPath(["plugin", "getLxMusicInfo.json"], "_cache", 1)) || [];
                            let iconArr = [];
                            _getPath(_getPath(["plugin", "details.json"], "_cache", 1)).forEach(_ => {
                                if (hijacks.includes(_.platform)) iconArr.push(_);
                            });
                            if (!iconArr.length) return "toast://没有支持落雪音源的插件";
                            hikerPop.selectCenterIcon({
                                iconList: iconArr,
                                title: "选择测试平台",
                                columns: 1,
                                click(a, i) {
                                    let platformObj = _getPlatform(iconArr[i].platform);
                                    let musicItem = platformObj.debug_musicItem;
                                    if (!musicItem) return "toast://插件没有debug_musicItem参数";
                                    let _qualities = {};
                                    let _qualitys = {
                                        "128k": "128k",
                                        "320k": "320k",
                                        "2000k": "flac",
                                        "4000k": "flac24bit",
                                        "23000k": "hires", // 4000k
                                        "24000k": "atmos",
                                        "20501k": "atmos_plus",
                                        "20900k": "master"
                                    }
                                    musicItem.qualities = musicItem.qualities || {};
                                    for (let _quality in _qualitys) {
                                        let _qualitie = musicItem.qualities[_quality];
                                        if (_qualitie) _qualities[_quality] = _qualitie;
                                    }
                                    musicItem.qualities = _qualities;
                                    _qualitys = Object.keys(_qualities).map(_key => {
                                        let _val = qualityMap[_key];
                                        _val.url = _qualitys[_key];
                                        return _val;
                                    }).sort((a, b) => b.sort - a.sort)

                                    let pop = hikerPop.selectBottomResIcon({
                                        title: "选择测试音质",
                                        iconList: _qualitys,
                                        columns: 1,
                                        click(u, i1, manage) {
                                            hikerPop.runOnNewThread(() => {
                                                showLoading('获取链接中...');
                                                let lxMusicInfo = platformObj.getLxMusicInfo(musicItem);
                                                let mediaItem = post("http://0.0.0.0:1999/lxmusic", {
                                                    "body": JSON.stringify({
                                                        "type": "debug",
                                                        "scriptId": _.id,
                                                        "quality": u.url,
                                                        "musicInfo": lxMusicInfo
                                                    })
                                                });
                                                hideLoading();
                                                mediaItem = JSON.parse(mediaItem);
                                                mediaItem = formatMediaItem(mediaItem);
                                                mediaItem = JSON.stringify(mediaItem);
                                                hikerPop.confirm({
                                                    content: mediaItem || "没有链接",
                                                    title: "音源解析成功",
                                                    okTitle: "播放看看",
                                                    cancelTitle: "我知道了",
                                                    hideCancel: false, //隐藏取消按钮
                                                    confirm() {
                                                        return mediaItem || "toast://没有链接";
                                                    },
                                                    cancel() {
                                                        return "hiker://empty";
                                                    }
                                                });
                                            });
                                        }
                                    });
                                }
                            });
                            break;
                        case '选中音源':
                        case '取消选中':
                            let selectp = _getPath(["source", "selects.json"], "_cache", 1);
                            let selects = JSON.parse(readFile(selectp) || "[]") || [];
                            let selecti = selects.indexOf(_.id);
                            if (selecti == -1) {
                                selects.push(_.id);
                            } else {
                                selects.splice(selecti, 1);
                            }
                            saveFile(selectp, JSON.stringify(selects));
                            refreshPage(false);
                            return "hiker://empty";
                            break;
                        case '位置排序':
                            if (getMyVar("source_filter", "全部") != "全部") {
                                return "toast://防止位置错乱，请在全部分组排序";
                            }
                            let detailp = _getPath(["source", "details.json"], "_cache", 1);
                            let details = JSON.parse(readFile(detailp) || "[]") || [];
                            let i3 = details[i];
                            details.splice(i, 1);
                            hikerPop.selectCenterIcon({
                                iconList: [].concat(details, {
                                    title: '最后面'
                                }),
                                title: "插件移动到",
                                columns: 2,
                                click(a, i2) {
                                    details.splice(i2, 0, i3);
                                    saveFile(detailp, JSON.stringify(details, 0, 1));
                                    let data2 = details.map(_ => _.id);
                                    saveFile(_getPath(["source", "sorted.json"], 0, 1), JSON.stringify(data2));
                                    refreshPage();
                                    return "toast://更改成功";
                                }
                            });
                            return "hiker://empty";
                            break;
                    }
                    return "hiker://empty";
                }
            });
            return "hiker://empty";
        }, _, i, isS),
        col_type: 'avatar',
        pic_url: _.icon
    });
    d.push({
        title: _.desc.small(),
        url: $('#noLoading#').lazyRule((_id) => {
            require(config.preRule);
            let enableds = _getPath(["source", "enableds.json"]) || {};
            enableds[_id] = !enableds[_id];


            if (enableds[_id]) {
                showLoading('尝试启用音源...');
                let success = JSON.parse(post("http://0.0.0.0:1999/lxmusic", {
                    "body": JSON.stringify({
                        "type": "loadSource",
                        "scriptId": _id
                    })
                })).success;
                hideLoading();
                if (!success) {
                    delete enableds[_id];
                }
            } else {
                showLoading('注销挂载音源...');
                let success = post("http://0.0.0.0:1999/lxmusic", {
                    "body": JSON.stringify({
                        "type": "shutSource",
                        "scriptId": _id
                    })
                });
                hideLoading();
                if (success == "ok") {
                    delete enableds[_id];
                }
            }
            saveFile(_getPath(["source", "enableds.json"], 0, 1), JSON.stringify(enableds));
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