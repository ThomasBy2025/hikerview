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
let pop = hikerPop.selectBottomSettingMenu({
    options: [
        SettingItem("默认播放音质", QualityNames[getItem('QualityIndex', '0')]),
        SettingItem("音质获取失败", getItem('QualityFailure', "向下兼容")),
        SettingItem("预加载预解析", MediaPreNames[MediaPreIndex]),
        SettingItem(),
        SettingItem("音频直链缓存", getItem('MediaCache', '1') == "1"),
        SettingItem("记忆播放进度", getItem('memoryPosition', '') == ""),
        SettingItem("获取链接信息", getItem('checkMetadata', '') == ""),
        SettingItem("强制识别音频", getItem('mediaIsMusic', '') != ""),
        SettingItem("启用插件换源", getItem('switchPluginSource', '1') == "1"),
        SettingItem("播放链接加密", getItem('startProxyServer', '0') == "1"),
        SettingItem("显示弹幕歌词", getItem('danmuLrc', '0') == "1"),
        SettingItem(),
        SettingItem("图标下载状态", readDir(_getPath(["image"], 0, 1)).length == 23 ? true : "文件不全"),
        SettingItem("依赖更新管理", false),
        SettingItem("二级样式设置", false),
        SettingItem("查看温馨提示", "编辑修改"),
        SettingItem("页面标识设置", pageHomeTypes[pageHomeIndex]),
        SettingItem("默认搜索类型", "搜索" + s_type),
    ],
    click(s, officeItem, change) {
        let isTrue;
        switch (s) {
            case '查看温馨提示':
                hikerPop.selectCenterIcon({
                    iconList: Array.from({
                        length: 24
                    }, (t, i) => ({
                        title: getHourHint(i, true),
                        icon: getLenSvg(i)
                    })),
                    title: "温馨提示",
                    extraMenu: new hikerPop.IconExtraMenu(() => {
                        hikerPop.infoBottom({
                            content: "介绍",
                            options: [
                                "通过 getHourHint(num) 获取返回文本",
                                "num取值：0-23，其他值返回num本身",
                                "如果返回的文本以js:开头，会执行eval",
                                "",
                                "示例：js:fetch(\"https://v1.hitokoto.cn/?encode=text\")"
                            ],
                            click(text) {}
                        });
                    }),
                    columns: 1,
                    // position: 0,
                    click(a, i) {
                        hikerPop.inputAutoRow({
                            hint: "文本以js:开头会执行eval",
                            title: "修改: " + i,
                            defaultValue: getHourHint(i, true),
                            //hideCancel: true,
                            noAutoSoft: true, //不自动打开输入法
                            confirm(text) {
                                setItem("HourHint_" + i, text.trim());
                                return "toast://设置成功\n" + text;
                            },
                            cancel() {
                                return "hiker://empty";
                            }
                        });
                    }
                });
                break;
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
            case "播放链接加密":
                isTrue = officeItem.getSelected() === 1;
                setItem('startProxyServer', isTrue ? "0" : "1");
                officeItem.setSelected(isTrue ? -1 : 1);
                change();
                break;
            case "启用插件换源":
                isTrue = officeItem.getSelected() === 1;
                setItem('switchPluginSource', isTrue ? "0" : "1");
                officeItem.setSelected(isTrue ? -1 : 1);
                change();
                break;
            case "记忆播放进度":
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
                        let imageNames = ["icon.png", "1.png", "2.png", "3.png", "down.png", "play.png", "open.svg", "shut.svg", "Loading.gif", "topImg.png", "jump.png", "update.svg", "edit.svg", "share.svg", "proxy.svg", "uninstall.svg", "account.svg", "import.svg", "hijack.svg", "unhijack.svg", "selected.svg", "unselected.svg", "sorted.svg"];
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
            case "依赖更新管理":
                hikerPop.selectBottomSettingMenu({
                    options: [
                        SettingItem("依赖代理接口", getItem("ghproxy", "").slice(0, 16) || "hiker://empty"),
                        SettingItem("插件更新设置", getItem("plugin_update", "0") == "1" ? "自动更新" : "手动更新"),
                        SettingItem("清除依赖缓存", "更新依赖"),
                        SettingItem()
                    ],
                    click(s2, officeItem2, change2) {
                        let isTrue2;
                        switch (s2) {
                            case "依赖代理接口":
                                hikerPop.inputAutoRow({
                                    hint: "github代理链接",
                                    title: s2,
                                    defaultValue: getItem("ghproxy", ""),
                                    //hideCancel: true,
                                    noAutoSoft: true, //不自动打开输入法
                                    confirm(text) {
                                        text = String(text).trim();
                                        if (!/http/.test(text)) {
                                            return "toast://不是http地址";
                                        }
                                        hikerPop.runOnNewThread(() => {
                                            try {
                                                let verify_url = 'https://raw.githubusercontent.com/src48597962/hk/master/verify';
                                                let content = fetch(text + verify_url, {
                                                    timeout: 5000
                                                });
                                                if (content && content.trim() == "ok") {
                                                    setItem('ghproxy', text);
                                                    config.ghproxy = 0;
                                                    eval(MY_RULE.preRule);
                                                    officeItem2.setDesc(text || "hiker://empty");
                                                    change2();
                                                    return "toast://设置成功\n" + text;
                                                }
                                            } catch (e) {}
                                            return 'toast://设置失败';
                                        });
                                    },
                                    cancel() {
                                        return "toast://取消";
                                    }
                                });
                                break;
                            case "插件更新设置":
                                isTrue2 = officeItem2.getDesc() == "自动更新";
                                setItem('plugin_update', isTrue2 ? "0" : "1");
                                officeItem2.setDesc(isTrue2 ? "手动更新" : "自动更新");
                                change2();
                                break;
                            case '清除依赖缓存':
                                hikerPop.confirm({
                                    content: "清除后需要能打开github的网络，进行初始化",
                                    title: "确定清除依赖缓存吗？",
                                    okTitle: "确定清除",
                                    cancelTitle: "算了算了",
                                    hideCancel: false, //隐藏取消按钮
                                    confirm() {
                                        deleteCache();
                                        pop.dismiss();
                                        return "toast://清除成功";
                                    },
                                    cancel() {
                                        return "hiker://empty";
                                    }
                                });
                                break;
                        }
                    }
                });
                break;
            case '二级样式设置':
                hikerPop.selectBottomSettingMenu({
                    options: [
                        SettingItem("简介样式设置", "JS"),
                        SettingItem("默认列表样式", getItem("col_type", "icon_1_left_pic")),
                        SettingItem(),
                        SettingItem("标准音质映射", [
                            getItem("mediaDesc_quality_low_color", "") || "#3BA600",
                            getItem("mediaDesc_quality_low_name", "") || "128K"
                        ].join(" - ")),
                        SettingItem("高品音质映射", [
                            getItem("mediaDesc_quality_standard_color", "") || "#62A6FB",
                            getItem("mediaDesc_quality_standard_name", "") || "320K"
                        ].join(" - ")),
                        SettingItem("无损音质映射", [
                            getItem("mediaDesc_quality_high_color", "") || "#FA7D00",
                            getItem("mediaDesc_quality_high_name", "") || "FLAC"
                        ].join(" - ")),
                        SettingItem("高品无损映射", [
                            getItem("mediaDesc_quality_super_color", "") || "red",
                            getItem("mediaDesc_quality_super_name", "") || "Hi-Res"
                        ].join(" - ")),
                        SettingItem(),
                        SettingItem("免费音频映射", [
                            getItem("mediaDesc_type_0_color", "") || "#008080",
                            getItem("mediaDesc_type_0_name", "") || "畅听"
                        ].join(" - ")),
                        SettingItem("付费音频映射", [
                            getItem("mediaDesc_type_1_color", "") || "#4B0082",
                            getItem("mediaDesc_type_1_name", "") || "会员"
                        ].join(" - ")),
                        SettingItem(),
                        SettingItem("插件名称映射", "{}"),
                    ],
                    click(s2, officeItem2, change2) {
                        let isTrue2;
                        switch (s2) {
                            case "默认列表样式":
                                let optionf = ["text_4", "text_5", "text_center_1", "movie_2", "movie_3", "movie_3_marquee", "pic_1", "pic_2", "pic_3", "pic_1_center", "pic_1_card", "pic_2_card", "icon_1_search", "icon_small_3", "long_text", "rich_text", "avatar", "text_icon", "x5_webview_single", "video", "pic_1", "line", "line_blank", "blank_block", "big_blank_block", "big_big_blank_block", "scroll_button", "card_pic_2_2", "card_pic_2_2_left", "input"];
                                let options = getColTypes().filter(_type => !optionf.includes(_type))
                                let position = options.indexOf(String(officeItem2.getDesc()));
                                options[position] = "““" + options[position] + "””";
                                let pop = hikerPop.selectBottom({
                                    title: "请选择显示样式",
                                    options,
                                    columns: 2,
                                    height: 0.6, //0-1
                                    position,
                                    click(a) {
                                        setItem("col_type", a);
                                        officeItem2.setDesc(a);
                                        change2();
                                        return "toast://设置成功\n" + a;
                                    }
                                });
                                break;
                            case "简介样式设置":
                                hikerPop.inputConfirm({
                                    hint: "text 或者 js:",
                                    title: s2,
                                    defaultValue: getItem("mediaDesc", "") || "js:\nlet tag = [\n    \"$platformName\".fontcolor(\"$platformColor\"),\n    \"$typeName\".fontcolor(\"$typeColor\"),\n    \"$qualityName\".fontcolor(\"$qualityColor\"),\n].join(\"&nbsp;\").bold().small().small().sup();\n`‘‘’’<i>${tag}&nbsp;$duration</i>&nbsp;&nbsp;∙&nbsp;&nbsp;$album`",
                                    textarea: true, //多行模式
                                    maxTextarea: true,
                                    noAutoSoft: true, //不自动打开输入法
                                    confirm(text) {
                                        try {
                                            let t = 'toast://设置成功\n' + eval(text);
                                            setItem('mediaDesc', text);
                                            change2();
                                            return t;
                                        } catch (e) {
                                            return 'toast://设置失败\n' + e.toString();
                                        }
                                    },
                                    cancel() {
                                        return "toast://取消";
                                    }
                                });
                                break;
                            case "插件名称映射":
                                hikerPop.inputConfirm({
                                    hint: '{ "kw":{"name":"小蜗","color":"red"} }',
                                    title: s2,
                                    defaultValue: getItem("platformDesc", ''),
                                    textarea: true, //多行模式
                                    maxTextarea: true,
                                    noAutoSoft: true, //不自动打开输入法
                                    confirm(text) {
                                        try {
                                            let t = JSON.parse(text);
                                            text = JSON.stringify(t, null, 2);
                                            setItem('platformDesc', text);
                                            change2();
                                            return 'toast://设置成功\n' + (text);
                                        } catch (e) {
                                            return 'toast://设置失败\n' + e.toString();
                                        }
                                    },
                                    cancel() {
                                        return "toast://取消";
                                    }
                                });
                                break;
                            default:
                                let xtype1 = /音频/.test(s2) ? "type" : "quality";
                                let xtype2 = {
                                    "标准音质映射": "low",
                                    "高品音质映射": "standard",
                                    "无损音质映射": "high",
                                    "高品无损映射": "super",
                                    "免费音频映射": "0",
                                    "付费音频映射": "1",
                                } [s2];
                                let xtype3 = "mediaDesc" + "_" + xtype1 + "_" + xtype2 + "_";
                                let xtype4 = String(officeItem2.getDesc()).split(" - ");
                                hikerPop.inputTwoRow({
                                    titleHint: "映射名称",
                                    titleDefault: xtype4[1],
                                    urlHint: "映射颜色",
                                    urlDefault: xtype4[0],
                                    noAutoSoft: true, //不自动打开输入法
                                    title: s2,
                                    //hideCancel: true,
                                    confirm(s1, s2) {
                                        setItem(xtype3 + 'name', s1);
                                        setItem(xtype3 + 'color', s2);
                                        officeItem2.setDesc(s2 + " - " + s1);
                                        change2();
                                        return "toast://保存成功\n" + s2 + " - " + s1;
                                    },
                                    cancel() {
                                        return "toast://取消"
                                    }
                                });
                                break;
                        }
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