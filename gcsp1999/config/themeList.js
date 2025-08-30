addListener('onClose', $.toString((path) => {
    if (fileExist(path)) deleteFile(path);
}, _getPath(["theme", themeType2, "themes", "NEW_THEME"], 0, 1)));

MY_URL = MY_URL.replace(/(t_type=)[^&]*/, "$1" + themeType2);
theme_Id = _getPath(["theme", themeType2, "select.txt"], "rules");
getTopImage({
    url: "hiker://empty"
});

[{
    title: "首页",
    key: "home"
}].map(t => {
    let tt = themeType2 != t.key;
    d.push({
        title: Rich(Color(t.title, tt && "Gray").bold()),
        url: $("#noLoading#").lazyRule((tt, t) => {
            if (tt) {
                setPageParams({
                    t_type: t
                });
                refreshPage();
            }
            return "hiker://empty";
        }, tt, t.key),
        col_type: 'text_4'
    });
});
["二级", "收藏"].map(t => {
    d.push({
        title: Rich(Color("<s>" + t + "</s>", "Gray").bold()),
        url: "hiker://empty",
        col_type: 'text_4'
    });
})


d.push({
    title: Rich(Color("新增", "#3399cc").bold()),
    url: MY_URL.replace("themeList", "themeEdit&t_id=NEW_THEME").replace("&s=", "&s=#noHistory##noRecordHistory#"),
    col_type: 'text_4',
    extra: {
        pageTitle: "新" + {
            home: "首页"
        } [themeType2] + "主题"
    }
});
d.push({
    col_type: 'line'
});
if (theme_Data.length === 0) d.push({
    title: Rich(Color("没有主题数据").bold().big()),
    desc: Rich("去导入".small()),
    url: 'hiker://empty',
    col_type: 'text_center_1',
    extra: {
        lineVisible: false
    }
});
theme_Data.map((_, i) => {
    let isSelect = theme_Id == _.path;
    d.push({
        title: "““””" + (isSelect ? Color(_.title, "#ff6601") : _.title) + ("&nbsp;&nbsp;&nbsp;[" + (_.author || "佚名") + "]\n" + ("plugins: " + ((_.plugins || []).map(_ => _.platform).join(",") || "&nbsp;NO PLUGINS")).sub().small()).fontcolor("Gray").small(),
        desc: "ID: " + _.path.replace(".json", ""),
        pic_url: _.icon,
        col_type: "icon_1_left_pic",
        url: $("#noLoading#").lazyRule((themeType2, i, MY_URL, isSelect) => {
            require(config.preRule);
            let theme_Path = _getPath(["theme", themeType2, "details.json"], "_cache", 1);
            let theme_Data = _getPath(theme_Path) || [];
            let hikerPop = $.require("http://123.56.105.145/weisyr/js/hikerPop.js");
            let path = _getPath(["theme", themeType2, "themes", ""], 0, 1);
            let _ = theme_Data[i];
            hikerPop.selectCenterIcon({
                iconList: [{
                    title: "分享主题",
                    icon: getImageUrl("share.svg")
                }, {
                    title: "编辑主题",
                    icon: getImageUrl("edit.svg")
                }, {
                    title: "删除主题",
                    icon: getImageUrl("uninstall.svg")
                }, {
                    title: "启用主题",
                    icon: getImageUrl("selected.svg")
                }],
                title: "主题操作",
                columns: 2,
                // position: 0,
                click(a) {
                    switch (a) {
                        case '分享主题':
                            return getShareText([_getPath(["theme", themeType2, "themes", _.path], 0, 1)], "theme");
                            break;
                        case '编辑主题':
                            return MY_URL.replace("themeList", "themeEdit&t_id=" + _.path).replace("&s=", "&s=#noHistory##noRecordHistory#");
                            break;
                        case '删除主题':
                            return $("确定删除主题 " + _.title + " 吗？\n此操作不可逆，请谨慎选择。").confirm((path, isOne, isSelect) => {
                                if (isOne) return "toast://至少要保留一个主题吧";
                                deleteFile(path);
                                if (isSelect) deleteFile(path.replace("themes/", "select.txt"));
                                clearMyVar("themeInitialization");
                                refreshPage();
                                return "hiker://empty";
                            }, path + _.path, theme_Data.length === 1, isSelect);
                            break;
                        case '启用主题':
                            saveFile(path.replace("themes/", "select.txt"), _.path);
                            refreshPage(false);
                            return 'hiker://empty';
                            break;
                        case '排序':
                            return 'hiker://empty';
                            break;
                        case '预览':
                            return 'hiker://empty';
                            break;
                    }
                    return 'hiker://empty';
                }
            });
            return "hiker://empty";
        }, themeType2, i, MY_URL, isSelect),
        extra: {
            pageTitle: _.title
        }
    });
});