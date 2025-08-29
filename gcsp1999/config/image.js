let imageNames = ["open.svg", "icon.png", "down.png", "shut.svg", "Loading.gif", "2.png", "1.png", "3.png", "topImg.png", "play.png", "jump.png", "update.svg", "edit.svg", "share.svg", "proxy.svg", "uninstall.svg", "account.svg", "import.svg", "hijack.svg", "unhijack.svg", "selected.svg", "unselected.svg", "sorted.svg"];
let imagePath2 = _getPath(["image", ""], 0, 1);
let imagePath1 = getGitHub(["image", ""]);
for (let imageName of imageNames) {
    // saveImage('http://x.com/1.png||http://x.com/2.png', 'hiker://files/1.png')
    downloadFile(imagePath1 + imageName, imagePath2 + imageName);
}
log("图片初始化成功");