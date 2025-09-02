getTopImage({
    url: "hiker://empty"
});
d.push(getDownData());
d.push({
    title: "导入歌单".bold(),
    col_type: "icon_small_3",
    img: "http://123.56.105.145/tubiao/unframed/459.png",
    url: "fileSelect://" + $.toString(() => {
        if (!input) return "toast://没有地址";
        path = "hiker://files/rules/Thomas/gcsp1999/collection/";
        _ = $.require("GZIP").unzip("file://" + input),
            _ = JSON.parse(_.replace(/("source"\:")tx"/gi, '$1qq"'));
        if (_.type == "playListPart_v2")
            _.data = [_.data];
        let l1 = JSON.parse(readFile(path + "details.json"));
        let l2 = l1.map(_ => _.source + _.sourceListId);
        let l3 = _.data.map(_ => {
            let __ = {
                name: _.name,
                source: _.source || _.id.split("_")[0],
                sourceListId: _.sourceListId || _.id.split("_")[1],
                locationUpdateTime: _.locationUpdateTime || new Date().getTime(),
                picUrl: _.picUrl || "https://docs.lxmusic.top/logo.svg",
                content: "2",
                // author: _.author || "佚名",
                // desc: _.desc || "值得分享的歌曲",
                // tags: _.tags || "好听"
            };
            if (__.source == "kg" || __.source == "kw") {
                let sourceListId = __.sourceListId.replace(/^(id|digest\-8_)_(\d+)$/i, "$2");
                if (__.source == "kg" && sourceListId.match(/https?\:\/\//i)) {
                    let ListIdmatch = sourceListId.match(/(\/special\/single\/|share_type=special&id=|global_specialid=|\/songlist\/|global_collection_id=)([^\.\&\/\?]+)/i);
                    sourceListId = ListIdmatch && ListIdmatch[2] || sourceListId;
                }
                __.sourceListId = sourceListId;
            };
            let i1 = l2.indexOf(__.source + __.sourceListId);
            if (i1 != -1) {
                l1.splice(i1, 1);
                l2.splice(i1, 1);
            }
            let list = _.list.map(_ => {
                let meta = _.meta;
                delete _.id;
                delete _.meta;
                delete meta._qualitys;
                meta.qualitys = meta.qualitys.filter(_ => /^(128k|320k|flac|flac24bit)$/i.test(_.type));
                if (_.interval.length == 5) {
                    _.interval = "00:" + _.interval;
                }
                return Object.assign(_, meta);
            });
            saveFile(
                path + __.source + '_' + __.sourceListId + ".json",
                JSON.stringify(list, 0, 1)
            );
            return __;
        });
        saveFile(
            path + "details.json",
            JSON.stringify(l1.concat(l3), 0, 1)
        );
        refreshPage();
        return "toast://导入成功";
    })
});
d.push({
    title: "样式切换".bold(),
    url: $("#noLoading#").lazyRule((id) => {
        const hikerPop = $.require("http://123.56.105.145/weisyr/js/hikerPop.js");

        function up(a) {
            let list = findItemsByCls(id + ':addlist') || [];
            for (let it of list) {
                updateItem(it.extra.id, {
                    col_type: a
                });
            }
            return "hiker://empty";
        }
        let pop = hikerPop.selectBottom({
            title: "请选择显示样式",
            options: getColTypes(),
            columns: 2,
            height: 0.6, //0-1
            position: 1,
            click(a) {
                return up(a)
            },
            longClick(a) {
                return up(a)
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

c_path = decodeURIComponent(c_path);
let c_data = _getPath(c_path) || {};
c_data = c_data.musicList || [];



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
            let path = a.title.split("\r\n")[1];
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
                        return setCollectionGroup(input, c_path, c_title);
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
    d.push({
        title: c_info.title.bold(),
        desc: "共" + c_data.length + "首音乐",
        col_type: "avatar",
        img: "hiker://images/icon_menu6",
        url: c_url,
        extra: {
            longClick: options.map(title => ({
                title,
                js: $.toString((input, c_path, c_title) => {
                    require(config.preRule);
                    return setCollectionGroup(input, c_path, c_title);
                }, title, c_path, c_info.title)
            }))
        }
    });
    d.push({
        url: "hiker://empty",
        col_type: "line",
    });



    // 分组数据
    if (c_data.length == 0) {
        d.push({
            col_type: "text_center_1",
            url: "hiker://empty",
            title: "““””" + "~~~什么都没有~~~".fontcolor("Gray")
        });
    } else {
        c_data.map((_, i) => {
            let __ = Extra(_, {
                title: Rich("$title" + ("　-　$artist").small().small().sub()),
                desc: "📼 $duration\n📀 $album",
                col_type: "text_1"
            }, 1);
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