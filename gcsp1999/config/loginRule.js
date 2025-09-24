addListener("onClose", () => clearMyVar("cookie"));
platform = getParam('platform');
let loginRule = _getPlatform(platform).loginRule;
d.push({
    title: "““确认登录””",
    url: $("#noLoading#").lazyRule((rule_id, platform, loginRule) => {
        delete loginRule.loginUrl;
        let cookie = String(getMyVar("cookie", ""));
        let isLogin = false;
        let userVariables = {};
        for (let key in loginRule) {
            try {
                let value = loginRule[key]
                userVariables[key] = cookie.match(value.reg)[value.index] || "";
                isLogin = true;
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
    }, rule_id, platform, loginRule),
    desc: "““””" + "点击头像可以退出账号重新登录".small(),
    col_type: "text_center_1"
});
d.push({
    col_type: "line_blank"
});
d.push({
    col_type: "x5_webview_single",
    url: loginRule.loginUrl,
    desc: "list&&screen-150",
    extra: {
        ua: MOBILE_UA,
        js: $.toString((title, durl) => {
            let cookie = "";
            setInterval(() => {
                cookie = fba.getCookie(durl);
                fba.putVar(title + "@cookie", cookie);
            }, 500);
        }, MY_RULE.title, loginRule.loginUrl)
    }
});