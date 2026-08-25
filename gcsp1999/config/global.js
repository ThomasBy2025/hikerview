addListener('onClose', $.toString(() => {
    clearMyVar('isEnd_page');
    clearMyVar('music_down');
}));
try {
    page = MY_PAGE;
} catch (NO_MY_PAGE) {
    page = 1;
}
try {
    MY_URL = input;
} catch (NO_LazyRule) {
    try {
        MY_URL = MY_URL;
    } catch (NO_MY_URL) {
        MY_URL = "";
    }
}
try {
    MY_PARAMS = MY_PARAMS || {};
} catch (NO_MY_PARAMS) {
    MY_PARAMS = {}
}
d = [];


// 高亮文本
function Color(test, color) {
    return String(test || "").fontcolor(color || '#FA7298');
}


// 标记文本
function Rich(test) {
    test = String(test || "").trim().replace(/<\/?em[^>]*>/gi, '')
        .replace(/&(lt|gt|nbsp|amp|quot);/gi, ($0, $1) => ({
            'lt': '<',
            'gt': '>',
            'nbsp': ' ',
            'amp': '&',
            'quot': '"'
        } [$1.toLowerCase()]));
    if (test == "") {
        return "";
    }
    return "‘‘’’" + String(test)
        .replace(/\\n|(<|\s+)br\s*\/?\s*>/gi, '\n')
        .replace(/\\r/g, '\r')
        .replace(/\\f/g, '\f')
        .replace(/\\t/g, '\t');
}


// 随机返回字符串
function R(x, z) {
    let t, z = z || "1234567890abcdef";
    if (x == "randomUUID") {
        t = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
            let r = Math.random() * 16 | 0,
                v = c === "x" ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    } else {
        t = "";
        for (let i = 0; i < x; i++) {
            t += z[Math.floor(Math.random() * z.length)];
        }
    }
    return t
}


// 获取本地文件夹里面的文件名
function readDir(path) {
    let names = [];
    if (path) {
        if (path.startsWith('hiker://')) {
            path = getPath(path);
        }
        let file = new java.io.File(path.replace("file://", ""));
        if (!(file.exists() && file.isDirectory())) return names;
        for (let it of file.listFiles()) {
            names.push(String(it.getName()));
        }
    }
    return names;
}


// 返回温馨提示
function getHourHint(hour, noEval) {
    return String(getItem('HourHint_' + hour, "").trim() || function() {
        switch (String(hour)) {
            case '5':
                return "晨雾编织着朦胧的前奏，请踩着露珠的韵脚走进今日"
            case '6':
                return "鸟鸣是自然的开场白，愿你的晨光如和弦般清亮"
            case '7':
                return "让晨曦的旋律轻抚眼帘，开启充满韵律的一天";
            case '8':
            case '9':
            case '10':
                return "早安，清晨熹微的阳光， 是你在微笑吗";
                break;

            case '11':
                return "云朵是飘逸的音符，可在这乐章里收获安宁？";
            case '12':
                return "风哼着悠扬的旋律，愿你此刻如休止符般从容";
            case '13':
                return "午好，伴随着熟悉的乐曲，聆听着动人的旋律";
                break;

            case '14':
            case '15':
                return "日光像民谣流淌，不妨让倦意随节奏飘散";
            case '16':
            case '17':
            case '18':
                return "夕暮，似清风醉晚霞，不经意间盈笑回眸";
                break;

            case '19':
            case '20':
                return "星星开始试音， 在苍穹谱写今日的休止符";
            case '21':
            case '22':
            case '23':
                return "夜晚，一个安静的角落，静静地聆听夜曲";
                break;

            case '3':
            case '4':
                return "凌晨，窗外的夜风轻拂，似有无声的音符在心中回荡";
            case '0':
            case '1':
            case '2':
                return "深夜，现在的夜，熬得只是还未改变的习惯";
                break;
            default:
                return hour;
                break;
        }
    }()).trim().replace(/^js:([\s\S]+)/i, function($0, $1) {
        try {
            return noEval ? $1 : eval($1);
        } catch (e) {
            return "js异常";
        }
    })
}


// 获取本地图片
function getImageUrl(_type) {
    _type = String(_type || 'rule_type_audio');
    _type = getItem("image@" + _type, "").trim() || _type;
    if (!/(https?|data)\:/i.test(_type)) {
        if (/.+\./i.test(_type)) {
            return _getPath(["image", _type], 0, 1);
        }
        _type = 'hiker://images/' + _type
    }
    return _type;
}


