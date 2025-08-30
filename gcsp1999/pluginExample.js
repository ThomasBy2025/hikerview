// 格式化歌曲信息
function formatMusicItem(_) {
    return {
        /* 平台 */
        platform: platformObj.platform,
        /* 类型 */ // 0免费 1会员
        type: "0" || "1",
        /* 标识 */
        id, // #songId
        /* 曲名 */
        title,
        /* 作者 */
        artist,
        /* 别名 */
        // alias: "",
        /* 直链 */
        // url: "",
        /* 时长(s) */
        duration, // #interval
        /* 专辑 */
        album,
        /* 封面 */
        artwork,
        /* 音质 */
        qualities: {},
        /* 其他 */ // 支持自定义
        albumId, //专辑id
        artistId, //歌手id
        videoId, //视频id
        // radioId, //播客id
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
        id,
        /* 标题 */
        title,
        /* 作者 */
        artist,
        /* 封面图 */
        // coverImg: "",
        artwork,
        /* 描述 */
        description,
        /* 作品总数 */
        worksNum,
        /* 其他参数 */
        date, // 更新时间
        tags: [], // 歌单标签
        playCount, // 播放数
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
        id,
        /* 歌手名称 */
        title,
        /* 作者名称 */
        artist: title,
        /* 头像 */
        avatar,
        /* 简介 */
        description,
        /* 作品总数 */
        worksNum,
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



// 返回对象，不支持的功能把函数删掉就行。
let platformObj = {
    platform: "插件标识", // 一般是英文简写，例: tx, wy, kg, kw, mg
    title: "插件名称", // ☆
    type: "插件分类", // ☆ 随便写：视频 / 音频 / 其他
    author: "插件作者",
    version: "2025.09.01", // 插件版本
    icon: "插件封面", //☆
    srcUrl: "插件在线链接",
    description: [{ // 更新内容/简介☆
        "title": "2025.09.01",
        "records": [
            "““更新””: 插件示例",
            "‘‘修复’’: 若干bug"
        ]
    }, {
        "title": "2025.01.04",
        "records": [
            "““更新””:....",
            "‘‘修复’’:...."
        ]
    }],



    platformProxy: false, // 该插件支持导入解析☆
    userVariables: [{ // 用户变量，通过getUserVariables(platformObj)函数获取
        key: "key1",
        name: "标题1",
        hint: "注释1"
    }, {
        key: "key2",
        name: "标题2",
        hint: "注释2"
    }],



    // 插件已适配musicfree☆
    // musicfree版本的platform需要和插件名称一致
    musicfree: {
        srcUrl: "插件musicfree版本在线链接",
        regNames: ["插件标题", "插件别名"] // 插件在musicfree的同源名称
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
    },



    // 获取歌单标签
    getRecommendSheetTags: function() {
        // 返回数组，取第一组为推荐分类。
        // 数组键值 { title: "主要分类标题", data: [] }
        // data键值  { title: "次要分类标题", id: "分类id" }
    },

    // 通过标签获取歌单列表
    getRecommendSheetsByTag: function(tagId, page) {
        // 返回对象  {isEnd, data}
        // isEnd 页面是否结束  true / false
        // data 符合歌单格式的数组
    },

    // 获取歌单详情
    getMusicSheetInfo: function(sheetId, page) {
        // 返回对象  {isEnd, item, data}
        // isEnd 页面是否结束  true / false
        // item 符合歌单格式的对象
        // data 符合单曲格式的数组
    },



    // 获取榜单列表
    getTopLists: function() {
        // 返回数组
        // 数组键值 { title: "分类标题", data: [] }
        // data键值  { title: "榜单标题", id: "榜单id" }
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
    },

    // 获取歌手列表☆
    getArtistListDetails: function(url) {
        // 返回对象  {isEnd, data}
        // isEnd 页面是否结束  true / false
        // data 符合歌手格式的数组
    },

    // 获取歌手详情
    getArtistWorks: function(artistId, page, artistType) {
        // artistType = "歌曲" || "专辑" || "视频" || "电台" || "播客"
        // 返回对象  {isEnd, item, data}
        // isEnd 页面是否结束  true / false
        // item 符合歌手格式的对象
        // data 符合type格式的数组
    },



    // 获取专辑详情
    getAlbumInfo: function(albumId, page) {
        // 返回对象  {isEnd, item, data}
        // isEnd 页面是否结束  true / false
        // item 符合专辑格式的对象
        // data 符合单曲格式的数组
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
    },

    // 获取链接(url)
    getMediaSource: function(musicItem, quality, header, mediaType) {
        // musicItem = 符合单曲格式的对象
        // quality = "low" || "standard" || "high" || "super" #需要获取的音质
        // header = 会员cookie(前提插件有实现登录函数)
        // mediaType = "play" || "down" || "debug"
        if (mediaType == "debug") { // 解析测试
            musicItem = {
                id: "会员歌曲id"
            };
            quality = "low";
            mediaType = "down";
        }
        let url = "播放链接实现"
        if (url != "") {
            if (mediaType == "down") {
                return url;
            } else {
                return {
                    urls: [url],
                    // names: [],
                    // headers: [],
                    lyric: getLyric(musicItem),
                    // audioUrls: [], // 一般用不到
                };
            }
        }
        return false; // 无法获取播放链接
    },

    // 获取歌词(lrc)
    getLyric: function(musicItem) {
        // musicItem = 符合单曲格式的对象 或者 字符串(id);
        // 返回符合lrc格式的字符串 / 在线链接
    },



    // 下面的参数可能会改，没有固定
    playurl_timeout: 0, // 官方链接的有效时长(s)☆

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

    // 获取视频链接(mv)☆
    getVideo: function(musicItem) {
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