// 格式化歌曲信息
function formatMusicItem(_) {
    let qualitys = _.relate_goods || [];
    if (qualitys.length == 0) {
        for (let k of ['', '320', 'sq', 'hign']) {
            if (_[k + 'filesize']) {
                qualitys.push({
                    type: {
                        '': "128k",
                        '320': "320k",
                        'sq': "flac",
                        'high': "flac24bit"
                    } [k],
                    size: _[k + 'filesize'],
                    hash: _[k + 'hash'].toUpperCase()
                });
            }
        }
    } else {
        _ = qualitys[0];
        qualitys = qualitys.slice(0, 4).filter(_ => /^(128|320|flac|high)$/i.test(_.quality)).map((_, i) => {
            return {
                type: {
                    '128': '128k',
                    '320': '320k',
                    'flac': 'flac',
                    'high': 'flac24bit'
                } [_.quality],
                size: _.info.filesize,
                hash: _.hash.toUpperCase()
            }
        });
    };
    let qualities = {};
    qualitys.map(_ => {
        let quality = {
            '128k': 'low',
            '320k': 'standard',
            'flac': 'high',
            'flac24bit': 'super'
        } [_.type]
        qualities[quality] = {};
        qualities[quality].size = _.size;
        qualities[quality].hash = _.hash;
    });
    let [artist, title] = String(_.filename || _.name).split(' - ');
    return {
        /* 平台 */
        platform: platformObj.platform,
        /* 类型 */ // 0免费 1会员
        type: (_.privilege == 0 || _.privilege == 8) ? "0" : "1",
        /* 标识 */
        id: _.audio_id || _.id, // #songId
        /* 标识2 - 优先获取✩ */
        mid: _.hash.toUpperCase(), // #mediaHash
        /* 曲名 */
        title,
        /* 作者 */
        artist,
        /* 别名 */
        // alias: "",
        /* 直链 */
        // url: "",
        /* 时长(ms) */
        duration: (_.info && _.info.duration) || (_.duration * 1000), // #interval
        /* 专辑 */
        album: _.albumname || _.remark,
        /* 封面 */
        artwork: _.album_sizable_cover || (_.info && _.info.image),
        /* 音质 */
        qualities,
        /* 其他 */ // 支持自定义
        albumId: _.album_id, //专辑id
        // artistId, //歌手id
        vid: _.MvHash || _.mvhash, //视频id video
        // rid, //播客id radio

        hash: _.hash.toUpperCase(),
        album_audio_id: _.album_audio_id,
        MixSongID: _.MixSongID,
        MvID: _.MvID
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
    return {
        /* 平台 */
        platform: platformObj.platform,
        /* 类型 */ // 2歌单
        type: "2",
        /* 歌单id */
        id: _.specialid || _.rankid || _.albumid || _.AuthorId,
        /* 标识2 - 优先获取✩ */
        // mid,
        /* 标题 */
        title: _.specialname || _.rankname || _.albumname || _.title || _.AuthorName || _.name,
        /* 作者 */
        // artist,
        /* 封面图 */
        // coverImg: "",
        artwork: _.img || _.flexible_cover || _.imgurl || _.Avatar || (_.pic || "").replaceAll("{size}", "500"),
        /* 描述 */
        description: _.intro,
        /* 作品总数 */
        worksNum: _.song_count || _.songcount || (_.extra && _.extra.resp && _.extra.resp.all_total),
        /* 其他参数 */
        date: _.rank_id_publish_date || _.publish_time, // 更新时间
        tags: [], // 歌单标签
        // playCount, // 播放数
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
        id: _.AuthorId || _.singerid,
        /* 标识2 - 优先获取✩ */
        // mid,
        /* 歌手名称 */
        title: _.AuthorName || _.singername,
        /* 作者名称 */
        // artist: title,
        /* 头像 */
        avatar: _.Avatar || _.imgurl,
        /* 简介 */
        // description,
        /* 作品总数 */
        worksNum: _.AudioCount || _.AlbumCount || _.songcount || undefined,
        /* 粉丝数 */
        // fans: _.FansNum,
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
        id,
        /* 标识2 - 优先获取✩ */
        mid,
        // 用户名
        nickName,
        // 头像
        avatar,
        // 评论内容
        comment,
        // 点赞数
        like,
        // 评论时间
        createAt,
        // 地址
        location,
        // 回复
        replies: [].map(formatComment),
        /* 其他参数 */
        type: "11" // 11评论
    };
}





// signatrue 加密
function getSigna(params, signKey, postBody) {
    let paramsString = Object.keys(params).sort()
        .map((key) => `${key}=${typeof params[key] === 'object' ? JSON.stringify(params[key]) : params[key]}`)
        .join("");
    return md5(`${signKey}${paramsString}${postBody || ""}${signKey}`);
}


// sign 加密
// signKey = "R6snCXJgbCaj9WFRJKefTMIFp0ey6Gza";
function getSignb(params, signKey, postBody) {
    let paramsString = Object.keys(params).sort()
        .map((key) => `${key}${typeof params[key] === 'object' ? JSON.stringify(params[key]) : params[key]}`)
        .join("");
    log(`${paramsString}${postBody || ''}${signKey}`)
    return md5(`${paramsString}${postBody || ''}${signKey}`);
}


// Register版 signature
function getSignc(params) {
    let paramsString = Object.keys(params)
        .map((key) => params[key])
        .sort().join("");
    return md5(`1014${paramsString}1014`);
}


// 云盘接口 key
function getSignd(hash, pid, signKey) {
    let signKey = "ebd1ac3134c880bda6a2194537843caa0162e2e7";
    return md5(`musicclound${hash}${pid}${signKey}`);
}

// 歌单接口 key
function getSigne({
    appid,
    clientver,
    clienttime
}, signkey) {
    return md5(`${appid}${signkey}${clientver}${clienttime}`);
}


// 获取链接参数
function getParams() {
    let {
        userid,
        token,
        appid,
        signkey
    } = getUserVariables(platformObj);
    let mid = new Date().getTime() + "";
    let clienttime = Math.floor(mid / 1000) + "";
    let uuid = md5(mid + clienttime); // R(32);
    return {
        userid: userid || "440908392",
        token: token || "f7524337c1ae877929a1497cf3d5d37e5c4cb8073fc298e492a67babc376a9d4",
        appid: appid || "1005",
        signkey: signkey || "OIlwieks28dk2k092lksi2UIkp",
        srcappid: "2919",
        dfid: "-",
        clientver: "1000",
        clienttime,
        uuid,
        mid
    }
}


// 拼接请求环境
let pageSize = 30;

function webSign(url, params, headers, path) {
    let signKey = params.signkey || "NVPh5oo715z5DIWAeQlhMDsWXXQV4hwt";
    let isApp = signKey == "OIlwieks28dk2k092lksi2UIkp";
    params = Object.assign(getParams(), (params || {}));
    delete params.signkey;
    params.appid = isApp ? "1005" : "1058";
    params.pagesize = pageSize;
    params.page = page;
    // "callback=callback123",
    // "bitrate=0",
    // "isfuzzy=0",
    // "inputtype=0",
    // "iscorrection=1",
    // "privilege_filter=0",
    // "platid=4",
    // "plat=0",
    // "filter=10",
    // "format=jsonp",
    // "version=8000",
    if (!params.key) params.key = getSigne(params, signKey);
    if (isApp) {
        delete params.token;
        params.userid = "0";
        params.signature = getSigna({}, signKey, params);
    } else {
        params.signature = getSigna(params, signKey);
    }

    return JSON.parse(fetch(buildUrl(url, isApp ? {} : params), {
        method: isApp ? "POST" : "GET",
        body: JSON.stringify(params),
        'headers': Object.assign({
            'dfid': params.dfid,
            'mid': params.mid,
            'clienttime': params.clienttime,
            "User-Agent": "Android800-AndroidPhone-" + params.clientver + "-18-0-playlist-wifi",
            "KG-FAKE": params.userid,
            "KG-THash": "3e5ec6b",
            "KG-Tid": "1",
            "KG-Rec": "1",
            "KG-RC": "1",
            "KG-RF": "00869891"
        }, headers || {})
    }).replace(/\<\!\-\-KG.*?\-\-\>/gi, ""))[path || "data"] || {};
}



// 歌单gcid解密
function getSheetGcid(gcid) {
    let params = {
        dfid: "-",
        uuid: "-",
        mid: "0",
        clientver: "20109",
        clienttime: "640612895",
        appid: "1005"
    }
    let body = JSON.stringify({
        ret_info: 1,
        data: [{
            id_type: 2,
            id: gcid
        }]
    });
    params.signature = getSigna(params, "OIlwieks28dk2k092lksi2UIkp", body);
    let _ = JSON.parse(post(buildUrl("https://t.kugou.com/v1/songlist/batch_decode", params), {
        body
    })).data.list[0].info;
    return _.specialid || _.list_create_gid || (`collection_3_${_.list_create_userid}_${_.list_create_listid}_0`);

    // 通过webView获取gcid歌单
    let list = executeWebRule(`https://m.kugou.com/songlist/${gcid}/`, $.toString(() => {
        phpParam = window.$output ? window.$output.info : nData;
        return JSON.stringify(phpParam.songs);
    }), {
        ua: MOBILE_UA,
        blockRules: ['.js', '.css', '.jpg', '.png', '.gif', '.svg', '.ico'],
        timeout: 5000
    });
    list = platformObj.getMusicInfo(JSON.parse(list));
    return {
        isEnd: true,
        data: list.map(formatMusicItem)
    }
}
















// 返回对象，不支持的功能把函数删掉就行。
let platformObj = {
    platform: "kg", // 插件标识，一般是英文简写，例: tx, wy, kg, kw, mg
    title: "酷狗音乐", // 插件名称☆
    type: "音频", // 插件分类☆ 随便写：视频 / 音频 / 其他
    author: "Thomas喲", // 插件作者
    version: "2025.09.26", // 插件版本
    icon: "https://android-artworks.25pp.com/fs08/2025/08/27/4/110_76496800e8490c8b2b7e5d94765a0969_con_130x130.png", //插件封面☆
    srcUrl: "https://raw.githubusercontent.com/ThomasBy2025/hikerview/refs/heads/main/gcsp1999/plugin/kg.js", // 在线链接
    description: [{ // 更新内容/简介☆
        "title": "2025.09.26",
        "records": [
            "““反馈Q群@365976134””",
            "““更新””: 网站登录逻辑，资源导入逻辑",
            "‘‘优化’’: 新的歌单接口，旧的接口只能获取2019年数据",
            "‘‘登录’’: 网站登录 - 注意: 没有token保活逻辑",
            "需要隔几天就重新登录一下。与APP端会员相同，和概念版会员不互通",
            "‘‘完善’’: 增加搜索 - 电台(听书)",
            "‘‘支持’’: 资源导入 - 导入酷狗码 / 资源链接"
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
        key: "userid",
        name: "用户标识",
        hint: "userid"
    }, {
        key: "token",
        name: "登录数据",
        hint: "token"
    }, {
        key: "appid",
        name: "平台标识",
        hint: "appid"
    }, {
        key: "signkey",
        name: "验证密匙",
        hint: "signkey"
    }],
    loginRule: { // 实现登录，
        loginUrl: "https://m.kugou.com/loginReg.php?act=login",
        userid: {
            reg: /KugooID=([^&;]+)/i,
            index: 1
        },
        token: {
            reg: /[&;]\s*t=([^&;]+)/i,
            index: 1
        },
        appid: "1058",
        signkey: "NVPh5oo715z5DIWAeQlhMDsWXXQV4hwt"
    },
    debug_musicItem: {
        "platform": "kg",
        "type": "1",
        "id": 301293698,
        "mid": "688857974673645CE89EDA26A36DB19D",
        "title": "告白气球",
        "artist": "周杰伦",
        "duration": 215640,
        "album": "周杰伦的床边故事",
        "artwork": "http://imge.kugou.com/stdmusic/{size}/20200620/20200620103601113025.jpg",
        "qualities": {
            "low": {
                "size": 3450877,
                "hash": "688857974673645CE89EDA26A36DB19D"
            },
            "standard": {
                "size": 8626883,
                "hash": "646035C6C56D18A4C7785F6008BD4820"
            },
            "high": {
                "size": 26387413,
                "hash": "3206E5C3880F5E0E47FCD8671449A9D2"
            },
            "super": {
                "size": 78024024,
                "hash": "589BB1B46E1C63BC95CFDC6B2F34B087"
            }
        },
        "albumId": "1645030",
        "hash": "688857974673645CE89EDA26A36DB19D",
        "album_audio_id": 39612569
    }, // 测试登录/解析时需要调用



    // 插件已适配musicfree☆
    // musicfree版本的platform需要和插件名称一致
    musicfree: {
        srcUrl: "https://raw.githubusercontent.com/ThomasBy2025/musicfree/refs/heads/main/plugins/kg.js", // 插件musicfree版本在线链接
        regNames: ["酷狗音乐", "小枸音乐", "元力KG", "kugou", "酷狗", "KugouMusic"] // 插件在musicfree的同源名称
    },



    // 搜索支持的类型，默认全部都能搜
    // "播客"
    supportedSearchType: ["单曲", "歌单", "专辑", "歌手", "视频", "歌词", "电台"],

    // 搜索内容
    search: function(query, page, type) {
        // type = supportedSearchType的一个数值
        // query = "搜索关键词"
        // 返回对象  {isEnd, data}
        // isEnd 页面是否结束  true / false
        // data 符合type格式的数组
        let _type = {
            "免费": {
                v: "v3",
                s: "song",
                p: {}, // 没有platform=WebFilter只返回免费歌曲
                m: formatMusicItem
            },
            "单曲": {
                v: "v3",
                s: "song",
                p: {
                    platform: "WebFilter"
                },
                m: formatMusicItem
            },
            "视频": {
                v: "v1",
                s: "mv",
                p: {
                    platform: "WebFilter"
                },
                m: formatVideoItem
            },
            "歌词": {
                v: "v1",
                s: "lyric",
                p: {
                    platform: "WebFilter"
                },
                m: formatLyricItem
            },
            "歌单": {
                v: "v1",
                s: "special",
                p: {
                    searchsong: 1
                },
                m: formatSheetItem
            },
            "专辑": {
                v: "v1",
                s: "album",
                p: {
                    searchsong: 1
                },
                m: formatAlbumItem
            },
            "歌手": {
                v: "v1",
                s: "author",
                p: {
                    searchsong: 1
                },
                m: formatArtistItem
            },
            "电台": {
                v: "v1",
                s: "album",
                p: {
                    category: "2,3"
                },
                m: formatAlbumItem
            },
            "伴奏": {
                v: "v1",
                s: "accsong",
                p: {
                    searchsong: 1
                },
                m: formatMusicItem
            },
            "小说": {
                v: "v1",
                s: "novel",
                p: {
                    searchsong: 1
                },
                m: false
            },
        } [type];
        _type.p.keyword = query;
        let _ = webSign("https://gateway.kugou.com/complexsearch/" + _type.v + "/search/" + _type.s, _type.p);

        let list = _.lists || [];
        if (type == "免费") {
            return _.lists;
        } else if ("视频" == type) {
            list = list.map(_ => ({
                hash: _.FileHash,
                id: _.AudioID,
                duration: _.Duration,
                filename: _.FileName,
                MixSongID: _.MixSongID,
                MvHash: _.MvHash,
                MvID: _.MvID,
                album_sizable_cover: _.Pic ? ([
                    "https://imgessl.kugou.com/mvhdpic/480",
                    _.Pic.slice(0, 8), _.Pic
                ].join("/")) : undefined
            }));
        } else if (/单曲|歌词/.test(type)) {
            list = platformObj.getMusicInfo(list) || [];
        }
        return {
            isEnd: ((page - 1) * pageSize + list.length) >= _.total,
            data: list.map(_type.m),
        }
    },



    // 获取歌单标签
    getRecommendSheetTags: function() {
        // 返回数组，取第一组为推荐分类。
        // 数组键值 { title: "主要分类标题", data: [] }
        // data键值  { title: "次要分类标题", id: "分类id" }
        let group = [{
            title: "热门",
            data: [{
                title: "推荐",
                id: "recommend"
            }, {
                title: "最新",
                id: "0"
            }, {
                title: "精选",
                id: "1084"
            }]
        }];
        let _ = webSign("http://mobilecdn.kugou.com/api/v3/category/allList", {
            plat: 0
        }).info;
        _.map((_, i) => {
            group.push({
                title: _.categoryname,
                data: _.child.map(_ => ({
                    title: _.categoryname,
                    id: _.categoryid + ""
                }))
            });
        });
        _ = webSign("http://www2.kugou.kugou.com/yueku/v9/special/getSpecial", {
            is_smarty: 1
        });
        let __ = _.hotTag.data;
        for (let i in __) {
            group[0].data.push({
                title: __[i].special_name,
                id: __[i].special_id + ""
            });
        }
        /*
                _ = _.tagids;
                let i = 1;
                for (let name in _) {
                    group[i] = {
                        title: name,
                        data: []
                    }
                    _[name].data.map(_ => {
                        group[i].data.push({
                            title: _.name,
                            id: _.id + ""
                        });
                    });
                    i++;
                }
        */
        return group;
    },

    // 通过标签获取歌单列表
    getRecommendSheetsByTag: function(tagId, page) {
        // 返回对象  {isEnd, data}
        // isEnd 页面是否结束  true / false
        // data 符合歌单格式的数组
        let total, list = [];
        if (tagId == "recommend") {
            list = JSON.parse(fetch("http://everydayrec.service.kugou.com/guess_special_recommend", {
                method: 'post',
                headers: {
                    'User-Agent': 'KuGou2012-8275-web_browser_event_handler'
                },
                body: {
                    appid: 1001,
                    clienttime: 1566798337219,
                    clientver: 8275,
                    key: 'f1f93580115bb106680d2375f8032d96',
                    mid: '21511157a05844bd085308bc76ef3343',
                    platform: 'pc',
                    userid: '262643156',
                    return_min: 6,
                    return_max: 15,
                }
            })).data;
        } else { // 旧接口只有2019的数据
            // list = JSON.parse(fetch("http://www2.kugou.kugou.com/yueku/v9/special/getSpecial?is_ajax=1&cdn=cdn&t=5&pagesize=30&c=" + tagId + "&p=" + page)).special_db;

            list = webSign("http://specialrecretry.service.kugou.com/special_recommend", {
                signkey: "OIlwieks28dk2k092lksi2UIkp",
                platform: "android",
                module_id: 1,
                req_multi: 1,
                session: page == 1 ? "" : MY_PARAMS.session,
                special_recommend: {
                    withtag: 1,
                    withsong: 0,
                    sort: 3, // 最热1，最新2，推荐3，飙升6
                    categoryid: +tagId,
                    ugc: 1,
                    is_selected: 0,
                    withrecommend: 1,
                    area_code: 1
                },
                clientcache: 1,
                // client_playlist: [],
                // client_playlist_flag: 0,
                // special_list: []
            }, {
                "x-router": "specialrec.service.kugou.com",
                "KG-RC": "2"
            });
            setPageParams({
                session: list.session
            });
        }
        return {
            isEnd: list.has_next != 1,
            data: list.special_list.map(formatSheetItem)
        }
    },

    // 获取歌单详情
    getMusicSheetInfo: function(sheetId, page) {
        // 返回对象  {isEnd, item, data}
        // isEnd 页面是否结束  true / false
        // item 符合歌单格式的对象
        // data 符合单曲格式的数组
        if (/gcid_/i.test(sheetId)) {
            return getSheetGcid(sheetId);
        }
        let _ = webSign("https://mobiles.kugou.com/api/v5/special/song_v2", {
            'global_specialid': sheetId,
            'specialid': sheetId
        });
        let list = platformObj.getMusicInfo(_.info);
        return {
            isEnd: ((page - 1) * pageSize + list.length) >= _.total,
            item: {},
            data: list.map(formatMusicItem),
        }
    },



    // 获取榜单列表
    getTopLists: function() {
        // 返回数组
        // 数组键值 { title: "分类标题", data: [] }
        // data键值  { title: "榜单标题", id: "榜单id" }
        let group = [null, "推荐", "新歌", "特色", "全球", "曲风"].map(title => {
            return {
                title: title,
                data: []
            }
        });
        let info = webSign('http://mobilecdn.kugou.com/api/v3/rank/list', {});
        info.info.map(_ => {
            group[_.classify].data.push(formatToplistItem(_));
        });
        return group.slice(1);
    },

    // 获取榜单详情
    getTopListDetail: function(topId, page) {
        // 返回对象  {isEnd, item, data}
        // isEnd 页面是否结束  true / false
        // item 符合歌单格式的对象
        // data 符合单曲格式的数组
        let _ = JSON.parse(fetch(`http://mobilecdnbj.kugou.com/api/v3/rank/song?pagesize=${pageSize}&page=${page}&rankid=${topId}`)).data;
        let list = platformObj.getMusicInfo(_.info);
        return {
            isEnd: ((page - 1) * pageSize + list.length) >= _.total,
            item: {},
            data: list.map(formatMusicItem),
        }
    },



    // 获取歌手标签☆
    getExploreArtistList: function() {
        // 返回对象 {url, class_name, class_url, area_name, area_url, year_name, year_url, sort_name, sort_url}
        // 写法和海阔小程序一致
        return {
            url: "http://mobilecdnbj.kugou.com/api/v5/singer/list?version=9108&showtype=1&plat=0&sextype=fyyear&sort=fysort&pagesize=30&type=fyclass&page=fypage&musician=0",
            class_name: "全部&华语&欧美&日本&韩国&粤语&闽南语&其他&音乐人",
            class_url: "0&1&2&5&6&7&8&4&3",
            year_name: "全部&男生&女生&组合",
            year_url: "0&1&2&3",
            sort_name: "热门&飙升",
            sort_url: "1&2"
        }
    },

    // 获取歌手列表☆
    getArtistListDetails: function(url) {
        // 返回对象  {isEnd, data}
        // isEnd 页面是否结束  true / false
        // data 符合歌手格式的数组
        url = url.replace(/&type=3(.+)0/, "&type=0$13");
        let _ = JSON.parse(fetch(url)).data;
        return {
            isEnd: page * pageSize < _.total,
            data: (_.info || []).map(formatArtistItem)
        }
    },

    // 获取歌手详情
    getArtistWorks: function(artistId, page, artistType) {
        // artistType = "歌曲" || "专辑" || "视频" || "电台" || "播客"
        // 返回对象  {isEnd, item, data}
        // isEnd 页面是否结束  true / false
        // item 符合歌手格式的对象
        // data 符合type格式的数组
        let _ = webSign('https://gateway.kugou.com/openapi/kmr/v1/author/audios', {
            "author_id": artistId
        });
        let list = (_.songs || []).map(_ => _.audio_info);
        list = platformObj.getMusicInfo(list);
        return {
            isEnd: ((page - 1) * pageSize + list.length) >= _.total,
            item: {},
            data: list.map(formatMusicItem),
        }
    },



    // 获取专辑详情
    getAlbumInfo: function(albumId, page) {
        // 返回对象  {isEnd, item, data}
        // isEnd 页面是否结束  true / false
        // item 符合专辑格式的对象
        // data 符合单曲格式的数组
        let _ = webSign("https://m3ws.kugou.com/api/v1/album/info", {
            "albumid": albumId,
            "plat": "5"
        });
        let list = platformObj.getMusicInfo(_.list);
        return {
            isEnd: ((page - 1) * pageSize + list.length) >= _.songcount,
            item: {},
            data: list.map(formatMusicItem),
        }
    },

    // 获取评论
    getMusicComments: function(commentId, page, commentType) {
        // commentType = "歌曲" || "歌单" || "专辑" || "视频" || "电台" || "播客"
        // 返回对象  {isEnd, data}
        // isEnd 页面是否结束  true / false
        // data 符合评论格式的数组
    },



    // 获取歌曲详情
    getMusicInfo: function(musicItem) {
        // musicItem大部分情况是字符串(id)，但不排除是数组的可能
        // 返回符合歌曲格式的对象，musicItem是数组时返回数组
        let isObj = !Array.isArray(musicItem);
        if (isObj) {
            musicItem = [musicItem];
        }
        let list2, list1 = musicItem.map(_ => ({
            "id": 0,
            "type": "audio",
            "hash": _.hash || _.FileHash,
            // album_audio_id: 0,
            // album_id: "0",
            // name: _.filename.replace(".mp3", ""),
            // page_id: 0,
        }));
        let headers = {
            'KG-THash': '13a3164',
            'KG-RC': '1',
            'KG-Fake': '0',
            'KG-RF': '00869891',
            'User-Agent': 'Android712-AndroidPhone-11451-376-0-FeeCacheUpdate-wifi'
        };
        if (true) {
            headers["x-router"] = "media.store.kugou.com";
            let body = JSON.stringify({
                "relate": 1,
                "userid": "2626431536",
                "vip": 1, // 0
                "token": "",
                // "userid": "0",
                "appid": 1001,
                "behavior": "play",
                "area_code": "1",
                "clientver": "10112", // 8990
                "need_hash_offset": 1,
                "resource": list1,
                // "dfid": "-",
                // "mid": R(32),
            });
            list2 = JSON.parse(post([
                "http://media.store.kugou.com/v1/get_res_privilege",
                "https://gateway.kugou.com/v2/get_res_privilege/lite"
            ][1], {
                body,
                headers
            })).data;
        } else {
            headers['x-router'] = 'kmr.service.kugou.com';
            let data = {
                area_code: '1',
                show_privilege: 1,
                show_album_info: '1',
                is_publish: '',
                appid: 1005,
                clientver: 11451,
                mid: '1',
                dfid: '-',
                clienttime: Date.now(),
                key: 'OIlwieks28dk2k092lksi2UIkp',
                fields: 'album_info,author_name,audio_info,ori_audio_name,base,songname',
            }
            let tasks = []
            while (list1.length) {
                tasks.push(Object.assign({
                    data: list1.slice(0, 100)
                }, data));
                if (list1.length < 100) break;
                list1 = list1.slice(100);
            }
            list2 = [];
            tasks.map(body => {
                let t = JSON.parse(post('http://gateway.kugou.com/v2/album_audio/audio', {
                    body,
                    headers
                })).data.map(t => t[0]);
                list2 = list2.concat(t);
            });
        }
        list1 = musicItem.map((_, i) => Object.assign(_, list2[i]));
        return isObj ? formatMusicItem(list1[0]) : list1;
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

        // url = JSON.parse(fetch("https://m.kugou.com/app/i/getSongInfo.php?cmd=playInfo&hash=" + musicItem.hash)).url;
        let url, hash = musicItem.qualities[quality].hash || musicItem.hash;
        hash = String(hash).toLowerCase();
        quality = {
            'low': '128',
            'standard': '320',
            'hign': 'flac',
            'super': 'high'
        } [quality] || "128";
        let album_id = musicItem.albumId || "0";
        let album_audio_id = musicItem.album_audio_id || "0";

        let params = getParams();
        let signKey = params.signkey;
        delete params.signkey;
        delete params.srcappid;
        delete params.uuid;

        let isLite = params.appid == '3116';
        params = Object.assign(params, {
            quality: quality + "",
            hash: hash + "",
            album_id: album_id + "",
            album_audio_id: album_audio_id + "",
            open_time: $.dateFormat(+params.mid, 'yyyyMMdd'),
            area_code: '1',
            module: '',
            ssa_flag: 'is_fromtrack',
            vipType: '6',
            ptype: '0',
            auth: '',
            mtype: '0',
            behavior: 'play',
            secret: R(32),
            version: '11040', // 9209
            cmd: '26',
            kcard: '0',
            cdnBackup: '1',
            pidversion: '3001',
            'IsFreePart': '1', //是否返回试听部分（仅部分歌曲）
            'key': md5(hash + (isLite ? '185672dd44712f60bb1736df5a377e82' : '57ae12eb6890223e355ccfcb74edf70d') + params.appid + params.mid + params.userid),
            'clientver': (isLite ? '11040' : '12569'), //12029, 10518
            'pid': (isLite ? '411' : '2'),
            'page_id': (isLite ? '967177915' : '151369488'),
            'ppage_id': (isLite ? '356753938,823673182,967485191' : '463467626,350369493,788954147')
        });
        params.signature = getSigna(params, signKey);


        let body_ = JSON.parse(fetch(buildUrl([
            "https://gateway.kugou.com/v5/url",
            "http://trackercdngz.kugou.com/i/v2/"
        ][0], params), {
            "headers": {
                "User-Agent": "Android800-AndroidPhone-" + params.clientver + "-56-0-starlive-ctnet(13)",
                "KG-THash": "595ff94",
                "KG-FAKE": params.userid,
                "KG-Rec": "1",
                "KG-RC": "1",
                "x-router": "tracker.kugou.com"
            }
        }));
        url = body_["url"] && body_["url"][0];
        if (url && url != "") {
            return {
                urls: [url],
                // names: [],
                // headers: [],
                lyric: platformObj.getLyric(musicItem),
                // audioUrls: [], // 一般用不到
            };
        } else if (body_.status == 3) {
            log("酷狗无版权的歌曲，目前无解");
        } else if (body_.status == 2) {
            log("链接获取失败，可能出现验证码或数字专辑未购买");
        } else if (body_.status == 1) {
            log("链接获取失败, 可能是数字专辑或者API失效");
        } else {
            log("未知错误导致获取链接失败");
        }
        return false; // 无法获取播放链接
    },

    // 获取歌词(lrc)
    getLyric: function(musicItem) {
        // musicItem = 符合单曲格式的对象 或者 字符串(id);
        // 返回符合lrc格式的字符串 / 在线链接
        let lrc;
        try {
            lrc = fetch("http://m.kugou.com/app/i/krc.php?cmd=100&timelength=999999&hash=" + musicItem.hash);
            if (!lrc) {
                throw new Error('no get lrc_1');
            }
        } catch (getlrc_err_1) {
            try {
                let u = "http://krcs.kugou.com/search?ver=1&man=yes&client=mobi&keyword=&duration=&hash=" + musicItem.hash + "&album_audio_id=";
                let __ = JSON.parse(fetch(u)).candidates[0];
                if (__ && __.id && __.accesskey) {
                    u = "http://lyrics.kugou.com/download?ver=1&client=pc&id=" + __.id + "&accesskey=" + __.accesskey + "&fmt=lrc&charset=utf8";
                    lrc = base64Decode(JSON.parse(fetch(u)).content);
                } else {
                    throw new Error('no get lrc_2');
                }
            } catch (getlrc_err_2) {
                try {
                    /*  20240225  这个接口不能用了
                               lrc = webSign("https://wwwapi.kugou.com/yy/index.php", [
                                    "r=play/getdata",
                                    "hash=" + _.hash,
                                    "album_id=" + _.album_audio_id,
                                    "platid=4"
                                ]).lyrics;
                    */
                    _ = webSign("https://m.kugou.com/api/v1/song/get_song_info_v2", {
                        "cmd": "playInfo",
                        "hash": musicItem.hash,
                        "album_id": "",
                        "album_audio_id": "",
                        // "appid=3358",
                        // "source_id=",
                        // "from="
                    });
                    lrc = webSign("https://m3ws.kugou.com/api/v1/krc/get_lyrics", {
                        "keyword": _.fileName,
                        "hash": _.hash,
                        "timelength": ((_.timeLength || _.duration) * 1000)
                    }).lrc;
                } catch (getlrc_err_3) {}
            }
        }
        return lrc || "";
    },



    // 下面的参数可能会改，没有固定
    playurl_timeout: 60 * 60 * 24, // 官方链接的有效时长(s)☆

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
    },

    // 获取视频音质
    getVideoInfo: function(musicItem) {
        let isObj = !Array.isArray(musicItem);
        if (isObj) {
            musicItem = [musicItem];
        }
        let list = musicItem.map((_) => ({
            hash: _.MvHash || _.mvhash,
            id: 0,
            name: ''
        }));

        list = webSign([
            "http://goodsmstoreretry.kugou.com/v1/get_video_privilege",
            "http://media.store.kugou.com/v1/get_video_privilege"
        ][0], {
            signkey: "OIlwieks28dk2k092lksi2UIkp",
            behavior: 'play',
            resource: list,
            area_code: 1,
            relate: 1,
            vip: 0,
        });

        list = musicItem.map((_, i) => Object.assign(_, list[i]));
        return isObj ? formatVideoItem(list[0]) : list;
    },

    // 获取视频链接(mv)☆
    getVideo: function(musicItem) {
        // musicItem = 符合单曲格式的对象 或者 字符串(id);
        let mvhash = musicItem.vid || webSign("http://mobilecdnbj.kugou.com/api/v3/song/info", {
            "hash": musicItem.hash
        }).mvhash;
        let names = [];
        let urls = [];
        if (mvhash) {
            // http://mobilecdnbj.kugou.com/api/v3/mv/detail?mvhash=
            let mvinfo = webSign([
                "http://trackermv.kugou.com/interface/index",
                "https://m.kugou.com/app/i/mv.php",
            ][0], {
                "cmd": "100",
                "hash": mvhash,
                "key": md5(mvhash + "kugoumvcloud"),
                "ismp3": "1",
                "ext": "mp4"
            }, {}, "mvdata");
            [
                ['rq', '【蓝光】 1080P'],
                ['sq', '【超清】 720P'],
                ['hd', '【高清】 480P'],
                ['sd', '【标清】 240P'],
                ['le', '【标清】 240P'],
            ].map([path, name] => {
                let __ = mvinfo[path];
                if (__ && __.downurl) {
                    names.push(name);
                    urls.push(__.downurl);
                }
            });
        }
        return {
            names,
            urls,
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
        // 返回格式如下
        return {
            // names: [],
            urls: [],
            // headers: [],
            // danmu: "在线链接/本地链接", // 支持B站的xml格式, JSON格式, webSocket等格式
            // audioUrls: [], // 一般用不到
        };
    },

    // 导入平台资源☆
    import_url: function(urlLike, run) {
        // 匹配链接 返回对象
        // 不成功就返回false
        if (Number(urlLike)) { // 酷狗码
            let kucode = JSON.parse(fetch('http://t.kugou.com/command/', {
                method: 'POST',
                headers: {
                    'KG-RC': '1',
                    'KG-THash': 'network_super_call.cpp:3676261689:379',
                    'User-Agent': '',
                },
                body: {
                    appid: 1001,
                    clientver: 9020,
                    mid: '21511157a05844bd085308bc76ef3343',
                    clienttime: 640612895,
                    key: '36164c4015e704673c588ee202b9ecb8',
                    data: urlLike
                },
            }));
            // 是酷狗码
            if (kucode.status == 1) {
                kucode = kucode.data;
                let kuinfo = kucode.info;

                // type 1单曲，2歌单，3电台，4酷狗码，5别人的播放队列
                if (kuinfo.type == 1) {
                    urlLike = "https://m.kugou.com/weibo/?hash=" + kucode.list.hash
                } else {
                    if (kuinfo.global_collection_id || (kuinfo.userid && kuinfo.id)) {
                        urlLike = 'https://www.kugou.com/yy/special/single/' + (kuinfo.global_collection_id || ("collection_3_" + kuinfo.userid + "_" + kuinfo.id + "_0")) + '.html';
                    } else {
                        return undefined; // copy_gcid
                        kucode = JSON.parse(fetch("http://www2.kugou.kugou.com/apps/kucodeAndShare/app/", {
                            method: 'POST',
                            headers: {
                                'KG-RC': '1',
                                'KG-THash': 'network_super_call.cpp:3676261689:379',
                                'User-Agent': '',
                            },
                            body: {
                                appid: 1001,
                                clientver: 10112, // 9020
                                mid: "70a02aad1ce4648e7dca77f2afa7b182", // 21511157a05844bd085308bc76ef3343
                                clienttime: 722219501, // 640612895
                                key: "381d7062030e8a5a94cfbe50bfe65433", // 36164c4015e704673c588ee202b9ecb8
                                data: {
                                    id: kuinfo.id,
                                    type: 3,
                                    userid: kuinfo.userid,
                                    collect_type: kuinfo.collect_type,
                                    page: 1,
                                    pagesize: kuinfo.count,
                                }
                            }
                        }));
                    }
                }
            } else {
                return false;
            }
        }


        if (!/kugou\./i.test(urlLike) || /5sing\./i.test(urlLike)) {
            return undefined;
        }
        let _, id;
        if (id = (urlLike.match(/\/mv.*?hash=([a-z0-9]+)/i) || [])[1]) { // type: 9
            _ = webSign("http://mobilecdnbj.kugou.com/api/v3/mv/detail", {
                with_res_tag: 1,
                area_code: 1,
                mvhash: id,
                plat: 0,
            });
            _ = (_.info && _.info.audio_info) || _.info || _;
            if (_.hash && _.hash != id) {
                _.mvhash = id;
                return platformObj.getMusicInfo(_);
            } else {
                return formatVideoItem(_);
            }
        }
        if (id = (urlLike.match(/hash=([a-z0-9]+)/i) || [])[1]) { // type: 0/1/8/10
            return platformObj.getMusicInfo({
                hash: id
            });
        }
        if (id = (urlLike.match(/\/songlist\/(gcid_[a-z0-9]+)/i) || [])[1]) { // type: 2
            _ = executeWebRule(`https://m.kugou.com/songlist/${id}/`, $.toString(() => {
                phpParam = (window.$output ? window.$output.info : nData).listinfo;
                return JSON.stringify(phpParam);
            }), {
                ua: MOBILE_UA,
                blockRules: ['.js', '.css', '.jpg', '.png', '.gif', '.svg', '.ico'],
                timeout: 3000
            });
            _ = JSON.parse(_);
            _.specialid = getSheetGcid(id); // gcid解密
            return formatSheetItem(_);
        }
        if (id = (urlLike.match(/(\/special\/single\/|share_type=special&id=|global_specialid=|global_collection_id=|^[^(\/share)]+[&\?]id=)([^\.\&\/\?]+)/i) || [])[2]) { // type: 2
            _ = webSign("https://mobiles.kugou.com/api/v5/special/info_v2", {
                "specialid": id,
                "global_specialid": id
            });
            if (_ === null && Number(id)) {
                _ = executeWebRule(`http://www2.kugou.kugou.com/yueku/v9/special/single/${id}-5-99999.html?json=true`, $.toString(() => {
                    return JSON.stringify(global);
                }), {
                    blockRules: ['.js', '.css', '.jpg', '.png', '.gif', '.svg', '.ico']
                });
                _ = JSON.parse(_);
            }
            return formatSheetItem(_);
        }
        if (id = (urlLike.match(/(\/rank\/info\/|[\?\&]rankid=)(\d+)/i) || [])[2]) { // type: 3
            _ = JSON.parse(fetch(`http://mobilecdnbj.kugou.com/api/v3/rank/info?pagesize=${pageSize}&page=${1}&rankid=${id}`)).data;
            return formatToplistItem(_);
        }
        if (id = (urlLike.match(/(\/album\/info\/|[\?\&]albumid=)(\d+)/i) || [])[2]) { // type: 4 / 7
            _ = webSign("https://m3ws.kugou.com/api/v1/album/info", {
                "albumid": id,
                "plat": "5"
            });
            _.albumid = id;
            return formatAlbumItem(_);
        }
        if (id = (urlLike.match(/(\/singer\/info\/|[\?\&]singerid=)(\d+)/i) || [])[2]) { // type: 5
            _ = webSign("https://gateway.kugou.com/mobilecdn/api/v3/singer/info", {
                "singerid": id,
                "with_listener_index": "1"
            });
            return formatArtistItem(_);
        }
        if (/user(.*?[\?\&]id=|\/)(\d+)/i.test(urlLike)) { // type: 6
            return undefined;
        }


        if (run == undefined) {
            let _url = executeWebRule(urlLike, $.toString((urlLike) => {
                isReg = (reg, i) => {
                    try {
                        return window.location.href.match(reg)[i];
                    } catch (matErr) {
                        return false;
                    }
                }
                _urlType = "2";
                try {
                    try {
                        phpParam = dataFromSmarty[0];
                    } catch (isKgpe) {}
                    specialid = phpParam.specialid || phpParam.global_collection_id;
                    if (phpParam.share_type == 'special' || specialid) {
                        _url_id = specialid;
                    } else if (phpParam.share_type == 'album' || phpParam.albumid) {
                        _urlType = "4";
                        _url_id = phpParam.albumid
                    } else if (phpParam.hash) {
                        _urlType = "0";
                        _url_id = phpParam.hash
                    } else if (phpParam.rankid) {
                        _urlType = "3"
                        _url_id = phpParam.rankid;
                    }
                } catch (err2) {
                    try { // 好像是这样拼的(大概
                        if ((listid = isReg(/listid=(\d+)/i, 1)) && (uid = isReg(/uid=(\d+)/i, 1))) {
                            _url_id = "collection_3_" + uid + "_" + listid + "_0";
                        } else {
                            phpParam = (window.$output ? window.$output.info : nData).listinfo;
                            _url_id = phpParam.specialid || phpParam.global_collection_id;
                            if (_url_id == "" && phpParam.no_show_gid && /songlist\/gcid/i.test(urlLike)) {
                                _urlType = "6";
                                _url_id = _url = urlLike;
                            }
                        }
                    } catch (err3) {
                        try {
                            _url_id = gbParams.info.singerid;
                            _urlType = "5";
                        } catch (err4) {
                            return "";
                        }
                    }
                }
                try {
                    if (_urlType == "0") {
                        _url = "https://m.kugou.com/weibo/?hash=" + _url_id;
                    } else if (_urlType == "3") {
                        _url = "https://m.kugou.com/rank/info/" + _url_id;
                    } else if (_urlType == "4") {
                        _url = "https://m.kugou.com/album/info/" + _url_id;
                    } else if (_urlType == "5") {
                        _url = "https://m.kugou.com/singer/info/" + _url_id;
                    } else if (_urlType == "2") {
                        _url = 'https://www.kugou.com/yy/special/single/' + _url_id + '.html';
                    }
                    if (_url_id) return JSON.stringify({
                        url: _url
                    });
                } catch (e) {}
                return "";
            }, urlLike), {
                ua: MOBILE_UA,
                blockRules: ['.js', '.css', '.jpg', '.png', '.gif', '.svg', '.ico'],
                timeout: 5000
            });
            if (_url) {
                return platformObj.import_url(JSON.parse(_url).url, true);
            }
        }
        return false;
    },

    // 获取分享链接☆
    share_url: function(mediaItem) {
        // 返回平台链接的字符串 或者false
    },



    // https://github.com/lxmusics/lx-music-api-server-python/blob/main/modules/kg/lite_signin.py
    Lite_Signin: function() {
        let mixsongid = platformObj.search("", 1, "免费")[0]["MixSongID"];
        let body = JSON.stringify({
            "mixsongid": Number(mixsongid)
        });
        let params = getParams();
        let signKey = params.signkey;
        delete params.signkey;
        delete params.srcappid;
        params.mid = R(32, "1234567890");
        params.clientver = '10518'; // 10566
        params.signature = getSigna(params, signKey, body);

        let req = JSON.parse(post(buildUrl("https://gateway.kugou.com/v2/report/listen_song", params), {
            body,
            headers: {
                "User-Agent": "Android800-AndroidPhone-10518-18-0-ReportPlaySongToServerProtocol-wifi",
                "KG-THash": "5ad0291",
                "KG-Rec": "1",
                "KG-RC": "1",
                "x-router": "youth.kugou.com"
            }
        }));
        if (req.status == 1) {
            return "toast://签到成功";
        } else if (req.error_code == 130012) { // 签到过了？
            return "toast://签到失败：今天已经签到过了？";
        } else if (req.error_code == 51002) { // 登录掉了？
            return "toast://签到失败：token失效了，请重新配置";
        } else {
            return "toast://签到失败：" + req.error_msg;
        }
    },



    // Get_Kg_New_Token
    refresh_token: function() {
        let {
            userid,
            token,
            appid,
            signkey
        } = getUserVariables(platformObj);
        appid = appid || "1005";
        signkey = signkey || "OIlwieks28dk2k092lksi2UIkp";
        [aes_key, aes_iv] = {
            "1005": ["90b8382a1bb4ccdcf063102053fd75b8", "f063102053fd75b8"],
            "3116": ["c24f74ca2820225badc01946dba4fdf7", "adc01946dba4fdf7"],
        } [appid] || [];
        log("kg_refresh_token");
        if (aes_key && aes_iv) {
            let CryptoUtil = $.require("hiker://assets/crypto-java.js");
            let clienttime_ms = new Date().getTime() + "";
            let clienttime = Math.floor(clienttime_ms / 1e3);
            let p3 = CryptoUtil.AES.encrypt(
                JSON.stringify({
                    clienttime,
                    token
                }),
                CryptoUtil.Data.parseUTF8(aes_key),
                ({
                    iv: CryptoUtil.Data.parseUTF8(aes_iv),
                    mode: "AES/CBC/PKCS7Padding"
                })
            ).toHex();

            // dfid, dev, plat, gitversion
            let body = JSON.stringify({
                p3,
                clienttime_ms,
                t1: "0",
                t2: "0",
                userid,
            });

            // uuid
            let params = {
                "dfid": "-",
                "appid": appid,
                "mid": R(32, "1234567890"),
                "clientver": "10597",
                "clienttime": clienttime + "",
            };
            params.signature = getSigna(params, signkey, body);


            try {
                let _body = JSON.parse(post(buildUrl("http://login.user.kugou.com/v4/login_by_token/", params), {
                    body,
                    headers: {
                        "User-Agent": "Android800-1070-10597-46-0-LOGIN-wifi",
                        "KG-THash": "5ad0291",
                        "KG-Rec": "1",
                        "KG-RC": "1"
                    }
                }));

                let new_token = _body.data && _body.data.token;
                if (new_token && new_token != "") {
                    log("token获取成功  |  是否更改：" + (token != new_token));
                    globalMap0.clearVar("gcsp1999@userVariables@kg");
                    setItem("kg@userVariables@token", new_token + "");
                    return true;
                }

                new_token = _body.error_code;
                if (new_token == 20018) {
                    log("token获取失败，可能登录掉了，请重新配置");
                } else if (new_token == 20010) {
                    log("token获取失败，用户数据错误，请重新配置");
                } else {
                    log("token获取失败，原因未知");
                }
            } catch (e) {
                log("token获取失败，网络异常？");
            }
        } else {
            log("登录的平台不是APP/概念版，不支持token保活");
        }
        return false;
    }
}
$.exports = platformObj;