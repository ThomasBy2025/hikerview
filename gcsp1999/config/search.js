addListener('onClose', $.toString(() => {
    try {
        let extra = findItem("gcsp1999:search").extra;
        extra.defaultValue = getMyVar("s_query", "");
        updateItem({
            extra: extra
        });
    } catch (noInput) {}
}));
if (platforms.length === 0) {
    if (page == 1) {
        getTopImage({
            url: "hiker://empty"
        });
        d.push({
            title: Rich(Color("没有插件数据").bold().big()),
            desc: Rich("去导入".small()),
            url: 'hiker://empty',
            col_type: 'text_center_1',
            extra: {
                lineVisible: false
            }
        });
    }
} else {
    if (page == 1) {
        getTopImage({
            url: buildUrl("hiker://page/home", {
                p: "nopage",
                t: "collection",
                s: "#immersiveTheme##noHistory##noRecordHistory#",
                rule: MY_RULE.title
            }),
        });
        getColType({
            type: '#切换接口_独立#'
        });
        getColType({
            type: '#搜索框#'
        });
        getSearchTypes();
        getColType({
            col_type: 'line_blank',
            length: 2
        });
        Loading();
    }
    let history = storage0.getItem("searchHistory", []);
    if (!Array.isArray(s_query) && s_query.trim() != "") {
        let ii = history.indexOf(s_query);
        if (ii > -1) {
            history.splice(ii, 1);
        }
        if (history.length > 20) {
            history.splice(history.length - 1, 1);
        }
        history.unshift(s_query);
        storage0.setItem("searchHistory", history);
    }
    if (s_type != "热搜" && (Array.isArray(s_query) || s_query.trim() != "")) {
        setPageTitle('搜索' + s_type + ' - ' + s_query + '#' + page);
        if (page == 1) {
            if (["单曲", "视频", "歌词", "播客"].indexOf(s_type) != -1) {
                getColType({
                    type: "#播放下载#",
                    col_type: "text_icon",
                    playTitle: '🎵 播放'.bold(),
                    downTitle: '📥 下载'.bold(),
                });
            } else {
                is_down = fetch('https://v1.hitokoto.cn/?encode=text', {
                    timeout: 3000
                });
                d.push({
                    title: ('📚 ' + is_down).bold(),
                    img: 'hiker://images/icon4',
                    url: $("#noLoading#").lazyRule((id) => {
                        let is_down = fetch('https://v1.hitokoto.cn/?encode=text', {
                            timeout: 3000
                        });
                        updateItem(id, {
                            title: ('📚 ' + is_down).bold(),
                            extra: {
                                id: id,
                                longClick: [{
                                    title: "复制: " + is_down,
                                    js: $.toString((t) => {
                                        return "copy://" + t
                                    }, is_down)
                                }]
                            }
                        });
                        return "hiker://empty";
                    }, rule_id + ":search_down"),
                    col_type: "text_icon",
                    extra: {
                        id: rule_id + ":search_down",
                        longClick: [{
                            title: "复制: " + is_down,
                            js: $.toString((t) => {
                                return "copy://" + t
                            }, is_down)
                        }]
                    }
                });
            }
        }
        getDataExtra(platform, s_query, s_type);
    } else if (page == 1) {
        setPageTitle('高级搜索');
        d.push({
            title: '历史搜索'.fontcolor('#ff6601').bold(),
            pic_url: "hiker://images/icon_find",
            col_type: "avatar",
            url: $("确定清除全部搜索记录？").confirm((id) => {
                clearItem("searchHistory");
                deleteItemByCls(id + ":key");
                addItemAfter(id + ":searchHistory", {
                    col_type: "text_center_1",
                    url: "hiker://empty",
                    title: "““””" + "~~~什么都没有哦~~~".fontcolor("Gray"),
                    extra: {
                        cls: id + ":key",
                        lineVisible: false
                    }
                });
            }, rule_id),
            extra: {
                id: rule_id + ":searchHistory",
            }
        });
        if (history.length === 0) d.push({
            col_type: "text_center_1",
            url: "hiker://empty",
            title: "““””" + "~~~什么都没有哦~~~".fontcolor("Gray"),
            extra: {
                cls: rule_id + ":key",
                lineVisible: false
            }
        });
        else history.map((key, i) => {
            d.push({
                title: key,
                url: $("#noLoading#").lazyRule((s_type, key) => {
                    if (true) {
                        if (s_type == '热搜') clearMyVar('s_type');
                        clearMyVar('isEnd_page');
                        putMyVar('s_query', key);
                        // clearMyVar('s_t3');
                        refreshPage(false);
                    } else {
                        let extra = findItem("gcsp1999:search").extra;
                        extra.defaultValue = key;
                        updateItem({
                            extra: extra
                        });
                    }
                    return "hiker://empty";
                }, s_type, key),
                col_type: "flex_button",
                extra: {
                    id: rule_id + ":key:" + key,
                    cls: rule_id + ":key",
                    longClick: [{
                        title: "删除关键词:" + key,
                        js: $.toString((id, key) => {
                            let history = storage0.getItem("searchHistory", []);
                            let ii = history.indexOf(key);
                            history.splice(ii, 1);
                            storage0.setItem("searchHistory", history);
                            deleteItem(id + ":key:" + key);
                            if (history.length === 0) addItemAfter(id + ":searchHistory", {
                                col_type: "text_center_1",
                                url: "hiker://empty",
                                title: "““””" + "~~~什么都没有哦~~~".fontcolor("Gray"),
                                extra: {
                                    cls: id + ":key",
                                    lineVisible: false
                                }
                            });
                        }, rule_id, key)
                    }]
                }
            });
        });
        /*
            let Resou = (id, s_type, keys) => {
                let D = [];
                keys.map(name => {
                    D.push({
                        title: name,
                        url: $('#noLoading#').lazyRule((s_type, keyword) => {
                            if (s_type == '热搜') putMyVar('s_type', "单曲");
                            clearMyVar('isEnd_page');
                            putMyVar('s_query', keyword);
                            refreshPage();
                            return "hiker://empty";
                        }, s_type, name),
                        col_type: 'flex_button',
                        extra: {
                            cls: id + ':resou:key'
                        }
                    });
                });
                return D;
            };
            d.push({
                col_type: 'line_blank'
            }, {
                title: '大家都在搜'.fontcolor('#ff6601').bold(),
                url: $('#noLoading#').lazyRule((id, platform, s_type, Resou) => {
                    deleteItemByCls(id + ':resou:key');
                    let srec = require(platform).refreshHotSearch();
                    addItemAfter(id + ':resou', Resou(id, s_type, srec));
                    return "hiker://empty";
                }, rule_id, _getPath(["plugin", "plugins", platform + ".js"], 0, 1), s_type, Resou),
                col_type: "avatar",
                pic_url: "hiker://images/rule_type_comics",
                extra: {
                    id: rule_id + ":resou"
                }
            });
            let srec = storage0.getMyVar(platform + "_srec");
            if (srec == "") {
                srec = _getPlatform(platform).getHotSearchKey();
                srec = srec.filter((a, b, c) => c.indexOf(a) === b && a.trim() !== "");
                storage0.putMyVar(platform + "_srec", srec);
            }
            d = d.concat(Resou(rule_id, s_type, srec));
        */
    }
}