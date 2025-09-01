(() => { // 初始化本地信息



    // 获取排序后的数组
    let getFiledirs = (fileArr1, fileArr2) => {
        let filepath = _getPath(fileArr2, 0, 1);
        let filedir1 = readDir(_getPath(fileArr1, 0, 1));
        let filedir2 = _getPath(filepath) || [];
        let filteredFiledir2 = filedir2.filter(item => filedir1.includes(item));
        let presentInBoth = filteredFiledir2.filter(item => filedir1.includes(item));
        let uniqueToFiledir1 = filedir1.filter(item => !filteredFiledir2.includes(item));
        let sortedFiledir1 = presentInBoth.concat(uniqueToFiledir1);
        saveFile(filepath, JSON.stringify(sortedFiledir1));
        return sortedFiledir1;
    }



    // 插件初始化
    if (getMyVar("pluginInitialization", "0") == "0") {

        // 本地存在的插件
        let filedirs = getFiledirs(["plugin", "plugins"], ["plugin", "sorted.json"]);

        // 精简的插件信息
        let path1 = _getPath(["plugin", "details.json"], "_cache", 1);
        let details = [];

        // 支持搜索的插件
        let path2 = _getPath(["plugin", "search.json"], "_cache", 1);
        let search1 = [];

        // 支持歌单的插件
        let path3 = _getPath(["plugin", "getRecommendSheetsByTag.json"], "_cache", 1);
        let sheets = [];

        // 支持榜单的插件
        let path4 = _getPath(["plugin", "getTopLists.json"], "_cache", 1);
        let topLists = [];

        // 支持歌手的插件
        let path5 = _getPath(["plugin", "getArtistListDetails.json"], "_cache", 1);
        let artists = [];

        // 支持musicfree的插件
        let path6 = _getPath(["plugin", "musicfree.json"], "_cache", 1);
        let musicfree = {};

        // 保存插件信息
        for (let platform of filedirs) {
            let plugin = _getPlatform(platform);
            let detail = {
                platform: plugin.platform,
                title: plugin.title,
                type: plugin.type || "未知",
                author: plugin.author || "佚名",
                version: plugin.version || "0",
                icon: plugin.icon,
                srcUrl: plugin.srcUrl,
                description: plugin.description || "",
                platformProxy: plugin.platformProxy,
                userVariables: plugin.userVariables,
                supportedSearchType: Array.isArray(plugin.supportedSearchType) ? plugin.supportedSearchType : ["单曲", "歌单", "专辑", "歌手", "视频", "歌词", "电台", "播客"],
                import_url: plugin.import_url && true
                // 登录相关还没写 - 完善中
            };
            if (plugin.search) {
                search1.push(detail);
            }
            if (plugin.getRecommendSheetTags) {
                sheets.push(detail);
            }
            if (plugin.getTopLists) {
                topLists.push(detail);
            }
            if (plugin.getExploreArtistList) {
                artists.push(detail);
            }
            if (plugin.musicfree && plugin.musicfree.regNames) {
                for (let regName of plugin.musicfree.regNames) {
                    musicfree[regName] = plugin.platform;
                }
            }
            details.push(detail);
        }
        saveFile(path1, JSON.stringify(details));
        saveFile(path2, JSON.stringify(search1));
        saveFile(path3, JSON.stringify(sheets));
        saveFile(path4, JSON.stringify(topLists));
        saveFile(path5, JSON.stringify(artists));
        saveFile(path6, JSON.stringify(musicfree));
        putMyVar("pluginInitialization", "1");
        log("插件初始化成功");
    }



    // 解析初始化
    if (getMyVar("proxyInitialization", "0") == "0") {
        let filedir2 = getFiledirs(["plugin", "plugins"], ["plugin", "sorted.json"]);
        // filter: 不存在的插件，不用初始化解析
        let plugins = readDir(_getPath(["proxy"], 0, 1)).filter(plugin => filedir2.includes(plugin + ".js"));
        // saveFile(_getPath(["proxy", "plugins.json"], "_cache", 1), JSON.stringify(plugins));
        for (let plugin of plugins) {
            let proxys = getFiledirs(["proxy", plugin, "proxys"], ["proxy", plugin, "sort.json"]);
            let proxyQ = {
                details: []
            };
            for (let proxy of proxys) {
                let proxyPath = _getPath(["proxy", plugin, "proxys", proxy], 0, 1);
                let proxyObj = $.require(proxyPath);
                let proxyQs = proxyObj.supportedQualityType || ["low"];
                for (proxyQa of proxyQs) {
                    if (!proxyQ[proxyQa]) {
                        proxyQ[proxyQa] = [];
                    }
                    proxyQ[proxyQa]["push"](proxyPath);
                }
                proxyQ.details.push({
                    "platform": proxyObj.platform, // 隶属插件标识
                    "srcUrl": proxyObj.srcUrl, // 解析标识
                    "title": proxyObj.title, // 解析名称
                    "author": proxyObj.author || "佚名", // 解析作者
                    "icon": proxyObj.icon || "", // 解析封面
                    "type": proxyObj.type || "未知", // 解析分组
                    "desc": proxyObj.desc || [], // 解析简介
                    "version": proxyObj.version || "0", // 解析版本
                    "supportedQualityType": proxyQs, // 支持的音质
                    "path": proxyPath // 解析地址
                });
            }
            Object.keys(proxyQ).map(Quality => {
                let qualityPath = _getPath(["proxy", plugin, Quality + ".json"], "_cache", 1);
                saveFile(qualityPath, JSON.stringify(proxyQ[Quality]));
            });
        }
        putMyVar("proxyInitialization", "1");
        log("解析初始化成功");
    }



    // 收藏初始化
    if (getMyVar("collectionInitialization", "0") == "0") {
        // 本地存在的收藏
        filedirs = getFiledirs(["collection", "collections"], ["collection", "sorted.json"]);

        // 精简的收藏信息
        path1 = _getPath(["collection", "details.json"], "_cache", 1);
        details = [];

        // 保存收藏信息
        for (let c_path of filedirs) {
            let cPath = _getPath(["collection", "collections", c_path], 0, 1);
            let cObj = $.require(cPath);
            details.push({
                path: cPath,
                title: cObj.title,
                author: cObj.author,
                icon: cObj.icon,
                type: cObj.type || "2",
                worksNum: cObj.musicList.length
            });
        }
        saveFile(path1, JSON.stringify(details));
        putMyVar("collectionInitialization", "1");
        log("收藏初始化成功");
    }



    // 主题初始化
    if (getMyVar("themeInitialization", "0") == "0") {
        let themeTypes = readDir(_getPath(["theme"], 0, 1));
        themeTypes = ["home"];
        for (let themeType of themeTypes) {
            let themes = getFiledirs(["theme", themeType, "themes"], ["theme", themeType, "sorted.json"]);

            // 防止选择的主题不存在
            let themep = _getPath(["theme", themeType, "select.txt"], 0, 1);
            if (themes.indexOf(_getPath(themep, "rules")) == -1) {
                saveFile(themep, themes[0]);
            }

            // 精简的主题信息
            themep = _getPath(["theme", themeType, "details.json"], "_cache", 1);
            let themed = [];
            for (let theme of themes) {
                let themePath = _getPath(["theme", themeType, "themes", theme], 0, 1);
                let themeObj = _getPath(themePath);
                themed.push({
                    "path": theme,
                    "title": themeObj.title,
                    "icon": themeObj.icon || "",
                    "author": themeObj.author || "佚名",
                    "plugins": themeObj.plugins || []
                });
            }
            saveFile(themep, JSON.stringify(themed));
        }
        putMyVar("themeInitialization", "1");
        log("主题初始化成功");
    }



    if (getMyVar("require_url_update", "0") == "0") {
        log("检测并更新依赖");
        try {
            let update_url = getGitHub(["config", "update.json"]);
            let _json1 = require(update_url);
            let _json2 = JSON.parse(fetch(update_url).replace(/^\(|\)$/g, ""));
            let records = [];
            for (let _key in _json2) {
                let _ver1 = (_json1[_key] || {}).version || 0;
                let _ver2 = (_json2[_key] || {}).version || 1;
                if (_ver1 < _ver2) { // 删除缓存
                    showLoading('更新依赖_' + _key);
                    deleteCache(getGitHub(["config", _key], 0, 1));
                    if (_key == "image.js") getGitHub(["config", _key], true);
                    let record = {
                        "title": _key,
                        "records": (_json2[_key] || {}).records || []
                    }
                    record.records.unshift("““版本””: " + _ver1 + " => " + _ver2);
                    records.push(record);
                }
            }
            if (records.length) {
                deleteCache(update_url);
                require(update_url);
                let hikerPop = $.require("http://123.56.105.145/weisyr/js/hikerPop.js");
                hikerPop.updateRecordsBottom(records);
            }
        } catch (e) {
            log("失败: " + e)
        }
        hideLoading();
        putMyVar("require_url_update", "1");
    }



    // 通过依赖检测规则是否更新
    // 只在首页检测，子页面MY_RULE的version是0
    if (themeType == "home" && MY_RULE.version < 20250902) {
        confirm({
            title: '更新提示',
            content: '检测到你的规则版本小于服务器版本，是否立即更新？',
            confirm: $.toString((rule_url) => {
                for (let i = 1; i < 4; i++) {
                    try {
                        return fetch(rule_url);
                    } catch (e) {
                        log("更新失败: " + i)
                    }
                }
                return "toast://网络异常，无法更新";
            }, getGitHub(["home_rule.hiker"]))
        });
    }
})();
