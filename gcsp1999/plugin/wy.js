// 格式化歌曲信息
function formatMusicItem(_) {
    _ = _.baseInfo || _.song || _;
    let name = _.name || _.songname;
    let singer = _.ar && _.ar.map(_ => _.name).join('&') || _.artistName;
    let albumName = _.al && _.al.name;
    let albumId = _.al && _.al.id;
    let picUrl = (_.al && _.al.picUrl) || _.cover
    let qualities = {};
    for (let k of ['l', 'h', 'sq', 'hr']) {
        if (_[k] || (k == 'l' && _[k = 'm'])) {
            let t = {
                'm': "low",
                'l': "low", //192k
                'h': "standard",
                'sq': "high",
                'hr': "super"
            } [k];
            qualities[t] = {};
            qualities[t].size = _[k].size;
            // qualities[t].url = "";
        }
    }
    return {
        /* 平台 */
        platform: platformObj.platform,
        /* 类型 */ // 0免费 1会员
        type: ((_.fee == 0 || _.fee == 8) && (_.privilege ? (_.privilege.st > -1) : 1)) ? "0" : "1",
        /* 标识 */
        id: String(_.id || "") || undefined, // #songId
        /* 标识2 - 优先获取✩ */
        // mid, // #mediaHash
        /* 曲名 */
        title: name,
        /* 作者 */
        artist: singer,
        /* 别名 */
        // alias: "",
        /* 直链 */
        // url: `http://music.163.com/song/media/outer/url?id=${_.id}.mp3`,
        /* 时长(s) */
        duration: _.dt || _.duration, // #interval
        /* 专辑 */
        album: albumName,
        /* 封面 */
        artwork: picUrl,
        /* 音质 */
        qualities,
        /* 其他 */ // 支持自定义
        albumId, //专辑id
        artistId: _.ar && _.ar.map(_ => _.id).join('&'), //歌手id
        vid: _.mv || undefined, //视频id video
        rid: _.dj && _.dj.id, //播客id radio

        // rawLrc: _.lyrics,
    }
}





// 格式化播客信息
function formatRadioItem(_) {
    _ = _.baseInfo || _.song || _;
    let al = _.program || _;
    let ar = _.anchor || _.dj;
    let at = _.radio;
    _ = _.mainSong;
    let r = {
        id: _.id,
        name: _.name || al.name || at.name,
        ar: _.artists || [{
            name: ar.nickname || ""
        }],
        al: {
            id: (at.id) || "",
            name: (at.name) || "",
            picUrl: al.coverUrl || (_.album && _.album.picUrl) || at.picUrl || ar.avatarUrl || ""
        },
        fee: _.fee || 0,
        dt: _.duration || al.duration,
        l: _.lMusic,
        m: _.mMusic,
        h: _.hMusic,
        sq: _.sqMusic,
        hr: _.hrMusic
    }
    if (r.al.id) r.al.id += "#djradio";
    _ = formatMusicItem(r);
    // _.type = "8" // 8播客
    return _;
}
// 格式化视频信息





