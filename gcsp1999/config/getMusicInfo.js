let _ = MY_PARAMS.item;
let it = Extra(_, {
    col_type: "card_pic_3_center"
}, true);
getTopImage({
    url: "hiker://empty"
});
d.push({
    url: "hiker://empty",
    col_type: "card_pic_3_center"
});
d.push(it);
d.push({
    url: "hiker://empty",
    col_type: "card_pic_3_center"
});
d.push({
    desc: _.duration,
    url: "hiker://empty",
    col_type: "text_center_1"
});



d.push({
    title: "““””" + "相似推荐".fontcolor("gray").bold().small().small(),
    url: "toast://完善中~",
    pic_url: "data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iaWNvbiIgc3R5bGU9IndpZHRoOiAxZW07aGVpZ2h0OiAxZW07dmVydGljYWwtYWxpZ246IG1pZGRsZTtmaWxsOiBjdXJyZW50Q29sb3I7b3ZlcmZsb3c6IGhpZGRlbjsiIHZpZXdCb3g9IjAgMCAxMDI0IDEwMjQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNODEwLjY2NjY2NyA2MzUuNzMzMzMzbDY0IDY0LTQ2LjkzMzMzNCA0Ni45MzMzMzQtNjQtNjRjLTM4LjQgMjEuMzMzMzMzLTg5LjYgMTIuOC0xMjMuNzMzMzMzLTE3LjA2NjY2Ny00Mi42NjY2NjctNDIuNjY2NjY3LTQyLjY2NjY2Ny0xMTAuOTMzMzMzIDAtMTQ5LjMzMzMzM3MxMTAuOTMzMzMzLTQyLjY2NjY2NyAxNDkuMzMzMzMzIDBjMzguNCAyOS44NjY2NjcgNDIuNjY2NjY3IDgxLjA2NjY2NyAyMS4zMzMzMzQgMTE5LjQ2NjY2NnpNNTU0LjY2NjY2NyA0NjkuMzMzMzMzdjEyOEgxMjh2LTEyOGg0MjYuNjY2NjY3eiBtMCAyOTguNjY2NjY3SDEyOHYtMTI4aDQyNi42NjY2Njd2MTI4eiBtMzQxLjMzMzMzMy0zNDEuMzMzMzMzSDEyOFYyOTguNjY2NjY3aDc2OHYxMjh6TTIxMy4zMzMzMzMgMzQxLjMzMzMzM3Y0Mi42NjY2NjdoNDIuNjY2NjY3VjM0MS4zMzMzMzNIMjEzLjMzMzMzM3ogbTg1LjMzMzMzNCAwdjQyLjY2NjY2N2g0Mi42NjY2NjZWMzQxLjMzMzMzM0gyOTguNjY2NjY3eiBtLTg1LjMzMzMzNCAxNzAuNjY2NjY3djQyLjY2NjY2N2g0Mi42NjY2Njd2LTQyLjY2NjY2N0gyMTMuMzMzMzMzeiBtODUuMzMzMzM0IDB2NDIuNjY2NjY3aDQyLjY2NjY2NnYtNDIuNjY2NjY3SDI5OC42NjY2Njd6IG0tODUuMzMzMzM0IDE3MC42NjY2Njd2NDIuNjY2NjY2aDQyLjY2NjY2N3YtNDIuNjY2NjY2SDIxMy4zMzMzMzN6IG04NS4zMzMzMzQgMHY0Mi42NjY2NjZoNDIuNjY2NjY2di00Mi42NjY2NjZIMjk4LjY2NjY2N3ogbTM4OC4yNjY2NjYtNjRjMTcuMDY2NjY3IDE3LjA2NjY2NyA0Mi42NjY2NjcgMTcuMDY2NjY3IDU5LjczMzMzNCAwczE3LjA2NjY2Ny00Mi42NjY2NjcgMC01OS43MzMzMzRjLTE3LjA2NjY2Ny0xNy4wNjY2NjctNDIuNjY2NjY3LTE3LjA2NjY2Ny01OS43MzMzMzQgMC0xNy4wNjY2NjcgMTcuMDY2NjY3LTE3LjA2NjY2NyA0Mi42NjY2NjcgMCA1OS43MzMzMzR6IiBmaWxsPSIjNDQ0NDQ0IiAvPjwvc3ZnPg==",
    col_type: "icon_5"
});
d.push({
    title: "““””" + "查看歌词".fontcolor("gray").bold().small().small(),
    url: $("").lazyRule((_id) => {
        try {
            require(config.preRule);
            let _ = findItem(_id).extra.item;
            let item = _.lyric ? _ : {
                lyric: _getPlatform(_.platform).getLyric(_)
            };
            let hikerPop = $.require("http://123.56.105.145/weisyr/js/hikerPop.js");
            hikerPop.copyBottom("你可以复制", getLyric(item));
            return "hiker://empty";
        } catch (e) {
            return "toast://无法获取歌词";
        }
    }, it.extra.id),
    pic_url: "data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iaWNvbiIgc3R5bGU9IndpZHRoOiAxZW07aGVpZ2h0OiAxZW07dmVydGljYWwtYWxpZ246IG1pZGRsZTtmaWxsOiBjdXJyZW50Q29sb3I7b3ZlcmZsb3c6IGhpZGRlbjsiIHZpZXdCb3g9IjAgMCAxMDI0IDEwMjQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNjQwIDU1NC42NjY2NjdoLTQyLjY2NjY2N3YxMjhoLTg1LjMzMzMzM3YtMjEzLjMzMzMzNGgyMTMuMzMzMzMzdjIxMy4zMzMzMzRoLTg1LjMzMzMzM3YtMTI4eiBtLTI1NiA0Mi42NjY2NjZoODUuMzMzMzMzdjg1LjMzMzMzNEgyOTguNjY2NjY3VjM0MS4zMzMzMzNoMTcwLjY2NjY2NnY4NS4zMzMzMzRIMzg0djQyLjY2NjY2Nmg4NS4zMzMzMzN2ODUuMzMzMzM0SDM4NHY0Mi42NjY2NjZ6TTE3MC42NjY2NjcgMjEzLjMzMzMzM2g2ODIuNjY2NjY2djU5Ny4zMzMzMzRIMTcwLjY2NjY2N1YyMTMuMzMzMzMzeiBtODUuMzMzMzMzIDg1LjMzMzMzNHY0MjYuNjY2NjY2aDUxMlYyOTguNjY2NjY3SDI1NnoiIGZpbGw9IiM0NDQ0NDQiIC8+PC9zdmc+",
    col_type: "icon_5"
});
d.push({
    title: "““””" + "下载歌曲".fontcolor("gray").bold().small().small(),
    url: $("").lazyRule((_id) => {
        require(config.preRule);
        return getQuality(findItem(_id).extra.item, true);
    }, it.extra.id),
    pic_url: "data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iaWNvbiIgc3R5bGU9IndpZHRoOiAxZW07aGVpZ2h0OiAxZW07dmVydGljYWwtYWxpZ246IG1pZGRsZTtmaWxsOiBjdXJyZW50Q29sb3I7b3ZlcmZsb3c6IGhpZGRlbjsiIHZpZXdCb3g9IjAgMCAxMDI0IDEwMjQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNDkwLjY2NjY2NyA2NDQuMjY2NjY3VjQ2OS4zMzMzMzNoODUuMzMzMzMzdjE3NC45MzMzMzRsNDYuOTMzMzMzLTQ2LjkzMzMzNCA1OS43MzMzMzQgNTkuNzMzMzM0LTY4LjI2NjY2NyA2OC4yNjY2NjZoMTMyLjI2NjY2N2M1OS43MzMzMzMtOC41MzMzMzMgMTA2LjY2NjY2Ny02NCAxMDYuNjY2NjY2LTEyOCAwLTcyLjUzMzMzMy01NS40NjY2NjctMTI4LTEyOC0xMjgtMTcuMDY2NjY3IDAtMjkuODY2NjY3IDQuMjY2NjY3LTQyLjY2NjY2NiA4LjUzMzMzNFY0NjkuMzMzMzMzYzAtOTMuODY2NjY3LTc2LjgtMTcwLjY2NjY2Ny0xNzAuNjY2NjY3LTE3MC42NjY2NjZzLTE3MC42NjY2NjcgNzYuOC0xNzAuNjY2NjY3IDE3MC42NjY2NjZjMCAxNy4wNjY2NjcgNC4yNjY2NjcgMjkuODY2NjY3IDQuMjY2NjY3IDQ2LjkzMzMzNC04LjUzMzMzMy00LjI2NjY2Ny0xNy4wNjY2NjctNC4yNjY2NjctMjUuNi00LjI2NjY2N0MyNjAuMjY2NjY3IDUxMiAyMTMuMzMzMzMzIDU1OC45MzMzMzMgMjEzLjMzMzMzMyA2MTguNjY2NjY3UzI2MC4yNjY2NjcgNzI1LjMzMzMzMyAzMjAgNzI1LjMzMzMzM2gxMzIuMjY2NjY3TDM4NCA2NTcuMDY2NjY3bDU5LjczMzMzMy01OS43MzMzMzQgNDYuOTMzMzM0IDQ2LjkzMzMzNHogbTEyMy43MzMzMzMgODEuMDY2NjY2bC04MS4wNjY2NjcgODEuMDY2NjY3LTgxLjA2NjY2Ni04MS4wNjY2NjdINDA1LjMzMzMzM3Y4NS4zMzMzMzRoLTg1LjMzMzMzM0MyMTMuMzMzMzMzIDgxMC42NjY2NjcgMTI4IDcyNS4zMzMzMzMgMTI4IDYxOC42NjY2NjdjMC04NS4zMzMzMzMgNTUuNDY2NjY3LTE1Ny44NjY2NjcgMTI4LTE4My40NjY2NjdDMjczLjA2NjY2NyAzMTEuNDY2NjY3IDM3OS43MzMzMzMgMjEzLjMzMzMzMyA1MTIgMjEzLjMzMzMzM2MxMTAuOTMzMzMzIDAgMjA5LjA2NjY2NyA3Mi41MzMzMzMgMjQzLjIgMTcwLjY2NjY2NyAxMDIuNCAxMi44IDE4My40NjY2NjcgMTAyLjQgMTgzLjQ2NjY2NyAyMTMuMzMzMzMzcy04NS4zMzMzMzMgMjAwLjUzMzMzMy0xOTIgMjEzLjMzMzMzNGgtODUuMzMzMzM0di04NS4zMzMzMzRoLTQ2LjkzMzMzM3oiIGZpbGw9IiM0NDQ0NDQiIC8+PC9zdmc+",
    col_type: "icon_5"
});
d.push({
    title: "““””" + "播放MV".fontcolor("gray").bold().small().small(),
    url: $("").lazyRule((_id) => {
        try {
            let _ = findItem(_id).extra.item;
            if (_.vid || (_.type == 9 && _.id)) {
                require(config.preRule);
                let run = _getPlatform(_.platform).getVideo(_);
                run = formatMediaItem(run);
                return run ? JSON.stringify(run) : "toast://没有链接";
            } else {
                return "toast://没有资源标识";
            }
        } catch (e) {
            return "toast://获取MV失败\n" + e.toString();
        }
    }, it.extra.id),
    pic_url: "data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iaWNvbiIgc3R5bGU9IndpZHRoOiAxZW07aGVpZ2h0OiAxZW07dmVydGljYWwtYWxpZ246IG1pZGRsZTtmaWxsOiBjdXJyZW50Q29sb3I7b3ZlcmZsb3c6IGhpZGRlbjsiIHZpZXdCb3g9IjAgMCAxMDI0IDEwMjQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNODUzLjMzMzMzMyA2ODIuNjY2NjY3aDQyLjY2NjY2N3Y4NS4zMzMzMzNIMTI4di04NS4zMzMzMzNoNDIuNjY2NjY3VjI1Nmg2ODIuNjY2NjY2djQyNi42NjY2Njd6TTI1NiAzNDEuMzMzMzMzdjI5OC42NjY2NjdoNTEyVjM0MS4zMzMzMzNIMjU2eiIgZmlsbD0iIzQ0NDQ0NCIgLz48L3N2Zz4=",
    col_type: "icon_5",
    extra: {
        cls: "playlist getVideo"
    }
});
d.push({
    title: "““””" + "精彩评论".fontcolor("gray").bold().small().small(),
    url: "toast://完善中~",
    pic_url: "data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iaWNvbiIgc3R5bGU9IndpZHRoOiAxZW07aGVpZ2h0OiAxZW07dmVydGljYWwtYWxpZ246IG1pZGRsZTtmaWxsOiBjdXJyZW50Q29sb3I7b3ZlcmZsb3c6IGhpZGRlbjsiIHZpZXdCb3g9IjAgMCAxMDI0IDEwMjQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMzQxLjMzMzMzMyA3MjUuMzMzMzMzaDI5OC42NjY2NjdWMjk4LjY2NjY2N0gyNTZ2NDI2LjY2NjY2Nmg4NS4zMzMzMzN6IG0tMTcwLjY2NjY2NiAwVjIxMy4zMzMzMzNoNTU0LjY2NjY2NnYxMjhoMTI4djM4NGMwIDQ2LjkzMzMzMy0zOC40IDg1LjMzMzMzMy04NS4zMzMzMzMgODUuMzMzMzM0SDI1NmMtNDYuOTMzMzMzIDAtODUuMzMzMzMzLTM4LjQtODUuMzMzMzMzLTg1LjMzMzMzNHogbTU1NC42NjY2NjYtMjk4LjY2NjY2NnYyNzcuMzMzMzMzYzAgMTIuOCA4LjUzMzMzMyAyMS4zMzMzMzMgMjEuMzMzMzM0IDIxLjMzMzMzM3MyMS4zMzMzMzMtOC41MzMzMzMgMjEuMzMzMzMzLTIxLjMzMzMzM1Y0MjYuNjY2NjY3aC00Mi42NjY2Njd6TTI5OC42NjY2NjcgMzQxLjMzMzMzM2gyOTguNjY2NjY2djg1LjMzMzMzNEgyOTguNjY2NjY3VjM0MS4zMzMzMzN6IG0wIDEyOGgyOTguNjY2NjY2djg1LjMzMzMzNEgyOTguNjY2NjY3di04NS4zMzMzMzR6IG0wIDEyOGgyMTMuMzMzMzMzdjg1LjMzMzMzNEgyOTguNjY2NjY3di04NS4zMzMzMzR6IiBmaWxsPSIjNDQ0NDQ0IiAvPjwvc3ZnPg==",
    col_type: "icon_5"
});



