function _getPath(Paths, fileType, run) {
    if (Paths === true || Paths === false) {
        return Paths;
    } else if (Array.isArray(Paths)) {
        Paths.unshift("hiker://files/" + (fileType || "rules") + "/Thomas/" + rule_id);
    } else {
        Paths = [Paths];
    }
    if (run) return Paths.join("/");
    try {
        let text = readFile(Paths.join("/"));
        return fileType ? text : JSON.parse(text);
    } catch (e) {
        return fileExist(Paths.join("/"));
    }
}

function getGitHub(Paths, re) {
    let GitHubUrl = config.ghproxy + Paths.join("/");
    return re === true ? require(GitHubUrl) : GitHubUrl;
}

function _getPlatform(platform) {
    if (!platform) return {};
    return $.require(_getPath(["plugin", "plugins", platform.replace(/\.js\s*$/i, "") + ".js"], 0, 1));
}

const rule_id = "gcsp1999";
let is_down = getMyVar('music_down', '0') == '1';
let themeType = getParam('t', '');
getGitHub(["config", "global.js"], true);
getGitHub(["config", "initialization.js"], true);

// 本地文件夹操作
function getDirectory(path) {
    return getGitHub(["config", "Flie.js"], true);
}




let themeType_TwoSwitch = false;
switch (themeType) {
    case "search":
    case "searchFind":
        let s_types = [
            "单曲", "歌单", "专辑", "歌手",
            "视频", "歌词", "电台", "播客",
        ];
        let s_type = getMyVar('s_type', getItem('s_type', '单曲'));
        if (themeType == "searchFind") break;
    case "getTopLists":
    case "getRecommendSheetsByTag":
    case "getArtistListDetails":
        addListener('onClose', $.toString(() => {
            clearMyVar('platform');
            clearMyVar('GroupIndex');
            clearMyVar('SortIndex');
            clearMyVar("s_type");
        }));
        themeType_TwoSwitch = true;

        let platformPath1 = _getPath(["plugin", themeType + ".json"], "_cache", 1);
        let platformAll = JSON.parse(readFile(platformPath1) || "[]") || [];
        let platforms = _getPath(["plugin", "enableds.json"]) || {};
        platforms = platformAll.filter(_ => platforms[_.platform]);

        let platform = getMyVar('platform', (platforms[0] && platforms[0].platform) || "");
        let platformItem = platforms.find(_ => _.platform == platform) || {};

        function getPlatformItems(_json) {
            if (((_json || {}).type || "").match("聚合")) {
                d.push(Object.assign({
                    title: (platformItem.title || "切换接口").bold(),
                    desc: platformItem.type + " &nbsp;",
                    url: $(platforms.map((_, ii) => {
                        return {
                            title: _.title + "\r\n" + _.platform,
                            icon: _.icon
                        }
                    }), 2, '选择接口平台', platformAll.indexOf(platformItem)).select(() => {
                        let platform = input.split("\r\n")[1];
                        putMyVar('platform', platform);
                        clearMyVar('isEnd_page');
                        clearMyVar('GroupIndex');
                        clearMyVar('SortIndex');
                        refreshPage();
                        return 'hiker://empty';
                    }),
                    img: platformItem.icon,
                    col_type: 'avatar',
                }, _json || {}));
            } else {
                platforms.map((_, ii) => {
                    d.push(Object.assign({
                        title: Rich(Color(_.title, _.platform != platform && "Gray").bold().big()),
                        url: $('#noLoading#').lazyRule((platform) => {
                            putMyVar('platform', platform);
                            clearMyVar('isEnd_page');
                            clearMyVar('GroupIndex');
                            clearMyVar('SortIndex');
                            refreshPage();
                            return 'hiker://empty';
                        }, _.platform),
                        pic_url: _.icon,
                        col_type: 'scroll_button',
                    }, _json || {}));
                });
                d.push({
                    col_type: "blank_block"
                });
            }
        }
        break;
    case "themeList":
    case "themeEdit":
    case "home":
    case "getTopListDetail":
    case "getMusicSheetInfo":
    case "getAlbumInfo":
    case "getArtistWorks":
        let {
            themeType2,
            theme_Id,
            theme_Data,
            theme_Info,
            theme_Index,
            theme_Item
        } = getThemeType(themeType);
        break;
}
if (themeType_TwoSwitch) switch (themeType) {
    case "search":
        s_types = platformItem.supportedSearchType || s_types;
        s_types.unshift("热搜");
        if (s_types.indexOf(s_type) == -1) s_type = s_types[0];
        var s_query = function(s_t2) {
            try {
                if (/https?\:\/\//.test(s_t2)) {
                    let s_t2_1 = !/antiserver.kuwo.cn/i.test(s_t2) && JSON.parse(fetch(s_t2, {
                        redirect: false,
                        onlyHeaders: true,
                        timeout: 5000
                    })).headers.location || "";
                    return s_t2_1[0].split("/").length > 4 ? s_t2_1[0] : s_t2;
                }
            } catch (noFetch) {};
            return s_t2;
        }(String(getMyVar('s_query', '')).replace(/^[\s\S]*?(https?\:\/\/[^\n\r]+)[\s\S]*/i, '$1').split(/\s+\@QQ音乐/i)[0]);

        // 搜索内容是 链接 / 数字(酷狗码) 时调用
        if (/https?\:\/\//.test(s_query) || Number(s_query)) {
            for (let s_platform of ["wy"]) {
                s_platform = _getPlatform(s_platform).import_url(s_query);
                if (s_platform) {
                    platform = s_platform.platform;
                    s_query = [s_platform];
                    s_type = ["单曲", "单曲", "歌单", "排行", "专辑", "歌手"][s_platform.type];
                    putMyVar("platform", platform);
                    putMyVar("s_type", s_type);
                    break;
                }
            }
            if (!Array.isArray(s_query) && !Number(s_query)) s_query = [];
        }

        function getSearchTypes(_json) {
            if (((_json || {}).type || "").match("聚合")) {
                d.push(Object.assign({
                    title: "搜索类型",
                    url: $(s_types.map(title => {
                        if (title == s_type)
                            title = Rich(Color(title).bold());
                        return title
                    }), 2, '选择搜索类型').select((s_type) => {
                        if (!input.match(s_type)) {
                            clearMyVar('isEnd_page');
                            putMyVar('s_type', input);
                            refreshPage();
                        }
                        return 'hiker://empty';
                    }, s_type),
                    img: $.require('image?rule=歌词适配')(s_type),
                    col_type: 'icon_small_3'
                }, _json || {}));
            } else {
                s_types.map((name, ii) => {
                    d.push(Object.assign({
                        title: Rich(Color(name, s_type != name && "Gray").bold()),
                        url: $('#noLoading#').lazyRule((s_type) => {
                            clearMyVar('isEnd_page');
                            putMyVar('s_type', s_type);
                            refreshPage();
                            return 'hiker://empty';
                        }, name),
                        col_type: 'scroll_button',
                    }, _json || {}));
                });
                d.push({
                    col_type: "blank_block"
                });
            }
        }
        break;
    case "getArtistListDetails":
        if (!platforms.length) break;
        let ArtistObj = storage0.getMyVar(platform + "_iArt");
        if (ArtistObj == "") {
            ArtistObj = _getPlatform(platform).getExploreArtistList();
            storage0.putMyVar(platform + "_iArt", ArtistObj);
        }
        ArtistObj = $.require(getGitHub(["config", "ClassTab.js"]), ArtistObj || {});
        var ArtistUrl = ArtistObj.getBaseUrl();

        function getArtistListDetails() {
            return ArtistObj.load(d);
        }
        break;
    case "getTopLists":
        if (!platforms.length) break;
        let TopLists = storage0.getMyVar(platform + "_iTop");
        if (platform && TopLists == "") {
            TopLists = _getPlatform(platform).getTopLists() || [];
            storage0.putMyVar(platform + "_iTop", TopLists);
        }
        let TopIndex = Number(getMyVar('TopIndex', '0'));
        let TopTitles = TopLists.map(_ => _.title);
        let TopTitle = TopTitles[TopIndex];
        var TopList = [];

        function getTopLists(_json) {
            if (((_json || {}).type || "").match("聚合")) {
                d.push(Object.assign({
                    title: "榜单切换",
                    url: $(TopTitles.map((title, ii) => {
                        if (TopIndex == ii)
                            title = Rich(Color(title).bold());
                        return title + "\r\n" + ii;
                    }), 2, '榜单分类选择').select(() => {
                        let index = input.split("\r\n")[1];
                        putMyVar('TopIndex', index);
                        clearMyVar('isEnd_page');
                        refreshPage();
                        return 'hiker://empty';
                    }),
                    img: $.require('image?rule=歌词适配')(TopTitle),
                    col_type: 'icon_small_3'
                }, _json || {}));
                TopList = TopLists[TopIndex].data;
            } else if (((_json || {}).type || "").match("独立")) {
                TopTitles.map((name, ii) => {
                    d.push(Object.assign({
                        title: Rich(Color(name, TopIndex != ii && "Gray").bold()),
                        url: $('#noLoading#').lazyRule((index) => {
                            putMyVar('TopIndex', index);
                            clearMyVar('isEnd_page');
                            refreshPage();
                            return 'hiker://empty';
                        }, ii + ""),
                        col_type: 'scroll_button',
                    }, _json || {}));
                });
                d.push({
                    col_type: "blank_block"
                });
                TopList = TopLists[TopIndex].data;
            } else {
                TopLists.map(({
                    title,
                    url,
                    data
                }) => {
                    if (title !== "") d.push({
                        title: Rich((title || "无法获取").fontcolor('#555555').bold().big()),
                        col_type: "text_1",
                        url: url || "hiker://empty",
                        extra: {
                            lineVisible: false
                        }
                    });
                    (data || []).map(Extra);
                });
                TopList = [];
            }
        }
        break;
    case "getRecommendSheetsByTag":
        if (!platforms.length) break;
        let SheetTags = storage0.getMyVar(platform + "_iTag");
        if (SheetTags == "") {
            SheetTags = _getPlatform(platform).getRecommendSheetTags() || [];
            storage0.putMyVar(platform + "_iTag", SheetTags);
        }
        let SheetGroups = SheetTags.map(_ => _.title);
        let GroupIndex = Number(getMyVar('GroupIndex', '0'));
        let GroupTitle = SheetGroups[GroupIndex];
        var SheetTag = (SheetTags[GroupIndex] || {}).data || []
        let SheetSorts = SheetTag.map(_ => _.title);
        let SortIndex = Number(getMyVar('SortIndex', '0'));
        let SortTitle = SheetSorts[SortIndex];
        SheetTag = (SheetTag[SortIndex] || {}).id || "";

        let SheetZero = (SheetTags[0] || {}).data || [];

        function getRecommendSheetsByTag() {
            d.push({
                title: Rich((
                    GroupIndex == 0 ? Color((SheetZero[0] || {}).title || "无法获取", SortIndex != 0 && "Gray") : Color(SortTitle)
                ).bold()),
                url: $("#noLoading#").lazyRule((platform, isOne) => {
                    if (isOne) {
                        putMyVar('GroupIndex', '0');
                        putMyVar('SortIndex', '0');
                        refreshPage();
                        return 'hiker://empty';
                    }
                    const hikerPop = $.require("http://123.56.105.145/weisyr/js/hikerPop.js");
                    let FlexSection = hikerPop.FlexMenuBottom.FlexSection;
                    let SheetTags = storage0.getMyVar(platform + "_iTag");
                    let GroupIndex = getMyVar('GroupIndex', '0');
                    let SortIndex = getMyVar('SortIndex', '0');
                    let pop = hikerPop.FlexMenuBottom({
                        extraInputBox: false,
                        sections: SheetTags.map((_, a) => {
                            let list = _.data.map((_, b) => "““””" + _.title.fontcolor((GroupIndex == a && SortIndex == b) ? '#FA7298' : 'Gray').bold());
                            return new FlexSection("““””" + _.title.fontcolor('#666666').big().bold(), list);
                        }),
                        title: "推荐歌单",
                        click(button, GroupIndex, SortIndex) {
                            putMyVar('GroupIndex', GroupIndex);
                            putMyVar('SortIndex', SortIndex);
                            pop.dismiss();
                            refreshPage();
                            return 'hiker://empty';
                        },
                        longClick(button, GroupIndex, SortIndex) {
                            putMyVar('GroupIndex', GroupIndex);
                            putMyVar('SortIndex', SortIndex);
                            pop.dismiss();
                            refreshPage();
                            return 'hiker://empty';
                        }
                    });
                    return "hiker://empty";
                }, platform, SheetTags.length < 2),
                col_type: "scroll_button"
            });
            SheetZero.slice(1).map((_, ii) => {
                ii = ii + 1;
                d.push({
                    title: Rich((Color(_.title, GroupIndex == 0 ? (SortIndex != ii && "Gray") : "Gray")).bold()),
                    url: $('#noLoading#').lazyRule((index) => {
                        putMyVar('SortIndex', index);
                        putMyVar('GroupIndex', '0');
                        clearMyVar('isEnd_page');
                        refreshPage();
                        return 'hiker://empty';
                    }, ii + ""),
                    col_type: 'scroll_button',
                });
            });
            d.push({
                col_type: "blank_block"
            });
        }

        function getSheetGroups(_json) {
            if (((_json || {}).type || "").match("聚合")) {
                d.push(Object.assign({
                    title: "大类切换",
                    url: $(SheetGroups.map((title, ii) => {
                        if (GroupIndex == ii)
                            title = Rich(Color(title).bold());
                        return title + "\r\n" + ii;
                    }), 2, '主要分类选择').select(() => {
                        let index = input.split("\r\n")[1];
                        putMyVar('GroupIndex', index);
                        clearMyVar('isEnd_page');
                        clearMyVar('SortIndex');
                        refreshPage();
                        return 'hiker://empty';
                    }),
                    img: $.require('image?rule=歌词适配')(GroupTitle),
                    col_type: 'icon_small_3'
                }, _json || {}));
            } else {
                SheetGroups.map((name, ii) => {
                    d.push(Object.assign({
                        title: Rich(Color(name, GroupIndex != ii && "Gray").bold()),
                        url: $('#noLoading#').lazyRule((index) => {
                            putMyVar('GroupIndex', index);
                            clearMyVar('isEnd_page');
                            clearMyVar('SortIndex');
                            refreshPage();
                            return 'hiker://empty';
                        }, ii + ""),
                        col_type: 'scroll_button',
                    }, _json || {}));
                });
                d.push({
                    col_type: "blank_block"
                });
            }
        }

        function getSheetSorts(_json) {
            if (((_json || {}).type || "").match("聚合")) {
                d.push(Object.assign({
                    title: "小类切换",
                    url: $(SheetSorts.map((title, ii) => {
                        if (SortIndex == ii)
                            title = Rich(Color(title).bold());
                        return title + "\r\n" + ii;
                    }), 2, '次要分类选择').select(() => {
                        let index = input.split("\r\n")[1];
                        putMyVar('SortIndex', index);
                        clearMyVar('isEnd_page');
                        refreshPage();
                        return 'hiker://empty';
                    }),
                    img: $.require('image?rule=歌词适配')(SortTitle),
                    col_type: 'icon_small_3'
                }, _json || {}));
            } else {
                SheetSorts.map((name, ii) => {
                    d.push(Object.assign({
                        title: Rich(Color(name, SortIndex != ii && "Gray").bold()),
                        url: $('#noLoading#').lazyRule((index) => {
                            putMyVar('SortIndex', index);
                            clearMyVar('isEnd_page');
                            refreshPage();
                            return 'hiker://empty';
                        }, ii + ""),
                        col_type: 'scroll_button',
                    }, _json || {}));
                });
                d.push({
                    col_type: "blank_block"
                });
            }
        }
        break;
}






