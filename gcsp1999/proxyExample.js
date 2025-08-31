// 自带变量 mediaPlatform
// 可以调用隶属插件的函数

let proxyObj = {
    "platform": "debug", // 隶属插件标识
    "url": "https://raw.githubusercontent.com/ThomasBy2025/hikerview/refs/heads/main/gcsp1999/proxyExample.js", // 解析标识
    "title": "解析示例", // 解析名称
    "author": "Thomas喲", // 解析作者
    "icon": "hiker://images/icon_xiutan", // 解析封面
    "type": "示例", // 解析分组
    "version": "2025.09.01", // 解析版本
    "desc": [{ // 解析简介
        "title": "2025.09.01",
        "records": [
            "““更新””: 解析示例",
            "‘‘移除’’: 旧版解析"
        ]
    }],

    // 支持解析的音质
    "supportedQualityType": ["low", "standard", "high", "super"],
    // 实现解析
    "getMediaSource": function(musicItem, quality) {
        return {
            // url: "",
            urls: [],
            names: [],
            // headers: [],
            lyric: "",
            // audioUrls: [], // 一般用不到
        };
    }
}
$.exports = proxyObj;