d.push({
    url: "hiker://empty",
    col_type: "big_blank_block"
});
d.push({
    url: "hiker://empty",
    col_type: "big_blank_block"
});
d.push({
    url: "hiker://empty",
    col_type: "big_blank_block"
});
d.push({
    title: "““””" + "▌歌手与专辑".fontcolor("gray").bold().small().sub(),
    url: "hiker://empty",
    col_type: "text_1",
    extra: {
        lineVisible: false
    }
});



let artistNames = _.artist.split("&");
let artistIds = (_.artistId || "").split("&");
for (let i = 0; i < artistNames.length; i++) {
    d.push({
        title: "歌手：" + artistNames[i],
        desc: ">",
        pic_url: "data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iaWNvbiIgc3R5bGU9IndpZHRoOiAxZW07aGVpZ2h0OiAxZW07dmVydGljYWwtYWxpZ246IG1pZGRsZTtmaWxsOiBjdXJyZW50Q29sb3I7b3ZlcmZsb3c6IGhpZGRlbjsiIHZpZXdCb3g9IjAgMCAxMDI0IDEwMjQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNzI1LjMzMzMzMyA3MjEuMDY2NjY3bC0zOC40LTM4LjRIMzc5LjczMzMzM2wtMzguNCAzOC40Vjc2OGgzODR2LTQ2LjkzMzMzM3ogbTg1LjMzMzMzNC0zOC40djE3MC42NjY2NjZIMjU2di0xNzAuNjY2NjY2aDQuMjY2NjY3bDg1LjMzMzMzMy04NS4zMzMzMzRoMzc1LjQ2NjY2N2w4OS42IDg1LjMzMzMzNHogbS04NS4zMzMzMzQtMzIwYzAgMTA2LjY2NjY2Ny04NS4zMzMzMzMgMTkyLTE5MiAxOTJTMzQxLjMzMzMzMyA0NjkuMzMzMzMzIDM0MS4zMzMzMzMgMzYyLjY2NjY2NyA0MjYuNjY2NjY3IDE3MC42NjY2NjcgNTMzLjMzMzMzMyAxNzAuNjY2NjY3IDcyNS4zMzMzMzMgMjU2IDcyNS4zMzMzMzMgMzYyLjY2NjY2N3ogbS04NS4zMzMzMzMgMEM2NDAgMzAyLjkzMzMzMyA1OTMuMDY2NjY3IDI1NiA1MzMuMzMzMzMzIDI1NlM0MjYuNjY2NjY3IDMwMi45MzMzMzMgNDI2LjY2NjY2NyAzNjIuNjY2NjY3czQ2LjkzMzMzMyAxMDYuNjY2NjY3IDEwNi42NjY2NjYgMTA2LjY2NjY2NlM2NDAgNDIyLjQgNjQwIDM2Mi42NjY2Njd6IiBmaWxsPSIjNDQ0NDQ0IiAvPjwvc3ZnPg==",
        url: artistIds[i] ? buildUrl("hiker://page/home", {
            p: "fypage",
            t: "getArtistWorks",
            s: getItem('pageHomeType', '#immersiveTheme#'),
            rule: MY_RULE.title,
            platform: _.platform,
            id: artistIds[i],
        }) : "hiker://empty",
        col_type: "avatar",
        extra: {
            pageTitle: artistNames[i]
        }
    });
}



