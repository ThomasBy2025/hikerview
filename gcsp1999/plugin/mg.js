// 格式化歌曲信息
function formatMusicItem(_) {
    _ = _.objectInfo || _[0] || _;
    if (_.songData) {
        _ = JSON.parse(_.songData);
    }
    let name = _.songName || _.name;
    let singer = (_.singers || _.singerList || (_.singer && [_.singer]) || []).map(_ => _.name || _).join("&");
    let interval = _.duration || _["length"];
    if (Number(interval)) interval = (interval * 1000);
    let songId = _.songId;
    let picUrl = _.img1 || _.img2 || _.img3 || _.landscapImg || _.mediumPic || (_.albumImgs && _.albumImgs[0].img) || (_.mvList && _.mvList[0].mvPicUrl[0].img) || "";
    picUrl = picUrl.replace(/^\/data/, "https://d.musicapp.migu.cn/data").replace(/^\:?\/\//, "https://");
    let albumName = (_.album && _.album.albumName) || _.album || "";
    let albumId = _.albumId || (_.album && _.album.albumId) || "";
    let resourceType = _.resourceType;
    let copyrightId = _.copyrightId;
    let contentId = _.contentId;
    let lrcUrl = _.lrcUrl || _.lyricUrl || (_.ext && _.ext.lrcUrl);
    let mrcUrl = _.mrcUrl;
    let trcUrl = _.trcUrl;

    let qualitys = [];
    if (_.fullSong) {
        for (let k1 of ['fullSong', 'hq', 'sq', 'bit24']) {
            if (_[k1] && _[k1].size) {
                qualitys.push({
                    type: {
                        fullSong: "128k",
                        hq: "320k",
                        sq: "2000k",
                        bit24: "4000k"
                    }[k1],
                    size: _[k1].size
                });
            }
        }
    } else {
        let k2 = (_.newRateFormats || _.audioFormats || [{
            formatType: "PQ"
        }]).filter(_ => /^(PQ|HQ|SQ|ZQ2?4?)$/i.test(_.formatType))
        for (let k of k2) {
            let _size = k.size || k.androidSize || k.iosSize || k.asize || k.isize;
            if (_size) {
                qualitys.push({
                    type: {
                        PQ: "128k",
                        HQ: "320k",
                        SQ: "2000k",
                        ZQ: "4000k",
                        ZQ24: "4000k",
                    }[k.formatType],
                    size: _size
                });
            }
        }
    }
    let qualities = {};
    qualitys.map(_ => {
        qualities[_.type] = {
            size: _.size
        };
    });
    return {
        /* 平台 */
        platform: platformObj.platform,
        /* 类型 */ // 0免费 1会员
        type: (_.fullSong ? _.fullSong.vipFlag : (_.vipType || _.restrictType)) > 0 ? "1" : "0",
        /* 标识 */
        id: songId,
        /* 标识2 - 优先获取✩ */
        mid: copyrightId, // #mediaHash
        /* 曲名 */
        title: name,
        /* 作者 */
        artist: singer,
        /* 别名 */
        // alias: "",
        /* 直链 */
        // url: "",
        /* 时长(s) */
        duration: interval,
        /* 专辑 */
        album: albumName || undefined,
        /* 封面 */
        artwork: picUrl,
        /* 音质 */
        qualities: qualities || undefined,
        /* 其他 */ // 支持自定义
        albumId: albumId || undefined, //专辑id
        // artistId, //歌手id
        vid: _.mvId || (_.mvList && _.mvList[0].copyrightId), //视频id video
        // rid, //播客id radio

        resourceType: songId && resourceType,
        copyrightId,
        contentId
    }
}
// 格式化播客信息
function formatRadioItem(_) {
    _ = formatMusicItem(_);
    _.type = "8" // 8播客
    return _;
}
// 格式化视频信息
function formatVideoItem(_) {
    _ = formatMusicItem(_);
    _.type = "9" // 9视频
    return _;
}
// 格式化歌词信息
function formatLyricItem(_) {
    _ = formatMusicItem(_);
    _.type = "10" // 10歌词
    return _;
}




// 格式化歌单信息
function formatSheetItem(_) {
    let artwork = _.img || _.image || _.imageUrl || _.musicListPicUrl || (_.imgItems && _.imgItems[0] && _.imgItems[0].img);
    if (artwork && /\/\//.test(artwork)) {
        artwork = "https://" + artwork.split("//")[1];
    }
    return {
        /* 平台 */
        platform: platformObj.platform,
        /* 类型 */ // 2歌单
        type: "2",
        /* 歌单id */
        id: String(_.id || _.playListId || _.rankId || (_.logEvent&&_.logEvent.contentId)),
        /* 标识2 - 优先获取✩ */
        // mid,
        /* 标题 */
        title: _.name || _.title || _.playListName || _.rankName || _.txt,
        /* 作者 */
        artist: _.singer || _.createUserName || _.userName,
        /* 封面图 */
        // coverImg: "",
        artwork,
        /* 描述 */
        description: _.summary || _.intro || _.desc || _.txt2,
        /* 作品总数 */
        worksNum: _.musicNum,
        /* 其他参数 */
        date: _.publishDate || (_.updateTime && _.updateTime.split(" ")[0]), // 更新时间
        tags: (_.tagLists || _.ts || []).map(_ => _.tagName || _), // 歌单标签
        // playCount, // 播放数


        resourceType: _.resourceType || (_.logEvent&&_.logEvent.contentType)
    };
}
// 格式化榜单信息
function formatToplistItem(_) {
    _ = formatSheetItem(_);
    _.type = "3" // 3榜单
    return _;
}
// 格式化专辑信息
function formatAlbumItem(_) {
    _ = formatSheetItem(_);
    _.type = "4" // 4专辑
    return _;
}
// 格式化电台信息
function formatProgramItem(_) {
    _ = formatSheetItem(_);
    _.type = "7" // 7电台
    return _;
}



// 格式化歌手信息
function formatArtistItem(_) {
    return {
        /* 平台 */
        platform: platformObj.platform,
        /* 类型 */ // 5歌手
        type: "5",
        /* 歌手id */
        id: _.id || _.resId,
        /* 标识2 - 优先获取✩ */
        // mid,
        /* 歌手名称 */
        title: _.name || _.txt,
        /* 作者名称 */
        artist: _.name || _.txt,
        /* 头像 */
        avatar: _.img || _.musicListPicUrl ||
            (_.imgItems && _.imgItems[0] && _.imgItems[0].img) ||
            (_.singerPicUrl && _.singerPicUrl[0] && _.singerPicUrl[0].img) || "",
        /* 简介 */
        // description,
        /* 作品总数 */
        // worksNum,
        /* 粉丝数 */
        // fans: 0,
        /* 其他参数 */
        resourceType: _.resourceType || _.resType,
    };
}





let pageSize = 30;
let this_host = "https://app.c.nf.migu.cn/MIGUM3.0/v1.0/";

function ajax(resourceType, xId, run, err_index) {
    try {
        let u, p = {
            needSimple: "01"
        };
        switch (resourceType) {
            case "D": // 视频
            case "2": // 歌曲
            case "5": // 专辑(新)
            case "2003": // 专辑(旧)
                u = "content/resourceinfo.do";
                p["resourceType"] = resourceType;
                p["copyrightId"] = xId;
                // p["resourceId"] = xId;
                resourceType = false;
                break;
            default:
                u = resourceType;
                p = Object.assign(p, xId || {});
                resourceType = true;
                break;
        };

        let Json = JSON.parse(fetch(buildUrl(this_host + u, p), {
            timeout: 2000
        }).replace(/},(}|])/g, '}$1')) || {};
        if (resourceType) return Json;
        return Json.resource[0] || {};
    } catch (e) {
        err_index = err_index || 0;
        if (err_index < 3) {
            return ajax(resourceType, xId, run, err_index + 1);
        } else {
            return {};
        }
    }
}





