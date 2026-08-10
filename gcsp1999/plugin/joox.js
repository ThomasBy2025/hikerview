// base64编码/解码
let b64En = (t) => base64Encode(t);
let b64De = (t) => base64Decode(t);
let pageSize = 30;


// 歌曲音质信息
let kbpsMap = {
    "24": "24k", // m4a
    "48": "48k", // m4a
    "96": "96k", // m4a
    "128": "128k", // mp3
    "192": "192k", // m4a
    "320": "320k", // mp3
    "ape": 0, // "1000k",
    "flac": "2000k", // flac
    "hires": "4000k", // flac
    "dolby256": 0, // "11000k",
    "dolby448": 0, // "11500k",
    "stereo_atmos": "20501k", // flac
    "master_tape": "20900k", // flac

    "320ogg": 0,
    "192ogg": 0,
    "192k_mnac": 0,
    "refrain": 0, // 试听？     
};
let _qualityMap = {
    "24k": {
        s: "C100",
        e: ".m4a",
    },
    "48k": {
        s: "C200",
        e: ".m4a",
    },
    "96k": {
        s: "C400",
        e: ".m4a",
    },
    "192k": {
        s: "C600",
        e: ".m4a",
    },

    "128k": {
        s: "M500",
        e: ".mp3",
    },
    "320k": {
        s: "M800",
        e: ".mp3",
    },
    "2000k": {
        s: "F000",
        e: ".flac",
    },
    "4000k": {
        s: "RS01",
        e: ".flac",
    },
    "20501k": { // 臻品全景
        s: "Q0M0",
        e: ".flac",
    },
    "20900k": { // 至臻母带
        s: "AIM0",
        e: ".flac",
    }
};





// 格式化歌曲信息
function formatMusicItem(_) {
    let qualities = {};
    let kbps = JSON.parse(_.kbps_map || "{}");
    for (let k in kbps) {
        if (kbpsMap[k] && kbps[k]) {
            let t = kbpsMap[k];
            qualities[t] = {
                size: kbps[k]
            };
        }
    }
    return {
        /* 平台 */
        platform: platformObj.platform,
        /* 类型 */ // 0免费 1会员
        type: _.track_free_action_control == 41 ? "0" : "1",
        /* 标识 */
        id: _.songid, // #songId
        /* 标识2 - 优先获取✩ */
        mid: _.songmid, // #mediaHash
        /* 曲名 */
        title: b64De(_.songname),
        /* 作者 */
        artist: b64De(_.singername),
        /* 时长(s) */
        duration: _.playtime, // #interval
        /* 专辑 */
        album: b64De(_.albumname),
        /* 封面 */
        artwork: _.album_url,
        /* 音质 */
        qualities,
        /* 其他 */ // 支持自定义
        albumId: _.albumid, //专辑id
        artistId: _.singerid, //歌手id
        vid: Number(_.vid) || undefined, //视频id video
        // rid: _.ktrack_id, //播客id radio
    }
}
// xml => json
function formatMusicItem2(_) {
    return formatMusicItem({
        kbps_map: pdfh(_, "kbps_map&&Text"),
        track_free_action_control: pdfh(_, "track_free_action_control&&Text"),
        songid: pdfh(_, "gl&&Text"),
        songmid: pdfh(_, "songmid&&Text"),
        songname: pdfh(_, "info1&&Text"),
        singername: pdfh(_, "info2&&Text"),
        playtime: pdfh(_, "playtime&&Text"),
        albumname: pdfh(_, "info3&&Text"),
        album_url: pdfh(_, "album_url&&Text"),
        albumid: pdfh(_, "albumid&&Text"),
        singerid: pdfh(_, "singerid&&Text"),
        vid: pdfh(_, "vid&&Text"),
        ktrack_id: pdfh(_, "ktrack_id&&Text"),
    });
}