// 获取数字图标
function getLenSvg(len, Col) {
    let stroke = Col || "#5BA946";
    let Svg = `<svg width="1000" height="800" xmlns="http://www.w3.org/2000/svg"><rect x="25" y="25" width="950" height="750" rx="250" ry="250" fill="${stroke}" stroke="${stroke}" stroke-width="25"/><text x="510" y="600" font-family="Arial, sans-serif" text-anchor="middle" dominant-baseline="middle" font-size="600" fill="#ffffff" stroke="#ffffff" stroke-width="30">${len}</text></svg>`;
    return "data:image/svg+xml;base64," + base64Encode(Svg);
}


// 二级页面置顶(主题切换)
function getTopImage(_json) {
    d.push(Object.assign({
        col_type: 'pic_1_full',
        pic_url: getImageUrl("topImg.png"),
        url: $("hiker://empty?t=" + themeType + "#noLoading#").lazyRule(() => {
            require(config.preRule);
            return selectThemePop(themeType);
        }),
        extra: {
            pageTitle: "主题管理"
        }
    }, _json || {}));
}


// 显示过渡动画
function Loading() {
    d.push({
        url: "toast://加载中...",
        pic_url: getImageUrl("Loading.gif"),
        col_type: "pic_1_center",
        extra: {
            cls: "loading_gif"
        }
    });
    setPreResult(d);
};


// 更新音乐数据为下载/播放
function getDownData(_json) {
    let {
        playTitle,
        downTitle
    } = Object.assign({
        playTitle: "播放歌曲".bold(),
        downTitle: "下载歌曲".bold()
    }, _json || {});
    let is_down = getMyVar('music_down', '0') == '1';
    return {
        title: is_down ? downTitle : playTitle,
        pic_url: getImageUrl(is_down ? "down.png" : "play.png"),
        url: $("#noLoading#").lazyRule((_json) => {
            require(config.preRule);
            putMyVar('music_down', is_down ? '0' : '1');
            _json = getDownData(_json);
            updateItem(rule_id + ':music:down', {
                title: _json.title,
                pic_url: _json.pic_url
            });

            let list = findItemsByCls(rule_id + ':itemlist') || [];
            for (let it of list) {
                updateItem(it.extra.id, {
                    url: it.url.replace(/, (false|true)\);/i, function($0, $1) {
                        if ($1 == "false") {
                            return ", true);";
                        } else {
                            return ", false);";
                        }
                    })
                });
            }
            return "hiker://empty";
        }, {
            playTitle,
            downTitle
        }),
        col_type: "icon_small_3",
        extra: {
            id: rule_id + ':music:down'
        }
    };
}


// 获取插件的用户变量
function getUserVariables(_) {
    let userVariables = globalMap0.getVar(rule_id + "@userVariables@" + _.platform, "");
    if (userVariables == "") {
        userVariables = {};
        if (Array.isArray(_.userVariables) && _.userVariables.length) {
            _.userVariables.map(__ => {
                userVariables[__.key] = getItem(_.platform + "@userVariables@" + __.key, "");
            });
        }
        globalMap0.putVar(rule_id + "@userVariables@" + _.platform, userVariables);
    }
    return userVariables;
}


// 格式化歌曲时间
function dateFormat(duration) {
    duration = duration || "00:00:00";
    if (!isNaN(Number(duration))) {
        duration = Number(duration);
        if (duration < 999) {
            duration *= 1000;
        }
        let t_Arr = $.dateFormat(duration, 'hh:mm:ss').split(':');
        if ((t_Arr[0] -= 8) < 10) t_Arr[0] = '0' + t_Arr[0];
        duration = t_Arr.join(":");
    } else if (String(duration).length == 5) {
        duration = "00:" + duration;
    }
    return duration.replace(/^0[\+\-]\d+/, "00");
}