function formatVideoItem(_) {
    if (_.baseInfo) {
        _ = _.baseInfo.resource;
        _ = {
            /* 平台 */
            platform: platformObj.platform,
            /* 类型 */
            type: "9", // 9视频
            /* 标识 */
            vid: _.mlogBaseData.id, //视频id video
            /* 曲名 */
            title: _.mlogBaseData.text,
            /* 作者 */
            artist: _.userProfile.nickname,
            /* 时长(s) */
            duration: _.mlogBaseData.duration, // #interval
            /* 封面 */
            artwork: _.mlogBaseData.coverUrl
        };
    } else {
        _ = formatMusicItem(_);
    }
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
    _ = _.baseInfo || _;
    return {
        /* 平台 */
        platform: platformObj.platform,
        /* 类型 */ // 2歌单
        type: "2",
        /* 歌单id */
        id: String(_.id || _.resourceId || "") || undefined,
        /* 标识2 - 优先获取✩ */
        // mid,
        /* 标题 */
        title: _.name || _.title,
        /* 作者 */
        artist: (_.artist && _.artist.name) || (_.creator && _.creator.nickname),
        /* 封面图 */
        // coverImg: "",
        artwork: _.coverImgUrl || _.picUrl || _.coverImg || _.coverUrl,
        /* 描述 */
        description: _.description || _.updateFrequency,
        /* 作品总数 */
        worksNum: _.trackCount || (_.artist && _.artist.musicSize),
        /* 其他参数 */
        date: _.updateTime || _.publishTime, // 更新时间
        tags: [], // 歌单标签
        playCount: _.playCount, // 播放数
        createUserId: _.userId,
        createTime: _.createTime,
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
        id: _.id + "",
        /* 标识2 - 优先获取✩ */
        // mid,
        /* 歌手名称 */
        title: _.name,
        /* 作者名称 */
        // artist: _.name,
        /* 头像 */
        avatar: _.img1v1Url || _.picUrl,
        /* 简介 */
        description: _.briefDesc || _.description,
        /* 作品总数 */
        worksNum: _.albumSize || _.musicSize,
        /* 粉丝数 */
        // fans: 0,
        /* 其他参数 */
    };
}
// 格式化用户信息
function formatUserItem(_) {
    _ = formatArtistItem(_);
    _.type = "6" // 6用户
    return _;
}



// 格式化评论信息
function formatComment(_) {
    return {
        /* 平台 */
        platform: platformObj.platform,
        // 评论ID
        id: _.commentId + "",
        /* 标识2 - 优先获取✩ */
        // mid,
        // 用户名
        nickName: _.user && _.user.nickname,
        // 头像
        avatar: _.user && _.user.avatarUrl,
        // 评论内容
        comment: _.content,
        // 点赞数
        like: _.likedCount,
        // 评论时间
        createAt: _.time,
        // 地址
        location: _.ipLocation && _.ipLocation.location,
        // 回复
        replies: (_.beReplied || []).map(formatComment),
        /* 其他参数 */
        type: "11" // 11评论
    };
}



// 基础常量
let pageSize = 30;
let this_host = "https://interface.music.163.com/";
// 音质参数
let qualityMap = {
    "low": "standard",
    "standard": "exhigh",
    "high": "lossless",
    "super": "hires",
    /*
        "standard": "128k标准音质",
        "higher": "192k高品音质",
        "exhigh": "320k极高音质",
        "lossless": "flac无损音质",
        "hires": "Hi-Res音质",
        "jyeffect": "高清环绕",
        "sky": "沉浸环绕", // SVIP
        "jymaster": "超清母带", // SVIP
    */
};
// 用户数据
function getHeaderx(headerx) {
    let {
        music_u
    } = getUserVariables(platformObj);
    return Object.assign({
        "Secret": "5pa55qC86Z+z5LmQ54mb6YC8",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36",
        "Cookie": "os=pc; appver=9.0.25; " + (music_u.replace(/^.*music_[ua]=/i, "MUSIC_U=") || "MUSIC_U=0034B44F9926BE9F1DD236BFB146E0FEB27696AD0802E2DD8D8062B036AD87CEEEB49D3141C00C103A8B110C944E6DFA2909843C098EB2515B513BC1AA0A7974866D653BEA27F81BF15700FB398CB95ABE260EDA0E71900A46296E8E9C069B6C6A3509D1FDE9F41DCEF55B07BEE0990EE13F8A461098536FF86896E76892551CC5B8C6C2063E605639146CEF24D2904725876F53C57B442653EA13ACFE9F2653B512A23BABE01680F2E953AF4BE1602B38B39B38B1D6D5C50E1F84AAF323D841A717DECDF9E0834EF1703C1D4A37DE7DB3AC49FA2A2C397B3418C34FAF191ED064E4F266D94A281B0C08947F339929EE1896350C37FE1E007D32BE2E0C1970DD2161A0D87F4A95CEA5B111289EC1064555149DBEEFBF73A1397D5B24EB5B429D81C8CBDB2A7DF61BECFAB3DBA3BD165167")
    }, headerx || {})
}