// 格式化歌单信息
function formatSheetItem(_) {
    return {
        /* 平台 */
        platform: platformObj.platform,
        /* 类型 */ // 2歌单
        type: "2",
        /* 歌单id */
        id: (_.id || _.RecID) + "",

        /* 标题 */
        title: b64De(_.title || _.name || _.RecName || _.singername),
        /* 作者 */
        artist: _.singername || undefined,
        /* 封面图 */
        // coverImg: "",
        artwork: _.picurl || _.PicUrl || _.big_pic || _.album_url || _.bigpic || _.pic_url_tpl.replace("%d", "1000"),
        /* 描述 */
        description: (_.description && b64De(_.description)) || undefined,
        /* 作品总数 */
        worksNum: _.total || _.song_num,
        /* 其他参数 */
        // date: _.modifytime||_.UpdateTime, // 更新时间
        // tags: [_.label], // 歌单标签
        // playCount: _.pv, // 播放数
    };
}
// 格式化榜单信息
function formatToplistItem(_) {
    _ = formatSheetItem(_);
    _.type = "3" // 3榜单
    return _;
}
// 格式化歌手信息
function formatArtistItem(_) {
    _ = formatSheetItem(_);
    _.type = "5"; // 5歌手
    _.avatar = _.artwork;
    delete _.artwork;
    return _;
}
// 格式化专辑信息
function formatAlbumItem(_) {
    _ = formatSheetItem(_);
    _.type = "4" // 4专辑
    return _;
}











// joox_app@openConnection
function fetch_app(path, body) {
    let {
        unzip,
        getMode,
        javaString
    } = $.require(getGitHub(["config", "JavaGzip.js"]));


    let udid = "ffffffffafc29b1f0000019e74b3c5af"; // 用戶標識？
    let cv = 0x21000201; // 未知标识 #70003
    let url = "http://smusic.app.wechat.com" + path;
    let bodyJson = Object.assign({
        "uid": "UnknownUserId",
        "udid": udid,
        "OpenUDID": udid,
        "OpenUDID2": udid,
        "sid": "0",
        "v": cv,
        "cv": cv,
        "ct": 11,
        "os_ver": 15, // 安卓系统版本
        "phonetype": "RMX5010", // 手机型号
        "chid": 0,
        "mcc": "",
        "mnc": "",
        "country": "CN",
        "backend_country": "hk",
        "lang": "zh_CN",
        "wmid": 0,
        "usertype": 10,
    }, body || {});
    let bodyStr = '<?xml version="1.0" encoding="UTF-8"?><root>';
    for (let tag in bodyJson) {
        bodyStr += '<' + tag + '>' + bodyJson[tag] + '</' + tag + '>';
    }
    bodyStr += '</root>';


    let ua = `WeChatMusic ${bodyJson.cv}(android ${bodyJson.os_ver})`;
    let bodyBytes = javaString(bodyStr).getBytes();
    let conn = java.net.URL(url).openConnection();
    conn.setRequestMethod("POST");
    conn.setDoOutput(true);
    conn.setConnectTimeout(5000);
    conn.setRequestProperty("Accept", "*/*");
    conn.setRequestProperty("Accept-Encoding", "");
    conn.setRequestProperty("Connection", "Keep-Alive");
    conn.setRequestProperty("User-Agent", ua);
    conn.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");

    let os = conn.getOutputStream();
    os.write(bodyBytes);
    os.flush();
    os.close();
    let res = conn.getInputStream().readAllBytes();
    try {
        return unzip(getMode(res.slice(5), "Hex"));
    } catch (e) {
        // log(e.toString());
        return "";
    }
}





