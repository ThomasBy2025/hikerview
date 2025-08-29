js:
getTopImage({
    url: "hiker://empty"
});
d.push({
    title: '新增解析',
    col_type: 'text_2',
    url: "toast://完善中"
});
d.push({
    title: '分享选中',
    col_type: 'text_2',
    url: "toast://完善中"
});
d.push({
    col_type: 'line'
});


// 对应的解析列表
let jx_platform = getParam("platform", "");
let jx_list = _getPath(_getPath(["proxy", jx_platform, "details.json"], "_cache", 1)) || [];



// 确定使用的解析
let enableds = _getPath(["proxy", jx_platform, "open.json"]) || {};



// 准备分享的解析
let selectp = _getPath(["proxy", "selects.json"], "_cache", 1);
let selects = JSON.parse(readFile(selectp) || "[]") || [];



if (jx_list.length == 0) {
    d.push({
        title: Rich(Color("没有解析数据").bold().big()),
        desc: Rich("去导入".small()),
        url: 'hiker://empty',
        col_type: 'text_center_1',
        extra: {
            lineVisible: false
        }
    });
} else {
    jx_list.map((_, i) => {
        let _id = _.path;
        let isS = selects.indexOf(_id) != -1;
        let qualitys = _.supportedQualityType;
        let desc1 = ["low", "standard", "high", "super"].map(quality => qualitys.includes(quality) ? '★' : '☆').join("");
        d.push({
            title: (isS ? Color(_.title) : _.title).bold() + ("(" + _.version + ")").small().small(),
            desc: Color(desc1, "#2E5D8E"),
            pic_url: _.icon,
            col_type: 'avatar',
            url: $("#noLoading#").lazyRule((_, i, _id, sObj) => {
                require(config.preRule);
                const hikerPop = $.require("http://123.56.105.145/weisyr/js/hikerPop.js");
                hikerPop.selectCenterIcon({
                    iconList: [{
                        title: "分享解析",
                        icon: getImageUrl("share.svg")
                    }, {
                        title: "编辑解析",
                        icon: getImageUrl("edit.svg")
                    }, {
                        title: "删除解析",
                        icon: getImageUrl("uninstall.svg")
                    }, {
                        title: "位置排序",
                        icon: getImageUrl("sorted.svg")
                    }, sObj, {
                        title: "测试解析",
                        icon: getImageUrl("hijack.svg")
                    }],
                    title: _.title + "(" + _.version + ")",
                    extraMenu: new hikerPop.IconExtraMenu(() => {
                        if (Array.isArray(_.desc) && _.desc.length)
                            hikerPop.updateRecordsBottom(_.desc);
                        else
                            return "toast://没有简介";
                    }),
                    columns: 2,
                    // position: 0,
                    click(a) {
                        switch (a) {
                            case '编辑解析':
                                return "editFile://" + _.path;
                                break;
                            case '分享解析':
                                return getShareText([_.path], "proxy");
                                break;
                            case '删除解析':
                                refreshPage(false);
                                return "hiker://empty";
                                break;
                            case '测试解析':
                                return "toast://完善中";
                                break;
                            case '选中解析':
                            case '取消选中':
                                let selectp = _getPath(["proxy", "selects.json"], "_cache", 1);
                                let selects = JSON.parse(readFile(selectp) || "[]") || [];
                                let selecti = selects.indexOf(_id);
                                if (selecti == -1) {
                                    selects.push(_id);
                                } else {
                                    selects.splice(selecti, 1);
                                }
                                saveFile(selectp, JSON.stringify(selects));
                                refreshPage(false);
                                return "hiker://empty";
                                break;
                            case '位置排序':
                                let detailp = _getPath(["proxy", _.platform, "details.json"], "_cache", 1);
                                let details = JSON.parse(readFile(detailp) || "[]") || [];
                                details.splice(i, 1);
                                return $(details.concat({
                                    title: '最后面'
                                }), 2, '解析移动到').select((set, list, i1, set2) => {
                                    let i2
                                    if (input == '最后面') {
                                        i2 = list.length;
                                    } else {
                                        i2 = list.map(_ => _.title).indexOf(input);
                                    }
                                    let data = JSON.parse(readFile(set) || "[]") || [];
                                    let i3 = data[i1];
                                    data.splice(i1, 1);
                                    data.splice(i2, 0, i3);
                                    saveFile(set, JSON.stringify(data, 0, 1));
                                    let data2 = data.map(_ => base64Encode(_.url) + ".js");
                                    saveFile(set2, JSON.stringify(data2));
                                    refreshPage();
                                    return "toast://更改成功";
                                }, detailp, details, i, _getPath(["proxy", _.platform, "sort.json"], 0, 1));
                                return "hiker://empty";
                                break;
                        }
                        return "hiker://empty";
                    }
                });
                return "hiker://empty";
            }, _, i, _id, isS ? {
                title: "取消选中",
                icon: getImageUrl("unselected.svg")
            } : {
                title: "选中解析",
                icon: getImageUrl("selected.svg")
            })
        });
        d.push({
            title: [_.platform, _.type, _.url].join("┃"),
            url: $('#noLoading#').lazyRule((jx_platform, _id) => {
                require(config.preRule);
                let enableds = _getPath(["proxy", jx_platform, "open.json"]) || {};
                enableds[_id] = !enableds[_id];
                saveFile(_getPath(["proxy", jx_platform, "open.json"], 0, 1), JSON.stringify(enableds));
                refreshPage(false);
                return 'hiker://empty';
            }, jx_platform, _id),
            col_type: 'text_icon',
            img: getImageUrl(enableds[_id] ? "open.svg" : "shut.svg"),
            extra: {
                lineVisible: false
            }
        });
        d.push({
            col_type: 'line'
        });
    });
}
setResult(d);