//  web - weapi
function ajax2(path, json, head) {
    let CryptoUtil = $.require("hiker://assets/crypto-java.js");
    let str_key = CryptoUtil.Data.parseUTF8("0CoJUm6Qyw8W8jud");
    let str_iv = CryptoUtil.Data.parseUTF8("0102030405060708");
    let aes = word => CryptoUtil.AES.encrypt(word, str_key, {
        mode: "AES/CBC/PKCS7Padding",
        iv: str_iv
    }).toBase64(_base64.NO_WRAP);
    let params = aes(aes(JSON.stringify(json)));
    let headers = getHeaderx(head);
    return JSON.parse(postPC(path.replace(/^(\/api)?\//i, this_host + "weapi/"), {
        headers,
        body: {
            params: params,
            encSecKey: "bf50d0bcf56833b06d8d1219496a452a1d860fd58a14c0aafba3e770104ca77dc6856cb310ed3309039e6865081be4ddc2df52663373b20b70ac25b4d0c6ca466daef6b50174e93536e2d580c49e70649ad1936584899e85722eb83ceddfb4f56c1172fca5e60592d0e6ee3e8e02be1fe6e53f285b0389162d8e6ddc553857cd"
        }
    }));
}



//  app - eapi
function ajax3(path, json, head) {
    let CryptoUtil = $.require("hiker://assets/crypto-java.js");
    let params = [path, JSON.stringify(json || {})];
    params.push(md5(
        "nobody" +
        params.join("use") +
        "md5forencrypt"
    ));
    let headers = getHeaderx(head);
    return JSON.parse(postPC(path.replace("/", this_host + "e"), {
        headers,
        body: {
            params: CryptoUtil.AES.encrypt(
                params.join("-36cd479b6b5-"),
                CryptoUtil.Data.parseUTF8("e82ckenh8dichen8"), {
                    mode: "AES/ECB/PKCS7Padding",
                }
            ).toHex()
        }
    }));
}



