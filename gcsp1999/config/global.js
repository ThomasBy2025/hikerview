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
        t = [R(8), R(4), R(4), R(4), R(12)].join("-");
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
    if (/^(?!http).+\./i.test(_type)) {
        return _getPath(["image", _type], 0, 1);
    }
    if (!/https?\:\/\//i.test(_type)) {
        _type = 'hiker://images/' + _type
    }
    return _type;
}


// 获取数字图标
function getLenSvg(len) {
    let Svg = `<svg width="1000" height="800" xmlns="http://www.w3.org/2000/svg"><rect x="25" y="25" width="950" height="750" rx="250" ry="250" fill="#5BA946" stroke="#5BA946" stroke-width="25"/><text x="510" y="600" font-family="Arial, sans-serif" text-anchor="middle" dominant-baseline="middle" font-size="600" fill="#ffffff" stroke="#ffffff" stroke-width="30">${len}</text></svg>`;
    return "data:image/svg+xml;base64," + base64Encode(Svg);
}


// 置顶图片(主题切换)
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
    let userVariables = globalMap0.getVar(rule_id + "@userVariables@" + _.platform);
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