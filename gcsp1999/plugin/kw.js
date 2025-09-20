// 格式化歌曲信息
function formatMusicItem(_) {
    let Reg = (k, _) => reg = (_.N_MINFO || "").match(new RegExp('bitrate:' + k + ',format:[^,]+,size:([^;]+)'));
    let name = _.songName || _.name || _.SONGNAME;
    let singer = _.artist || _.ARTIST;
    let songId = _.MUSICRID ? _.MUSICRID.split('_')[1].split('&')[0] : (_.rid || _.id);
    let albumName = _.album || _.ALBUM;
    let albumId = _.albumid || _.ALBUMID;

    let qualities = {};
    for (let k of [128, 320, 2000, 4000]) {
        if (Reg(k, _)) {
            let t = {
                128: "low",
                320: "standard",
                2000: "high",
                4000: "super"
            }[k];
            qualities[t] = {};
            qualities[t].size = reg[1].replace(/\s*mb/i, " MB");
        }
    }
    let picUrl = _.pic || _.img || _.hts_PICPATH;
    if (!picUrl) {
        if (_.web_albumpic_short) {
            picUrl = "https://img2.kuwo.cn/star/albumcover/" + _.web_albumpic_short.replace(/^120/, '500');
        } else {
            picUrl = fetch('http://artistpicserver.kuwo.cn/pic.web?type=rid_pic&pictype=url&size=500&rid=' + songId).replace("NO_PIC", "");
        }
        picUrl = picUrl || _.hts_MVPIC;
        if (!picUrl && _.MVPIC) {
            picUrl = "https://img4.kuwo.cn/wmvpic/" + _.MVPIC.replace(/^\d+/, '500');
        }
        if (!picUrl && _.web_artistpic_short) {
            picUrl = "http://img1.kuwo.cn/star/starheads/" + _.web_artistpic_short.replace(/^120/, '500');
        }
    }

    return {
        /* 平台 */
        platform: platformObj.platform,
        /* 类型 */ // 0免费 1会员
        type: (_.isListenFee || _.tpay) == 1 ? "1" : "0",
        /* 标识 */
        id: songId + "",
        /* 标识2 - 优先获取✩ */
        // mid, // #mediaHash
        /* 曲名 */
        title: name,
        /* 作者 */
        artist: singer,
        /* 别名 */
        // alias: "",
        /* 直链 */
        // url: "",
        /* 时长(s) */
        duration: _.songTimeMinutes || ((_.duration || _.DURATION) * 1000), // #interval
        /* 专辑 */
        album: albumName,
        /* 封面 */
        artwork: picUrl,
        /* 音质 */
        qualities,
        /* 其他 */ // 支持自定义
        albumId, //专辑id
        // artistId, //歌手id
        vid: (_.mvpayinfo && _.mvpayinfo.vid) || _.mkvrid, //视频id video
        // rid, //播客id radio
    }
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
        id: (_.sourceid || _.playlistid || _.id || _.ARTISTID) + "",
        /* 标识2 - 优先获取✩ */
        // mid,
        /* 标题 */
        title: _.name || _.title,
        /* 作者 */
        artist: _.artist || _.uname || _.userName,
        /* 封面图 */
        // coverImg: "",
        artwork: _.hts_img || _.img || _.pic,
        /* 描述 */
        description: _.pub || _.info || _.intro,
        /* 作品总数 */
        worksNum: _.total,
        /* 其他参数 */
        // date, // 更新时间
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




// 格式化歌手信息
function formatArtistItem(_) {
    return {
        /* 平台 */
        platform: platformObj.platform,
        /* 类型 */ // 5歌手
        type: "5",
        /* 歌手id */
        id: _.ARTISTID || _.id,
        /* 标识2 - 优先获取✩ */
        // mid,
        /* 歌手名称 */
        title: _.ARTIST || _.name,
        /* 作者名称 */
        // artist: title,
        /* 头像 */
        avatar: _.hts_PICPATH || _.pic,
        /* 简介 */
        description: _.desc,
        /* 作品总数 */
        worksNum: _.SONGNUM || _.musicNum,
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



// 常量请求
let pageSize = 30;
let pcapi = "https://www.kuwo.cn/api/www/";
let peapi = "https://m.kuwo.cn/newh5app/api/mobile/";

function ajax(url) {
    let Cookie = getMyVar('kw_Cookie', "");
    let Secret = getMyVar('kw_Secret', "");
    let Token = getMyVar('kw_Token', "");
    if (!Cookie || !Secret || !Token) {

        let e, t;
        Cookie = String(JSON.parse(fetchPC('https://www.kuwo.cn/favicon.ico?v=1', {
            withHeaders: true,
            onlyHeaders: true
        })).headers['set-cookie'] || "Hm_Iuvt_cdb524f42f0ce19b169b8072123a4727=2bm5QbPQKPZSRHyFN4pbZnGcNJ4J2DZJ").split(';')[0];
        [e, t] = Cookie.split('=');
        Cookie += "; BAIDU_RANDOM=" + t;


        // Cookie = "BAIDU_RANDOM=***";
        Token = function(T) { // PE
            let C = $.require('hiker://assets/crypto-java.js');
            T = C.Digest.digest(C.Data.parseUTF8(T), 'SHA-1');
            return md5(T).toUpperCase();
        }(t);


        // Cookie = "Hm_Iuvt_***=***";
        Secret = function(e, t) { // PC
            let n = e.split('').map(c => c.charCodeAt(0)).join('');
            let r = Math.floor(n.length / 5),
                o = parseInt(n.charAt(r) + n.charAt(2 * r) + n.charAt(3 * r) + n.charAt(4 * r) + n.charAt(5 * r)),
                l = Math.ceil(e.length / 2),
                c = Math.pow(2, 31) - 1;
            let d = Math.round(1e9 * Math.random()) % 1e8;
            n += d.toString();
            while (n.length > 10) {
                n = (parseInt(n.substring(0, 10)) + parseInt(n.substring(10))).toString();
            }
            n = (o * n + l) % c;
            let f = '';
            for (let i = 0; i < t.length; i++) {
                let h = t.charCodeAt(i) ^ Math.floor(n / c * 255);
                f += ('00' + h.toString(16)).slice(-2);
                n = (o * n + l) % c;
            }
            d = '00000000' + d.toString(16);
            return f + d.slice(-8);
        }(e, unescape(t));


        // 保存变量
        putMyVar('kw_Cookie', Cookie);
        putMyVar('kw_Secret', Secret);
        putMyVar('kw_Token', Token);
    }
    url += `httpsStatus=1&reqId=${R("randomUUID")}&plat=web_www&from=`;
    let getdata = (ajaxerr) => {
        try {
            return JSON.parse(fetch(url, {
                headers: {
                    'Referer': 'https://kuwo.cn/',
                    'Cookie': Cookie,
                    'Secret': Secret,
                    'Token': Token,
                }
            })).data || {};
        } catch (err) {
            return ajaxerr < 2 ? getdata(ajaxerr + 1) : "";
        }
    }
    return getdata(0);
}



// 网页接口很规范
function ajax2(url, mat) {
    let _ = ajax(url);
    let list = _.data || _.list || [];
    if (!mat) { // 获取歌曲信息
        mat = formatMusicItem;
        list = _.musicList || _.musiclist || _.list || [];
        let list2 = platformObj.getMusicInfo(list);
        list = list.map((__, i) => Object.assign(__, list2[i]));
    }
    return {
        isEnd: list.length < pageSize,
        data: list.map(mat)
    }
}



// 返回对象，不支持的功能把函数删掉就行。
let platformObj = {
    platform: "kw", // 插件标识，一般是英文简写，例: tx, wy, kg, kw, mg
    title: "酷我音乐", // 插件名称☆
    type: "音频", // 插件分类☆ 随便写：视频 / 音频 / 其他
    author: "Thomas喲", // 插件作者
    version: "2025.09.20", // 插件版本
    icon: "https://android-artworks.25pp.com/fs08/2025/08/19/6/110_7a4a098a92bb3f1b506acfda21a038e4_con_130x130.png", //插件封面☆
    srcUrl: "https://raw.githubusercontent.com/ThomasBy2025/hikerview/refs/heads/main/gcsp1999/plugin/kw.js", // 在线链接
    description: [{ // 更新内容/简介☆
        "title": "2025.09.20",
        "records": [
            "““反馈Q群@365976134””",
            "““更新””: 资源导入相关逻辑",
            "‘‘修复’’: 免费歌曲无法获取",
            "‘‘增加’’: 支持搜索电台(听书)"
        ]
    }, {
        "title": "2025.09.20",
        "records": [
            "““更新””: 插件示例",
            "‘‘增加’’: 用户变量"
        ]
    }],



    platformProxy: true, // 该插件支持导入解析☆
    userVariables: [{ // 用户变量，通过getUserVariables(platformObj)函数获取
        key: "source",
        name: "渠道标识",
        hint: "source"
    }],
    debug_musicItem: {
        "platform": "kw",
        "type": "1",
        "id": "7149583",
        "title": "告白气球",
        "artist": "周杰伦",
        "duration": 215000,
        "album": "周杰伦的床边故事",
        "artwork": "https://img2.kuwo.cn/star/albumcover/500/64/39/3540704654.jpg",
        "qualities": {
            "low": {
                "size": "3.29 MB"
            },
            "standard": {
                "size": "8.22 MB"
            },
            "high": {
                "size": "44.90 MB"
            },
            "super": {
                "size": "74.40 MB"
            }
        },
        "albumId": "555949",
        "vid": "7976426"
    }, // 测试登录/解析时需要调用



    // 插件已适配musicfree☆
    // musicfree版本的platform需要和插件名称一致
    musicfree: {
        srcUrl: "", // 插件musicfree版本在线链接
        regNames: ["酷我音乐", "小蜗音乐", "元力KW", "kuwo"] // 插件在musicfree的同源名称
    },



    // 搜索支持的类型，默认全部都能搜
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
                ft: "music",
                noVipver: true,
                mat: formatMusicItem
            },
            "单曲": {
                ft: "music",
                mat: formatMusicItem
            },
            "歌单": {
                ft: "playlist",
                mat: formatSheetItem
            },
            "专辑": {
                ft: "album",
                mat: formatAlbumItem
            },
            "歌手": {
                ft: "artist",
                mat: formatArtistItem
            },
            "视频": {
                ft: "video",
                mat: formatVideoItem
            },
            "歌词": {
                ft: "lyric",
                mat: formatLyricItem
            },
            "电台": {
                ft: "radio",
                mat: formatAlbumItem
            },
        }[type];
        let p = {
            // 必要参数
            rformat: "json", // 返回格式
            encoding: "utf8", // 编码方式
            ft: _type.ft, // 搜索类型
            rn: pageSize, // 获取30个
            pn: page - 1, // 当前页数
            all: query, // 搜索的关键词
            vipver: "MUSIC_8.0.3.0_BCS75", // 此参数存在时会返回vip歌曲

            // 下面是非必要参数
            mobi: 1, // APP端？ #限制返回的参数大小
            newsearch: 1, // 新搜索数据？
            searchapi: 7, // api序号？
            issubtitle: 1, // 是否包含关键词？
            vermerge: 1, // 未知参数
            strategy: 2012,
            show_copyright_off: 1,
            correct: 1,
            cluster: 0,
            client: "kt",
            spPrivilege: 0,
            newver: 3
            // 还有一些其他参数
        }
        if (_type.noVipver) {
            delete p.vipver;
        }
        if (_type.ft == "album") {
            p.albumver = 1; // 获取专辑信息
        } else if (_type.ft == "radio") {
            p.ft = "album"; // 获取电台(听书)信息
            p.isstar = 1;
            p.starver = 1;
        } else if (_type.ft == "lyric") {
            delete p.all;
            p.ft = "music";
            p.lrccontent = query;
        }
        let _ = JSON.parse(fetch(buildUrl("http://search.kuwo.cn/r.s", p)));
        let list = _.abslist || _.albumlist || [];
        let total = page * pageSize;
        return {
            isEnd: (_.TOTAL || _.total || total) <= (total - pageSize + list.length),
            data: list.map(_type.mat)
        }
    },



    // 获取歌单标签
    getRecommendSheetTags: function() {
        // 返回数组，取第一组为推荐分类。
        // 数组键值 { title: "主要分类标题", data: [] }
        // data键值  { title: "次要分类标题", id: "分类id" }
        let group = [{
            title: "推荐",
            data: [{
                title: "每日推荐",
                id: "rcm/index/playlist?id=rcm"
            }, {
                title: "最新精选",
                id: "classify/playlist/getRcmPlayList?order=new"
            }, {
                title: "热门精选",
                id: "classify/playlist/getRcmPlayList?order=hot"
            }]
        }];
        ajax(pcapi + "playlist/getTagList?").map(_ => {
            if (_.data.length) {
                _.name = _.name.replace('曲风流派', '风格').replace("语言", "语种");
                group.push({
                    title: _.name,
                    data: _.data.map(_ => ({
                        title: _.name,
                        id: "classify/playlist/getTagPlayList?id=" + _.id
                    }))
                });
            }
        });
        return group;
    },

    // 通过标签获取歌单列表
    getRecommendSheetsByTag: function(tagId, page) {
        // 返回对象  {isEnd, data}
        // isEnd 页面是否结束  true / false
        // data 符合歌单格式的数组
        return ajax2(pcapi + tagId + "&pn=" + page + "&rn=" + pageSize + "&", formatSheetItem);
    },

    // 获取歌单详情
    getMusicSheetInfo: function(sheetId, page) {
        // 返回对象  {isEnd, item, data}
        // isEnd 页面是否结束  true / false
        // item 符合歌单格式的对象
        // data 符合单曲格式的数组
        // "https://mobilist.kuwo.cn/list.s?type=songlist&id="+ t1+ "&pn=0&rn="+pageSize+"";
        // "https://kuwo.cn/newh5/playlist/playlistByPage?id="+ t1+ "&pn=0&rn="+pageSize+"";
        // "http://nplserver.kuwo.cn/pl.svc?op=getlistinfo&pid="+t1+"&pn=0&rn="+pageSize+"" + "&encode=utf8&keyset=pl2012&identity=kuwo&pcmp4=1&vipver=MUSIC_9.0.5.0_W1&newver=1&_=";
        return ajax2(pcapi + "playlist/playListInfo?pid=" + sheetId + "&pn=" + page + "&rn=" + pageSize + "&");
    },



    // 获取榜单列表
    getTopLists: function() {
        // 返回数组
        // 数组键值 { title: "分类标题", data: [] }
        // data键值  { title: "榜单标题", id: "榜单id" }
        let group = [];
        ajax(pcapi + "bang/bang/bangMenu?").map(_ => {
            group.push({
                title: _.name,
                data: _.list.map(formatToplistItem)
            });
        });
        return group;
    },

    // 获取榜单详情
    getTopListDetail: function(topId, page) {
        // 返回对象  {isEnd, item, data}
        // isEnd 页面是否结束  true / false
        // item 符合歌单格式的对象
        // data 符合单曲格式的数组
        return ajax2(pcapi + "bang/bang/musicList?bangId=" + topId + "&pn=" + page + "&rn=" + pageSize + "&");
    },



    // 获取歌手标签☆
    getExploreArtistList: function() {
        // 返回对象 {url, class_name, class_url, area_name, area_url, year_name, year_url, sort_name, sort_url}
        // 写法和海阔小程序一致
        return {
            url: buildUrl("https://wapi.kuwo.cn/api/www/artist/artistInfo", {
                category: "fyclass",
                prefix: "fysort", // a-z #
                pn: "fypage",
                rn: pageSize,
                httpsStatus: 1,
                reqId: R("randomUUID"),
                plat: "web_www",
                from: ""
            }),
            class_name: "全部&华语男&华语女&华语组合&日韩男&日韩女&日韩组合&欧美男&欧美女&欧美组合&其他",
            class_url: "0&1&2&3&4&5&6&7&8&9&10",
            sort_name: "全部&A&B&C&D&E&F&G&H&I&J&K&L&M&N&O&P&Q&R&S&T&U&V&W&X&Y&Z&#",
            sort_url: "&A&B&C&D&E&F&G&H&I&J&K&L&M&N&O&P&Q&R&S&T&U&V&W&X&Y&Z&%2523"
        }
    },

    // 获取歌手列表☆
    getArtistListDetails: function(url, page) {
        // 返回对象  {isEnd, data}
        // isEnd 页面是否结束  true / false
        // data 符合歌手格式的数组
        let _ = JSON.parse(fetch(url)).data || {};
        let total = page * pageSize;
        let list = _.artistList;
        return {
            isEnd: (_.total || total) <= (total - pageSize + list.length),
            data: list.map(formatArtistItem)
        }
    },

    // 获取歌手详情
    getArtistWorks: function(artistId, page, artistType) {
        // artistType = "歌曲" || "专辑" || "视频" || "电台" || "播客"
        // 返回对象  {isEnd, item, data}
        // isEnd 页面是否结束  true / false
        // item 符合歌手格式的对象
        // data 符合type格式的数组
        return ajax2(pcapi + "artist/artistMusic?artistid=" + artistId + "&pn=" + page + "&rn=" + pageSize + "&");
    },



    // 获取专辑详情
    getAlbumInfo: function(albumId, page) {
        // 返回对象  {isEnd, item, data}
        // isEnd 页面是否结束  true / false
        // item 符合专辑格式的对象
        // data 符合单曲格式的数组
        return ajax2(pcapi + "album/albumInfo?albumId=" + albumId + "&pn=" + page + "&rn=" + pageSize + "&");
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
        musicItem = musicItem.map(_ => {
            return _.id || _.rid
        }).join(",");
        let list = JSON.parse(fetch(buildUrl([
            "http://datacenter.kuwo.cn/d.c",
            "http://musicpay.kuwo.cn/music.pay"
        ][0], {
            cmkey: "plist_pl2012",
            ft: "music",
            resenc: "utf8",
            ids: musicItem,
            action: "play",
            op: "query"
        })));
        list = list.songs || list;
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
        let url;
        // url = fetch("https://antiserver.kuwo.cn/anti.s?type=convert_url&format=mp3&rid=" + t1);
        let {
            source
        } = getUserVariables(platformObj);
        if (source && source != "") {
            let mobi = buildUrl("http://nmobi.kuwo.cn/mobi.s", {
                f: "web",
                user: 0,
                source,
                type: "convert_url_with_sign",
                rid: musicItem.id,
                br: {
                    low: '128kmp3',
                    standard: '320kmp3',
                    high: '2000kflac',
                    super: '4000kflac'
                }[quality]
            });
            url = JSON.parse(fetch(mobi)).data.url.split("?")[0];
        } else {
            url = ajax([
                pcapi.replace(/(api\/)/, '$1v1/') + "music/playUrl",
                peapi + "v2/music/src/" + musicItem.id,
            ][0] + "?mid=" + musicItem.id + "&type=music&").url;
        }
        if (url && url != "" && url != "None") {
            return {
                urls: [url + "#isMusic=true#"],
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
        let lrc, t1 = musicItem.id;
        try {
            lrc = function(rid, isGetLyricx) {
                let {
                    javaString,
                    Base64,
                    getMode,
                    unzip,
                    zip,
                    xor
                } = $.require(getGitHub(["config", "JavaGzip.js"]));
                let params = "user=12345,web,web,web&requester=localhost&req=1&rid=MUSIC_" + rid;
                if (isGetLyricx) params += "&lrcx=1";
                params = xor(params, "yeelion", "Base64");
                let stream = fetch("http://newlyric.kuwo.cn/newlyric.lrc?" + params, {
                    toHex: true
                });
                if (stream.slice(0, 20) !== "74703d636f6e74656e74") {
                    return "";
                }
                let index = stream.indexOf('0d0a0d0a') + 8;
                let lrcByte = unzip(stream.slice(index), false, true);

                // 歌词是gbk编码
                if (isGetLyricx) { // 二次解密
                    let b64Text = String(javaString(lrcByte, "UTF-8"));
                    let b64Byte = Base64.getDecoder().decode(b64Text);
                    return xor(b64Byte, "yeelion", false, "gb18030");
                } else {
                    return javaString(lrcByte, "gb18030");
                }
            }(t1, false);
        } catch (lrc_err1) {
            try { // 备用
                lrc = ajax([
                    peapi + "v1/music/info/" + t1,
                    "http://m.kuwo.cn/newh5/singles/songinfoandlrc",
                    pcapi.replace(/(api\/)/, 'open$1v1/') + "lyric/getlyric",
                ][1] + "?musicId=" + t1 + "&") || {};
                lrc = (lrc.lrclist || lrc.lrc || []).map(_ => {
                    let s = ((_.time - 0) % 60).toFixed(3).padStart(6, '0');
                    let m = ((_.time - s) / 60).toFixed(0).padStart(2, '0');
                    return `[${m}:${s}]` + _.lineLyric
                }).join('\n');
            } catch (lrc_err2) {}
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



    // 获取视频链接(mv)☆
    getVideo: function(musicItem) {
        // musicItem = 符合单曲格式的对象 或者 字符串(id);
        let mvhash = musicItem.vid || platformObj.getMusicInfo(musicItem).vid;
        let names = [];
        let urls = [];
        if (mvhash) {
            let _mvurl = "http://anymatch.kuwo.cn/mobi.s?f=web&type=get_url_by_vid&vid=" + mvhash + "&quality=MP4";
            let _mvmat = (path) => mvinfo.formats.match('\\|MP4' + path);
            [
                ['BD', '【蓝光】 1080P'],
                ['UL', '【超清】 720P'],
                ['HV', '【高清】 480P'],
                ['', '【标清】 360P'],
                ['L', '【流畅】 240P'],
            ].map([path, name] => {
                if (_mvmat(path)) {
                    let _mp4url = fetch(_mvurl + path).match(/url=(\S+)/);
                    if (_mp4url && _mp4url[1]) {
                        urls.push(_mp4url[1].split("?")[0]);
                        names.push(name);
                    }
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



    // 导入平台资源☆
    import_url: function(urlLike) {
        // 匹配链接 返回对象
        // 不成功就返回false
        if (!/kuwo\.cn/i.test(urlLike)) {
            return undefined;
        }
        let _, id;
        if (id = (urlLike.match(/(\/yinyue\/|\/play_detail\/|[\?\&][mr]?id=(MUSIC_)?)(\d+)/i) || [])[3]) { // type: 0/1/8/10
            return platformObj.getMusicInfo({
                id
            });
        }
        if (id = (urlLike.match(/(\/playlist(_detail)?\/|[\?\&]pid=)(\d+)/i) || [])[3]) { // type: 2
            _ = JSON.parse(fetch("http://nplserver.kuwo.cn/pl.svc?op=getlistinfo&pid=" + id + "&pn=0&rn=0&encode=utf8&keyset=pl2012&identity=kuwo&pcmp4=1&vipver=MUSIC_9.0.5.0_W1&newver=1&_="));
            return formatSheetItem(_);
        }
        if (id = (urlLike.match(/(rank|bang)(.*?b?id=)(\d+)/i) || [])[3]) { // type: 3
            _ = JSON.parse(fetch("http://kbangserver.kuwo.cn/ksong.s?from=pc&fmt=json&pn=0&rn=0&type=bang&data=content&id=" + id + "&show_copyright_off=0&pcmp4=1&isbang=1&_="));
            _ = formatToplistItem(_);
            _.id = id;
            return _;
        }
        if (id = (urlLike.match(/(\/album(_detail)?\/|[\?\&]albumid=)(\d+)/i) || [])[3]) { // type: 4 / 7
            _ = JSON.parse(fetch("https://searchlist.kuwo.cn/r.s?stype=albuminfo&albumid=" + id + "&show_copyright_off=1&alflac=1&vipver=1&sortby=1&newver=1&mobi=1"));
            return formatAlbumItem(_);
        }
        if (id = (urlLike.match(/\/singer(_detail|s)?\/(\d+)/i) || [])[2]) { // type: 5
            _ = ajax(pcapi + "artist/artist?artistid=" + id + "&");
            return formatArtistItem(_);
        }
        if (/user(.*?[\?\&]id=|\/)(\d+)/i.test(urlLike)) { // type: 6
            return undefined;
        }
        if (id = (urlLike.match(/mv\/?play(\/\d+)?(\/|.*?id=)(\d+)/i) || [3])) { // type: 9
            return platformObj.getMusicInfo({
                id
            });
        }
        return false;
    },

    // 获取分享链接☆
    share_url: function(mediaItem) {
        // 返回平台链接的字符串 或者false
    },
}
$.exports = platformObj;
