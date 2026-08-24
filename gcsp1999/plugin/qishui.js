// 拼接图片链接
function getArtworkUrl(a) {
    if (a && a.uri && a.template_prefix) {
        return "https://p3-luna.douyinpic.com/img/" + a.uri + "~" + a.template_prefix + "-resize:960:960.png";
    }
    return undefined;
}



// 格式化歌曲信息
function formatMusicItem(_) {
    let qualities;
    if (_.bit_rates) {
        qualities = {};
        _.bit_rates.map(_ => {
            let t = {
                "medium": "128k",
                "higher": "192k",
                "highest": "320k",
                "lossless": "2000k", // 最大
                "hi_res": "4000k",
                "spatial": "24000k",
            }[_.quality];
            if (t && !qualities[t]) {
                qualities[t] = {};
                qualities[t].size = _.size;
            }
        });
    }
    let artwork = _.cover_url || getArtworkUrl(_.album && _.album.url_cover);
    return {
        /* 平台 */
        platform: platformObj.platform,
        /* 类型 */ // 0免费 1会员
        type: _.label_info.only_vip_playable ? "1" : "0",
        /* 标识 */
        id: _.item_id || _.id,
        mid: _.vid,
        /* 曲名 */
        title: _.title || _.name,
        /* 作者 */
        artist: _.artists && _.artists.map(_ => _.name || "").join('&'),
        /* 时长(s) */
        duration: _.duration,
        /* 专辑 */
        album: _.album && _.album.name,
        /* 封面 */
        artwork,
        /* 音质 */
        qualities,
        /* 其他 */ // 支持自定义
        albumId: _.album && _.album.id, //专辑id
        artistId: _.artists && _.artists.map(_ => _.id || "").join('&'), //歌手id
    }
}



// 格式化视频信息
function formatVideoItem(_) {
    return {
        /* 平台 */
        platform: platformObj.platform,
        /* 类型 */ // 9视频
        type: "9",
        /* 标识 */
        id: _.video_id,
        /* 曲名 */
        title: _.videoName,
        /* 作者 */
        artist: _.artistName,
        /* 时长(s) */
        duration: _.duration * 1000,
        /* 专辑 */
        // album,
        /* 封面 */
        artwork: _.coverURL,
        /* 音质 */
        // qualities,
        /* 其他 */ // 支持自定义
        // albumId,
        // artistId,
    }
}



