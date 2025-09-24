$.exports = function(musicItem, quality, mediaType) {
    let Quality = ["low", "standard", "high", "super"][quality];
    let isMedia = musicItem.type != 8 && musicItem.type != 9;
    let purl = startProxyServer($.toString((Config, musicItem, isCache, danmuLrc) => {
        try {
            MY_URL = "";
            config = Config;
            require(config.preRule);
            let serverType = MY_PARAMS.serverType[0];
            let serverPath = decodeURIComponent(MY_PARAMS.serverPath[0]);
            let Quality = MY_PARAMS.quality[0];
            let _cachePath = _getPath(["mediaCache", musicItem.platform, MY_PARAMS.songId[0], Quality + ".json"], "_cache", 1);
            let timeout = new Date().getTime();


            let mediaItem;
            let mediaPlatform = {
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
                        mediaItem = mediaPlatform[serverType](musicItem, Quality);
                    } catch (e) {}
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
                        audioUrls: [],
                        lyric: "",
                        danmu: "",
                        timeout: (mediaPlatform.playurl_timeout || 60 * 10) * 1000
                    }, mediaItem || {});
                    if (!mediaItem.urls.length && mediaItem.url) {
                        mediaItem.urls.push(mediaItem.url);
                        // delete mediaItem.url;
                    }
                    mediaItem.urls = mediaItem.urls.filter(Boolean); // 去除假链接
                    if (!mediaItem.urls.length) return "toast://无法解析";

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
            log(String(err.toString()));
        }
        return "";
    }, config, musicItem, getItem('MediaCache', '1') == "1", {
        mode: [5, 1, 6, 7, 4][getItem('danmuMode', '1')],
        open: getItem('danmuLrc', '0') == "1",
        size: getItem("danmuSize", "10")
    }));

    let _par = {
        startProxyServer: 1,
        serverType: "getMediaSource",
        serverPath: "",
        source: musicItem.platform,
        songId: musicItem.mid || musicItem.id || musicItem.vid || musicItem.rid,
        quality: Quality,
        mediaType: (quality > 1 ? ".flac" : ".mp3")
    }
    let playNames = [];
    let playUrls = [];

    // 解析接口
    let proxyPaths = _getPath(_getPath(["proxy", musicItem.platform, "details.json"], "_cache", 1)) || [];
    let enableds = _getPath(["proxy", musicItem.platform, "open.json"]) || {};
    for (let proxyItem of proxyPaths) {
        if (enableds[proxyItem.path] && proxyItem.supportedQualityType.includes(Quality)) {
            _par.serverPath = encodeURIComponent(proxyItem.path);
            playNames.push(proxyItem.title);
            playUrls.push(buildUrl(purl, _par));
        }
    }

    // 原生接口
    _par.serverPath = encodeURIComponent(_getPath(["plugin", "plugins", musicItem.platform + ".js"], 0, 1));
    _par.serverType = "danmu";
    let danmu = buildUrl(purl, _par);
    _par.serverType = "getLyric";
    let lyric = buildUrl(purl, _par);
    _par.serverType = isMedia ? "getMediaSource" : (musicItem.type == 9 ? "getVideo" : "getRadio");
    playUrls.unshift(buildUrl(purl, _par));
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
        playUrls[i] = u;
    }
    return JSON.stringify({
        names: playNames,
        urls: playUrls,
        danmu,
        lyric
    });
}