(() => { // 初始化本地信息


    // 每小时重置一次变量
    let new_time = new Date().getHours();
    let hour = Number(getItem("initialization_hour", "0"));
    if (hour < new_time || (!new_time && hour == 23)) {
        setItem("initialization_hour", new_time + "");
        putMyVar("pluginInitialization", "3");
        putMyVar("proxyInitialization", "0");
        putMyVar("collectionInitialization", "0");
        putMyVar("themeInitialization", "0");
    }



    // 获取排序后的数组
    let getFiledirs = (fileArr1, fileArr2) => {
        let filepath = _getPath(fileArr2, 0, 1);
        let filedir1 = readDir(_getPath(fileArr1, 0, 1));
        let filedir2 = _getPath(filepath) || [];
        // filedir2 = filedir2.filter((item, index) => filedir2.indexOf(item) === index);
        let filteredFiledir2 = filedir2.filter(item => filedir1.includes(item));
        let presentInBoth = filteredFiledir2.filter(item => filedir1.includes(item));
        let uniqueToFiledir1 = filedir1.filter(item => !filteredFiledir2.includes(item));
        let sortedFiledir1 = presentInBoth.concat(uniqueToFiledir1);
        saveFile(filepath, JSON.stringify(sortedFiledir1));
        return sortedFiledir1;
    }



    // 插件初始化
    hour = getMyVar("pluginInitialization", "0") == "3";
    if (getMyVar("pluginInitialization", "0") == "0" || hour) {

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
            try {
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
                    loginUrl: plugin.loginRule && plugin.loginRule.loginUrl,
                    supportedSearchType: Array.isArray(plugin.supportedSearchType) ? plugin.supportedSearchType : ["单曲", "歌单", "专辑", "歌手", "视频", "歌词", "电台", "播客"],
                    import_url: plugin.import_url && true,
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
                getUserVariables(detail); // 初始化用户变量
                details.push(detail);
            } catch (e) {
                log("标识: " + platform + " 的插件异常，无法获取");
            }
        }
        saveFile(path1, JSON.stringify(details));
        saveFile(path2, JSON.stringify(search1));
        saveFile(path3, JSON.stringify(sheets));
        saveFile(path4, JSON.stringify(topLists));
        saveFile(path5, JSON.stringify(artists));
        saveFile(path6, JSON.stringify(musicfree));
        putMyVar("pluginInitialization", hour ? "2" : "1");
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
                try {
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
                } catch (e) {
                    log("地址: " + proxyPath + " 的解析异常，无法获取");
                }
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
            try {
                let cObj = $.require(cPath);
                details.push({
                    path: cPath,
                    title: cObj.title,
                    author: cObj.author,
                    icon: cObj.icon,
                    type: cObj.type || "2",
                    worksNum: cObj.musicList.length
                });
            } catch (e) {
                log("地址: " + cPath + " 的收藏异常，无法获取");
            }
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



    new_time = Number($.dateFormat(new Date().getTime(), 'yyyyMMdd'));
    if (Number(getItem("ghproxy_url_update", "20250921")) < new_time) {
        log("github代理保活");
        if (getItem("ghproxy", "") != "") {
            showLoading('更新依赖代理...');
            try {
                let ghproxys = [];
                try {
                    ghproxys = JSON.parse(fetch("https://www.github-mirrors.zone.id/api/urls")).data.map(url => {
                        url = url.trim();
                        if (!url.endsWith("/")) {
                            url = url + "/";
                        }
                        return url;
                    });
                } catch (no_zone) {
                    ghproxys = JSON.parse(fetch(getGitHub(["config", "ghproxys.json"])));
                }
                ghproxys.unshift(getItem("ghproxy"));
                let verify_url = 'https://raw.githubusercontent.com/src48597962/hk/master/verify';
                let new_ghproxy = function() {
                    for (let ghproxy of ghproxys) {
                        try {
                            let verify_txt = String(fetch(ghproxy + verify_url, {
                                timeout: 3000
                            })).trim();
                            if (verify_txt.match(/^\s*ok\s*$/i)) {
                                return ghproxy;
                                break;
                            }
                            // log("err: " + ghproxy + " => " + verify_txt);
                        } catch (e) {}
                    }
                    return false;
                }();
                if (new_ghproxy && new_ghproxy != "") { // 更新成功
                    setItem("ghproxy", new_ghproxy);
                }
            } catch (err) {}
            hideLoading();
        } else {
            // log("未设置github代理");
        }
        setItem("ghproxy_url_update", new_time + "");
    }



    if (Number(getItem("require_url_update", "20250921")) < new_time) {
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
            log("失败: ")
        }
        hideLoading();
        setItem("require_url_update", new_time + "");
    }



    // 酷狗 - token保活
    if (getItem("kg@userVariables@token", "") != "" && Number(getItem("kg_refresh_token", "20250921")) < new_time) {
        try {
            let kg = _getPlatform("kg").refresh_token();
            if (kg && getItem("kg@userVariables@appid") == '3116') {
                confirm({
                    title: '[酷狗概念版] 听歌领会员',
                    content: '每日听歌即可领取1日酷狗概念版VIP',
                    confirm: $.toString((new_time) => {
                        setItem("kg_refresh_token", new_time + "");
                        require(config.preRule);
                        return _getPlatform("kg").Lite_Signin();
                    }, new_time),
                    cancel: $.toString((new_time) => {
                        setItem("kg_refresh_token", new_time + "");
                        return "toast://今日不再提示"
                    }, new_time)
                });
            } else {
                setItem("kg_refresh_token", new_time + "");
            }
        } catch (e) {
            log("酷狗音乐，token保活失败");
        }
    }



    // 腾讯 - token保活  #5天刷新一次
    if (getItem("tx@userVariables@qm_keyst", "") != "" && Number(getItem("tx_refresh_token", "20250921")) < new_time) {
        try {
            let tx = _getPlatform("tx").refresh_login();
            if (tx == undefined) { // 登录成功
                setItem("tx_refresh_token", (new_time + 5) + "");
            } else {
                toast(tx.replace("toast://", "腾讯音乐："));
                setItem("tx_refresh_token", new_time + "");
            }
        } catch (e) {
            log("腾讯音乐，token保活失败");
        }
    }



    // 通过依赖检测规则是否更新
    // 只在首页检测，子页面MY_RULE的version是0
    if (themeType == "home") {
        if (MY_RULE.version != 0 && MY_RULE.version < 20250902) {
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
        } else if (readDir(_getPath(["image"], 0, 1)).length < 23) {
            confirm({
                title: '文件不全',
                content: '检测到你的规则图标文件异常，是否下载图标？',
                confirm: $.toString((imagePath2, imagePath1) => {
                    let imageNames = ["open.svg", "icon.png", "down.png", "shut.svg", "Loading.gif", "2.png", "1.png", "3.png", "topImg.png", "play.png", "jump.png", "update.svg", "edit.svg", "share.svg", "proxy.svg", "uninstall.svg", "account.svg", "import.svg", "hijack.svg", "unhijack.svg", "selected.svg", "unselected.svg", "sorted.svg"];
                    for (let imageName of imageNames) {
                        showLoading('加载图标: ' + imageName)
                        downloadFile(imagePath1 + imageName, imagePath2 + imageName);
                    }
                    hideLoading();
                    return "toast://图标初始化成功";
                }, _getPath(["image", ""], 0, 1), getGitHub(["image", ""]))
            });
        } else if (getItem("plugin_update", "0") == "1" && getMyVar("pluginInitialization", "0") == "1") {
            putMyVar("pluginInitialization", "2");
            let newPath = _getPath(["plugin", "newPlatform.js"], "_cache", 1);
            details = _getPath(_getPath(["plugin", "details.json"], "_cache", 1));
            for (let _ of details) {
                showLoading('更新插件: ' + _.title);
                if (_.srcUrl) {
                    try {
                        let newPlatform = fetch(_.srcUrl);
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
                                        log("标识为 " + _.platform + " 的插件自动更新成功\n" + v1.join(".") + "=>" + v2.join("."));
                                    }
                                }
                                if (!v3) {
                                    log("标识为 " + _.platform + " 的插件已经是最新版");
                                }
                            } else {
                                log("标识为 " + _.platform + " 的插件不能更新：新旧插件标识不一致");
                            }
                        } else {
                            log("标识为 " + _.platform + " 的插件无法获取");
                        }
                    } catch (e) {
                        log("标识为 " + _.platform + " 的插件更新失败");
                    }
                } else {
                    log("标识为 " + _.platform + " 的插件不支持在线更新");
                }
            }
            hideLoading();
        }
    }
})();