// 选择二级样式
function setColType(officeItem2, change2) {
    let hikerPop = $.require("http://123.56.105.145/weisyr/js/hikerPop.js");
    let options = [
        "text_1", "icon_1_left_pic",
        "card_pic_3_center", "card_pic_3",
        "movie_1", "icon_2_round",
        "movie_1_left_pic", "movie_1_vertical_pic",
        "icon_3_round_fill", "icon_round_4",
        "icon_round_small_4", "icon_4_card",
        "movie_1_vertical_pic_blur", "flex_button",
        "card_pic_1", "card_pic_2",
        "icon_5_no_crop", "icon_5",
        "icon_4", "icon_small_4",
        "text_3", "icon_3_fill",
        "text_2", "icon_2",
        "pic_3_square", "pic_1_full",
    ];
    let setCol = officeItem2 ? officeItem2.getDesc() :
        getItem("col_type", "card_pic_3");
    let getCol = getMyVar("col_type", setCol);
    let position = options.indexOf(String(setCol));
    let position2 = options.indexOf(String(getCol));
    if (position != position2) {
        options[position2] = "‘‘" + options[position2] + "’’";
    }
    options[position] = "““" + options[position] + "””";
    let pop = hikerPop.selectBottom({
        title: "请选择显示样式",
        options,
        columns: 2,
        height: 0.6,
        click(a) { // 点击更改
            a = a.replace(/[‘’“”]+/g, "");
            if (officeItem2) {
                putMyVar("col_type", a);
                // officeItem2.setDesc(a);
                change2();
                return "toast://更改成功\n" + a;
            } else {
                let list = findItemsByCls('gcsp1999:itemlist') || [];
                for (let it of list) {
                    updateItem(it.extra.id, {
                        col_type: a
                    });
                }
                putMyVar("col_type", a);
                return "hiker://empty";
            }
        },
        longClick(a) { // 长按设置
            a = a.replace(/[‘’“”]+/g, "");
            if (officeItem2) {
                putMyVar("col_type", a);
                setItem("col_type", a);
                officeItem2.setDesc(a);
                change2();
                return "toast://设置成功\n" + a;
            } else {
                let list = findItemsByCls('gcsp1999:itemlist') || [];
                for (let it of list) {
                    updateItem(it.extra.id, {
                        col_type: a
                    });
                }
                putMyVar("col_type", a);
                setItem("col_type", a);
                return "hiker://empty";
            }
        }
    });
    return "hiker://empty";
}





