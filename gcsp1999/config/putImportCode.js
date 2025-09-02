let text = getParam('importCode', '');
let enTypes = getParam('encodeTypes', '').split("+");
for (let enType of enTypes) {
    switch (enType) {
        case 'parsePaste':
            text = parsePaste(text);
            break;
        case 'base64Decode':
            text = base64Decode(text);
            break;
        case 'aesDecode':
            text = aesDecode('hk6666666109', text);
            break;
        case 'KuwoDES':

            break;
        case 'rsaDecrypt':

            break;
    }
}
text = base64Decode(text);
let json = JSON.parse(text || "{}");
let type = {
    "collection": json.paths ? "收藏分组" : "收藏元素",
    "theme": json.paths ? "主题文件" : "主题元素",
    "plugin": json.paths ? "插件数据" : "用户变量",
    "proxy": json.paths ? "解析代理" : "",
} [json.type] || "未知数据";
let arr1 = [];
let arr2 = [];
if (json.paths) {
    for (let i in json.paths) {
        if (fileExist(json.paths[i])) {
            arr1.push(i);
        } else {
            arr2.push(i);
        }
    }
} else {
    // 待完善
}
let len1 = arr1.length
let len2 = arr2.length;
let len3 = json.paths ? json.paths.length : 1;



getTopImage({
    url: "hiker://empty"
});
d.push({
    title: Rich(Color("📲 云口令导入", "#3399cc").bold().big().big()),
    desc: [type, "合计" + len3, "新增" + len2, "存在" + len1].join("┃"),
    pic_url: getImageUrl("import.svg"),
    col_type: "text_center_1",
    url: "hiker://empty",
    extra: {
        lineVisible: false
    }
});
d.push({
    col_type: "big_blank_block"
});
[
    ["导入全部", "hiker://images/home_icon_bookmark_group"],
    ["导入选中", "hiker://images/home_icon_bookmark"],
    ["导入新增", "hiker://images/home_icon_add"]
].map(_ => {
    d.push({
        title: _[0],
        pic_url: _[1],
        col_type: "icon_small_3",
        url: $("#noLoading#").lazyRule((type, json, arr2, isPlugin) => {
            if (json.paths) {
                let len = 0;
                let enableds = {};
                if (isPlugin) {
                    enableds = JSON.parse(readFile(isPlugin) || '{}');
                }
                if (type == "导入全部") {
                    for (let i in json.paths) {
                        saveFile(json.paths[i], json.codes[i]);
                        if (isPlugin) {
                            enableds[json.paths[i]] = true;
                        }
                        len++;
                    }
                } else {
                    for (let i of arr2) {
                        saveFile(json.paths[i], json.codes[i]);
                        if (isPlugin) {
                            enableds[json.paths[i]] = true;
                        }
                        len++;
                    }
                }
                if (isPlugin) {
                    saveFile(isPlugin, JSON.stringify(enableds));
                }
                clearMyVar(json.type + 'Initialization');
                return back(true), "toast://导入成功, 数量: " + len;
            } else {
                type = json.type;
                if (type == "theme") { // 主题元素
                } else if (type == "plugin") { // 插件的用户变量
                } else if (type == "proxy") { // 解析待定
                } else if (type == "collection") { // 收藏元素，这个常用
                    require(config.preRule);
                    return setCollectionData(json.code, true);
                }
            }
        }, _[0], json, arr2, json.type == "plugin" && _getPath(["plugin", "enableds.json"], 0, 1))
    });
});
d.push({
    col_type: "line_blank"
})
d.push({
    col_type: "line_blank"
})
d.push({
    title: enTypes.concat("base64Decode").join(" > "),
    desc: "解密流程".small(),
    pic_url: "hiker://images/home_icon_code",
    url: "hiker://empty",
    col_type: "avatar"
});
d.push({
    col_type: "line"
});
let importPath = _getPath(["import", "_code.js"], "_cache", 1);
if (json.paths) {
    for (let i in json.paths) {
        let _code = json.codes[i];
        if (type == "主题文件" || type == "收藏分组") {
            _code = JSON.parse(_code);
            d.push({
                title: _code.title,
                desc: _code.author ? ("作者: " + _code.author) : ("类别: " + ["免费", "会员", "歌单", "榜单", "专辑", "歌手", "用户", "电台", "播客", "视频", "歌词", "评论"][_code.type]),
                pic_url: _code.icon,
                col_type: "avatar",
                url: "hiker://empty"
            });
            d.push({
                title: "ID: " + (_code.platform ? _code.platform + "_" : "") + _code.id,
                url: "hiker://empty",
                col_type: 'text_icon',
                pic_url: getImageUrl(arr2.indexOf(i) != -1 ? "open.svg" : "shut.svg"),
                extra: {
                    lineVisible: false
                }
            });
            d.push({
                col_type: 'line'
            });
        } else if (type == "插件数据" || type == "解析代理") {
            saveFile(importPath, _code);
            _code = $.require(importPath);
            d.push({
                title: _code.title,
                desc: "作者: " + _code.author,
                pic_url: _code.icon,
                col_type: "avatar",
                url: "hiker://empty"
            });
            d.push({
                title: [
                    "标识: " + _code.platform,
                    "类别: " + _code.type,
                    "版本: " + _code.version
                ].join("┃"),
                url: "hiker://empty",
                col_type: 'text_icon',
                pic_url: getImageUrl(arr2.indexOf(i) != -1 ? "open.svg" : "shut.svg"),
                extra: {
                    lineVisible: false
                }
            });
            d.push({
                col_type: 'line'
            });
        }
    }
    // clearMyVar(json.type + 'Initialization');
} else {
    // return setCollectionData(json.code);
}