function getThemeType(themeType) {
    let themeType2 = MY_PARAMS.t_type || getParam('t_type', '') || {
        home: "home",
        // getMusicSheetInfo: "page"
    } [themeType] || "";
    // log(themeType2)
    let theme_Id = getParam('t_id', '') || _getPath(["theme", themeType2, "select.txt"], "rules") || "";
    let theme_Data = _getPath(_getPath(["theme", themeType2, "details.json"], "_cache", 1)) || [];
    let theme_Info = theme_Data.find(_ => _.path == theme_Id) || {};
    let theme_Index = -1;
    let theme_Item = [];
    try {
        theme_Index = theme_Data.indexOf(theme_Info);
        theme_Item = (_getPath(["theme", themeType2, "themes", theme_Id]) || {}).data || [];
        if (theme_Data.length === 0 && theme_Item.length) {
            log("主题初始化异常，重新获取");
            clearMyVar("themeInitialization");
        }
        theme_Item = theme_Item.filter(_ => _.open && (!_.page || page == 1));
    } catch (e) {}



    if (theme_Info.plugins && theme_Info.plugins.length) { // 待完善
        log("主题有插件依赖: " + JSON.stringify(theme_Info.plugins));
    }
    return {
        themeType2,
        theme_Id,
        theme_Data,
        theme_Info,
        theme_Index,
        theme_Item
    }
}

