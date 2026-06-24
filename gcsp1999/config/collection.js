getTopImage({
    url: "hiker://empty"
});
d.push(getDownData());
getColType({
    type: '#资源导入#',
    title: "导入歌单".bold(),
    col_type: "icon_small_3",
    img: "http://123.56.105.145/tubiao/unframed/459.png",
    extra: {
        pageTitle: "资源导入"
    }
});
d.push({
    title: "样式切换".bold(),
    url: $("#noLoading#").lazyRule((id) => {
        const hikerPop = $.require("http://123.56.105.145/weisyr/js/hikerPop.js");

        function up(a) {
            let list = findItemsByCls(id + ':itemlist') || [];
            for (let it of list) {
                updateItem(it.extra.id, {
                    col_type: a
                });
            }
            setItem("col_type", a);
            return "hiker://empty";
        }
        let optionf = ["text_4", "text_5", "text_center_1", "movie_2", "movie_3", "movie_3_marquee", "pic_1", "pic_2", "pic_3", "pic_1_center", "pic_1_card", "pic_2_card", "icon_1_search", "icon_small_3", "long_text", "rich_text", "avatar", "text_icon", "x5_webview_single", "video", "pic_1", "line", "line_blank", "blank_block", "big_blank_block", "big_big_blank_block", "scroll_button", "card_pic_2_2", "card_pic_2_2_left", "input"];
        let options = getColTypes().filter(_type=>!optionf.includes(_type))
        let position = options.indexOf(getItem("col_type", "icon_1_left_pic"));
        options[position] = "““" + options[position] + "””";
        let pop = hikerPop.selectBottom({
            title: "请选择显示样式",
            options,
            columns: 2,
            height: 0.6, //0-1
            position,
            click(a) {
                return up(a);
            },
            longClick(a) {
                return up(a);
            }
        });
        return "hiker://empty";
    }, rule_id),
    col_type: "icon_small_3",
    img: "http://123.56.105.145/tubiao/red/35.png"
});
d.push({
    url: "hiker://empty",
    col_type: "line_blank",
});
d.push({
    url: "hiker://empty",
    col_type: "line_blank",
});





let c_Items = getCollectionItems();
let c_path = (MY_PARAMS && MY_PARAMS.path) || getParam("path", c_Items[0] && c_Items[0].path) || "";
let c_info = c_Items.find(_ => _.path == c_path);
let c_index = c_Items.indexOf(c_info);


// "修改封面", "修改名称", "二级页面"
let options = ["更新资源", "分享分组", "编辑分组", "删除分组", "合并分组", "新增分组", "更改排序"];
let c_url = $("#noLoading#").lazyRule((options, c_path, c_title, i) => {
    options.splice(1, 0, "切换样式");
    const hikerPop = $.require("http://123.56.105.145/weisyr/js/hikerPop.js");
    require(config.preRule);
    let c_Items = getCollectionItems(false, true);
    let spen = Number(getMyVar("collection_columns", "2"));
    let inputBox;
    let pop = hikerPop.selectBottomResIcon({
        iconList: c_Items,
        columns: spen,
        title: "切换分组",
        noAutoDismiss: false,
        position: 20,
        toPosition: 20,
        position: i,
        click(a) {
            let path = a.title.split("\r\n\n\n")[1];
            setPageParams({
                path
            });
            refreshPage();
            return 'hiker://empty';
        },
        menuClick(manage) {
            hikerPop.selectCenter({
                options,
                columns: 2,
                title: "扩展操作",
                click(input) {
                    if (input == '切换样式') {
                        spen = spen == 2 ? 1 : 2;
                        putMyVar("collection_columns", spen + "");
                        manage.changeColumns(spen);
                        hikerPop.runOnNewThread(() => {
                            java.lang.Thread.sleep(120);
                            manage.scrollToPosition(20, true);
                        });
                        return "hiker://empty";
                    } else {
                        pop.dismiss();
                        return setCollectionGroup(input, c_path);
                    }
                },
            });
        }
    });
    return "hiker://empty";
}, options, c_path, c_info && c_info.title, c_index);
setPageTitle(c_info && c_info.title || "无法获取");

