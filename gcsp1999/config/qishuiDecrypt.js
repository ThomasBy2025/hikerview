function decodeSpadeValue(ch) {
    let code = Number(ch);
    if (code >= 48 && code <= 57) {
        return code - 48;
    }
    if (code >= 97 && code <= 122) {
        return code - 97 + 10;
    }
    return 0xFF;
}

function popcount32(value) {
    let x = value & 0xFFFFFFFF;
    let count = 0;
    while (x) {
        count += x & 1;
        x >>>= 1;
    }
    return count;
}

function decodeSpadePlayAuth(playAuth) {
    let raw = _base64.decode(playAuth, _base64.NO_WRAP);
    if (raw.length < 3) {
        return "";
    }
    let pad = (raw[0] ^ raw[1] ^ raw[2]) - 48;
    let dml = raw.length - pad - 2;
    if (pad < 0 || dml <= 1 || raw.length < pad + 2) {
        return "";
    }
    let end = raw.length - pad;
    let source = raw.slice(1, end);
    let candidate = source.map(n => (n + 256) % 256);
    let buff = [0xfa, 0x55].concat(candidate);
    for (let i = 0; i < source.length; i++) {
        let v = (candidate[i] ^ buff[i]) - popcount32(i) - 21;
        while (v < 0) {
            v += 0xFF;
        }
        candidate[i] = v;
    }
    let skip = decodeSpadeValue(candidate[0]);
    let decoded = candidate.slice(1, 1 + dml - skip)
        .map(n => (n < 128 ? n : n - 256));
    return java.lang.String(decoded, "UTF-8");
}