function selectThemePop(themeType) {
    ({
        themeType2,
        theme_Data,
        theme_Index
    }) = getThemeType(themeType);
    let hikerPop = $.require("http://123.56.105.145/weisyr/js/hikerPop.js");
    let pop = hikerPop.selectCenterIcon({
        iconList: theme_Data.map(_ => {
            _.title += "\n\r" + _.path
            return _
        }),
        title: "主题切换",
        extraMenu: new hikerPop.IconExtraMenu(() => {
            pop.dismiss();
            return buildUrl("hiker://page/home", {
                p: "nopage",
                t: "themeList",
                s: "#immersiveTheme##noRefresh##noHistory##noRecordHistory#",
                t_type: themeType2,
                rule: MY_RULE.title
            });
        }),
        columns: 1,
        position: theme_Index,
        click(a) {
            let theme_Id = a.split("\n\r")[1];
            saveFile(_getPath(["theme", themeType2, "select.txt"], 0, 1), theme_Id);
            refreshPage();
            return "hiker://empty";
        }
    });
    return "hiker://empty";
}

function getThemeData(themeType) {
    switch (themeType) {
        case "getTopLists":
        case "getRecommendSheetsByTag":
        case "getArtistListDetails":

        case "getTopListDetail":
        case "getMusicSheetInfo":
        case "getAlbumInfo":
        case "getArtistWorks":
        case "getProgramInfo":
            if (platforms && !platforms.length) {
                if (page == 1) {
                    getTopImage({
                        url: "hiker://empty"
                    });
                    if (platforms.length === 0) d.push({
                        title: Rich(Color("没有插件数据").bold().big()),
                        desc: Rich("去导入".small()),
                        url: 'hiker://empty',
                        col_type: 'text_center_1',
                        extra: {
                            lineVisible: false
                        }
                    });
                    else d.push({
                        title: Rich(Color("platform不存在").bold().big()),
                        desc: Rich("原因未知".small()),
                        url: 'hiker://empty',
                        col_type: 'text_center_1',
                        extra: {
                            lineVisible: false
                        }
                    });
                }
                break;
            }
            if (page == 1) {
                getTopImage({
                    url: "hiker://empty"
                });
                switch (themeType) {
                    case "getTopLists":
                    case "getRecommendSheetsByTag":
                    case "getArtistListDetails":
                        getColType({
                            type: '#切换接口_独立#'
                        });
                        eval(themeType + "()");
                        break;
                    default:
                        // getTopImage();
                        break;
                }
                Loading();
            }
            let platform_id = decodeURIComponent(getParam('id'));
            try {
                if (/\D/.test(platform_id)) platform_id = eval(platform_id);
            } catch (e) {}
            if (typeof platform_id === 'number') {
                platform_id = String(platform_id);
            }
            getDataExtra(getParam('platform') || platform, platform_id);
            break;


        case "searchFind":
            s_types.map(s_type => {
                getColType({
                    title: "搜索" + s_type + " => " + MY_KEYWORD,
                    desc: '通过"高级搜索"页面搜索',
                    url: $('#noLoading#').lazyRule((query, type) => {
                        clearMyVar('isEnd_page');
                        putMyVar('s_query', query);
                        putMyVar('s_type', type);
                        return buildUrl("hiker://page/home", {
                            p: "fypage",
                            t: "search",
                            s: "#immersiveTheme##noHistory##noRecordHistory#",
                            rule: MY_RULE.title
                        });
                    }, MY_KEYWORD, s_type),
                    extra: {
                        pageTitle: "高级搜索"
                    }
                });
            });
            setResult(d);
            return true;
            break;



        case "home":
            if (theme_Data.length === 0) d.push({
                title: Rich(Color("没有主题数据").bold().big()),
                desc: Rich("去导入".small()),
                url: 'hiker://empty',
                col_type: 'text_center_1',
                extra: {
                    lineVisible: false
                }
            });
            theme_Item.map(_ => {
                eval(String(_.data || "").replace(/\$name/g, _.name || "").replace(/\$type/g, _.type || "").replace(/\$length/g, _.length || "1"));
            });
            break;
        case "themeList":
        case "themeEdit":
        case "pluginList":
        case "proxyList":
        case "collectionList":
        case "putImportCode":

        case "search":
        case "collection":
            getGitHub(["config", themeType + ".js"], true);
            break;
        case "executeThemeIndex":
            let t_type = getParam('t_type', '');
            let t_id = getParam('t_id', '');
            let t_index = getParam('t_index', '');
            executeThemeIndex(t_type, t_id, t_index);
            break;
        default:
            _getPlatform(getParam('platform') || platform)[themeType]();
            // $.require(themeType + 2);
            break;
    }
    page == 1 ? setPreResult(d) : setResult(d);
    deleteItemByCls('loading_gif');
}





