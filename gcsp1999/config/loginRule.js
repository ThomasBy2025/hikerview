addListener("onClose", () => clearMyVar("cookie"));
platform = getParam('platform');
let loginUrl = _getPlatform(platform).loginRule.loginUrl;
d.push({
    title: "““确认登录””",
    url: $("#noLoading#").lazyRule((platform) => {
        require(config.preRule);
        let loginRule = _getPlatform(platform).loginRule;
        delete loginRule.loginUrl;
        let cookie = String(getMyVar("cookie", ""));
        let isLogin;
        let userVariables = {};
        for (let key in loginRule) {
            try {
                let value = loginRule[key];
                if (typeof value.reg === 'string') {
                    value = value.reg;
                } else {
                    value = cookie.match(value.reg)[value.index] || "";
                }
                userVariables[key] = value;
                if (isLogin === undefined || isLogin) {
                    isLogin = true;
                } else {
                    isLogin = false;
                }
            } catch (e) {
                isLogin = false;
            }
        }
        if (isLogin) {
            globalMap0.clearVar(rule_id + "@userVariables@" + platform);
            for (let _key in userVariables) {
                setItem(platform + "@userVariables@" + _key, userVariables[_key]);
            }
            back(true);
            return "toast://登录成功";
        } else {
            return "toast://未登录";
        }
    }, platform),
    desc: "““””" + "点击头像可以退出账号重新登录".small(),
    col_type: "text_center_1"
});
d.push({
    col_type: "line_blank"
});
d.push({
    col_type: "x5_webview_single",
    url: loginUrl,
    desc: "list&&screen-150",
    extra: {
        ua: MOBILE_UA,
        js: $.toString((title, durl) => {
            let cookie = "";
            setInterval(() => {
                cookie = fba.getCookie(durl);
                fba.putVar(title + "@cookie", cookie);
            }, 500);
        }, MY_RULE.title, loginUrl)
    }
});