const hikerPop = $.require("http://123.56.105.145/weisyr/js/hikerPop.js");
let SettingItem = hikerPop.selectBottomSettingMenu.SettingItem;
let QualityNames = ["标准音质", "高品音质", "无损音质", "高品无损"];
let MediaPreNames = ["软件默认", "强制模式", "无需加载"];
let MediaPreIndex = {
    "": 0,
    "#pre#": 1,
    "#noPre#": 2
} [getItem('MediaPre', '')] || 0;
let pageHomeTypes = ["软件原生", "全屏扩展", "沉浸体验", "游戏模式"];
let pageHomeIndex = {
    "": 0,
    "#fullTheme#": 1,
    "#immersiveTheme#": 2,
    "#gameTheme#": 3
} [getItem('pageHomeType', '#immersiveTheme#')] || 0;
let s_types = [
    "单曲", "歌单", "专辑", "歌手",
    "视频", "歌词", "电台", "播客",
];
let s_type = getItem('s_type', '单曲');
hikerPop.selectBottomSettingMenu({
    options: [
        SettingItem("默认播放音质", QualityNames[getItem('QualityIndex', '0')]),
        SettingItem("音质获取失败", getItem('QualityFailure', "向下兼容")),
        SettingItem("预加载预解析", MediaPreNames[MediaPreIndex]),
        SettingItem(),
        SettingItem("音频直链缓存", getItem('MediaCache', '1') == "1"),
        SettingItem("播放进度记忆", getItem('memoryPosition', '') == ""),
        SettingItem("获取链接信息", getItem('checkMetadata', '') == ""),
        SettingItem("强制识别音频", getItem('mediaIsMusic', '') != ""),
        SettingItem("显示弹幕歌词", getItem('danmuLrc', '0') == "1"),
        SettingItem(),

        SettingItem("图标下载状态", readDir(_getPath(["image"], 0, 1)).length == 23 ? true : "文件不全"),
        SettingItem("依赖代理接口", getItem("ghproxy", "") || "hiker://empty"),
        SettingItem("页面标识设置", pageHomeTypes[pageHomeIndex]),
        SettingItem("默认搜索类型", "搜索" + s_type),
    ],
    click(s, officeItem, change) {
        let isTrue;
        switch (s) {
            case '默认播放音质':
                hikerPop.selectCenterIcon({
                    iconList: QualityNames.map(title => ({
                        icon: "hiker://images/rule_type_audio",
                        title: title
                    })),
                    title: s,
                    columns: 1,
                    position: getItem('QualityIndex', '0'),
                    click(a, i) {
                        setItem('QualityIndex', i + "");
                        officeItem.setDesc(a);
                        change();
                    }
                });
                break;
            case '音质获取失败':
                let newDesc = officeItem.getDesc() == "向下兼容" ? "向上兼容" : "向下兼容";
                setItem('QualityFailure', newDesc);
                officeItem.setDesc(newDesc);
                change();
                break;
            case '预加载预解析':
                hikerPop.selectCenterIcon({
                    iconList: MediaPreNames.map(title => ({
                        icon: "hiker://images/rule_type_tool",
                        title: title
                    })),
                    title: s,
                    columns: 1,
                    position: {
                        "": 0,
                        "#pre#": 1,
                        "#noPre#": 2
                    } [getItem('MediaPre', '')] || 0,
                    click(a, i) {
                        setItem('MediaPre', ["", "#pre#", "#noPre#"][i]);
                        officeItem.setDesc(a);
                        change();
                    }
                });
                break;

            case "音频直链缓存":
                isTrue = officeItem.getSelected() === 1;
                setItem('MediaCache', isTrue ? "0" : "1");
                officeItem.setSelected(isTrue ? -1 : 1);
                change();
                break;
            case "播放进度记忆":
                isTrue = officeItem.getSelected() === 1;
                setItem('memoryPosition', isTrue ? "memoryPosition=null" : "");
                officeItem.setSelected(isTrue ? -1 : 1);
                change();
                break;
            case "获取链接信息":
                isTrue = officeItem.getSelected() === 1;
                setItem('checkMetadata', isTrue ? "#checkMetadata=true#" : "");
                officeItem.setSelected(isTrue ? -1 : 1);
                change();
                break;
            case "强制识别音频":
                isTrue = officeItem.getSelected() === 1;
                setItem('mediaIsMusic', isTrue ? "" : "#isMusic=true#");
                officeItem.setSelected(isTrue ? -1 : 1);
                change();
                break;
            case "显示弹幕歌词":
                isTrue = officeItem.getSelected() === 1;
                setItem('danmuLrc', isTrue ? "0" : "1");
                officeItem.setSelected(isTrue ? -1 : 1);
                change();
                break;

            case "图标下载状态":
                if (officeItem.getDesc() == "文件不全") {
                    let imageNames = ["open.svg", "icon.png", "down.png", "shut.svg", "Loading.gif", "2.png", "1.png", "3.png", "topImg.png", "play.png", "jump.png", "update.svg", "edit.svg", "share.svg", "proxy.svg", "uninstall.svg", "account.svg", "import.svg", "hijack.svg", "unhijack.svg", "selected.svg", "unselected.svg", "sorted.svg"];
                    let imagePath2 = _getPath(["image", ""], 0, 1);
                    let imagePath1 = getGitHub(["image", ""]);
                    for (let imageName of imageNames) {
                        // saveImage('http://x.com/1.png||http://x.com/2.png', 'hiker://files/1.png')
                        showLoading('加载图标: ' + imageName)
                        downloadFile(imagePath1 + imageName, imagePath2 + imageName);
                    }
                    hideLoading();
                    officeItem.setSelected(1);
                    officeItem.setDesc("");
                    change();
                    return "toast://图标初始化成功";
                } else {
                    return "toast://图标已下载~";
                }
                break;
            case "依赖代理接口":
                hikerPop.inputAutoRow({
                    hint: "github代理链接",
                    title: s,
                    defaultValue: getItem("ghproxy", ""),
                    //hideCancel: true,
                    noAutoSoft: true, //不自动打开输入法
                    confirm(text) {
                        text = String(text).trim();
                        setItem('ghproxy', text);
                        config.ghproxy = 0;
                        eval(MY_RULE.preRule);
                        officeItem.setDesc(text || "hiker://empty");
                        change();
                        return "toast://设置成功\n" + config.ghproxy;
                    },
                    cancel() {
                        return "toast://取消";
                    }
                });
                break;
            case '页面标识设置':
                hikerPop.selectCenterIcon({
                    iconList: pageHomeTypes.map(title => ({
                        icon: "hiker://images/rule_type_read",
                        title: title
                    })),
                    title: s,
                    columns: 1,
                    position: {
                        "": 0,
                        "#fullTheme#": 1,
                        "#immersiveTheme#": 2,
                        "#gameTheme#": 3
                    } [getItem('pageHomeType', '#immersiveTheme#')] || 0,
                    click(a, i) {
                        let b = ["", "#fullTheme#", "#immersiveTheme#", "#gameTheme#"][i];
                        setItem('pageHomeType', b);
                        officeItem.setDesc(a);
                        change();
                    }
                });
                break;
            case '默认搜索类型':
                hikerPop.selectCenterIcon({
                    iconList: s_types.map(title => ({
                        icon: "hiker://images/rule_type_comics",
                        title: title
                    })),
                    title: s,
                    columns: 1,
                    position: s_types.indexOf(getItem('s_type', '单曲')),
                    click(a, i) {
                        setItem('s_type', a);
                        officeItem.setDesc("搜索" + a);
                        change();
                    }
                });
                break;
        }
        change();
    },
    onDismiss() {
        refreshPage();
    }
});