if (c_info === undefined) {
    d.push({
        title: Rich(Color("没有收藏数据").bold().big()),
        desc: Rich("切换分组".small()),
        url: c_url,
        col_type: 'text_center_1',
        extra: {
            lineVisible: false
        }
    });
} else {
    let c_data = _getPath(decodeURIComponent(c_path)) || {};
    c_data = c_data.musicList || [];
    d.push({
        title: c_info.title.bold(),
        desc: "共" + c_data.length + "首音乐",
        col_type: "avatar",
        img: "hiker://images/icon_menu6",
        url: c_url,
        extra: {
            longClick: options.map(title => ({
                title,
                js: $.toString((input, c_path, c_title, c_index) => {
                    require(config.preRule);
                    return setCollectionGroup(input, c_path, c_title, c_index);
                }, title, c_path)
            }))
        }
    });
    d.push({
        url: "hiker://empty",
        col_type: "line",
    });
    c_path = decodeURIComponent(c_path);


    // 分组数据
    if (c_data.length == 0) {
        d.push({
            col_type: "text_center_1",
            url: "hiker://empty",
            title: "““””" + "~~~什么都没有~~~".fontcolor("Gray")
        });
    } else {
        c_data.map((_, i) => {
            let __ = Extra(_, 0, 1);
            __.extra.longClick[1].title = "复制";
            __.extra.longClick.splice(1, 0, {
                title: "修改",
                js: $.toString((path1, i) => {
                    let path2 = "hiker://files/_cache/Thomas/gcsp1999/collection/edit.json";
                    let json = JSON.parse(readFile(path1));
                    let _ = json.musicList[i];
                    saveFile(path2, JSON.stringify(_, 0, 1));
                    return "editFile://" + path2 + "@js=" + $.toString((path, json, i) => {
                        input = "file://" + input;
                        try {
                            let _ = JSON.parse(readFile(input));
                            json.musicList[i] = _;
                            saveFile(path, JSON.stringify(json));
                            deleteFile(input);
                            clearMyVar('collectionInitialization');
                            refreshPage();
                            return 'toast://保存成功';
                        } catch (e) {
                            return 'toast://参数异常，不是标准的json';
                        }
                    }, path1, json, i);
                }, c_path, i)
            }, {
                title: "排序",
                js: $.toString((path, i) => {
                    let json = JSON.parse(readFile(path));
                    let zy = json.musicList
                    let zu = json.musicList.map((_, i) => _.title + '\r\n\n\n' + i);
                    let _ = json.musicList[i];
                    zy.splice(i, 1);
                    zu.splice(i, 1);
                    return $(zu.concat("最后面"), 2, '请选择资源位置').select((path, json, zy, zu, data) => {
                        let i;
                        if ("最后面" == input) {
                            i = zu.length;
                        } else {
                            i = zu.indexOf(input);
                        }
                        zy.splice(i, 0, data);
                        json.musicList = zy;
                        saveFile(path, JSON.stringify(json));
                        refreshPage(false);
                        return "toast://更改排序成功";
                    }, path, json, zy, zu, _);
                }, c_path, i)
            }, {
                title: "删除",
                js: $.toString((path, i, name) => {
                    return $("确定删除 " + name + " 吗？").confirm((path, i) => {
                        let zy = JSON.parse(readFile(path));
                        zy.musicList.splice(i, 1);
                        saveFile(path, JSON.stringify(zy, 0, 1));
                        refreshPage(false);
                        return "toast://歌曲删除成功";
                    }, path, i)
                }, c_path, i, _.title)
            });
            d.push(__);
        });
    }
}
setResult(d);