function getColType(_json) {
    let _json2 = {
        url: "hiker://empty"
    };
    if (Array.isArray(_json)) {
        for (_json2 of _json) {
            getColType(_json2)
        }
    } else {
        switch (String(_json.type || '')) {
            case '#搜索框#':
                _json2 = {
                    title: "搜索",
                    desc: '搜索关键词 / 平台链接',
                    url: $.toString((isSearch, s_type) => {
                        // putMyVar('s_query', input.trim());
                        if (s_type == '热搜') clearMyVar('s_type');
                        clearMyVar('isEnd_page');
                        if (isSearch) {
                            refreshPage();
                            return 'hiker://empty';
                        }
                        return buildUrl("hiker://page/home", {
                            p: "fypage",
                            t: "search",
                            s: "#immersiveTheme##noHistory##noRecordHistory#",
                            rule: MY_RULE.title
                        });
                    }, themeType == "search", s_type),
                    col_type: "input",
                    extra: {
                        id: rule_id + ":search1",
                        pageTitle: "高级搜索",
                        defaultValue: getMyVar("s_query"),
                        onChange: "putMyVar('s_query', input)"
                    }
                }
                break;
            case '#推荐歌单#':
                _json2 = {
                    title: "‘‘’’歌单".bold(),
                    pic_url: "hiker://images/rule_type_comics",
                    url: buildUrl("hiker://page/home", {
                        p: "fypage",
                        t: "getRecommendSheetsByTag",
                        s: "#immersiveTheme##noHistory##noRecordHistory#",
                        rule: MY_RULE.title,
                        id: "SheetTag"
                    }),
                    col_type: "icon_5",
                    extra: {
                        pageTitle: "推荐歌单",
                        id: rule_id + ":getRecommendSheetsByTag"
                    }
                }
                break;
            case '#排行榜单#':
                _json2 = {
                    title: "‘‘’’排行".bold(),
                    pic_url: "hiker://images/rule_type_all",
                    url: buildUrl("hiker://page/home", {
                        p: "nopage",
                        t: "getTopLists",
                        s: "#immersiveTheme##noHistory##noRecordHistory#",
                        rule: MY_RULE.title,
                        id: "TopList"
                    }),
                    col_type: "icon_5",
                    extra: {
                        pageTitle: "排行榜单",
                        id: rule_id + ":getTopLists"
                    }
                }
                break;
            case '#歌手列表#':
                _json2 = {
                    title: "‘‘’’歌手".bold(),
                    pic_url: "hiker://images/rule_type_read",
                    url: buildUrl("hiker://page/home", {
                        p: "fypage",
                        t: "getArtistListDetails",
                        s: "#immersiveTheme##noHistory##noRecordHistory#",
                        rule: MY_RULE.title,
                        id: "ArtistUrl"
                    }),
                    col_type: "icon_5",
                    extra: {
                        pageTitle: "歌手列表",
                        id: rule_id + ":getTopLists"
                    }
                }
                break;
            case '#主题切换#':
                _json2 = {
                    title: theme_Info.title,
                    desc: theme_Info.author,
                    pic_url: theme_Info.icon,
                    url: $("hiker://empty?t=" + themeType + "#noLoading#").lazyRule(() => {
                        require(config.preRule);
                        return selectThemePop(themeType);
                    }),
                    col_type: "avatar",
                    extra: {
                        pageTitle: "主题管理",
                    }
                }
                break;
            case '#插件管理#':
                _json2 = {
                    title: "‘‘’’插件".bold(),
                    pic_url: "hiker://images/ic_bookmark_folder",
                    url: buildUrl("hiker://page/home", {
                        p: "nopage",
                        t: "pluginList",
                        s: "#immersiveTheme##noRefresh##noHistory##noRecordHistory#",
                        rule: MY_RULE.title
                    }),
                    col_type: "icon_5",
                    extra: {
                        pageTitle: "插件管理",
                    }
                }
                break;
            case '#程序设置#':
                _json2 = {
                    title: "‘‘’’设置".bold(),
                    pic_url: "hiker://images/rule_type_tool",
                    url: $("#noLoading#").lazyRule(() => {
                        require(config.preRule);
                        getGitHub(["config", "ruleInstallPop.js"], true);
                        return "hiker://empty";
                    }),
                    col_type: "icon_5"
                }
                break;
            case '#资源导入#':
                _json2 = {
                    title: Rich(Color("资源导入").bold()).small(),
                    url: "toast://完善中~" || buildUrl("hiker://empty", {
                        p: "nopage",
                        t: "fileSelect",
                        s: "#immersiveTheme##noHistory##noRecordHistory#"
                    }),
                    pic_url: 'hiker://images/icon_bookmark_add',
                    col_type: 'text_4'
                }
                break;
            case '#收藏列表#':
                _json2 = {
                    title: "‘‘’’收藏".bold(),
                    pic_url: "hiker://images/icon_download",
                    url: buildUrl("hiker://page/home", {
                        p: "nopage",
                        t: "collectionList",
                        s: "#immersiveTheme##noHistory##noRecordHistory#",
                        rule: MY_RULE.title
                    }),
                    col_type: "icon_5"
                }
                break;
            case '#高级搜索#':
                _json2 = {
                    title: "高级搜索",
                    url: $('#noLoading#').lazyRule(() => {
                        clearMyVar('search_page');
                        clearMyVar('s_query');
                        clearMyVar('s_type');
                        return buildUrl("hiker://page/home", {
                            p: "fypage",
                            t: "search",
                            s: "#immersiveTheme##noHistory##noRecordHistory#",
                            rule: MY_RULE.title
                        });
                    }),
                    pic_url: "hiker://images/icon2",
                    col_type: 'scroll_button',
                    extra: {
                        pageTitle: "高级搜索",
                    }
                }
                break;
            case '#播放下载#':
                _json2 = getDownData(_json);
                break;
            case '#切换接口_聚合#':
            case '#切换接口_独立#':
                return getPlatformItems(_json);
                break;
            case '#主要分类_聚合#':
            case '#主要分类_独立#':
                return getSheetGroups(_json);
                break;
            case '#次要分类_聚合#':
            case '#次要分类_独立#':
                return getSheetSorts(_json);
                break;
            default:
                break;
        }
        d.push(Object.assign(_json2, _json));
        if (_json.length-- > 1) {
            return getColType(_json);
        } else {
            return true;
        }
    }
}