// 返回对象，不支持的功能把函数删掉就行。
let platformObj = {
    platform: "mg", // 插件标识，一般是英文简写，例: tx, wy, kg, kw, mg
    title: "咪咕音乐", // 插件名称☆
    type: "音频", // 插件分类☆ 随便写：视频 / 音频 / 其他
    author: "Thomas喲", // 插件作者
    version: "2026.08.12", // 插件版本
    icon: "https://android-artworks.25pp.com/fs08/2025/08/15/11/110_37674a8ce6c562639a7513517e148bcd_con_130x130.png", //插件封面☆
    srcUrl: "https://raw.githubusercontent.com/ThomasBy2025/hikerview/refs/heads/main/gcsp1999/plugin/mg.js", // 在线链接
    description: [{ // 更新内容/简介☆
        "title": "2026.08.12",
        "records": [
            "““反馈Q群@365976134””",
            "““更新””: 重构插件",
            "‘‘修复’’: 接口请求"
        ]
    }, {
        "title": "2025.09.08",
        "records": [
            "““更新””: 插件示例"
        ]
    }],


    platformProxy: true, // 该插件支持导入解析☆
    debug_musicItem: {
        "album": "T.I.M.E.",
        "albumId": "1140378890",
        "artist": "G.E.M.邓紫棋",
        "artwork": "https://d.musicapp.migu.cn/data/oss/resource/00/3r/uo/64bfab470bed4440bad6467c558cbe1e.webp",
        "contentId": "600919000009783382",
        "copyrightId": "69053700014",
        "duration": "00:04:13",
        "id": "1140379966",
        "mid": "69053700014",
        "platform": "mg",
        "qualities": {
            "128k": {
                "size": "4061102"
            },
            "2000k": {
                "size": "26471114"
            },
            "320k": {
                "size": "10152439"
            },
            "4000k": {
                "size": "50726746"
            }
        },
        "resourceType": "2",
        "title": "唯一",
        "type": "1"
    }, // 测试登录/解析时需要调用



    // 插件已适配musicfree☆
    // musicfree版本的platform需要和插件名称一致
    musicfree: {
        srcUrl: "", // 插件musicfree版本在线链接
        regNames: ["咪咕音乐", "小蜜音乐", "元力MG", "migu"] // 插件在musicfree的同源名称
    },



    // 搜索支持的类型，默认全部都能搜
    supportedSearchType: ["单曲", "歌单", "专辑", "歌手", "视频", "歌词"],

    // 搜索内容
    search: function(query, page, type) {
        let _type = {
            "单曲": {
                type: "song",
                mat: formatMusicItem
            },
            "歌单": {
                type: "songList",
                mat: formatSheetItem
            },
            "专辑": {
                type: "album",
                mat: formatAlbumItem
            },
            "歌手": {
                type: "singer",
                mat: formatArtistItem
            },
            "视频": {
                type: "mvSong",
                mat: formatVideoItem
            },
            "歌词": {
                type: "lyricSong",
                path: "lyric",
                mat: formatLyricItem
            }
        }[type];

        let surl_app = (stype, spath) => {
            let deviceId = '963B7AA0D21511ED807EE5846EC87D20';
            let timestamp = Date.now().toString();
            let sign = '6cdc72a439cef99a3418d2a78aa28c73';
            sign = md5([query + sign, deviceId + timestamp].join("yyapp2d16148780a1dcc7408e06336b98cfd50"));
            let Switch = {
                "song": 0, // 单曲
                "songList": 0, // 歌单
                "mvSong": 0, // 视频
                "lyricSong": 0, // 歌词
                "album": 0, // 专辑
                "singer": 0, // 歌手
                "tagSong": 0, // 标签
                "bestShow": 0, // 热门
                "concert": 0, // 现场
            };
            Switch[stype] = 1;
            
            let url = buildUrl("https://jadeite.migu.cn/music_search/v3/search/searchAll", {
                isCorrect: 0,
                isCopyright: 1,
                searchSwitch: JSON.stringify(Switch),
                pageSize,
                text: encodeURIComponent(query),
                pageNo: page,
                sort: 0,
                sid: "USS"
            });
            return JSON.parse(fetch(url, {
                headers: {
                sign,
                deviceId,
                timestamp,
                channel: '0146921',
                uiVersion: 'A_music_3.6.1',
                'User-Agent': 'Mozilla/5.0 (Linux; U; Android 11.0.0; zh-cn; MI 11 Build/OPR1.170623.032) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30',
            }}))[(spath || stype) + "ResultData"];
        }
        let _ = surl_app(_type.type, _type.path);
        let list = _.items || _.resultList || _.result;
        let total1 = page * pageSize;
        let total2 = _.total || _.totalCount || total1;
        return {
            isEnd: total2 <= (total1 - pageSize + list.length),
            data: list.map(_type.mat)
        }
    },



    // 获取歌单标签
    getRecommendSheetTags: function() {
        let group = [{
            title: "推荐",
            data: []
        }];
        // 推荐0：https://app.c.nf.migu.cn/MIGUM3.0/resource-dataloader/recommend-playlist/v1.0?scene=recommend_playlist
        // 推荐1：https://app.c.nf.migu.cn/pc/bmw/playlist-square/recommend-playlist/v1.0?templateVersion=2
        // 推荐2：https://app.c.nf.migu.cn/pc/bmw/page-data/playlist-square-recommend/v1.0?templateVersion=2
        try { // 热门标签
            JSON.parse(fetchPC("https://app.c.nf.migu.cn/pc/bmw/playlist-square/tab/v1.0")).data
                .contentItemList.forEach((_, i) => {
                    group[0].data.push({
                        title: _.tagName,
                        id: _.tagId
                    });
                });
        } catch (e) {}
        try {
            JSON.parse(fetchPC("https://app.c.nf.migu.cn/pc/v1.0/template/musiclistplaza-taglist/release")).data
                .forEach((_, i) => {
                    group.push({
                        title: _.header.title.replace('流派', '风格'),
                        data: _.content.map(_ => ({
                            title: _.texts[0],
                            id: _.texts[1]
                        }))
                    });
                });
        } catch (e) {}
        return group;
    },

    // 通过标签获取歌单列表
    getRecommendSheetsByTag: function(tagId, pageNumber) {
        let url = buildUrl("https://app.c.nf.migu.cn/pc/v1.0/template/musiclistplaza-listbytag/release", {
            pageNumber,
            templateVersion: 2,
            tagId
        });
        let res = JSON.parse(fetchPC(url)).data;
        let list = res.contentItemList[1].itemList.filter(_ => _.logEvent);
        return {
            isEnd: !res.nextPageUrl,
            data: list.map(formatSheetItem)
        }
    },

    // 获取歌单详情
    getMusicSheetInfo: function(sheetId, page) {
        let _ = JSON.parse(fetchPC("https://app.c.nf.migu.cn/resource/playlist/v2.0?playlistId=" + sheetId)).data;
        // let item = formatSheetItem(_);
        let total = _.musicNum;

        // https://app.c.nf.migu.cn/MIGUM3.0/resource/playlist/song/v2.0?pageNo=1&pageSize=50&playlistId=169018447
        _ = ajax("user/queryMusicListSongs.do", {
            musicListId: sheetId + "",
            pageNo: page,
            pageSize: total
        });
        let list = _.items || _.list || _.contents || _.songItems || _.songList || _.songlist || [];
        return {
            isEnd: list.length < pageSize,
            data: list.map(formatMusicItem)
        }
    },





    // 获取歌曲详情
    getMusicInfo: function(musicItem) {
        let _ = ajax("2", musicItem.copyrightId);
        return formatMusicItem(_);
    },

    // 获取链接(url)
    playurl_timeout: 9E9, // 链接的有效时长(s)☆
    getMediaSource: function(musicItem, quality, qualityItem, mediaType, header) {
        let toneFlag = {
            "128k": "PQ",
            "320k": "HQ",
            "2000k": "SQ",
            "4000k": "ZQ"
        }[quality];
        let headers = {
            "channel": "014X031",
            "referer": "https://musc.migu.cn/",
            "birth": "h5page",
        }

        // 只能获取免费歌曲的128k(PQ)
        let _url = buildUrl("https://app.c.nf.migu.cn/MIGUM3.0/strategy/pc/listen/v1.0", {
            contentId: musicItem.contentId,
            copyrightId: musicItem.copyrightId,
            resourceType: 2,
            toneFlag
        });
        let res = fetch(_url, {
            headers
        });

        if (false) {// WEB接口
            let migukey = "Jk8qzuePiJ1qE3mDYhLQ3T73DtDoAhLP";
            let bytes = hexToBytes(fetch(buildUrl("https://app.c.nf.migu.cn/strategy/pc/listen/v2.0", {
                contentId: musicItem.contentId,
                copyrightId: musicItem.copyrightId,
                resourceType: 2,
                netType: "01",
                toneFlag: toneFlag,
                scene: "",
                lowerQualityContentId: musicItem.contentId
            }), {
                "toHex": true,
                "headers": headers
            }));

            let res = "";
            let seed = bytes[3];

            bytes = bytes.slice(4);
            for (let i = 0; i < bytes.length; i++) {
                let n = (bytes[i] + seed - migukey.charCodeAt(i % migukey.length)) & 0xFF;
                res += String.fromCharCode(n);
            }
        }

        res = JSON.parse(res).data || {};
        return res.url && {
            url: res.url.split("?")[0],
            lyric: res.lrcUrl
        }
    },

    // 获取歌词(lrc)
    getLyric: function(musicItem) {
        try {
            let url = buildUrl("https://app.c.nf.migu.cn/MIGUM3.0/resource/song/by-songids/v2.0", {
                songId: musicItem.id
            });
            let res = JSON.parse(fetchPC(url)).data;
            return res[0].lrcUrl || "";
        } catch (err) {}
        return "";
    },



    // 获取视频链接(mv)☆
    getVideo: function(musicItem) {
        // musicItem = 符合单曲格式的对象 或者 字符串(id);
        /*
                let mvinfo = ajax("2", String(musicItem.copyrightId)).relatedSongs
                    .find(_ => _.resourceType == "D") || {};
               let mvhost = "http://freevod.nf.migu.cn:8080";
        */
        var names = [];
        var urls = [];
        let mvhost = "https://freevod.nf.migu.cn";
        let mvhash = String(musicItem.vid);
        /*
                let mvhash = mvinfo.productId;
                mvhost = this_host.replace("v1.0/", "strategy/mvplayinfo/by-priority/v1.0?canFallback=true&contentId=" + mvhash + "&formatType=");
                ["HQ", "PQ"].map(Type => {
                    let u = JSON.parse(fetch(mvhost + Type)).data;
                    if (u && u.playUrl) {
                        names.push({
                            PQ: "【标清】 240P",
                            HQ: "【高清】 480P",
                        } [Type]);
                        urls.push(u.playUrl);
                    }
                });
        */
        if (mvhash) {
            mvinfo = ajax("D", mvhash).rateFormats || [];
            mvinfo.map(_ => {
                if (_.url && _.formatType != "UHD") {
                    names.push({
                        LQ: "【标清】 240P",
                        PQ: "【高清】 480P",
                        HQ: "【超清】 720P",
                        SQ: "【蓝光】 1080P",
                        UHD: "【加密】 ???P"
                    }[_.formatType] || "【未知】 ???P");
                    urls.push(mvhost + _.url.split("?")[0] + "#isVideo=true#");
                }
            });
        }
        if (urls.length) {
            return {
                names,
                urls,
                // headers: [],
                // danmu: "在线链接/本地链接", // 支持B站的xml格式, JSON格式, webSocket等格式
                // audioUrls: [], // 一般用不到
            };
        } else {
            return false;
        }
    },





    // 获取榜单列表
    getTopLists: function() {
        let res = JSON.parse(fetchPC("https://app.c.nf.migu.cn/pc/bmw/rank/rank-index/v1.0")).data;
        let list = res.contents || [];
        return list.map(_ => ({
            title: _.style,
            data: _.contents.map(formatToplistItem)
        }));
    },

    // 获取榜单详情
    getTopListDetail: function(rankId, page) {
        let url = buildUrl("https://app.c.nf.migu.cn/pc/bmw/rank/rank-info/v1.0", {
            rankType: "",
            period: "",
            rankId
        });
        let res = JSON.parse(fetchPC(url)).data;
        let list = res.contents || [];
        return {
            isEnd: true,
            data: list.map(formatMusicItem)
        }
    },



    // 获取歌手标签☆
    getExploreArtistList: function() {
        return {
            url: "https://app.c.nf.migu.cn/pc/bmw/singer-index/list/v1.0?tab=fysort-fyclass",
            class_name: "男生&女生&组合",
            class_url: "nan&nv&group",
            sort_name: "华语&欧美&日韩",
            sort_url: "huayu&oumei&rihan",
        }
    },

    // 获取歌手列表☆
    getArtistListDetails: function(url) {
        let res = JSON.parse(fetchPC(url)).data
        let list = res.contents || [];
        return {
            isEnd: true,
            data: list.map(formatArtistItem)
        }
    },

    // 获取歌手详情
    getArtistWorks: function(singerId, pageNo, artistType) {
        // https://app.c.nf.migu.cn/pc/bmw/singer/info/v1.1?singerId=112
        // https://app.c.nf.migu.cn/pc/bmw/singer/album/v1.0?pageNo=1&singerId=112
        let url = buildUrl("https://app.c.nf.migu.cn/pc/bmw/singer/song/v1.0", {
            pageNo,
            singerId,
            type: 1
        });
        let res = JSON.parse(fetchPC(url)).data;
        let list = res.contents || [];
        let data = [];
        list.forEach(_ => {
            _.contents.forEach(_ => {
                if (_.songItem) data.push(formatMusicItem(_.songItem));
            });
        });
        return {
            isEnd: !res.header.nextPageUrl,
            data: data
        }
    },



    // 获取专辑详情
    getAlbumInfo: function(albumId, pageNo) {
        let url = buildUrl("https://app.c.nf.migu.cn/MIGUM3.0/resource/album/song/v2.0", {
            pageNo,
            pageSize: 200,
            albumId
        });
        let res = JSON.parse(fetchPC(url)).data || {};
        if (!(res.songList && res.songList.length)) {
            // ajax("5", albumId);
            url = buildUrl("https://app.c.nf.migu.cn/v1.0/content/resourceinfo.do", {
                needSimple: "01",
                resourceType: 5,
                resourceId: albumId
            });
            res = JSON.parse(fetchPC(url)).resource[0] || {};
        }
        let list = res.songList || res.songItems || [];
        return {
            isEnd: true,
            data: list.map(formatMusicItem)
        }
    },





    // 导入平台资源☆
    import_url: function(url) {
        // 匹配链接 返回对象
        // 不成功就返回false
    },

    // 获取分享链接☆
    share_url: function(mediaItem) {
        // 返回平台链接的字符串 或者false
    },
}
$.exports = platformObj;