d.push({
    title: "专辑：" + (_.album || _.title),
    desc: ">",
    pic_url: "data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iaWNvbiIgc3R5bGU9IndpZHRoOiAxZW07aGVpZ2h0OiAxZW07dmVydGljYWwtYWxpZ246IG1pZGRsZTtmaWxsOiBjdXJyZW50Q29sb3I7b3ZlcmZsb3c6IGhpZGRlbjsiIHZpZXdCb3g9IjAgMCAxMDI0IDEwMjQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNDMwLjkzMzMzMyA0OTQuOTMzMzMzbDgxLjA2NjY2NyA0Ni45MzMzMzQgMjM4LjkzMzMzMy0xMzYuNTMzMzM0LTgxLjA2NjY2Ni00Ni45MzMzMzMtMjM4LjkzMzMzNCAxMzYuNTMzMzMzeiBtLTg1LjMzMzMzMy01MS4ybDIzOC45MzMzMzMtMTM2LjUzMzMzMy03Mi41MzMzMzMtNDIuNjY2NjY3LTIzOC45MzMzMzMgMTM2LjUzMzMzNCA3Mi41MzMzMzMgNDIuNjY2NjY2ek0yNTYgNDkwLjY2NjY2N3YxNDUuMDY2NjY2bDIxMy4zMzMzMzMgMTIzLjczMzMzNHYtMTQ1LjA2NjY2N2wtMjEzLjMzMzMzMy0xMjMuNzMzMzMzeiBtNTEyIDBsLTIxMy4zMzMzMzMgMTIzLjczMzMzM3YxNDUuMDY2NjY3bDIxMy4zMzMzMzMtMTIzLjczMzMzNHYtMTQ1LjA2NjY2NnpNNTEyIDE3MC42NjY2NjdsMzQxLjMzMzMzMyAxOTYuMjY2NjY2VjY4Mi42NjY2NjdsLTM0MS4zMzMzMzMgMTk2LjI2NjY2NkwxNzAuNjY2NjY3IDY4Mi42NjY2NjdWMzY2LjkzMzMzM0w1MTIgMTcwLjY2NjY2N3oiIGZpbGw9IiM0NDQ0NDQiIC8+PC9zdmc+",
    url: _.albumId ? buildUrl("hiker://page/home", {
        p: "fypage",
        t: "getAlbumInfo",
        s: getItem('pageHomeType', '#immersiveTheme#'),
        rule: MY_RULE.title,
        platform: _.platform,
        id: _.albumId,
    }) : "hiker://empty",
    col_type: "avatar",
    extra: {
        pageTitle: _.album || _.title
    }
});