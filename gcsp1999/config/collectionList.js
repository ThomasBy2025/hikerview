let c_type = getMyVar("c_type", "本地收藏");
getTopImage({
    url: "hiker://empty"
});
[{
        title: "本地收藏",
        icon: "hiker://images/bookmark"
    },
    {
        title: "在线收藏",
        icon: "hiker://images/collection"
    },
    {
        title: "历史浏览",
        icon: "hiker://images/history"
    }
].map(_ => {
    d.push({
        title: Color(_.title, c_type != _.title && "#62a6fb").bold(),
        url: $('#noLoading#').lazyRule((c_type) => {
            putMyVar('c_type', c_type);
            refreshPage();
            return 'hiker://empty';
        }, _.title),
        col_type: 'icon_small_3',
        pic_url: _.icon
    });
});
getColType({
    col_type: "line_blank",
    length: 2
});
d.push({
    title: "TGX收藏 - 收藏列表".bold() + "(v3)",
    desc: "本地音视频".bold().small(),
    url: "hiker://localMedia",
    col_type: "avatar",
    pic_url: "hiker://images/icon_music3"
});
d.push({
    col_type: "line"
});
switch (c_type) {
    case "在线收藏":
        let collections = JSON.parse(fetch("hiker://collection?rule=歌词适配"));
        let collectioni = 0;
        collections.forEach(it => {
            try {
                if (it.params && (JSON.parse(it.params).title == MY_RULE.title)) {
                    let title = it.mTitle || it.title;
                    let pic_url = it.picUrl;
                    let url = String(JSON.parse(it.params).url || "").split(';')[0];
                    let desc = Rich(Color("足迹：", "#1aad19").bold().small()) + (it.lastClick ? it.lastClick.split('@@')[0] : "无");
                    // desc += "更新: " + (it.extraData ? JSON.parse(it.extraData).lastChapterStatus : "");
                    let col_type = "icon_1_left_pic";
                    d.push({
                        url,
                        title,
                        desc,
                        pic_url,
                        col_type,
                        extra: {
                            inheritTitle: false,
                        }
                    });
                    collectioni++;
                }
            } catch (e) {
                log("软件收藏列表加载异常>" + e.message + ' 错误行#' + e.lineNumber);
            }
        });
        if (!collectioni) d.push({
            title: "没有在线收藏",
            url: "hiker://empty",
            col_type: "text_center_1"
        });
        break;
    case "历史浏览":
        let historys = JSON.parse(fetch("hiker://history?rule=歌词适配"));
        let historyi = 0;
        historys.forEach(it => {
            try {
                if (it.params && (JSON.parse(it.params).title == MY_RULE.title)) {
                    let title = it.mTitle || it.title;
                    let pic_url = it.picUrl;
                    let url = String(JSON.parse(it.params).url || "").split(';')[0];
                    let desc = Rich(Color("足迹：", "#1aad19").bold().small()) + (it.lastClick ? it.lastClick.split('@@')[0] : "无");
                    let col_type = "icon_1_left_pic";
                    d.push({
                        url,
                        title,
                        desc,
                        pic_url,
                        col_type,
                        extra: {
                            inheritTitle: false
                        }
                    });
                    historyi++;
                }
            } catch (e) {
                log("历史浏览列表加载异常>" + e.message + ' 错误行#' + e.lineNumber);
            }
        });
        if (!historyi) d.push({
            title: "没有历史浏览",
            url: "hiker://empty",
            col_type: "text_center_1"
        });
        break;
    case "本地收藏":
    default:
        getCollectionItems({})
        break;
}