function getAudioFileUrl(audioUrl) {
    let _fileUrl = "hiker://files/_cache/Thomas/gcsp1999/qishuiMusic/";
    if (audioUrl.match(_fileUrl)) {
        audioUrl = base64Decode(audioUrl.replace(_fileUrl, "")
            .replace(/\_/g, "/").replace(/\-/g, "+"));
    }
    let audioMat = audioUrl.match(/tos\-cn\-ve\-(\d+)\/[a-z0-9]+/i);
    if (audioMat[1] == 2774) {
        audioUrl = "https://sf6-cdn-tos.douyinstatic.com/obj/" + audioMat[0];
    }
    _fileUrl += base64Encode(audioUrl).replace(/=+$/, "")
        .replace(/\//g, "_").replace(/\+/g, "-");
    showLoading('正在获取资源详情');
    writeHexFile(_fileUrl, fetch(audioUrl, {
        toHex: true
    }));
    hideLoading();
    return _fileUrl;
}

$.exports = function(audioUrl, audioEkey) {
    audioUrl = getAudioFileUrl(audioUrl); // 把在线资源下载到本地
    audioEkey = decodeSpadePlayAuth(audioEkey) || audioEkey;
    let purl = startProxyServer($.toString((getAudioFileUrl) => {
        try {

            // AES-CTR解密[Java]
            const Cipher = javax.crypto.Cipher;
            const IvParameterSpec = javax.crypto.spec.IvParameterSpec;
            const SecretKeySpec = javax.crypto.spec.SecretKeySpec;
            const aesCtrDecrypt = (key, iv, encrypted) => {
                let secretKey = new SecretKeySpec(key, "AES");
                let ivSpec = new IvParameterSpec(iv);
                let cipher = Cipher.getInstance("AES/CTR/NoPadding");
                cipher.init(Cipher.DECRYPT_MODE, secretKey, ivSpec);
                return cipher.doFinal(encrypted);
            }

            // 轻拷贝ByteBuffer
            function copyBuf(buf, start, end) {
                return buf.duplicate()
                    .position(start)
                    .limit(end)
                    .slice();
            }

            // ByteBuffer转Bytes
            function copyArr(buf, start, end, len) {
                let bit = java.nio.ByteBuffer.allocate(len);
                copyBuf(buf, start, end).get(bit.array(), 0, end - start);
                return bit.flip().array();
            }

            // 获取mp4Box
            function readBox(p, end) {
                if (end - p < 8) return false;
                let size = buffer.getInt(p); // readUint32BE
                let headerSize = 8;
                if (size == 1) {
                    if (end - p < 16) {
                        return false;
                    }
                    size = buffer.getLong(p + 8); // readBigUInt64BE
                    headerSize = 16;
                } else if (size == 0) {
                    size = end - p;
                }
                if (size < headerSize || (end - p) < size) {
                    return false;
                }
                let sub = copyArr(buffer, p + 4, p + 8, 4);
                sub = java.lang.String(sub, "UTF-8");
                if (/[^a-z0-9]/i.test(sub)) return {};
                return {
                    type: sub,
                    size: size,
                    start: p,
                    headerSize: headerSize,
                    payload: p + headerSize,
                    payloadSize: size - headerSize
                }
            }

            // 遍历mp4Box
            function findBox(_data, _offset) {
                let p = _data.payload + (_offset || 0);
                let end = _data.payload + _data.payloadSize;
                let map = {};
                while (p < end) {
                    let currentBox = readBox(p, end);
                    if (currentBox && currentBox.type) {
                        let newItem = {};
                        if (currentBox.payloadSize >= 8 && currentBox.type != "mdat") {
                            newItem = findBox(currentBox); // 递归遍历
                        }
                        newItem.extra = currentBox;
                        map[currentBox.type] = newItem;
                        p += currentBox.size;
                    } else {
                        p += 8;
                    }
                }
                return map;
            }

            // 格式化stsz
            function parseStsz(_) {
                let _buf = copyBuf(buffer, _.start + 8, _.start + _.size);
                let count = _buf.getInt(8);
                let sampleSize = _buf.getInt(4);
                return Array.from({
                    length: count
                }, (_, i) => { // sampleSize !== 0
                    return sampleSize || _buf.getInt(12 + i * 4);
                });
            }

            // 格式化senc
            function parseSenc(_) {
                let _buf = copyBuf(buffer, _.start + 8, _.start + _.size);
                let count = _buf.getInt(4);
                let p = 8;
                let ivs = [];
                for (let i = 0; i < count; i++) {
                    ivs.push(copyArr(_buf, p, p + 8, 16));
                    p += 8;
                }
                return ivs;
            }



            toast("汽水音乐: CENC解密已注册\n解析需要时间， 请耐心等待");
            let ekey = decodeURIComponent(MY_PARAMS.ekey[0]);
            let purl = decodeURIComponent(MY_PARAMS.purl[0]);
            let bytes = fetch(purl, {
                inputStream: true
            });
            if (bytes.length === 0) {
                purl = getAudioFileUrl(purl);
                bytes = fetch(purl, {
                    inputStream: true
                }).readAllBytes();
            } else {
                bytes = bytes.readAllBytes();
            }
            let buffer = java.nio.ByteBuffer.wrap(bytes);
            buffer.order(java.nio.ByteOrder.BIG_ENDIAN);


            // 把数据递归成json
            let mp4 = findBox({
                payloadSize: buffer.limit(),
                payload: 0,
            });
            let stbl = mp4.moov.trak.mdia.minf.stbl;


            // 解密 'mdat'
            let offset = mp4.mdat.extra.start + 8;
            let sampleSizes = parseStsz(stbl.stsz.extra);
            let ivs = parseSenc(stbl.senc ? stbl.senc.extra : mp4.moov.senc.extra);
            let key = _base64.decode(hexToBase64(ekey), _base64.NO_WRAP);
            for (let i = 0; i < sampleSizes.length; i++) {
                let size = sampleSizes[i];
                let _bit = copyArr(buffer, offset, (offset + size), size); // arr.slice(a,b)
                let sample = aesCtrDecrypt(key, ivs[i], _bit); // 解密
                buffer.position(offset);
                buffer.put(sample); // 替换
                offset += size;
            }


            /*
                        // 查找 'enca' 替换为 'mp4a'
                        let enca = stbl.stsd.enca.extra;
                        buffer.position(enca.start + 4);
                        buffer.put([0x6D, 0x70, 0x34, 0x61]);
            */
            /*
                        // 查找 'dfLa' 替换为 'fLaC'
                        let dfLa = stbl.stsd.dfLa.extra;
                        buffer.position(dfLa.start + 4);
                        buffer.put([0x66, 0x4C, 0x61, 0x43]);
            */

            return {
                body: buffer.array()
            };
        } catch (e) {}
    }, getAudioFileUrl));
    return buildUrl(purl, {
        type: "qishuiDecrypt",
        purl: encodeURIComponent(audioUrl),
        ekey: encodeURIComponent(audioEkey)
    }) + "#isMusic=true#";
}