let t_index = getParam('t_index', '');
let _myVarKeys = [
    "t1_type",
    "t1_title",
    "t1_author",
    "t1_icon",
    "t1_id",
    "t1_plugins",
    "t2_open",
    "t2_page",
    "t2_length",
    "t2_name",
    "t2_type",
    "t2_data"
];
addListener('onClose', $.toString((list, path, isNew) => {
    for (let key of list) clearMyVar(key);
}, _myVarKeys));
getTopImage({
    url: "hiker://empty"
});




if (t_index === "") {

    let isData = getMyVar('t1_type', "数据");
    ["数据", "基本"].map(t => {
        d.push({
            title: Rich(Color(t, isData != t && "#3399cc").bold()),
            url: $('#noLoading#').lazyRule((t) => {
                putMyVar('t1_type', t);
                refreshPage();
                return 'hiker://empty';
            }, t),
            col_type: "text_2"
        });
    });
    d.push({
        col_type: "line"
    });

    if (isData == "基本") {
        let _myVarMaps = {
            "t1_title": "标题",
            "t1_author": "作者",
            "t1_icon": "图标",
        };
        _myVarKeys.slice(1, 4).map(key => {
            let value = getMyVar(key, theme_Info[key.replace("t1_", "")] || "");
            d.push({
                title: value,
                desc: _myVarMaps[key],
                url: $("#noLoading#").lazyRule((title, key, value) => {
                    const hikerPop = $.require("http://123.56.105.145/weisyr/js/hikerPop.js");
                    let pop = hikerPop.inputAutoRow({
                        hint: "不建议留空",
                        title: title,
                        defaultValue: value || "",
                        //hideCancel: true,
                        noAutoSoft: false, //不自动打开输入法
                        confirm(text) {
                            putMyVar(key, text);
                            refreshPage();
                            return "hiker://empty";
                        },
                        cancel() {
                            return "hiker://empty";
                        }
                    });
                    return "hiker://empty";
                }, _myVarMaps[key], key, value),
                col_type: 'text_1'
            });
        });
        let value = getMyVar("t1_plugins", "");
        if (value == "") {
            value = theme_Info.plugins || [];
            value = value.map(_ => _.platform).join(",");
        }
        value = value.replaceAll("NO PLUGINS", "");
        d.push({
            title: value,
            desc: "依赖",
            url: $("#noLoading#").lazyRule((value, path) => {
                const hikerPop = $.require("http://123.56.105.145/weisyr/js/hikerPop.js");
                let fruit = JSON.parse(readFile(path) || "[]").map(_ => _.platform);
                let checkedName = [];
                hikerPop.multiChoice({
                    title: "获取主题时需要加载的插件",
                    options: fruit,
                    checkedIndexs: value.split(",").map(val => fruit.indexOf(val)),
                    onChoice(i, isChecked) {
                        // log(i + ":" + isChecked);
                    },
                    rightTitle: "确认",
                    rightClick(options, checked, setItemChecked, dismiss) {
                        value = options.filter((v, i) => checked[i]).join(",");
                        putMyVar("t1_plugins", value || "NO PLUGINS");
                        refreshPage();
                        dismiss();
                    },
                    leftTitle: "全选",
                    leftClick(options, checked, setItemChecked) {
                        setItemChecked(fruit.map((v, i) => i));
                    },
                    centerTitle: "取消全部",
                    centerClick(options, checked, setItemChecked) {
                        setItemChecked([]);
                    },
                    noAutoDismiss: true
                });
                return "hiker://empty";
            }, value, _getPath(["plugin", "details.json"], "_cache", 1)),
            col_type: 'text_1'
        });
        d.push({
            col_type: 'line_blank'
        });
        d.push({
            title: "保存并退出",
            url: $('#noLoading#').lazyRule((path, id) => {
                let _ = JSON.parse(readFile(path) || "{}");
                let __ = {
                    title: getMyVar('t1_title', _.title) || "",
                    author: getMyVar('t1_author', _.author) || "",
                    icon: getMyVar('t1_icon', _.icon) || "",
                    plugins: String(getMyVar('t1_plugins', (_.plugins || []).map(_ => _.platform).join(","))).split(",").map(platform => {
                        return {
                            platform: platform
                        }
                    }) || [],
                    data: _.data || []
                }
                if (id == "NEW_THEME") {
                    deleteFile(path);
                    id = md5(id + new Date().getTime());
                    path = path.replace("NEW_THEME", id + ".json");
                }
                __.id = id;
                saveFile(path, JSON.stringify(__).replace(/\[{"platform":"(NO PLUGINS)?"},?/g, "["));
                clearMyVar("themeInitialization");
                return back(true), "hiker://empty";
            }, _getPath(["theme", themeType2, "themes", theme_Id], 0, 1), theme_Id),
            col_type: 'text_center_1',
            extra: {
                lineVisible: false
            }
        });
    } else {
        let path = _getPath(["theme", themeType2, "themes", theme_Id], 0, 1);
        let data = (_getPath(path) || {}).data || [];

        if (data.length == 0) {
            d.push({
                title: "主题元素不存在~",
                desc: "新建元素/删除主题",
                url: "hiker://empty",
                col_type: "text_center_1"
            });
        } else data.map((_, i) => {
            d.push({
                title: (_.open ? "☑︎" : "☒") + " " + _.name,
                desc: "翻页: " + (_.page ? "☒" : "☑︎") + "　数量: " + (_.length || 1) + "　样式: " + _.type,
                url: $(["移动", "编辑", (_.open ? '禁用' : '启用'), "删除", "预览"], 1, '选择扩展操作').select((path, i, EditUrl) => {
                    if (input == "编辑") return EditUrl + "#noHistory##noRecordHistory#";
                    if (input == "预览") return EditUrl.replace("=themeEdit", "=executeThemeIndex").replace("&s=#immersiveTheme#", "&s=#noHistory##noRecordHistory#");
                    let data = JSON.parse(readFile(path) || "{}");
                    let list = data.data || [];
                    let _ = list[i];
                    switch (input) {
                        case '删除':
                            return $("确定删除元素 " + _.name + " 吗？\n此操作不可逆，请谨慎选择。").confirm((path, data, list, i) => {
                                list.splice(i, 1);
                                data.data = list;
                                saveFile(path, JSON.stringify(data, 0, 2));
                                refreshPage(false);
                                return "hiker://empty";
                            }, path, data, list, i);
                            break;
                        case '移动':
                            list.splice(i, 1);
                            let zu = list.map((_, i) => _.name + '\n\n' + i);
                            return $(zu.concat("最后面"), 2, '请选择资源位置').select((path, data, list, _, zu) => {
                                if ("最后面" == input) {
                                    list.push(_)
                                } else {
                                    let i = zu.indexOf(input);
                                    list.splice(i, 0, _);
                                }
                                data.data = list;
                                saveFile(path, JSON.stringify(data, 0, 2));
                                refreshPage(false);
                                return "hiker://empty";
                            }, path, data, list, _, zu);
                            break;
                        case '启用':
                        case '禁用':
                            _.open = !_.open;
                            list[i] = _;
                            data.data = list;
                            saveFile(path, JSON.stringify(data, 0, 2));
                            refreshPage(false);
                            return "hiker://empty";
                            break;
                    }
                }, path, i, MY_URL + "&t_index=" + i),
                col_type: 'text_1',
                extra: {
                    pageTitle: "元素设置"
                }
            });
        });



        d.push({
            col_type: 'line_blank'
        });
        d.push({
            title: "添加元素",
            url: MY_URL + "&t_index=" + data.length + "#noHistory##noRecordHistory#",
            col_type: 'text_center_1',
            extra: {
                pageTitle: "元素设置",
                lineVisible: false
            }
        });
    }
} else {
    let t2_item = ((_getPath(["theme", themeType2, "themes", theme_Id]) || {}).data || [])[t_index] || {};
    let t2_path = _getPath(["theme", themeType2, "themes", theme_Id], 0, 1);
    let t2_page = getMyVar('t2_page', t2_item.page ? "1" : "0") == "1";
    let t2_open = getMyVar('t2_open', t2_item.open ? "1" : "0") == "1";
    let t2_length = getMyVar('t2_length', t2_item.length || "1");
    let t2_name = getMyVar('t2_name', t2_item.name) || "";
    let t2_type = getMyVar('t2_type', t2_item.type) || "";
    let t2_data = getMyVar('t2_data', t2_item.data) || "";





    d.push({
        title: "只在一页执行",
        url: $('#noLoading#').lazyRule((yn) => {
            putMyVar("t2_page", yn);
            refreshPage();
            return 'hiker://empty';
        }, t2_page ? "0" : "1"),
        img: "http://123.56.105.145/tubiao/messy/" + (t2_page ? 55 : 63) + ".svg",
        col_type: 'text_icon'
    });
    d.push({
        title: "启用主题元素",
        url: $('#noLoading#').lazyRule((yn) => {
            putMyVar("t2_open", yn);
            refreshPage();
            return 'hiker://empty';
        }, t2_open ? "0" : "1"),
        img: "http://123.56.105.145/tubiao/messy/" + (t2_open ? 55 : 63) + ".svg",
        col_type: 'text_icon'
    });
    d.push({
        title: "获取元素数量",
        url: $('#noLoading#').lazyRule((yn, getSvg) => {
            let list = [1, 2, 3, 4, 5, 6, 7, 8];
            return $(list.map(title => {
                return {
                    title: title,
                    icon: getSvg(title)
                };
            }), 2, '当前元素数量', yn - 1).select(() => {
                putMyVar("t2_length", input);
                refreshPage();
                return 'hiker://empty';
            });
        }, t2_length, getLenSvg),
        img: getLenSvg(t2_length),
        col_type: 'text_icon'
    });
    d.push({
        col_type: 'line_blank'
    });
    d.push({
        title: t2_name,
        desc: "title",
        url: $("#noLoading#").lazyRule((t) => {
            const hikerPop = $.require("http://123.56.105.145/weisyr/js/hikerPop.js");
            let pop = hikerPop.inputAutoRow({
                hint: "不建议留空",
                title: "元素名称",
                defaultValue: t || "",
                //hideCancel: true,
                noAutoSoft: false, //不自动打开输入法
                confirm(text) {
                    if (t == "最后面") return 'toast://名称不能是"最后面"';
                    putMyVar("t2_name", text);
                    refreshPage();
                    return "hiker://empty";
                },
                cancel() {
                    return "hiker://empty";
                }
            });
            return "hiker://empty";
        }, t2_name),
        col_type: 'text_1'
    });
    d.push({
        title: t2_type,
        desc: "col_type",
        url: $("#noLoading#").lazyRule(() => {
            const hikerPop = $.require("http://123.56.105.145/weisyr/js/hikerPop.js");
            let pop = hikerPop.selectBottom({
                title: "请选择显示样式",
                options: getColTypes(),
                columns: 2,
                height: 0.6, //0-1
                position: 1,
                click(a) {
                    putMyVar("t2_type", a);
                    refreshPage();
                    return "hiker://empty";
                },
                longClick(a) {
                    putMyVar("t2_type", a);
                    refreshPage();
                    return "hiker://empty";
                }
            });
            return "hiker://empty";
        }),
        col_type: 'text_1'
    });
    d.push({
        desc: "说明待完善",
        col_type: 'input',
        extra: {
            highlight: true,
            type: "textarea",
            height: 7,
            defaultValue: t2_data,
            onChange: $.toString(() => {
                putMyVar("t2_data", input.trim());
            })
        }
    });



    d.push({
        col_type: 'line_blank'
    });
    d.push({
        title: "复原",
        url: $("确定恢复元素为编辑前吗？\n此操作不可逆，请谨慎选择。").confirm((_) => {
            _.page = _.page ? "1" : "0";
            _.open = _.open ? "1" : "0";
            for (let key in _) {
                putMyVar("t2_" + key, _[key]);
            }
            refreshPage();
            return "hiker://empty";
        }, t2_item),
        col_type: 'text_3'
    });










    let arr = [];
    switch (themeType2) {
        case '首页':
            arr.push(
                '#主题切换#',
                '#插件管理#',
                '#程序设置#',

                '#推荐歌单#',
                '#排行榜单#',
                '#歌手列表#',

                '#搜索框#',
                '#高级搜索#',
                '#收藏列表#',
                '#资源导入#',
                '#播放下载#',
            );
            break;
        case '推荐':
            arr.push(
                '#主题切换#',
                '#切换接口_聚合#',
                '#切换接口_独立#',

                '#主要分类_聚合#',
                '#主要分类_独立#',
                '#主要分类_列表#',
                '#主要分类_标题#',

                '#次要分类_聚合#',
                '#次要分类_独立#',
                '#次要分类_列表#',
                '#次要分类_标题#',

                "#获取数据#",
            );
            break;

        case '歌单':
            arr.push(
                '#主题切换#',
                '#置顶标题#',
                '#页面简介#',
                '#播放下载#',
                '#收藏列表#',

                "#获取数据#",
            );
            break;
        default:
            break;
    }
    arr.push("#分割#", "温馨提示", "我的收藏", "历史浏览", "Media")

    d.push({
        title: "模板",
        url: $(arr, 2, '选择扩展操作').select(() => {
            let type, data, open = "1",
                page = "1";
            if (input.match(/^\#.*\#$/)) {
                data = `getColType({
    type: '${input}',
    // title: '$name',
    col_type: '$type',
    length: '$length'
});`;
                type = {
                    '#分割#': "line_blank",
                    '#搜索框#': 'input',
                    '#主题切换#': 'avatar',
                    '#置顶标题#': "movie_1_vertical_pic_blur",
                    '#页面简介#': "rich_text",
                } [input];
            }
            switch (input) {
                case '#插件管理#':
                case '#程序设置#':
                case '#推荐歌单#':
                case '#排行榜单#':
                case '#歌手列表#':
                case '#收藏列表#':
                case '#资源导入#':
                    type = "icon_5";
                    break
                case '#高级搜索#':
                case '#切换接口_独立#':
                case '#主要分类_独立#':
                case '#次要分类_独立#':
                case '#主要分类_列表#':
                case '#次要分类_列表#':
                    type = "scroll_button";
                    break;
                case '#播放下载#':
                case '#切换接口_聚合#':
                case '#主要分类_聚合#':
                case '#次要分类_聚合#':
                    type = "icon_small_3";
                    break;
                case '#主要分类_标题#':
                    type = "text_center_1";
                    data = `getColType({
    title: GroupTitle,
    url: 'hiker://empty',
    col_type: '$type',
    length: '$length',
    extra: {"lineVisible":false}
});`;
                    break;
                case '#次要分类_标题#':
                    type = "text_center_1";
                    data = `getColType({
    title: SortTitle,
    url: 'hiker://empty',
    col_type: '$type',
    length: '$length',
    extra: {"lineVisible":false}
});`;
                    break;
                case "温馨提示":
                    type = "text_center_1";
                    data = `d.push({
    title: "““””" + getHourHint(new Date().getHours()).fontcolor("Gray").small(),
    url: "hiker://empty",
    col_type: "$type",
    extra: {
        lineVisible: true
    }
});`;
                    break;
                case "Media":
                    type = "scroll_button";
                    data = "d.push({\n    title: 'Media',\n    url: 'hiker://localMedia',\n    img: 'hiker://images/home_download',\n    col_type: '$type'\n});";
                    break
                case "我的收藏":
                    type = "scroll_button";
                    data = "d.push({\n    title: '我的收藏',\n    url: 'hiker://collection?rule=歌词适配',\n    img: 'hiker://images/icon1',\n    col_type: '$type'\n});";
                    break;
                case "历史浏览":
                    type = "scroll_button";
                    data = "d.push({\n    title: '历史记录',\n    url: 'hiker://history?rule=歌词适配',\n    img: 'hiker://images/icon3',\n    col_type: '$type'\n});";
                    break;

                case '#分类数据#':
                case '#页面数据#':
                case '#获取数据#':
                    page = "0";
                    type = "card_pic_3";
                    break;
            }
            let _ = {
                page,
                open,
                name: input.replace(/\#/g, ""),
                type,
                data
            }
            for (let key in _) {
                putMyVar("t2_" + key, _[key]);
            }
            refreshPage();
            return "hiker://empty";
        }),
        col_type: 'text_3'
    });
    d.push({
        title: "保存",
        url: $('#noLoading#').lazyRule((p, i) => {
            let data = JSON.parse(readFile(p) || "{}");
            let list = data.data || [];
            let _ = list[i] || {};
            list[i] = {
                page: getMyVar('t2_page', _.page ? "1" : "0") == "1",
                open: getMyVar('t2_open', _.open ? "1" : "0") == "1",
                length: getMyVar('t2_length', _.length) || "1",
                name: getMyVar('t2_name', _.name) || "",
                type: getMyVar('t2_type', _.type) || "",
                data: getMyVar('t2_data', _.data) || ""
            }
            data.data = list;
            saveFile(p, JSON.stringify(data, 0, 2));
            return back(true), "hiker://empty";
        }, t2_path, t_index),
        col_type: 'text_3'
    });
}