const Extra = (_, _extra, run) => {
    for (let _key in _) {
        if (_[_key] == undefined) {
            delete _[_key];
        }
    }
    let isExtra = typeof _extra === 'object';
    let isMedia = ["0", "1", "8", "9", "10"].indexOf(_.type) != -1;
    let pic_url = String(_.artwork || _.coverImg || _.avatar || _.pic_url || _.img || "").replace(/{size}/gi, '480');
    let col_type = _.col_type || 'card_pic_3';
    delete _.col_type;
    let _type = ["单曲", "单曲", "歌单", "榜单", "专辑", "歌手", "用户", "电台", "播客", "视频", "歌词", "评论"][_.type] || "未知";



    let json = Object.assign({
        title: _.title + (isMedia && _.artist ? " - " + _.artist : ""),
        desc: isMedia ? ((_.album || "") + " " + (_.duration || "")) : (_.description || ""),
        content: _type,
        col_type,
        pic_url,
        extra: {
            inheritTitle: false, // 不继承页面标题
            lineVisible: false, // 隐藏底部分界线
            cls: rule_id + ':addlist',
            id: [_.platform, _.type, _.id].join("$"),
            pic_url,
            longClick: [{
                title: "★ 收藏" + _type + " ★",
                js: $.toString((_) => {
                    require(config.preRule);
                    return setCollectionData(_);
                }, _)
            }, {
                title: "✩ 分享" + _type + " ✩",
                js: $.toString((_) => {
                    require(config.preRule);
                    return getShareText(_, "collection");
                }, _)
            }],
        }
    }, isExtra ? _extra : {});

    json.title = String(json.title || "")
        .replace(/\$title|\$nickName/g, _.title || _.nickName || "")
        .replace(/\$artist/g, _.artist || "");
    json.desc = String(json.desc || "")
        .replace(/\$duration/g, _.duration || "00:00:00")
        .replace(/\$artist/g, _.artist || "")
        .replace(/\$album/g, _.album || _.title || "")
    json.pic_url = String(json.pic_url || json.img || "")
        .replace(/\$artwork|\$coverImg|\$avatar/g, _.artwork || _.coverImg || _.avatar || pic_url || "");



    let _url = json.url || _.url;
    let _url2 = buildUrl(isMedia ? "hiker://empty" : "hiker://page/home", {
        p: isMedia ? "nopage" : "fypage",
        t: ["getMediaSource", "getMediaSource", "getMusicSheetInfo", "getTopListDetail", "getAlbumInfo", "getArtistWorks", "getUserInfo", "getProgramInfo", "getRadio", "getVideo", "getLyric", "getMusicComments"][_.type] || _.type || "",
        s: isMedia ? "#noHistory##noRecordHistory#" : getItem('pageHomeType', '#immersiveTheme#'),
        rule: MY_RULE.title,
        platform: _.platform,
        id: encodeURIComponent(String(_.mid || _.id)),
    });
    if (isMedia) {
        let _url3 = (is_down) => $(_url2).lazyRule((musicItem, is_down) => {
            require(config.preRule);
            return getQuality(musicItem, is_down);
        }, _, is_down);
        json.extra.longClick.unshift({
            title: "★ 下载资源 ★",
            js: $.toString((url) => {
                return url;
            }, _url || _url3(true))
        });
        json.extra.url = _url || _url3(!is_down);
        json.url = _url || _url3(is_down);
    } else {
        json.url = _url || _url2;
    }
    if (run == true) return json;
    d.push(json);
    return true;

    _.title = Rich(_.title || _.name + ((_.singer && ' - ' + _.singer) || ""))
        .replace(/^‘‘’’|\s*\-?\s*$/gi, "")
        .replace("　-　".small().small().sub(), "")
        .replace("　-　", "&nbsp;&nbsp;&nbsp;&nbsp;-&nbsp;&nbsp;&nbsp;&nbsp;");
}

