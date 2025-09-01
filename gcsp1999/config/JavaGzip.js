/* 用途不明
const FileUtil = com.example.hikerview.utils.FileUtil;
const DeflaterInputStream = java.util.zip.DeflaterInputStream;
*/
const Byte = java.lang.Byte;
const Base64 = java.util.Base64;
const javaString = java.lang.String;
const StringBuffer = java.lang.StringBuffer;
const newInstance = java.lang.reflect.Array.newInstance;

const Deflater = java.util.zip.Deflater; // 创建zip
const GZIPOutputStream = java.util.zip.GZIPOutputStream; // gzip压缩
const GZIPInputStream = java.util.zip.GZIPInputStream; // gzip解压
const DeflaterOutputStream = java.util.zip.DeflaterOutputStream; // zip压缩
const InflaterInputStream = java.util.zip.InflaterInputStream; // zip解压
const ByteArrayOutputStream = java.io.ByteArrayOutputStream; // 承载byte
const ByteArrayInputStream = java.io.ByteArrayInputStream; // 传递byte



// 压缩字符串
function zip(text, isGzip, mode) {
    let baseStr = new javaString(text);
    let baos = new ByteArrayOutputStream();
    if (isGzip) { // gzip压缩
        let gzos = new GZIPOutputStream(baos);
        gzos.write(baseStr.getBytes("UTF-8"));
        gzos.close();
    } else { // zip压缩
        let deflater = new Deflater();
        deflater.setLevel(Deflater.BEST_COMPRESSION);
        let dos = new DeflaterOutputStream(baos, deflater);
        dos.write(baseStr.getBytes("UTF-8"));
        dos.finish();
        dos.close();
    }
    // 返回
    baos.close();
    return getMode(baos.toByteArray(), mode);
}



// hexText = fetch(path, {toHex:true});
function unzip(hexText, isGzip, mode) {

    // hex文本 转换成byte
    let compressedData = Base64.getDecoder().decode(hexToBase64(hexText));
    let bais = new ByteArrayInputStream(compressedData);
    let baos = new ByteArrayOutputStream();
    let buffer = new newInstance(Byte.TYPE, 1024);

    // zip解压 或 gzip解压
    let xis, len;
    if (isGzip) {
        xis = new GZIPInputStream(bais)
    } else {
        xis = new InflaterInputStream(bais);
    }
    while ((len = xis.read(buffer)) != -1) {
        baos.write(buffer, 0, len);
    }
    xis.close();
    bais.close();
    baos.close();

    // 返回
    return getMode(baos.toByteArray(), mode);
}



// 异或字符串
function xor(str1, str2, mode, Charset) {
    let bufarr = typeof str1 === 'string' ? javaString(str1).getBytes() : str1;
    let bufkey = typeof str2 === 'string' ? javaString(str2).getBytes() : str2;
    let bufarrlen = bufarr.length;
    let bufkeylen = bufkey.length;
    let a = javaString(str1).getBytes();
    let i = 0;
    while (i < bufarrlen) {
        let j = 0
        while (j < bufkeylen && i < bufarrlen) {
            a[i] = bufarr[i] ^ bufkey[j];
            i++;
            j++;
        }
    }
    return getMode(a, mode, Charset);
}



// 获取返回值
function getMode(javaBytes, modeType, Charset) {
    if (modeType === true) return javaBytes;
    Charset = Charset || "UTF-8";
    switch (modeType) {
        case "Hex": // 转换为Hex字符串
            let strBuffer = new StringBuffer();
            for (let i = 0; i < javaBytes.length; i++) {
                strBuffer.append(javaString.format("%02x", Byte(javaBytes[i])));
            }
            return String(strBuffer.toString());
            break;
        case "Base64": // 转化为Base64字符串
            let base64String = Base64.getEncoder().encodeToString(javaBytes);
            return String(base64String);
            break;
        case "UTF-8":
        default: // 返回字符串
            let compressedData = new javaString(javaBytes, Charset);
            return String(compressedData);
            break;
    }
}
$.exports = {
    javaString,
    Base64,
    getMode,
    unzip,
    zip,
    xor
};