// 格式化歌单信息
function formatSheetItem(_) {
    return {
        /* 平台 */
        platform: platformObj.platform,
        /* 类型 */ // 2歌单
        type: "2",
        /* 歌单id */
        id: _.id,
        /* 标题 */
        title: _.title || _.name,
        /* 作者 */
        artist: (_.owner && _.owner.nickname) || (_.user_artist_info && _.user_artist_info.nickname) || undefined,
        /* 封面图 */
        artwork: _.cover_url || getArtworkUrl(_.url_cover || _.url_avatar),
        /* 描述 */
        description: _.desc || _.intro,
        /* 作品总数 */
        worksNum: _.count_tracks || (_.resource_cnt && _.resource_cnt.track_cnt),
        /* 其他参数 */
        date: _.release_date || _.update_time || _.create_time, // 更新时间
        //  tags: [], // 歌单标签
        //  playCount, // 播放数
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
    _ = formatSheetItem(_);
    _.type = "5" // 5歌手
    return _;
}









// luna/pc
function ajaxPC(path, params, postBody) {
    params = Object.assign({
        "aid": "386088",
        "app_name": "luna_pc",
        "region": "cn",
        "geo_region": "cn",
        "os_region": "cn",
        "sim_region": "",
        "cdid": "",
        "version_name": "3.3.0",
        "version_code": "30030000",
        "channel": "official",
        "build_mode": "master",
        "network_carrier": "",
        "ac": "wifi",
        "tz_name": "Asia/Shanghai",
        "resolution": "",
        "device_platform": "windows",
        "device_type": "Windows",
        "os_version": "Windows 11 Home China",
        // "charge": "0",
        "device_id": "100000305367703244",
        "fp": "100000305367703244",
        "iid": "",
    }, params || {});
    let url = buildUrl("https://api.qishui.com/luna/pc" + path, params);

    let res = fetch(url, {
        method: postBody ? "POST" : "GET",
        body: postBody || "",
        headers: {
            "User-Agent": "LunaPC/3.2.1(343009595)",
            "x-luna-background-type": "foreground",
            "x-luna-is-background-req": "0",
            "x-luna-is-local-user": "0"
        }
    });
    return JSON.parse(res);
}



// luna
function ajaxPE(path, params, postBody, header) {
    params = Object.assign({
        "_rticket": String(Date.now()),
        "device_platform": "android",
        "os": "android",
        "ssmix": "a",
        "cdid": "46556f98-1720-4248-83da-62b74b60b46a",
        "channel": "xiaomi_8478_64",
        "aid": "8478",
        "app_name": "luna",
        "version_code": "100198030",
        "version_name": "19.8.0",
        "manifest_version_code": "100198030",
        "update_version_code": "100198030",
        "resolution": "1080*1920",
        "dpi": "480",
        "device_type": "ABR-AL80",
        "device_brand": "HUAWEI",
        "language": "zh",
        "os_api": "35",
        "os_version": "15",
        "ac": "wifi",
        "device_model": "ABR-AL80",
        "save_power": "0",
        "font_size": "1.00",
        "luna_first_launch_apk_type": "normal_apk",
        "diversion_channel_name": "xiaomi_8478_64",
        "is_car_play": "0",
        "battery": "0.99",
        "network_speed": "10156",
        "hybrid_version_code": "100198030",
        "tz_name": "Asia/Shanghai",
        "tz_offset": "28800",
        "luna_register_time": "1784311292",
        // 与抓包原文一致（保留 %E5 编码，勿解码为中文；axios 会再把 % 编成 %25）
        "diversion_category_level_two": "Xiaomi%E5%95%86%E5%BA%97-%E8%87%AA%E7%84%B6",
        "package": "com.luna.music",
        "charge": "0",
        "luna_apk_type": "normal_apk",
        "output_device_type": "Phone",
        "volume": "1.00",
        "brightness": "0.08",
        "need_personal_recommend": "1",
        "is_teen_mode": "0",
        "sim_region": "cn",
        "diversion_category_level_one": "%E5%8E%82%E5%95%86%E5%95%86%E5%BA%97-%E8%87%AA%E7%84%B6",
        "android_device_type": "default",
        "iid": "2204957404569386",
        "device_id": "2204957404565290"
    }, params || {});
    let url = buildUrl("https://api.qishui.com/luna" + path, params);
    if (postBody === "run") return url;
    let res = fetch(url, {
        method: postBody ? "POST" : "GET",
        body: postBody || "",
        headers: Object.assign({
            "User-Agent": "com.luna.music/100198030 (Linux; U; Android 15; zh_CN_#Hans; ABR-AL80; Build/V417IR;tt-ok/3.12.13.19)",
            "content-type": "application/json; charset=UTF-8"
        }, header || {})
    });
    return JSON.parse(res);
}



// ff
function ajax(url, params) {
    return JSON.parse(fetch(buildUrl(url, params || {}), {
        headers: {
            "User-Agent": "com.luna.music/100159040 (Linux; U; Android 11; zh_CN; Cronet/TTNetVersion:dd1b0931 2024-06-28 QuicVersion:d299248d 2024-04-09)",
            // "x-common-params-v2": "channel=appstore&aid=8478&device_id=1100210274091033"
        }
    }));
}







// 格式化歌词为Lrc
function convertToLRC(input) {
    // 按行分割输入文本
    let lines = input.split('\n');
    let lrcLines = [];
    lines.forEach(line => {
        // 提取歌词文本（移除所有时间偏移标记）
        let lyrics = line
            .replace(/\[\d+,\d+\]/g, '') // 移除行首时间标签
            .replace(/<\d+,\d+,\d+>/g, '') // 移除所有偏移标记
            .trim();
        // 如果歌词不为空则添加
        if (lyrics) {
            // 提取时间标签（ 毫秒）
            let timeTagMatch = line.match(/\[(\d+),\d+\]/);
            if (!timeTagMatch) return;
            let startTimeMs = parseInt(timeTagMatch[1]);

            // 转换为 mm:ss.xx 格式
            let dateObj = new Date(startTimeMs);
            let minutes = dateObj.getUTCMinutes();
            let seconds = dateObj.getUTCSeconds();
            let milliseconds = dateObj.getUTCMilliseconds();

            // 格式化时间标签
            let formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(Math.floor(milliseconds / 10)).padStart(2, '0')}`;
            lrcLines.push(`[${formattedTime}] ${lyrics}`);
        }
    });
    return lrcLines.join('\n');
}



// 校验时间戳，判断是不是试听链接
function isFixedPreviewDuration(t1, t2) {
    t1 = parseInt(t1);
    if (t1 === 60 || t1 === 30) {
        t1 = dateFormat(t1);
        t2 = t2.duration;
        if (t1 != t2) {
            return 1;
        }
    }
    return 0;
}


// 返回对象，不支持的功能把函数删掉就行。
let platformObj = {
    platform: "qishui", // 插件标识，一般是英文简写，例: tx, wy, kg, kw, mg
    title: "汽水音乐", // 插件名称☆
    type: "音频", // 插件分类☆ 随便写：视频 / 音频 / 其他
    author: "JanYun & Toskysun & Thomas喲", // 插件作者
    version: "2026.08.24", // 插件版本
    icon: "https://android-artworks.25pp.com/fs08/2025/09/03/1/106_c76eeca9455df883203b790473d1f30a_con_130x130.png", //插件封面☆
    srcUrl: "https://raw.githubusercontent.com/ThomasBy2025/hikerview/refs/heads/main/gcsp1999/plugin/qishui.js", // 在线链接
    description: [{ // 更新内容/简介☆
        "title": "2026.08.24",
        "records": [
            "““反馈Q群@365976134””",
            "““更新””: 插件优化(3.2.6)",
            "‘‘作者’’: JanYun & Toskysun",
            "‘‘MF地址’’: https://music.cwo.cc.cd/plugins/qishui.js",
        ]
    }, {
        "title": "2025.09.05",
        "records": [
            "““更新””: 插件示例(0.1.3)",
            "‘‘作者’’: 鸿蒙",
            "‘‘MF地址’’: https://raw.githubusercontent.com/jiyiv5/musicfree/refs/heads/main/qishui.js",
        ]
    }],
    userVariables: [{ // 用户变量，通过getUserVariables(platformObj)函数获取
        key: "sessionid",
        name: "用户标识",
        hint: "sessionid"
    }],
    platformProxy: true, // 该插件支持导入解析☆
    debug_musicItem: {
        "platform": "qishui",
        "type": "1",
        "id": "7602087033175754771",
        "mid": "v03ad6g10000d60ldufog65qok1to7h0",
        "title": "我也不想这样",
        "artist": "王菲",
        "duration": "00:04:56",
        "album": "王菲(1997年專輯)",
        "artwork": "https://p3-luna.douyinpic.com/img/tos-cn-v-2774c002/o4PAOiXErwABiYh9yVW4CaIVO7AYERAQOBoFO~tplv-b829550vbb-resize:960:960.png",
        "qualities": {
            "128k": {
                "size": 2530451
            },
            "192k": {
                "size": 4906511
            },
            "320k": {
                "size": 9658634
            },
            "2000k": {
                "size": 31946405
            },
            "24000k": {
                "size": 12034681
            },
            "4000k": {
                "size": 11976411
            }
        },
        "albumId": "7602087033175607315",
        "artistId": "6817629419360749570"
    }, // 测试登录/解析时需要调用





    // 实现搜索
    supportedSearchType: ["单曲", "专辑", "歌单", "歌手"],
    search: function(query, page, type) {
        let _type = {
            "单曲": {
                ft: "track",
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
        }[type];
        let params = {
            "q": query,
            "count": 20,
            "cursor": (page - 1) * 20,
            "aid": "386088"
        }
        let res = ajaxPE("/search/" + _type.ft, params).result_groups[0];
        let list = res.data.map(_ => _.entity[_type.ft]);
        return {
            "isEnd": !res.has_more,
            "data": list.map(_type.mat)
        };

        // 此接口只能搜歌曲，而且信息不全
        params = {
            "keyword": query,
            "search_type": "music",
            "limit": 20,
            "real_offset": (page - 1) * 20,
            "search_source": "qishui"
        }
        res = ajax("https://api-vehicle.volcengine.com/v2/search/type", params).data;
        list = res.list.map(_ => ({
            id: _.item_id,
            title: _.title,
            artists: [{
                name: _.author_info.name,
                id: ""
            }],
            cover_url: _.cover_url,
            label_info: _.qishui_label_info,
            duration: _.duration * 1000,
            media_type: _.media_type.replace(/^music$/, "track")
        }));
        return {
            "isEnd": !res.has_more,
            "data": list.map(formatMusicItem)
        };
    },



    // 获取歌单标签
    getRecommendSheetTags: function() {
        return [{
            "title": "热门分类",
            "data": [{
                "id": 0,
                "title": "推荐"
            }, {
                "id": 14,
                "title": "流行"
            }, {
                "id": 8,
                "title": "华语"
            }, {
                "id": 9,
                "title": "欧美"
            }, {
                "id": 20,
                "title": "国风"
            }, {
                "id": 18,
                "title": "民谣"
            }, {
                "id": 15,
                "title": "摇滚"
            }, {
                "id": 38,
                "title": "说唱"
            }, {
                "id": 16,
                "title": "电子"
            }, {
                "id": 19,
                "title": "R&B"
            }, {
                "id": 69,
                "title": "治愈"
            }, {
                "id": 45,
                "title": "睡前"
            }, {
                "id": 40,
                "title": "学习"
            }]
        }];
    },

    // 通过标签获取歌单列表
    getRecommendSheetsByTag: function(tagId, page) {
        let body = JSON.stringify({
            "block_type": "discover_playlist_mix",
            "feed_discover_extra": {},
            "latest_douyin_liked_playlist_show_ts": 0,
            "sub_channel_id": +tagId
        });
        let res = ajaxPC("/discover/mix", {}, body);
        let list = res.inner_block.map(_ => _.resources[0].entity.playlist);
        if (tagId == "0" && page == 1) list.unshift({
            "id": "7434476168507637799",
            "title": "旅行者必听｜原神全部专辑上线✨",
            "desc": "汽水音乐公开歌单",
            "cover_url": "https://p3-luna.douyinpic.com/img/tos-cn-i-b829550vbb/c2da1ff20dcb4a168117392c7964b6d0~tplv-b829550vbb-crop-center:720:720.jpg",
        });
        return {
            isEnd: !res.has_more,
            data: list.map(formatSheetItem)
        }
    },

    // 获取歌单详情
    getMusicSheetInfo: function(sheetId, page) {
        let param = {
            "playlist_id": sheetId,
            "cursor": page == 1 ? "" : MY_PARAMS.cursor,
            "count": "-1"
        };
        let res = ajaxPC("/playlist/detail", param);
        let list = res.media_resources.map(_ => _.entity.track_wrapper.track);
        setPageParams({
            cursor: res.next_cursor + ""
        });
        return {
            isEnd: !res.has_more,
            data: list.map(formatMusicItem)
        }
    },



    // 获取榜单列表
    getTopLists: function() {
        return [{
            "title": "默认排行榜",
            "data": [{
                "platform": platformObj.platform,
                "type": "3",
                "id": "7036274230471712007",
                "description": "汽水音乐内每周热度最高的50首歌，每周四更新",
                "artwork": "https://p3-luna.douyinpic.com/img/tos-cn-i-b829550vbb/d0d8d48461a62748e84689cdf049b19a.png~tplv-b829550vbb-resize:960:960.png",
                "title": "热歌榜"
            }, {
                "platform": platformObj.platform,
                "type": "3",
                "id": "7060812597884869927",
                "description": "近期发行的热度最高的50首新歌，每周四更新",
                "artwork": "https://p3-luna.douyinpic.com/img/tos-cn-i-b829550vbb/f12f7eb5b54d0899c7c724df009668a8.png~tplv-b829550vbb-resize:960:960.png",
                "title": "新歌榜"
            }, {
                "platform": platformObj.platform,
                "type": "3",
                "id": "7061475546400005410",
                "description": "汽水音乐内每周热度最高的50首外文歌曲，每周四更新",
                "artwork": "https://p3-luna.douyinpic.com/img/tos-cn-i-b829550vbb/33747550ed5499b58feda42a21748637.png~tplv-b829550vbb-resize:960:960.png",
                "title": "欧美榜"
            }, {
                "platform": platformObj.platform,
                "type": "3",
                "id": "7415959718721494311",
                "description": "抖音音乐人开放平台上传歌曲，综合每周站内热度进行排序展示",
                "artwork": "https://p3-luna.douyinpic.com/img/tos-cn-v-2774c002/o8FQKiQQBxHWa2hzsBNAgYOX6iEHEAibADAbfB~tplv-b829550vbb-resize:960:960.png",
                "title": "音乐人歌曲榜"
            }]
        }];
    },

    // 获取榜单详情
    getTopListDetail: function(topId, page) {
        let res = ajaxPE("/charts/" + topId);
        let list = res.chart.track_ranks.map(_ => _.track);
        return {
            isEnd: true,
            data: list.map(formatMusicItem)
        }
    },



    // 获取歌手详情
    getArtistWorks: function(artistId, page, artistType) {
        // #专辑列表   #`/artists/${artistId}/albums`
        let params = {
            "cursor": String((page - 1) * 1000),
            "count": "1000"
        }
        let res = ajaxPC(`/artists/${artistId}/tracks`, params);
        return {
            "isEnd": true,
            "data": res.tracks.map(formatMusicItem)
        };
    },



    // 获取专辑详情
    getAlbumInfo: function(albumId, page) {
        let params = {
            "cursor": String((page - 1) * 1000),
            "count": "1000",
            "ignore_tracks": "false"
        }
        let res = ajaxPC(`/albums/${albumId}`, params);
        return {
            "isEnd": true,
            "data": res.tracks.map(formatMusicItem)
        };
    },















    // 获取歌曲详情
    getMusicInfo: function(musicItem, run) {
        let params = {
            "track_id": musicItem.id,
            "device_platform": "web"
        };
        let res = ajax("https://beta-luna.douyin.com/luna/h5/seo_track", params);
        return run === true ? res : formatMusicItem(res.seo_track.track);
        params = {
            track_id: musicItem.id,
            __loader: "track_page"
        };
        res = ajax("https://music.douyin.com/qishui/share/track", params).audioWithLyricsOption;
        return run === true ? res : formatVideoItem(res.trackInfo);
    },





    // 获取链接(url)
    getMediaSource: function(musicItem, quality, qualityItem, mediaType, header) {
        let {
            sessionid
        } = getUserVariables(platformObj);
        sessionid = sessionid || (header && header.sessionid) || "3e60f931253128d953e15144ba7105f1";
        if (sessionid && sessionid != "") {
            let url = ajaxPE("/track_v2", {}, "run");
            let body = JSON.stringify({
                "enable_refresh_api": true,
                "limited_free_param": {
                    "expire_time": 0,
                    "from_other_queue": false,
                    "intercept_type": "",
                    "is_login_support": true,
                    "is_logout_support": true,
                    "limited_free": false,
                    "limited_free_type": "",
                    "rewind_prev_intercept_type": "",
                    "sign": "",
                    "sign_version": ""
                },
                "media_type": "track",
                "queue_type": "search_one_track",
                "scene_name": "search_track_reco",
                "track_id": String(musicItem.id),
            });
            let headers = JSON.parse(fetch("http://api.music.qishui.vsaa.cn/qm/api.php", {
                method: "POST",
                body: JSON.stringify({
                    "url": url,
                    "body": base64Encode(body),
                    "cookie": "sessionid=" + sessionid,
                    "ua": "",
                    "send": false
                }),
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36 Edg/151.0.0.0",
                    "Accept-Encoding": "gzip, deflate",
                    "Content-Type": "application/json",
                    "Origin": "http://api.music.qishui.vsaa.cn",
                    "Referer": "http://api.music.qishui.vsaa.cn/qm/",
                    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6"
                }
            })).headers;
            _ = JSON.parse(post(url, {
                headers,
                body
            }));
        } else {
            _ = platformObj.getMusicInfo(musicItem, true);
        }
        let lrc = _.lyric && _.lyric.content;
        if (lrc) lrc = convertToLRC(lrc);

        if (true) { // 接口自带了链接
            _ = JSON.parse(_.track_player.video_model);
            if (isFixedPreviewDuration(_.video_duration, musicItem)) {
                return false; // 链接只有试听30s
            }
        } else {
            _url = _.track_player.url_player_info;
            _ = JSON.parse(fetch(_url)).Result.Data;
        }
        let urlList = _.video_list || _.PlayInfoList || [];

        let headers = [];
        let names = [];
        let urls = [];
        for (let _ of urlList) {

            let purl = String(_.MainPlayUrl || _.main_url || _.BackupPlayUrl || _.backup_url || "")
            // .replace("audio_mp4", "audio_mp3"); // 不用替换也行？
            let _quality = _.Quality || _.video_meta.quality;
            /*
            let format = _.Format || _.video_meta.vtype;  // m4a
            let codec = _.Codec || _.video_meta.codec_type; // aac
            // encrypt_info
            let e_type = _.EncryptionMethod || _.encrypt_info.encryption_method;
            let auth_id = _.PlayAuthID || _.encrypt_info.kid;
            let auth = _.PlayAuth || _.encrypt_info.spade_a;// 需要解密
            */
            if (purl && purl != "") {
                let {
                    title,
                    sort,
                    _url,
                    url
                } = qualityMap[_quality];
                if (_url == quality || url == quality) {
                    let ekey = _.PlayAuth || (_.encrypt_info && _.encrypt_info.spade_a);
                    if (ekey) {
                        purl = $.require(getGitHub(["config", "qishuiDecrypt.js"]))(purl, ekey);
                    }
                    return {
                        urls: [purl + "#isMusic=true#"],
                        names: [title],
                        lyric: lrc
                    };
                }
                names.push(title);
                urls.push(purl + "#isMusic=true#");
                /*headers.push({
                    "Accept-Language": "zh-CN,zh;q=0.9",
                    "Cache-Control": "no-cache",
                    "Pragma": "no-cache",
                    "Range": "bytes=0-",
                    "Referer": "https://www.douyin.com/",
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36"
                });*/
            }
        }
        return 0; // 没有指定音质
        return {
            names,
            urls,
            headers,
            lyric: lrc
        };
    },





    // 获取歌词(lrc)
    getLyric: function(musicItem) {
        let params = {
            "sources": "qishui",
            "need_author": true,
            "need_album": true,
            "need_ugc": true,
            "need_stat": true,
            "item_ids": musicItem.id
        }
        let res = ajax("https://api-vehicle.volcengine.com/v2/custom/contents", params);
        return res.data.list[0].lyric_info.lyric_text;
    },





    // 获取视频音质
    getVideoInfo: function(musicItem, run) {
        let params = {
            ugc_video_id: musicItem.id,
            __loader: "ugc_video_page"
        };
        let res = ajax("https://music.douyin.com/qishui/share/ugc_video", params).videoOptions;
        return run === true ? res : formatVideoItem(res);
    },

    // 获取视频链接(mv)☆
    getVideo: function(musicItem) {
        return platformObj.getVideoInfo(musicItem, true).url;
    },










    // 导入平台资源☆
    import_url: function(urlLike) {
        // 匹配链接 返回对象
        // 不成功就返回false
        let id;
        if (!/(qishui|music)\.douyin\.com/i.test(urlLike)) {
            return undefined;
        }
        if (id = (urlLike.match(/([\?\&]track_id=)(\d+)/i) || [])[2]) { // type: 0/1单曲
            return platformObj.getMusicInfo({
                id
            });
        }
        if (id = (urlLike.match(/([\?\&]ugc_video_id=)(\d+)/i) || [])[2]) { // type: 9视频
            return platformObj.getVideoInfo({
                id
            });
        }

        if (id = (urlLike.match(/([\?\&]playlist_id=)(\d+)/i) || [])[2]) { // type: 2歌单
            let params = {
                playlist_id: id,
                __loader: "playlist_page"
            };
            let res = ajax("https://music.douyin.com/qishui/share/playlist", params);
            return formatSheetItem(res.playlistInfo);
        }
        if (id = (urlLike.match(/([\?\&]album_id=)(\d+)/i) || [])[2]) { // type: 4专辑
            let params = {
                album_id: id,
                __loader: "album_page"
            };
            let res = ajax("https://music.douyin.com/qishui/share/album", params);
            return formatAlbumItem(res.albumInfo);
        }
        if (id = (urlLike.match(/([\?\&]artist_id=)(\d+)/i) || [])[2]) { // type: 5歌手
            let params = {
                artist_id: id,
                __loader: "artist_page"
            };
            let res = ajax("https://music.douyin.com/qishui/share/artist", params);
            return formatArtistItem(res.artistInfo);
        }
        return false;
    },

    // 获取分享链接☆
    share_url: function(mediaItem) {
        switch (String(mediaItem.type)) {
            case "0":
            case "1":
                return "https://music.douyin.com/qishui/share/track?track_id=" + mediaItem.id;
                break;
            case "2":
                return "https://music.douyin.com/qishui/share/playlist?playlist_id=" + mediaItem.id;
                break;
            case "4":
                return "https://music.douyin.com/qishui/share/album?album_id=" + mediaItem.id;
                break;
            case "5":
                return "https://music.douyin.com/qishui/share/artist?artist_id=" + mediaItem.id;
                break;
            case "9":
                return "https://music.douyin.com/qishui/share/ugc_video?ugc_video_id=" + mediaItem.id;
                break;
        }
        return "";
    },





    // 获取评论
    getMusicComments: function(commentId, page, commentType) {
        // 格式化评论信息
        function formatComment(_) {
            return {
                /* 平台 */
                platform: platformObj.platform,
                // 评论ID
                id: _.id,
                // 用户名
                nickName: _.user.nickname,
                // 头像
                avatar: _.user.medium_avatar_url && _.user.medium_avatar_url.urls[0],
                // 评论内容
                comment: _.content,
                // 点赞数
                like: _.count_digged,
                // 评论时间
                createAt: _.time_created,
                // 地址
                // location,
                // 回复
                // replies: [].map(formatComment),
                /* 其他参数 */
                type: "11" // 11评论
            };
        }
        let params = {
            "group_id": commentId + "",
            "cursor": ((page - 1) * 20) + "",
            "count": "20",
            "group_type": "1",
            "image_strategy": "2"
        }
        let _ = ajaxPC("/comments", params);
        return {
            "isEnd": _.count < page * 20,
            "data": _.comments.map(formatComment)
        };
    },
}
$.exports = platformObj;