function getDataExtra(platform, tag, type) {
    if (!platform) return true;
    if (page == 1 || getMyVar('isEnd_page', '0') == '0') {
        let isEnd = true;
        let data = [];
        let item = {};
        if (Array.isArray(tag)) {
            data = tag;
        } else {
            ({
                isEnd,
                item,
                data
            }) = _getPlatform(platform)[themeType](tag, page, type) || {};
        }
        (data || []).map(Extra);
        if (isEnd || !data || data.length === 0) {
            putMyVar('isEnd_page', '1');
            if (themeType == "search" && Array.isArray(tag) && tag.length == 0) {
                d.push({
                    title: "链接格式未收录",
                    url: "hiker://empty",
                    col_type: "text_center_1",
                });
            } else if (themeType != "getTopLists") {
                d.push({
                    title: "““””" + '我是有底线的'.fontcolor('Gray').small(),
                    url: 'hiker://empty',
                    col_type: 'text_center_1',
                    extra: {
                        lineVisible: false
                    }
                });
            }
        } else {
            clearMyVar('isEnd_page');
        }
    }
    return true;
}





function getCollectionItems(c_json, isPop) {
    let collectionItems = _getPath(_getPath(["collection", "details.json"], "_cache", 1)) || [];
    if (collectionItems.length == 0 && !isPop && c_json != undefined) {
        d.push({
            title: "没有本地收藏",
            url: "hiker://empty",
            col_type: "text_center_1"
        });
    }
    return collectionItems.map(it => {
        it.type = ["免费", "会员", "歌单", "榜单", "专辑", "歌手", "用户", "电台", "播客", "视频", "歌词", "评论"][it.type] || "未知";
        it.path = encodeURIComponent(it.path);
        let _json = Object.assign({
            url: c_json != undefined ? buildUrl("hiker://page/home", {
                p: "nopage",
                t: "collection",
                path: it.path,
                s: "#immersiveTheme##noHistory##noRecordHistory#",
                rule: MY_RULE.title
            }) : $("hiker://empty").lazyRule((path) => {
                setPageParams({
                    path
                });
                refreshPage();
                return 'hiker://empty';
            }, it.path),
            col_type: "icon_1_left_pic",
            extra: {
                inheritTitle: false
            }
        }, c_json || {});
        _json.title = String(_json.title || it.title || "").replace(/\$title|\$name/gi, it.title || "");
        _json.pic_url = String(_json.pic_url || _json.img || it.icon || "").replace(/\$pic_url|\$img|\$icon/gi, it.icon || "");

        _json.desc = String(_json.desc || ("‘‘类别’’: " + it.type + "　　" + "““数量””: " + (it.worksNum || "未知")).small())
            .replace(/\$length|\$worksNum/gi, it.worksNum || "未知").replace(/\$type/gi, it.type);
        return isPop ? {
            title: it.title + "\r\n" + it.path,
            icon: it.icon
        } : (c_json != undefined ? d.push(_json) : it);
    });
}


function executeThemeIndex(t_type, t_id, t_index, run) {
    let t_item = _getPath(["theme", t_type, "themes", t_id.replace(".json", "") + ".json"]) || {};
    let t_data = (t_item.data || [])[t_index] || {};
    t_data = String(t_data.data || "").replace(/\$length/g, t_data.length || "1").replace(/\$name/g, t_data.name || "").replace(/\$type/g, t_data.type || "");
    if (run) return t_data;
    eval(t_data);
}





function getQuality(musicItem, down) {
    let ns = ["【标准音质】", "【高品音质】", "【无损音质】", "【高品无损】"];
    let qs = ["low", "standard", "high", "super"];
    let qualities = musicItem.qualities || {};
    if (down) {
        let SizetoStr = size => {
            if (!size) return '无法计算';
            let units = ['B', 'KB', 'MB', 'GB'];
            let i = 0;
            while (size >= 1024) {
                size /= 1024;
                i++;
            }
            size = i ? size.toFixed(2) : size;
            return `${size} ${units[i]}`;
        }
        qs = Object.keys(qualities);
        let arr1 = [];
        for (let i in qs) {
            let size = qualities[qs[i]].size;
            if (Number(size)) {
                size = SizetoStr(size);
            }
            arr1.push(ns[i] + size);
        }
        if (qs.length === 0) arr1 = [musicItem.title + ' - ' + musicItem.artist];
        return $(arr1, 1, '选择下载音质').select((musicItem, arr1) => {
            let quality = arr1.indexOf(input);
            MY_URL = "";
            require(config.preRule);
            try {
                let playUrl = JSON.parse(getMedia(musicItem, quality, "0"));
                return "download://" + (playUrl.url || playUrl.urls[0] || playUrl.audioUrls[0]);
            } catch (e) {
                return "toast://解析失败";
            }
        }, musicItem, arr1);
    } else if (qualities) {
        let typeCache = {}
        let i = Number(getItem('QualityIndex', '0'))
        if (getItem('QualityFailure', "向下兼容") != "向下兼容") { // 向上取
            do {
                if (qualities[qs[i]]) {
                    return getMedia(musicItem, i, "1");
                }
                i++;
            } while (-1 < i && i < 3);
        } else { // 向下取
            do {
                if (qualities[qs[i]]) {
                    return getMedia(musicItem, i, "2");
                }
                i--;
            } while (0 < i && i < 4);
        }
    }
    // 异常
    return getMedia(musicItem, 0, "3");
}

