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
                let danmuModes = ["置顶居中", "顺序滚动", "逆向滚动", "高级弹幕", "置底居中"];
                hikerPop.selectBottomSettingMenu({
                    options: [
                        SettingItem("启用状态", getItem('danmuLrc', '0') == "1", "显示弹幕"),
                        SettingItem("排版样式", danmuModes[getItem('danmuMode', '1')]),
                        SettingItem("弹幕颜色", "随机获取"),
                        SettingItem("字号大小", getItem("danmuSize", "10")),
                        SettingItem("高级设置", "完善中~"),
                        SettingItem()
                    ],
                    click(s2, officeItem2, change2) {
                        let isTrue2;
                        switch (s2) {
                            case "启用状态":
                                isTrue2 = officeItem2.getSelected() === 1;
                                setItem('danmuLrc', isTrue2 ? "0" : "1");
                                officeItem2.setSelected(isTrue2 ? -1 : 1);
                                change2();
                                break;
                            case "字号大小":
                                hikerPop.seekCenter({
                                    title: "设置弹幕字号",
                                    max: 90,
                                    pos: officeItem2.getDesc() - 10,
                                    onChange(pos, max, fromHtml) {
                                        return fromHtml("当前字号：" + String(pos + 10).fontcolor("red"));
                                    },
                                    rightClick(pos, max) {
                                        let trueRes = String(pos + 10);
                                        setItem("danmuSize", trueRes);
                                        officeItem2.setDesc(trueRes);
                                        change2();
                                    },
                                    centerTitle: "取消",
                                });
                                break;
                            case "排版样式":
                                hikerPop.selectCenterIcon({
                                    iconList: danmuModes.map(title => ({
                                        icon: "hiker://images/rule_type_news",
                                        title: title
                                    })),
                                    title: s2,
                                    columns: 1,
                                    position: getItem('danmuMode', '1'),
                                    click(a, i) {
                                        setItem('danmuMode', i + "");
                                        officeItem2.setDesc(a);
                                        change2();
                                    }
                                });
                                break;
                        }
                    },
                    onDismiss() {
                        officeItem.setSelected(getItem('danmuLrc', "0") == "1" ? 1 : -1);
                        change();
                    }
                });
                break;
            case "图标下载状态":
                if (officeItem.getDesc() == "文件不全") {
                    officeItem.setSelected(1);
                    officeItem.setDesc("");
                    change();
                    hikerPop.runOnNewThread(() => {
                        let imageNames = ["open.svg", "icon.png", "down.png", "shut.svg", "Loading.gif", "2.png", "1.png", "3.png", "topImg.png", "play.png", "jump.png", "update.svg", "edit.svg", "share.svg", "proxy.svg", "uninstall.svg", "account.svg", "import.svg", "hijack.svg", "unhijack.svg", "selected.svg", "unselected.svg", "sorted.svg"];
                        let imagePath2 = _getPath(["image", ""], 0, 1);
                        let imagePath1 = getGitHub(["image", ""]);
                        for (let imageName of imageNames) {
                            // saveImage('http://x.com/1.png||http://x.com/2.png', 'hiker://files/1.png')
                            showLoading('加载图标: ' + imageName)
                            downloadFile(imagePath1 + imageName, imagePath2 + imageName);
                        }
                        hideLoading();
                        return "toast://图标初始化成功";
                    });
                } else {
                    hikerPop.selectCenterIcon({
                        iconList: readDir(_getPath(["image"], 0, 1)).map(title => ({
                            icon: getImageUrl(title),
                            title
                        })),
                        title: "本地图片劫持",
                        columns: 2,
                        click(a, i) {
                            hikerPop.inputAutoRow({
                                hint: "本地文件，可改成在线链接",
                                title: "劫持: " + a,
                                defaultValue: getItem("image@" + a, "").trim(),
                                //hideCancel: true,
                                noAutoSoft: true, //不自动打开输入法
                                confirm(text) {
                                    setItem("image@" + a, text.trim());
                                    return "toast://设置成功\n" + text;
                                },
                                cancel() {
                                    return "hiker://empty";
                                }
                            });
                        }
                    });
                    return "hiker://empty";
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