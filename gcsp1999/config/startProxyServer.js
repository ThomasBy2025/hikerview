// ============================================================
//  执行逻辑
//  和子页面链接相似，判断“播放链接”的 serverType 参数
//  在 startProxyServer 环境下调用插件逻辑并解析
//  该环境不能自动切换音质，需要解析函数处理=)
//  优点：可以知道链接的实质解析接口
//  特性：可以隐藏播放链接(127.0.0.1)
// ============================================================

const renovateUrl = startProxyServer($.toString((Config, isCache, danmuLrc) => {
    try {
        MY_URL = "";
        config = Config;
        require(config.preRule);


        let Quality = MY_PARAMS.quality[0];
        let _qualityItem = {};
        try {
            _qualityItem = musicItem.qualities[Quality];
            if (Array.isArray(_qualityItem)) {
                _qualityItem = _qualityItem[MY_PARAMS.qualityType[0]];
            }
        } catch (e) {}
        let musicItem = JSON.parse(base64Decode(MY_PARAMS.musicItem[0].replace(/\_/g, "/").replace(/\-/g, "+")));


        let serverType = MY_PARAMS.serverType[0];
        let serverPath = decodeURIComponent(MY_PARAMS.serverPath[0]);
        let _cachePath = _getPath(["mediaCache", musicItem.platform, musicItem.mid || musicItem.id || musicItem.vid || musicItem.rid, Quality + ".json"], "_cache", 1);
        let timeout = Number(Date.now());


        let mediaItem = formatMediaItem(musicItem);
        let mediaPlatform = {
            search: () => false,
            getMediaSource: () => false,
            getLyric: () => false,
            getVideo: () => false,
            getRadio: () => false,
        };
        if (isCache) { // 读取缓存
            try {
                mediaItem = _getPath(_cachePath);
                if (mediaItem.timeout < timeout) {
                    mediaItem = false;
                } else {
                    mediaItem.timeout -= timeout;
                }
            } catch (e) {
                mediaItem = false;
            }
        }



        if (serverType != "getLyric" && serverType != "danmu") { // 获取链接
            if (!mediaItem) {
                try { // 获取插件函数
                    mediaPlatform = Object.assign(mediaPlatform, $.require(serverPath));
                } catch (e) {}
                try { // 通过插件获取链接
                    if (serverType == "isProxyPlugin") {
                        let keyword = musicItem.title + " - " + musicItem.artist;
                        let SEARCH = mediaPlatform.search(keyword, 1, "单曲", musicItem) || {};
                        let new_musicItem = (SEARCH.data || [])[0];
                        if (new_musicItem) {
                            mediaItem = getQuality(new_musicItem, false, "4", Quality);
                            mediaItem = JSON.parse(mediaItem.replace('"lyric":"[00:00.000]",', ""));
                        }
                    } else { // 解析/原生
                        mediaItem = mediaPlatform[serverType](musicItem, Quality, _qualityItem);
                    }
                } catch (e) {
                    // log(e.toString());
                }
            }
            mediaItem = formatMediaItem(mediaItem, mediaPlatform.playurl_timeout);


            if (mediaItem) {
                // 缓存直链数据
                if (isCache) {
                    mediaItem.timeout = Number(mediaItem.timeout) + Number(timeout);
                    saveFile(_cachePath, JSON.stringify(mediaItem));
                }

                // 返回链接
                let playUrl = mediaItem.url || mediaItem.audioUrls[0] || mediaItem.urls[0];
                let playHead = mediaItem.headers[0] || {};
                return {
                    body: fetch(playUrl, {
                        inputStream: true,
                        headers: playHead
                    })
                };
            } else {
                return null;
            }
        } else { // 获取歌词
            if (!mediaItem) {
                try { // 获取插件函数
                    mediaPlatform = Object.assign(mediaPlatform, $.require(serverPath));
                } catch (e) {}
                try { // 通过插件获取歌词
                    mediaItem = {
                        lyric: mediaPlatform.getLyric(musicItem, Quality)
                    };
                } catch (e) {}
            }
            if (mediaItem) { // 格式化歌词
                mediaItem.lyric = getLyric(mediaItem);
                if (serverType == "getLyric") {
                    return mediaItem.lyric || "";
                } else if (danmuLrc.open) { // 返回弹幕
                    if (!mediaItem.danmu) {
                        return getDanMu(mediaItem, danmuLrc);
                    } else {
                        try {
                            return JSON.stringify({
                                body: '',
                                headers: {
                                    'Content-Type': 'text/html',
                                    'Location': mediaItem.danmu
                                },
                                statusCode: 302
                            });
                        } catch (e) {}
                    }
                }
            }
        }
    } catch (err) {
        // log(String(err.toString()));
    }
    return "";
}, config, getItem('MediaCache', '1') == "1", {
    mode: [5, 1, 6, 7, 4][getItem('danmuMode', '1')],
    open: getItem('danmuLrc', '0') == "1",
    size: getItem("danmuSize", "10")
}));



