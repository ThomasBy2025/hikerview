// 从数组读取小端序32位
function readUInt32LE(arr, i) {
    return arr.slice(i, i + 4).reduce((acc, byte, idx) =>
        acc + (byte << (idx * 8)), 0) >>> 0;
}


// 从数组读取大端序32位
function readUInt32BE(arr, i) {
    return arr.slice(i, i + 4).reduce((acc, byte, idx) =>
        acc + (byte << ((3 - idx) * 8)), 0) >>> 0;
}


// 将32位整数转换为小端序数组
function writeUInt32LE(num) {
    num >>>= 0;
    return [
        num & 0xFF,
        (num >> 8) & 0xFF,
        (num >> 16) & 0xFF,
        (num >> 24) & 0xFF
    ];
}


// 将32位整数转换为大端序数组
function writeUInt32BE(num) {
    num >>>= 0;
    return [
        (num >> 24) & 0xFF,
        (num >> 16) & 0xFF,
        (num >> 8) & 0xFF,
        num & 0xFF
    ];
}


// QQ_TEA加密的JavaScript实现
function tencentTea(key) {
    let k = key.split("").map(c => c.charCodeAt(0));
    this.secret_key = [
        readUInt32BE(k, 0),
        readUInt32BE(k, 4),
        readUInt32BE(k, 8),
        readUInt32BE(k, 12)
    ];
    this.delta = 0x9E3779B9;
}
tencentTea.prototype.xor = function(a, b) {
    let r = [];
    for (let i = 0; i < 8; i++) {
        r.push(a[i] ^ b[i]);
    }
    return r;
}


// 实现加密
tencentTea.prototype.encode = function(v, [k0, k1, k2, k3]) {
    let y = readUInt32BE(v, 0);
    let z = readUInt32BE(v, 4);
    let s = 0;
    for (let i = 0; i < 16; i++) {
        s += this.delta;
        y += ((z << 4) + k0) ^
            (z + s) ^ ((z >>> 5) + k1);
        z += ((y << 4) + k2) ^
            (y + s) ^ ((y >>> 5) + k3);
    }
    return [].concat(
        writeUInt32BE(y),
        writeUInt32BE(z)
    );
}
tencentTea.prototype.encrypt = function(data) {
    let filln = -(data.length + 10) & 7;
    let salt_2 = [];
    for (let s = 0; s < 2; s++) {
        salt_2[s] = Math.floor(Math.random() * 256);
    }
    let fills = new Array(filln).fill(0xDC);
    let zero = new Array(0x07).fill(0x00);
    let v = [].concat(
        filln | 0xF8,
        salt_2, fills,
        data, zero
    );
    zero.push(0x00);

    let d = [];
    let tr = zero;
    let to = zero;
    for (let i = 0; i < v.length; i += 8) {
        let o = this.xor(v.slice(i, i + 8), tr);
        let r = this.encode(o, this.secret_key);
        tr = this.xor(r, to);
        to = o;
        d = d.concat(tr);
    }
    return d;
};


// 实现解密
tencentTea.prototype.decode = function(v, [k0, k1, k2, k3]) {
    let y = readUInt32BE(v, 0);
    let z = readUInt32BE(v, 4);
    let s = this.delta << 4 | 0;
    for (let i = 0; i < 16; i++) {
        z -= ((y << 4) + k2) ^
            (y + s) ^ ((y >>> 5) + k3)
        y -= ((z << 4) + k0) ^
            (z + s) ^ ((z >>> 5) + k1);
        s -= this.delta;
    }
    return [].concat(
        writeUInt32BE(y),
        writeUInt32BE(z)
    );
}
tencentTea.prototype.decrypt = function(v) {
    let tr = new Array(0x08).fill(0x00);
    let to = tr.slice();
    let d = [];
    for (let i = 0; i < v.length; i += 8) {
        let o = this.xor(v.slice(i, i + 8), tr);
        let r = this.decode(o, this.secret_key);
        let x = this.xor(r, to);
        tr = this.xor(x, to);
        to = v.slice(i, i + 8);
        d = d.concat(x);
    }
    let pos = (d[0] & 0x07) + 2;
    return d.slice(pos + 1, -7);
}


$.exports = {
    tencentTea,
    readUInt32LE,
    readUInt32BE,
    writeUInt32LE,
    writeUInt32BE
}