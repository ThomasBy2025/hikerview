addListener('onClose', $.toString(() => {
    clearMyVar('isEnd_page');
    clearMyVar('music_down');
    clearMyVar('platform');
}));
try {
    page = MY_PAGE;
} catch (NO_MY_PAGE) {
    page = 1;
}
try {
    MY_URL = input;
    MY_PARAMS = {};
} catch (NO_LazyRule) {
    MY_URL = MY_URL;
}
d = [];


// 高亮文本
function Color(test, color) {
    return String(test || "").fontcolor(color || '#FA7298');
}


// 标记文本
function Rich(test) {
    test = String(test || "").replace(/<\/?em[^>]*>/gi, '')
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
function getHourHint(hour) {
    return getItem('HourHint_' + hour, function() {
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
    }());
}


// 获取本地图片
function getImageUrl(_type) {
    _type = String(_type || 'rule_type_audio');
    if (/^(?!http).+\./i.test(_type)) {
        return "hiker://files/rules/Thomas/gcsp1999/image/" + _type;
    }
    switch (_type) {
        case '设置':
            return 'http://123.56.105.145/tubiao/messy/30.svg';
            break;
        case '收藏':
            return 'http://123.56.105.145/tubiao/more/129.png';
            break;
        case '作者':
            return 'http://q.qlogo.cn/g?b=qq&nk=1585568865&s=140';
            break;
        case 'add':
            return 'https://cdn.icon-icons.com/icons2/37/PNG/512/addproperty_a%C3%B1adir_3625.png';
            break;

        case '推荐':
            return 'https://cf.ghproxy.cc/https://raw.githubusercontent.com/ls125781003/tubiao/main/3d/64.png';
            break;
        case '语种':
            return 'https://cf.ghproxy.cc/https://raw.githubusercontent.com/ls125781003/tubiao/main/3d/182.png';
            break;
        case '风格':
            return 'https://cf.ghproxy.cc/https://raw.githubusercontent.com/ls125781003/tubiao/main/3d/359.png';
            break;
        case '场景':
            return 'https://cf.ghproxy.cc/https://raw.githubusercontent.com/ls125781003/tubiao/main/3d/90.png';
            break;
        case '心情':
            return 'https://cf.ghproxy.cc/https://raw.githubusercontent.com/ls125781003/tubiao/main/3d/131.png';
            break;
        case '主题':
            return 'https://cf.ghproxy.cc/https://raw.githubusercontent.com/ls125781003/tubiao/main/3d/254.png';
            break;
        case '年代':
            return 'https://cf.ghproxy.cc/https://raw.githubusercontent.com/ls125781003/tubiao/main/3d/186.png';
            break;
        case '播客':
            return 'https://cf.ghproxy.cc/https://raw.githubusercontent.com/ls125781003/tubiao/main/3d/172.png';
            break;
        case '排行':
            return 'https://cf.ghproxy.cc/https://raw.githubusercontent.com/ls125781003/tubiao/main/3d/51.png';
            break;
        default:
            if (!/https?\:\/\//i.test(_type)) {
                _type = 'hiker://images/' + _type
            }
            return _type;
            break;
    }
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
            let list = findItemsByCls(rule_id + ':addlist') || [];
            for (let it of list) {
                let extra_url = it.url;
                let url = it.extra.url;
                it.extra.url = extra_url;
                updateItem(it.extra.id, {
                    extra: it.extra,
                    url
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
    let userVariables = {};
    if (Array.isArray(_.userVariables) && _.userVariables.length) {
        _.userVariables.map(__ => {
            userVariables[__.key] = getItem(_.platform + "@userVariables@" + __.key, "");
        });
    }
    return userVariables;
}