function getMedia(musicItem, quality, mediaType) {
    if (0 > quality || quality > 3) {
        return "toast://无法解析";
    }
    let Quality = ["low", "standard", "high", "super"][quality];
    let mediaItem;
    let mediaPlatform = {
        getMediaSource: () => false,
        getLyric: () => false,
        getVideo: () => false,
        getRadio: () => false,
    };
    let isMedia = musicItem.type != 8 && musicItem.type != 9;
    let _cachePath = _getPath([Quality, musicItem.platform, musicItem.mid || musicItem.id || musicItem.vid || musicItem.rid, ".json"], "_cache", 1);
    let timeout = new Date().getTime();
    let isCache = getItem('MediaCache', '1') == "1";
    if (isCache) { // 读取缓存
        try {
            mediaItem = _getPath(_cachePath);
            if (mediaItem.timeout < timeout) {
                mediaItem = false;
            }
        } catch (e) {
            mediaItem = false;
        }
    }
    if (!mediaItem) {
        try { // 获取插件函数
            mediaPlatform = Object.assign(mediaPlatform, _getPlatform(musicItem.platform));
        } catch (e) {}

        try { // 通过插件获取链接
            if (musicItem.type == 9) {
                mediaItem = mediaPlatform.getVideo(musicItem, Quality);
            } else if (musicItem.type == 8) {
                mediaItem = mediaPlatform.getRadio(musicItem, Quality);
            } else {
                mediaItem = mediaPlatform.getMediaSource(musicItem, Quality);
            }
        } catch (e) {}

        if (!mediaItem && isMedia) { // 通过解析获取链接
            try {
                let proxyPaths = _getPath(_getPath(["proxy", musicItem.platform, Quality + ".json"], "_cache", 1)) || [];
                let enableds = _getPath(["proxy", musicItem.platform, "open.json"]) || {};
                for (let proxyPath of proxyPaths) {
                    if (enableds[proxyPath]) {
                        try {
                            mediaItem = $.require(proxyPath).getMediaSource(musicItem, Quality);
                        } catch (e) {}
                        if (mediaItem) break;
                    }
                }
            } catch (e) {}
        }

        if (!mediaItem && isMedia && mediaType != "0" && (musicItem.vid || musicItem.rid)) { // 获取视频链接代替
            try {
                if (musicItem.vid) {
                    mediaItem = mediaPlatform.getVideo(musicItem, Quality);
                } else {
                    mediaItem = mediaPlatform.getRadio(musicItem, Quality);
                }
            } catch (e) {}
        }
    }
    if (mediaItem) { // 返回的字符串链接改成json
        if (typeof mediaItem === 'string') {
            if (mediaItem.includes("hiker://") || mediaItem.includes("toast://")) {
                return mediaItem;
            }
            mediaItem = {
                url: mediaItem
            }
        }
        mediaItem = Object.assign({
            urls: [],
            names: [],
            headers: [],
            // audioUrls: [],
            lyric: "",
            danmu: "",
            timeout: mediaPlatform.playurl_timeout || 60 * 60
        }, mediaItem || {});
        if (!mediaItem.urls.length && mediaItem.url) {
            mediaItem.urls.push(mediaItem.url);
            // delete mediaItem.url;
        }
        // 获取LRC歌词
        if (!mediaItem.lyric) {
            try {
                mediaItem.lyric = mediaPlatform.getLyric(musicItem);
            } catch (e) {}
        }
        // 缓存直链数据
        if (isCache) {
            mediaItem.timeout += timeout;
            saveFile(_cachePath, JSON.stringify(mediaItem));
        }

        // 获取链接设置
        if (mediaType != "down") {
            // 是否读取链接信息 #checkMetadata=true#
            let _url = getItem('checkMetadata', '');
            // 强制识别音频 #isMusic=true#
            _url += getItem('mediaIsMusic', '');
            // 链接预加载 #pre# #noPre#
            _url += getItem('MediaPre', '');
            for (let i in mediaItem.urls) {
                let u = String(mediaItem.urls[i]);
                // 是否记忆播放进度 &memoryPosition=null
                u = u.replace(/$/, (u.includes("?") ? "&" : "?") + getItem('memoryPosition', '')) + _url;
                mediaItem.urls[i] = u;
            }
        }

        // 格式化歌词
        mediaItem.lyric = String(mediaItem.lyric).replace(/\<\/?(br|p)\/?\>/gi, "\n")
            .replace(/^data\:text\/plain\,\s*|\<\s*\-?\d+\s*\,\s*\-?\d+\s*\>/gi, "") // 目前不支持逐字歌词
            .replace(/(\[\d+\:\d+)\:(\d+\])/gi, "$1.$2");
        if (!mediaItem.lyric.match(/^\s*https?\:\/\/|\d+\:\d+/i)) { // 不是 标准lrc / lrcurl
            mediaItem.lyric = function(lrc, time) {
                let time = String(time || 200);
                if (time.match(/\d+\:\d+/)) {
                    time = function(time) {
                        let sp = time.split(":");
                        let l3 = sp.length == 3;
                        let h = l3 ? sp[0] : sp[3] || 0;
                        let m = l3 ? sp[1] : sp[0] || 0;
                        let s = l3 ? sp[2] : sp[1] || 0;
                        return (h * 60 * 60) + (m * 60) + s;
                    }(time.replace(/^\s*0+\:/gi, ""));
                } else if (time.match(/\D/)) {
                    time = 200;
                }
                time = Number(time) || 200;
                let n = String(lrc).replace(/\s*((\n|(\u003c|<)\/?(br|p)\/?(\u003e|>))\s*)+\s*/gi, '\n').trim().split(/\n/);
                return n.map((lineLyric, i) => {
                    let itime = i / n.length * time;
                    let s = ((itime - 0) % 60).toFixed(3).padStart(6, '0');
                    let m = ((itime - s) / 60).toFixed(0).padStart(2, '0');
                    return `[${m}:${s}]` + lineLyric;
                }).join('\n');
            }(mediaItem.lyric, musicItem.duration || 200);
        }
        // 显示弹幕歌词
        if (getItem('danmuLrc', '0') == "1") {
            mediaItem.danmu = function(lrcText) {
                try {
                    if (!lrcText.match(/\d+\:\d+/) && lrcText.match(/^\s*https?\:\/\//)) { // 可能是lrc链接
                        lrcText = fetch(lrcText);
                        mediaItem.lyric = lrcText;
                    }

                    let result = [];
                    String(lrcText).split(/\n/).map(t => {
                        let mat = String(t).trim().split(/\]\s*/);
                        let txt = String(mat.slice(1).join(']'));
                        let tme = mat[0].slice(1).split(':');
                        if (txt.length) {
                            try {
                                let minutes = parseInt(tme[0], 10) * 60;
                                let seconds = tme.slice(1).join(".");
                                minutes += parseFloat(seconds);
                                result.push({
                                    text: txt,
                                    time: minutes.toFixed(3)
                                });
                            } catch (nolrc) {}
                        }
                    });
                    let danmuLRC = _getPath(["danmuLRC.json"], "_cache", 1);
                    saveFile(danmuLRC, JSON.stringify(result));
                    return danmuLRC;
                } catch (e) {}
                return "";
            }(mediaItem.lyric);
        }
        return JSON.stringify(mediaItem);
    } else {
        switch (mediaType) {
            case "0": // 精准下载
            case "3": // 没有音质
                return "toast://解析失败";
                break;
            case "1":
                return getMedia(musicItem, quality + 1, mediaType);
                break;
            case "2":
                return getMedia(musicItem, quality - 1, mediaType);
                break;
        }
    }
}