// 返回函数
let platformObj = {
    platform: "joox", // 插件标识
    title: "Joox音乐", // 插件名称☆
    type: "音频", // 插件分类☆ 随便写：视频 / 音频 / 其他
    author: "Thomas喲", // 插件作者
    version: "2026.08.10", // 插件版本
    icon: "https://static.joox.com/pc/prod/static/di/icons/icon-512x512.png", //插件封面☆
    srcUrl: "https://raw.githubusercontent.com/ThomasBy2025/hikerview/refs/heads/main/gcsp1999/joox.js", // 在线链接
    platformProxy: true, // 该插件支持导入解析☆
    debug_musicItem: {
        "album": "Now You See Me",
        "albumId": "1458791",
        "artist": "周杰倫",
        "artistId": "4558",
        "artwork": "https://image.joox.com/JOOXcover/0/b3e6b2d35c05240a/1000",
        "duration": "00:03:35",
        "id": "107192078",
        "mid": "Z7701FE999D3D2",
        "platform": "joox",
        "qualities": {
            "128k": {
                "size": 3450877
            },
            "2000k": {
                "size": 47089150
            },
            "20501k": {
                "size": 24539670
            },
            "20900k": {
                "size": 156978121
            },
            "24k": {
                "size": 684327
            },
            "320k": {
                "size": 8626883
            },
            "4000k": {
                "size": 78024024
            },
            "48k": {
                "size": 1323936
            },
            "96k": {
                "size": 2641351
            }
        },
        "title": "告白氣球",
        "type": "1"
    },



    // 搜索
    supportedSearchType: ["单曲", "专辑", "歌单", "歌手"],
    search: function(query, page, type) {
        let ein = page * pageSize;
        let _type = {
            "单曲": { // 信息不全
                type: 0,
                path: "tracks",
                mat: formatMusicItem
            },
            "专辑": { // 接口失效
                type: 1,
                path: "albums",
                mat: formatAlbumItem
            },
            "歌手": {
                type: 2,
                path: "artists",
                mat: formatArtistItem
            },
            "歌单": {
                type: 3,
                path: "playlists",
                mat: formatSheetItem
            },
        }[type];
        if (_type.type) {
            let _ = JSON.parse(fetch_app("/fcgi-bin/category_search", {
                "cid": 10041,
                "music": b64En(query),
                "type": _type.type,
                "sin": ein - pageSize,
                "ein": ein,
            }));
            return {
                isEnd: _.sum <= ein,
                data: _.result.map(_type.mat)
            }
        }

// 搜索歌曲
        let xml = fetch_app("/fcgi-bin/3g_search", {
            "cid": 110,
            "uid": "",
            "sid": "",
            "qq": "",
            "music": b64En(query),
            "highlight": 1,
            "sin": ein - pageSize,
            "ein": ein,
        });
        let sum = pdfh(xml, "meta&&sum&&Text") - 0;
        let Arr = pdfa(xml, "body&&item");
        return {
            isEnd: sum <= ein,
            data: Arr.map(formatMusicItem2)
        }
    },



    // 获取歌单标签
    getRecommendSheetTags: function() {
        let group = [{
            title: "推荐",
            data: [{
                title: "综合推荐",
                id: "0"
            }]
        }];
        let _ = JSON.parse(fetch_app("/fcgi-bin/tag_list", {
            "cid": 720
        }));
        _.feature.forEach(it => {
            group[0].data.push({
                title: b64De(it.name),
                id: it.tag_id
            });
        });
        _.category.forEach(it => {
            group.push({
                title: b64De(it.name),
                data: it.itemlist.map(ii => ({
                    title: b64De(ii.name),
                    id: ii.tag_id
                }))
            });
        });
        return group;
    },

    // 通过标签获取歌单列表
    getRecommendSheetsByTag: function(tagId, page) {
        let ein = page * pageSize;
        let _ = JSON.parse(fetch_app("/fcgi-bin/recommend_more", {
            "cid": 30,
            "sin": ein - pageSize,
            "ein": ein,
            "req_type": 5,
            "tab": 1,
            "tag_id": tagId
        }));
        return {
            isEnd: _.count <= ein,
            data: _.itemlist.map(formatSheetItem)
        }
    },

    // 获取歌单详情
    getMusicSheetInfo: function(sheetId, page) {
        let ein = page * pageSize;
        let _ = JSON.parse(fetch_app("/fcgi-bin/3g_get_diss", {
            "cid": 287,
            "authst": "",
            "wmid": 0,
            "opType": 2,
            "qryDissID": sheetId,
            "orderFromTo": 0,
            "qtyUin": 0,
            "hostUin": 0,
            "dirID": 0,
            "meta_ver": 0,
            "detail_ver": 0,
        }));
        return {
            isEnd: true,
            data: _.songlist.map(formatMusicItem)
        }
    },



    // 获取榜单列表
    getTopLists: function() {
        let group = [];
        let _ = JSON.parse(fetch_app("/fcgi-bin/get_toplist", {
            "cid": 293
        }));
        _.Group.forEach(it => {
            group.push({
                title: b64De(it.GroupName),
                data: it.List.map(formatToplistItem)
            });
        });
        return group;
    },

    // 获取榜单详情
    getTopListDetail: function(topId, page) {
        let ein = page * pageSize;
        let _ = JSON.parse(fetch_app("/fcgi-bin/fcg_mv_rank", {
            "cid": 283,
            "authst": "",
            "itemid": topId, // id
            "typeid": 10005,
            "cmd": "getsonginfo",
            "sin": 0,
            "pagesize": 100,
        }));
        return {
            isEnd: true,
            data: _.songlist.map(formatMusicItem)
        }
    },



    // 获取歌手标签☆
    getExploreArtistList: function() {
        // 返回对象 {url, class_name, class_url, area_name, area_url, year_name, year_url, sort_name, sort_url}
        // 写法和海阔小程序一致
        let class_name = [];
        let class_url = [];
        let _ = JSON.parse(fetch_app("/fcgi-bin/singer_category", {
            "cid": 0
        }));
        _.category.forEach(_ => {
            _.itemlist.forEach(_ => {
                class_name.push(b64De(_.name));
                class_url.push(_.category_id);
            });
        });
        return {
            url: "fyclass",
            class_name: class_name.join("&"),
            class_url: class_url.join("&")
        }
    },

    // 获取歌手列表☆
    getArtistListDetails: function(cid, page) {
        let ein = page * pageSize;
        let _ = JSON.parse(fetch_app("/fcgi-bin/all_singer_list", {
            "category_id": cid,
            "sin": ein - pageSize,
            "ein": ein,
        }));
        return {
            isEnd: _.sum <= ein,
            data: _.itemlist.map(formatArtistItem)
        }
    },

    // 获取歌手详情
    getArtistWorks: function(artistId, page, artistType) {
        let ein = page * pageSize;
        let _ = JSON.parse(fetch_app("/fcgi-bin/3g_album_singer", {
            "cid": 266,
            "sin": ein - pageSize,
            "ein": ein,
            "authst": "",
            "udid": "",
            "qq": "",
            "cmd": "2", // 1专辑，2歌曲
            "singerid": artistId,
            "flag": "1",
        }));
        return {
            isEnd: _.sum <= ein,
            data: _.songlist.map(formatMusicItem)
        }
    },



    // 获取专辑详情
    getAlbumInfo: function(albumId, page) {
        let _ = JSON.parse(fetch_app("/fcgi-bin/get_albuminfo", {
            "cid": 10048,
            "page": page - 1, // 0
            "albumid": albumId
        })).albuminfo.songlist;
        return {
            isEnd: true,
            data: _.map(formatMusicItem)
        }
    },

    // 获取歌曲详情   # 没有接口，搜索获取
    getMusicInfo: function(musicItem) {
        let fid = musicItem.id;
        let query = musicItem.title + " - " + musicItem.artist;
        let arr = search(query, 1, "单曲").data;
        return arr.find(_ => _.id == fid);
    },



    // 获取链接(url)
    getMediaSource: function(musicItem, quality, header, mediaType) {
            let typeObj = _qualityMap[quality];
            let filename = `${typeObj.s}${musicItem.mid}${typeObj.e}`;
           // return getVkey(filename);// #Vkey纯算(v1)

            let guid = "0";
            let xml = fetch_app("/fcgi-bin/music_express", {
                "cid": 352,
                "authst": "",
                "qq": 0,
                "guid": guid,
                "nettype": 1020, // 网络状态
                "musicname": filename,
            });
            return pdfh(xml, "server&&Text") + filename +
                "?vkey=" + pdfh(xml, "item&&Text") +
                "&guid=" + guid;
    },



    // 获取歌词(lrc)
    getLyric: function(musicItem) {
        let xml = fetch_app("/fcgi-bin/3g_lyric", {
            "cid": 111,
            "gt": 1,
            "gl": musicItem.id,
            "music": b64En(musicItem.title),
            "singer": b64En(musicItem.artist),
            "album": b64En(musicItem.album),
        });
        return b64De(pdfh(xml, "txt&&Text"));
    },
}
$.exports = platformObj;