// 搜索请求
function searchBase(query, page, type, v1) {
    let path = "/api" + v1 + "/search/" + (/\//.test(type) ? type : (type + "/get"));
    let data = {
        "filterCode": "-1",
        "offset": ((page - 1) * pageSize) + "",
        "limit": pageSize + "",
        "channel": "typing",
        "keyword": query,
        "scene": "normal",
        "s": query,
    };
    let res = ajax3(path, data);
    return res.data || res.result;
}



// 返回对象，不支持的功能把函数删掉就行。
let platformObj = {
    platform: "wy", // 插件标识，一般是英文简写，例: tx, wy, kg, kw, mg
    title: "网易音乐", // 插件名称☆
    type: "音频", // 插件分类☆ 随便写：视频 / 音频 / 其他
    author: "Thomas喲", // 插件作者
    version: "2025.09.20", // 插件版本
    icon: "https://android-artworks.25pp.com/fs08/2025/08/29/0/110_e8f7db85c17637c2d54309fcf535cadc_con_130x130.png", //插件封面☆
    srcUrl: "https://raw.githubusercontent.com/ThomasBy2025/hikerview/refs/heads/main/gcsp1999/plugin/wy.js", // 在线链接
    description: [{ // 更新内容/简介☆
        "title": "2025.09.20",
        "records": [
            "““反馈Q群@365976134””",
            "““更新””: 资源导入相关逻辑",
            "‘‘修复’’: 45秒试听链接不返回"
        ]
    }, {
        "title": "2025.09.08",
        "records": [
            "““更新””: 插件示例",
            "‘‘增加’’: 用户变量"
        ]
    }],



    platformProxy: true, // 该插件支持导入解析☆
    userVariables: [{ // 用户变量，通过getUserVariables(platformObj)函数获取
        key: "music_u",
        name: "用户数据",
        hint: "music_u / music_a"
    }],
    debug_musicItem: {
        "platform": "wy",
        "type": "1",
        "id": "2083785152",
        "title": "唯一",
        "artist": "G.E.M.邓紫棋",
        "duration": 253735,
        "album": "T.I.M.E.",
        "artwork": "http://p4.music.126.net/aJWtwvdYRXvKUpAE2C6NoA==/109951168919708423.jpg",
        "qualities": {
            "low": {
                "size": 4060845
            },
            "standard": {
                "size": 10152045
            },
            "high": {
                "size": 27080453
            },
            "super": {
                "size": 51401370
            }
        },
        "albumId": 174925713,
        "artistId": "7763"
    }, // 测试登录/解析时需要调用



    // 插件已适配musicfree☆
    // musicfree版本的platform需要和插件名称一致
    musicfree: {
        srcUrl: "", // 插件musicfree版本在线链接
        regNames: ["网易音乐", "网易云音乐", "网易云", "小芸音乐", "简繁音乐", "云音乐", "元力WY", "网抑云", "网易", "NeteaseMusic"] // 插件在musicfree的同源名称
    },



    // 搜索支持的类型，默认全部都能搜
    supportedSearchType: ["单曲", "歌单", "专辑", "歌手", "视频", "歌词", "电台", "播客"],

    // 搜索内容
    search: function(query, page, type) {
        // type = supportedSearchType的一个数值
        // query = "搜索关键词"
        // 返回对象  {isEnd, data}
        // isEnd 页面是否结束  true / false
        // data 符合type格式的数组
        let stype = {
            "单曲": {
                t: "song",
                m: formatMusicItem
            },
            "专辑": {
                t: "album",
                v: "/v1",
                m: formatAlbumItem
            },
            "歌手": {
                t: "artist",
                v: "/v1",
                m: formatArtistItem
            },
            "歌单": {
                t: "playlist",
                m: formatSheetItem
            },
            "歌词": {
                t: "resource/lyric",
                m: formatLyricItem
            },
            "视频": {
                t: "mlog",
                m: formatVideoItem
            },
            "电台": {
                t: "voicelist",
                m: formatProgramItem
            },
            "播客": {
                t: "voice",
                m: formatRadioItem
            }
        } [type];
        let _ = searchBase(query, page, stype.t, stype.v || "");
        let list = _.resources || _.albums || _.artists || [];

        if (stype.t == "mlog") {
            list = function() {
                let a = [];
                let b = [];
                let c = [];
                list.map((_, i) => {
                    try {
                        c.push({
                            id: _.baseInfo.resource.mlogExtVO.song.id
                        });
                        b.push(i);
                    } catch (e) {
                        a[i] = _;
                    }
                });
                c = ajax2("/api/v3/song/detail", {
                    c: JSON.stringify(c)
                });
                c.songs.map((__, i) => {
                    let e = __ || c.privileges[i];
                    e.privilege = c.privileges[i];
                    a[b[i]] = e;
                });
                return a;
            }();
        }

        let total1 = page * pageSize;
        let total2 = _.songCount || _.playlistCount || _.albumCount || _.totalCount || (total1 - pageSize + list.length);
        return {
            isEnd: total2 <= total1,
            data: list.map(stype.m)
        }
    },



    // 获取歌单标签
    getRecommendSheetTags: function() {
        // 返回数组，取第一组为推荐分类。
        // 数组键值 { title: "主要分类标题", data: [] }
        // data键值  { title: "次要分类标题", id: "分类id" }
        let group = ["语种", "风格", "场景", "情感", "主题"].map(name => {
            return ({
                title: name,
                data: []
            });
        });
        ajax3("/api/playlist/catalogue/v1", {}).sub.map(_ => {
            group[_.category].data.push({
                title: _.name,
                id: _.name
            });
        });
        group.unshift({
            title: "热门",
            data: [{
                title: "随机",
                id: "personalized"
            }, {
                title: "推荐",
                id: "_SPECIAL_CLOUD_VILLAGE_PLAYLIST"
            }, {
                title: "官方",
                id: "官方"
            }, {
                title: "雷达",
                id: "_RADAR"
            }, {
                title: "原创",
                id: "_SPECIAL_ORIGIN_SONG_LOCATION"
            }, {
                title: "心情",
                id: "_FEELING_PLAYLIST_LOCATION"
            }, {
                title: "场景",
                id: "_SCENE_PLAYLIST_LOCATION"
            }, {
                title: "专属",
                id: "_COMBINATION"
            }, {
                title: "全部",
                id: "全部歌单"
            }, {
                title: "新热",
                id: "_NEW_SONG_AND_ALBUM"
            }, {
                title: "影视",
                id: "_FIRM_PLAYLIST"
            }, {
                title: "奖项",
                id: "_AWARDS_PLAYLIST"
            }]
        });
        return group;
    },

    // 通过标签获取歌单列表
    getRecommendSheetsByTag: function(tagId, page) {
        // 返回对象  {isEnd, data}
        // isEnd 页面是否结束  true / false
        // data 符合歌单格式的数组
        let _, t1 = tagId;
        if (t1 == "personalized") { // 默认
            _ = ajax3("/api/personalized/playlist", {
                limit: 27
            }, {
                Cookie: ""
            });
        } else if (/^_[A-Z]+/.test(t1)) { // 推荐
            _ = ajax3("/api/link/page/rcmd/resource/show", {
                "pageCode": "HOME_RECOMMEND_PAGE",
                "isFirstScreen": "false",
                "cursor": "6",
                "refresh": "true",
                "blockCodeOrderList": `["PAGE_RECOMMEND${t1}"]`
            }).data.blocks[0].dslData;
            _ = (_.home_page_common_playlist_module_d1r94fwj80 || _.home_page_scene_playlist_module_w5rp24j0x2 || _.home_page_scene_playlist_module_rsoa9pd6fn || _).blockResource;
        } else {
            _ = ajax3("/api/playlist/list", {
                cat: t1 || "全部",
                order: "hot",
                limit: pageSize,
                offset: (page - 1) * pageSize,
                total: true,
                csrf_token: "",
            });
        }
        let list = _.result || _.playlists || _.resources || [];
        let total1 = page * pageSize;
        let total2 = _.total || (total1 - pageSize + list.length);
        return {
            isEnd: (_.more !== true) || (total2 <= total1),
            data: list.map(formatSheetItem)
        };
    },

    // 获取歌单详情
    getMusicSheetInfo: function(sheetId, page) {
        // 返回对象  {isEnd, item, data}
        // isEnd 页面是否结束  true / false
        // item 符合歌单格式的对象
        // data 符合单曲格式的数组
        if (/#djradio/.test(sheetId)) return platformObj.getProgramInfo(sheetId, page);
        let _ = ajax3("/api/v6/playlist/detail", {
            n: 99999,
            id: +sheetId
        }).playlist;
        let list = _.tracks || [];
        return {
            isEnd: 99999 >= _.trackCount,
            item: formatSheetItem(_),
            data: list.map(formatMusicItem)
        };
    },



    // 获取榜单列表
    getTopLists: function() {
        // 返回数组
        // 数组键值 { title: "分类标题", data: [] }
        // data键值  { title: "榜单标题", id: "榜单id" }
        let group1 = [];
        let group2 = ajax3("/api/toplist/detail/v2", {});
        group2.data.map(_ => {
            if (_.list && _.list.length) {
                let group3 = [];
                _.list.map(_ => {
                    if (_.id != 0) group3.push(formatSheetItem(_));
                });
                group1.push({
                    title: _.name,
                    data: group3
                });
            }
        });
        return group1;
    },

    // 获取榜单详情
    getTopListDetail: function(topId, page) {
        // 返回对象  {isEnd, item, data}
        // isEnd 页面是否结束  true / false
        // item 符合歌单格式的对象
        // data 符合单曲格式的数组
    },



    // 获取歌手标签☆
    getExploreArtistList: function() {
        // 返回对象 {url, class_name, class_url, area_name, area_url, year_name, year_url, sort_name, sort_url}
        // 写法和海阔小程序一致
        return {
            url: JSON.stringify({
                initial: "",
                total: true,
                limit: 30,
                area: "fyarea",
                type: "fyclass"
            }),
            class_name: "全部&男生&女生&组合",
            class_url: "-1&1&2&3",
            area_name: "全部&华语&欧美&日本&韩国&其他",
            area_url: "-1&7&96&8&16&0",
        }
    },

    // 获取歌手列表☆
    getArtistListDetails: function(url, page) {
        // 返回对象  {isEnd, data}
        // isEnd 页面是否结束  true / false
        // data 符合歌手格式的数组
        url = JSON.parse(url);
        url.offset = (page - 1) * 30;
        let _ = ajax3("/api/v1/artist/list", url);
        return {
            isEnd: _.more != true,
            data: _.artists.map(formatArtistItem)
        };
    },

    // 获取歌手详情
    getArtistWorks: function(artistId, page, artistType) {
        // artistType = "歌曲" || "专辑" || "视频" || "电台" || "播客"
        // 返回对象  {isEnd, item, data}
        // isEnd 页面是否结束  true / false
        // item 符合歌手格式的对象
        // data 符合type格式的数组
        let T = {
            "歌曲": {
                "path1": "/api/v1/artist/",
                "path2": "hotSongs",
                "mapJs": formatMusicItem
            },
            "专辑": {
                "path1": "/api/artist/albums/",
                "path2": "hotAlbums",
                "mapJs": formatAlbumItem
            },
        } [artistType || "歌曲"];
        let res = ajax3(T.path1 + artistId, {});
        if (T.path2 == "hotSongs") {
            res[T.path2] = platformObj.getMusicInfo(res[T.path2]);
        }
        return {
            isEnd: true,
            item: formatArtistItem(res.artist),
            data: res[T.path2].map(T.mapJs),
        };
    },



    // 获取专辑详情
    getAlbumInfo: function(albumId, page) {
        // 返回对象  {isEnd, item, data}
        // isEnd 页面是否结束  true / false
        // item 符合专辑格式的对象
        // data 符合单曲格式的数组
        if (albumId.match("#djradio")) {
            return platformObj.getProgramInfo(albumId, page);
        }
        let res = ajax3("/api/v1/album/" + albumId, {});
        res.songs = platformObj.getMusicInfo(res.songs);
        return {
            isEnd: true,
            item: formatAlbumItem(res.album),
            data: (res.songs || []).map(formatMusicItem),
        };
    },

    // 获取评论
    getMusicComments: function(commentId, page, commentType) {
        // commentType = "歌曲" || "歌单" || "专辑" || "视频" || "电台" || "播客"
        // 返回对象  {isEnd, data}
        // isEnd 页面是否结束  true / false
        // data 符合评论格式的数组
        let res = ajax3("/api/v2/resource/comments", {
            "threadId": "R_SO_4_" + musicItem.id,
            "cursor": "20",
            "sortType": "1",
            "pageNo": page,
            "pageSize": pageSize + "",
            "parentCommentld": "0",
            "showlnner": false
        }).data;
        return {
            isEnd: res.hasMore != true,
            data: res.comments.map(formatComment)
        }
    },



    // 获取歌曲详情
    getMusicInfo: function(musicItem) {
        // musicItem大部分情况是字符串(id)，但不排除是数组的可能
        // 返回符合歌曲格式的对象，musicItem是数组时返回数组
        // 获取歌曲详情
        let isObj = !Array.isArray(musicItem);
        if (isObj) {
            musicItem = [musicItem];
        }
        musicItem = musicItem.map(_ => ({
            id: _.id + ""
        }));
        let list = ajax3("/api/v3/song/detail", {
            c: JSON.stringify(musicItem)
        });
        list = list.songs.map((song, i) => {
            song.privilege = list.privileges[i];
            return song;
        });
        return isObj ? formatMusicItem(list[0]) : list;
    },

    // 获取链接(url)
    getMediaSource: function(musicItem, quality, header, mediaType) {
        // musicItem = 符合单曲格式的对象
        // quality = "low" || "standard" || "high" || "super" #需要获取的音质
        // header = 会员cookie(前提插件有实现登录函数)
        // mediaType = "play" || "down" || "debug"
        if (mediaType == "debug") { // 登录测试
            musicItem = platformObj.debug_musicItem;
            quality = "low";
            mediaType = "down";
        }
        let _, url = musicItem.type == 0 && `http://music.163.com/song/media/outer/url?id=${musicItem.id}.mp3`;
        if (!url) _ = ajax3("/api/song/enhance/player/url/v1", {
            ids: `["${musicItem.id}"]`,
            encodeType: "flac",
            immerseType: "c51",
            trialMode: "23", // 试听
            level: qualityMap[quality]
        }, header).data;
        if (_ && _[0] && _[0].code == 404) return false;
        if (_ && _[0] && _[0].url && !(_[0].freeTrialInfo && _[0].freeTrialInfo.end == 45)) {
            url = String(_[0].url).split("?")[0];
        }
        if (url && url != "") {
            return {
                urls: [url],
                // names: [],
                // headers: [],
                lyric: platformObj.getLyric(musicItem),
                // audioUrls: [], // 一般用不到
            };
        }
        return false; // 无法获取播放链接
    },

    // 获取歌词(lrc)
    getLyric: function(musicItem) {
        // musicItem = 符合单曲格式的对象 或者 字符串(id);
        // 返回符合lrc格式的字符串 / 在线链接
        let lrc;
        try { // /api/song/media?id=
            lrc = ajax2("/api/song/lyric", {
                id: musicItem.id,
                lv: -1,
                kv: -1,
                tv: -1
            }).lrc.lyric;
        } catch (err_1) {
            try {
                lrc = ajax3("/api/song/lyric/v1", {
                    "id": musicItem.id,
                    "cp": "false",
                    "lv": "0",
                    "tv": "0",
                    "kv": "0",
                    "rv": "0",
                    "yv": "0",
                    "ytv": "0",
                    "yrv": "0"
                }).lrc.lyric;
            } catch (err_2) {}
        }
        return lrc || "";
    },



    // 下面的参数可能会改，没有固定
    playurl_timeout: 60 * 60, // 官方链接的有效时长(s)☆

    // 获取用户详情☆
    getUserInfo: function(userId, page, userType) {
        // userType = "创建" || "收藏" || "专辑" || "电台" || "播客"
        // 返回对象  {isEnd, item, data}
        // isEnd 页面是否结束  true / false
        // item 符合用户格式的对象
        // data 符合type格式的数组
    },

    // 获取电台详情☆
    getProgramInfo: function(programId, page) {
        // 返回对象  {isEnd, item, data}
        // isEnd 页面是否结束  true / false
        // item 符合电台格式的对象
        // data 符合播客格式的数组
        let _ = ajax3("/api/v4/dj/program/byradio", {
            "page": "{\"size\":0}",
            "radioId": String(programId).replace("#djradio", "")
        }).data;
        let list = _.records.map(formatRadioItem);
        return {
            isEnd: _.page.more != true,
            // item: formatProgramItem(_.extInfo.radioData),
            data: list
        }
    },

    // 获取视频链接(mv)☆
    getVideo: function(musicItem) {
        // musicItem = 符合单曲格式的对象 或者 字符串(id);
        let mvhash = musicItem.vid;
        let names = [];
        let urls = [];
        let mvinfo;
        if (isNaN(Number(mvhash))) {
            mvinfo = ajax2(`/mlog/detail/v1`, {
                id: mvhash,
                resolution: 1080,
                type: 1
            }).data.resource.content.video.urlInfos;
            mvinfo.map(_ => {
                let _r = {
                    '1080': '【蓝光】 ',
                    '720': '【超清】 ',
                    '480': '【高清】 ',
                    '360': '【标清】 ',
                    '240': '【流畅】 '
                } [_.r] + _.r + 'P';
                names.push(_r);
                urls.push(_.url);
            });
        } else {
            mvinfo = ajax3("/api/mv/detail", {
                "id": mvhash + ""
            }).data.brs;
            [
                ['1080', '【蓝光】 '],
                ['720', '【超清】 '],
                ['480', '【高清】 '],
                ['360', '【标清】 '],
                ['240', '【流畅】 '],
            ].map([path, name] => {
                if (mvinfo[path]) {
                    names.push(name + path + 'P');
                    urls.push(mvinfo[path]);
                }
            });
        }
        return urls.length && {
            urls: urls.map(u => u + "#isVideo=true#"),
            names,
            // headers: [],
            // danmu: "在线链接/本地链接", // 支持B站的xml格式, JSON格式, webSocket等格式
            // audioUrls: [], // 一般用不到
        };
    },

    // 获取播客详情☆
    getRadioInfo: function(radioItem) {
        // 返回符合播客格式的对象
    },

    // 获取播客链接(dj)☆
    getRadio: function(musicItem) {
        // musicItem = 符合单曲格式的对象 或者 字符串(id);
        return platformObj.getMediaSource(musicItem, "low");
    },

    // 导入平台资源☆
    import_url: function(urlLike) {
        // 匹配链接 返回对象
        // 不成功就返回false
        if (!/music\.163\.com|163cn\.tv/i.test(urlLike)) {
            return undefined;
        }
        let _, id;
        if (id = (urlLike.match(/song(.*?[\?\&]id=|\/)(\d+)/i) || [])[2]) { // type: 0/1/10
            return platformObj.getMusicInfo({
                id
            });
        }
        if (id = (urlLike.match(/playlist(.*?[\?\&]id=|\/)(\d+)/i) || [])[2]) { // type: 2/3
            _ = ajax3("/api/v6/playlist/detail", {
                n: 1,
                id: id
            }).playlist;
            return formatSheetItem(_);
        }
        if (id = (urlLike.match(/album(.*?[\?\&]id=|\/)(\d+)/i) || [])[2]) { // type: 4
            _ = ajax3("/api/v1/album/" + id, {});
            return formatAlbumItem(_.album);
        }
        if (id = (urlLike.match(/artist(.*?[\?\&]id=|\/)(\d+)/i) || [])[2]) { // type: 5
            _ = ajax3("/api/v1/artist/" + id, {});
            return formatArtistItem(_.artist);
        }
        if (/user(.*?[\?\&]id=|\/)(\d+)/i.test(urlLike)) { // type: 6
            return undefined;
        }
        if (id = (urlLike.match(/d?j?radio(.*?[\?\&]id=|\/)(\d+)/i) || [])[2]) { // type: 7
            _ = ajax3("/api/djradio/v3/get", {
                id
            }).data;
            return formatProgramItem(_);
        }
        if (id = (urlLike.match(/program(.*?[\?\&]id=|\/)(\d+)/i) || [])[2]) { // type: 8
            _ = ajax2("/api/dj/program/detail/static/get", {
                id
            }).data;
            return formatRadioItem(_);
        }
        if (id = (urlLike.match(/mv(.*?[\?\&]id=|\/)(\d+)/i) || [])[2]) { // type: 9
            _ = ajax2("/api/v1/mv/detail", {
                id
            }).data;
            _ = formatVideoItem(_);
            _.type = "9";
            _.vid = _.id;
            delete _.qualities;
            delete _.id;
            return _;
        }
        return false;
    },

    // 获取分享链接☆
    share_url: function(mediaItem) {
        // 返回平台链接的字符串 或者false
    },
}
$.exports = platformObj;