function getShareText(input, type, len, path) {
    let arr = getPastes();
    if (type == "plugin" || type == "collection") {
        arr.push("复制链接");
    }
    arr.push("明文口令");
    return $(arr, 2, '选择分享格式').select((code, type, len, path) => {
        try {
            let isObj = typeof code === 'object' && !Array.isArray(code);
            if (isObj) return "toast://元素分享完善中";
            let json = {};
            if (isObj) {
                json = {
                    type: type, // theme | plugin | proxy | collection
                    code: code
                }
            } else { // 传入的code是文件数组
                json = {
                    type: type,
                    codes: code.map(path => readFile(path)),
                    paths: code,
                }
                len = code.length;
            }
            // isObj = {};
            let text = base64Encode(JSON.stringify(json));

            let group = "getCode";
            if (input == "复制链接") {
                if (isObj) {
                    if (isObj.platform == "userlist") {
                        return "toast://自建歌单无法分享"
                    } else {
                        return "toast://完善中";
                    }
                } else {
                    return "toast://无法获取链接"
                }
                group = "shareUrl";
            } else if (input != "明文口令") {
                text = sharePaste(text, input);
                group += "+parsePaste";
            }
            let type2 = {
                theme: "主题",
                plugin: "插件",
                proxy: "解析",
                collection: "收藏",
            } [type];
            let desc = "共「" + len + "」条" + type2;
            if (len == 1 && isObj) {
                let type3 = isObj.platform.replace("userlist", "自用");
                if (type == "plugin") {
                    type3 = isObj.type || "未知"
                } else if (type == "theme") {
                    type3 = "首页"
                }
                desc = type3 + type2 + "「" + isObj.title + "」";
            }
            if (path) {
                deleteFile(path);
                refreshPage();
            }
            return "copy://歌词适配" + type2 + "口令，打开海阔即可导入\n" + desc + "￥" + group + "￥" + text + '@import=js:$.require("import?rule=歌词适配")(input.split("￥"));';
        } catch (err) {
            return "toast://分享失败";
        }
    }, input, type, len || 1, path || "");
}


function setCollectionGroup(input, path, title) {
    switch (input) {
        case '更新资源':
            return "toast://完善中";
            break;
        case '合并分组':
            break;
        case '更改排序':
            break;
        case '分享分组':
            return getShareText([path], "collection");
            break;
        case '编辑分组':
            return "editFile://" + path;
            break;
        case '删除分组':
            return $("确定删除分组 " + title + " 吗？\n此操作不可逆，谨慎选择。").confirm((path) => {
                deleteFile(path);
                clearMyVar('collectionInitialization');
                refreshPage();
                return "hiker://empty";
            }, path);
            break;
        case '新增分组':
            let hikerPop = $.require("http://123.56.105.145/weisyr/js/hikerPop.js");
            hikerPop.inputTwoRow({
                titleHint: "新组名称",
                titleDefault: "",
                urlHint: "新组封面",
                urlDefault: "",
                noAutoSoft: true, //不自动打开输入法
                title: "新组信息",
                //hideCancel: true,
                confirm(input, icon) {
                    if (!input.trim()) return "toast://组名不能为空";
                    let t = new Date().getTime();
                    let _ = {
                        "platform": "userlist",
                        "id": t + "",
                        "type": "2",
                        "title": input,
                        "icon": icon || "hiker://images/icon1",
                        "musicList": []
                    }
                    let path = "hiker://files/rules/Thomas/gcsp1999/collection/collections/userlist_" + t + ".json";
                    saveFile(path, JSON.stringify(_));
                    clearMyVar('collectionInitialization');
                    refreshPage();
                    return "toast://导入歌曲成功";
                },
                cancel() {
                    return "hiker://empty";
                    // return "toast://你取消了";
                }
            });
            break;
    }
    return "hiker://empty";
}

function setCollectionData(musicItem, run) {
    let hikerPop = $.require("http://123.56.105.145/weisyr/js/hikerPop.js");
    let isMedia = ["0", "1", "8", "9", "10"].indexOf(musicItem.type) != -1;
    let detailp = _getPath(["collection", "details.json"], "_cache", 1);
    let iconList = (_getPath(detailp) || []).map(_ => ({
        title: _.title + '\r\n' + _.path,
        icon: _.icon
    }));
    let isBack = run === true;
    if (!isMedia) {
        return "toast://分组收藏完善中，可以先在线收藏";
    }
    let pop = hikerPop.selectCenterIcon({
        iconList,
        title: "请选择资源位置",
        extraMenu: new hikerPop.IconExtraMenu(() => {
            pop.dismiss();
            hikerPop.inputTwoRow({
                titleHint: "新组名称",
                titleDefault: "",
                urlHint: "新组封面",
                urlDefault: "",
                noAutoSoft: true, //不自动打开输入法
                title: "新组信息",
                //hideCancel: true,
                confirm(input, icon) {
                    if (!input.trim()) return "toast://组名不能为空";
                    let t = new Date().getTime();
                    let _ = {
                        "platform": "userlist",
                        "id": t + "",
                        "type": "2",
                        "title": input,
                        "icon": icon || "hiker://images/icon1",
                        "musicList": [musicItem]
                    }
                    let path = "hiker://files/rules/Thomas/gcsp1999/collection/collections/userlist_" + t + ".json";
                    saveFile(path, JSON.stringify(_));
                    clearMyVar('collectionInitialization');
                    isBack && back(true);
                    return "toast://导入歌曲成功";
                },
                cancel() {
                    return "hiker://empty";
                    // return "toast://你取消了";
                }
            });
            return "hiker://empty";
        }),
        columns: 2,
        // position: 0,
        click(input) {
            let [title, path] = input.split("\r\n");
            let zy = JSON.parse(readFile(path) || "{}") || {};
            let zu = (zy.musicList || []).map((_, i) => _.title + '\r\n' + i);
            return $(zu.concat("最后面"), 2, '请选择资源位置').select((zy, zu, path, musicItem, isBack) => {
                let i;
                if ("最后面" == input) {
                    i = zu.length;
                } else {
                    i = zu.indexOf(input);
                }
                zy.musicList.splice(i, 0, musicItem);
                saveFile(path, JSON.stringify(zy));
                clearMyVar('collectionInitialization');
                isBack && back(true);
                return "toast://导入歌曲成功";
            }, zy, zu, path, musicItem, isBack);
        }
    });
    return "hiker://empty";
}



function getLastChapterRule() {
    setResult("");
}