// 歌曲音质映射
var qualityMap = {
    "25000k": {
        "title": "DTS:X",
        "desc": "多维沉浸 声动随心",
        "abbr": "MA",
        "alias": ["25000kmmp4"],
        "sort": -23
    },
    "22000k": {
        "title": "原唱伴唱",
        "desc": "除母带外 获取加密的最高音质",
        "abbr": "BC",
        "alias": ["22000kmgg"],
        "sort": -22
    },


    "20900k": {
        "title": "至臻母带5.0",
        "desc": "还原录音细节 音质提升近一半",
        "abbr": "MS",
        "alias": ["20900kmflac", "jymaster", "viper_clear", "master"],
        "sort": 21
    },
    "20501k": {
        "title": "臻音全景声",
        "desc": "自研空间音频 如同在三维空间",
        "abbr": "AT",
        "alias": ["20501kmflac", "jyeffect",  "viper_hifi",  "atmos_plus", "clear"],
        "sort": 20
    },
    "24000k": {
        "title": "沉浸环绕声",
        "desc": "影院级空间感 声临其境的环绕",
        "abbr": "3D",
        "alias": ["24000kmflac", "sky", "viper_atmos", "spatial", "Z3D", "atmos", "effect"],
        "sort": 19
    },
    "20201k": {
        "title": "超高清HiFi",
        "desc": "智能音质增强 补全声场小细节",
        "abbr": "ZQ",
        "alias": ["20201kmflac", "vivid", "ZQ32"],
        "sort": 18
    },


    "11700k": {
        "title": "杜比全景声",
        "desc": "音质无压缩 完全保留创作者原始音频",
        "abbr": "DB",
        "alias": ["11700kmp4", "dolby"],
        "sort": 17
    },
    "11600k": {
        "title": "杜比Digital+",
        "desc": "支持7.1声道 提供更清晰一致的环绕声体验",
        "abbr": "UL",
        "alias": ["11600kmp4"],
        "sort": 16
    },
    "11500k": {
        "title": "杜比Digital",
        "desc": "支持5.1声道 高效压缩音频且不损失音质",
        "abbr": "HV",
        "alias": ["11500kmp4"],
        "sort": 15
    },
    "11000k": {
        "title": "杜比AC-4",
        "desc": "新型音频格式 适配各类音频体验场景",
        "abbr": "AC",
        "alias": ["11000kmp4"],
        "sort": 14
    },


    "20000k": {
        "title": "臻品质2.0",
        "desc": "智能获取最高音质[不加密]",
        "abbr": "ZP",
        "alias": ["20000kflac", "20000kzp"],
        "sort": 13
    },
    "10501k": {
        "title": "空间音频",
        "desc": "模拟环绕声场 让声音围你而动",
        "abbr": "AR",
        "alias": ["10501kflac", "multitrack"],
        "sort": 12
    },
    "23000k": {
        "title": "黑胶转录",
        "desc": "真实极致的听觉感受",
        "abbr": "VN",
        "alias": ["23000kflac", "vinyl"],
        "sort": 11
    },
    "4000k": {
        "title": "高清无损",
        "desc": "录音棚级沉浸临场",
        "abbr": "HR",
        "alias": ["4000kflac", "hires", "high", "hi_res", "ZQ", "ZQ24", "flac24bit", "super"],
        "sort": 10
    },
    "2000k": {
        "title": "标清无损",
        "desc": "CD级无损保真",
        "abbr": "SQ",
        "alias": ["2000kflac", "lossless", "flac", "SQ"],
        "sort": 9
    },
    "1000k": {
        "title": "低清无损",
        "desc": "满足日常听感的无损音质",
        "abbr": "AQ",
        "alias": ["1000kape", "viper_tape"],
        "sort": 8
    },


    "320k": {
        "title": "极高音质",
        "desc": "",
        "abbr": "HQ",
        "alias": ["320kmp3", "exhigh", "320", "highest", "HQ"],
        "sort": 7
    },
    "300k": {
        "title": "高品音质",
        "desc": "",
        "abbr": "KQ",
        "alias": ["300kogg"],
        "sort": 6
    },
    "192k": {
        "title": "较高音质",
        "desc": "",
        "abbr": "RQ",
        "alias": ["192kmp3", "higher", "192kogg"],
        "sort": 5
    },
    "128k": {
        "title": "普通音质",
        "desc": "",
        "abbr": "PQ",
        "alias": ["128kmp3", "128kwma", "standard", "128", "medium", "PQ", "low"],
        "sort": 4
    },
    "100k": {
        "title": "标准音质",
        "desc": "",
        "abbr": "BQ",
        "alias": ["100kogg"],
        "sort": 3
    },
    "96k": {
        "title": "均衡音质",
        "desc": "",
        "abbr": "EQ",
        "alias": ["96kwma"],
        "sort": 2
    },
    "48k": {
        "title": "流畅音质",
        "desc": "",
        "abbr": "LQ",
        "alias": ["48kaac", "LQ", "mgg"],
        "sort": 1
    },
    "24k": {
        "title": "极速音质",
        "desc": "",
        "abbr": "FQ",
        "alias": ["24kaac"],
        "sort": 0
    },
    "12k": {
        "title": "试听音质",
        "desc": "",
        "abbr": "ST",
        "alias": [],
        "sort": 404
    },


    // 隐藏
    "3000k": {
        "title": "dts?",
        "desc": "",
        "abbr": "",
        "alias": [],
        "sort": 404
    },
    "5000k": {
        "title": "",
        "desc": "",
        "abbr": "",
        "alias": [],
        "sort": 404
    },
    "7000k": {
        "title": "",
        "desc": "",
        "abbr": "",
        "alias": [],
        "sort": 404
    },
    "10000k": {
        "title": "",
        "desc": "",
        "abbr": "",
        "alias": [],
        "sort": 404
    },
}


// 扩展音质映射
var qualityArr = [];
for (let _key in qualityMap) {
    let f = qualityMap[_key];
    if (f.sort != 404 && f.sort > -1) {
        let c = getItem("qualityColor" + f.sort, "") || (f.sort > 17 ? "#AA0000" : f.sort > 13 ? "#E47000" : f.sort > 7 ? "#0080E4" : f.sort > 3 ? "#5BA946" : "Gray");
        f.icon = getLenSvg(f.abbr, c);
        f.color = c;
        f.url = _key;
        f.title = "【" + f.title + "】(" + _key + "）";
        if (f.alias.length) {
            for (let _key2 of f.alias) {
                qualityMap[_key2] = JSON.parse(JSON.stringify(f));
                qualityMap[_key2]._url = _key;
                qualityMap[_key2].url = _key2;
            }
        }
        qualityArr[f.sort] = _key;
    }
}


// 获取映射音质
function hijackQuality(_Key, _Arr) {
    if (!Array.isArray(_Arr)) return _Key;
    for (let _key of _Arr) {
        let f = qualityMap[_key];
        if (f._url == _Key || f.url == _Key) {
            return _key;
        }
    }
    return _Key;
}