$.exports = function(musicItem, quality, qualityType) {
    let isMedia = musicItem.type != 8 && musicItem.type != 9;
    let Quality = musicItem.qualitys[quality];
    let _Key = Quality._url || Quality.url; // 128k
    delete musicItem.qualitys;
    let purl = renovateUrl;
    let _par = {
        startProxyServer: "1", // 是代理环境★
        serverType: "getMediaSource", // 需要执行的函数★
        serverPath: "", // 函数所在地址★

        quality: _Key, // 音质信息★
        qualityType: qualityType,
        mediaType: (Quality.sort > 7 ? ".flac" : ".mp3"), // 资源类型☆
        musicItem: base64Encode(JSON.stringify(musicItem))
            .replace(/=+$/, "").replace(/\//g, "_").replace(/\+/g, "-")
    }
    let playNames = [];
    let playUrls = [];





    // 私有解析
    let proxyPaths = _getPath(_getPath(["proxy", musicItem.platform, "details.json"], "_cache", 1)) || [];
    let enableds = _getPath(["proxy", musicItem.platform, "open.json"]) || {};
    for (let proxyItem of proxyPaths) {
        if (enableds[proxyItem.path] && proxyItem.supportedQualityType.includes(_Key)) {
            _par.serverPath = encodeURIComponent(proxyItem.path);
            playNames.push(proxyItem.title);
            playUrls.push(buildUrl(purl, _par));
        }
    }


    // 公用解析
    _par.serverType = "isProxyPlugin";
    let plugins = _getPath(["plugin", "enableds.json"]) || {};
    let details = _getPath(_getPath(["plugin", "isProxyPlugin.json"], "_cache", 1)) || [];
    let detaila = details.filter(_ => plugins[_.platform] && _.platform != musicItem.platform);
    for (let plugin of detaila) {
        _par.serverPath = encodeURIComponent(_getPath(["plugin", "plugins", plugin.platform + ".js"], 0, 1));
        playNames.push(plugin.title);
        playUrls.push(buildUrl(purl, _par));
    }


    // 插件换源
    _par.isPlugin = "1";
    details = details.map(_ => _.platform);
    detaila = _getPath(_getPath(["plugin", "details.json"], "_cache", 1)) || [];
    details = detaila.filter(_ => !details.includes(_.platform));
    detaila = details.filter(_ => plugins[_.platform] && _.platform != musicItem.platform);
    for (let plugin of detaila) {
        _par.serverPath = encodeURIComponent(_getPath(["plugin", "plugins", plugin.platform + ".js"], 0, 1));
        playNames.push(plugin.title);
        playUrls.push(buildUrl(purl, _par));
    }
    delete _par.isPlugin;


    // 原生请求
    _par.serverPath = encodeURIComponent(_getPath(["plugin", "plugins", musicItem.platform + ".js"], 0, 1));
    _par.serverType = isMedia ? "getMediaSource" :
        (musicItem.type == 9 ? "getVideo" : "getRadio");
    playUrls.unshift(buildUrl(purl, _par)); // 原插件链接
    playNames.unshift("原生");


    // 原生替代
    if (isMedia && musicItem.vid) {
        _par.serverType = "getVideo";
        playUrls.push(buildUrl(purl, _par));
        playNames.push("视频");
    }
    if (isMedia && musicItem.rid) {
        _par.serverType = "getRadio";
        playUrls.push(buildUrl(purl, _par));
        playNames.push("播客");
    }


    // 歌词文本
    _par.mediaType = ".txt";
    _par.serverType = "danmu"; // 弹幕歌词
    let danmu = buildUrl(purl, _par);
    _par.serverType = "getLyric"; // 歌词文本
    let lyric = buildUrl(purl, _par);





    // 是否读取链接信息 #checkMetadata=true#
    let _url = "#ignoreImg=true#" + getItem('checkMetadata', '');
    // 强制识别音频 #isMusic=true#
    _url += getItem('mediaIsMusic', '');
    // 链接预加载 #pre# #noPre#
    _url += getItem('MediaPre', '');
    for (let i in playUrls) {
        let u = String(playUrls[i]);
        // 是否记忆播放进度 &memoryPosition=null
        if (u) {
            let n = getItem('memoryPosition', '');
            u = u.replace(/$/, function() {
                return n ? ((u.includes("?") ? "&" : "?") + n) : ""
            }) + _url;
        }
        playUrls[i] = u.replace(/[\?\&]$/, "") + "#ignoreImg=true#";
    }

    return JSON.stringify({
        names: playNames,
        urls: playUrls,
        musicItem,
        danmu,
        lyric
    });
}