let scriptCode = `const Buffer = {
    from: t => {
        r = t.length;
        e = new Uint8Array(r);
        for (n = 0; n < r; n++)
            e[n] = t.charCodeAt(n);
        return e
    }
}
range = t => Array.from(new Array(t).keys());
Long = t => {
    const r = BigInt(t);
    return {
        toString: () => r.toString(),
        isNegative: () => r < 0,
        not: () => Long(~r),
        low: Number(r),
        or: t => Long(r | BigInt(t)),
        xor: t => Long(r ^ BigInt(t)),
        and: t => Long(r & BigInt(t)),
        equals: t => r === BigInt(t),
        shiftLeft: t => Long(r << BigInt(t)),
        shiftRight: t => Long(r >> BigInt(t))
    }
};
LongArray = t => t.map(t => Long(t));
arrayE = LongArray([
    31, 0, 1, 2, 3, 4, -1, -1,
    3, 4, 5, 6, 7, 8, -1, -1,
    7, 8, 9, 10, 11, 12, -1, -1,
    11, 12, 13, 14, 15, 16, -1, -1,
    15, 16, 17, 18, 19, 20, -1, -1,
    19, 20, 21, 22, 23, 24, -1, -1,
    23, 24, 25, 26, 27, 28, -1, -1,
    27, 28, 29, 30, 31, 30, -1, -1
])
arrayIP = LongArray([
    57, 49, 41, 33, 25, 17, 9, 1,
    59, 51, 43, 35, 27, 19, 11, 3,
    61, 53, 45, 37, 29, 21, 13, 5,
    63, 55, 47, 39, 31, 23, 15, 7,
    56, 48, 40, 32, 24, 16, 8, 0,
    58, 50, 42, 34, 26, 18, 10, 2,
    60, 52, 44, 36, 28, 20, 12, 4,
    62, 54, 46, 38, 30, 22, 14, 6
])
arrayIP_1 = LongArray([
    39, 7, 47, 15, 55, 23, 63, 31,
    38, 6, 46, 14, 54, 22, 62, 30,
    37, 5, 45, 13, 53, 21, 61, 29,
    36, 4, 44, 12, 52, 20, 60, 28,
    35, 3, 43, 11, 51, 19, 59, 27,
    34, 2, 42, 10, 50, 18, 58, 26,
    33, 1, 41, 9, 49, 17, 57, 25,
    32, 0, 40, 8, 48, 16, 56, 24
])
arrayLs = [
    1, 1, 2, 2, 2, 2, 2, 2,
    1, 2, 2, 2, 2, 2, 2, 1
]
arrayLsMask = LongArray([0, 1048577, 3145731])
arrayMask = range(64).map(t => Math.pow(2, t))
arrayMask[63] *= -1
arrayP = LongArray([
    15, 6, 19, 20, 28, 11, 27, 16,
    0, 14, 22, 25, 4, 17, 30, 9,
    1, 7, 23, 13, 31, 26, 2, 8,
    18, 12, 29, 5, 21, 10, 3, 24
])
arrayPC_1 = LongArray([
    56, 48, 40, 32, 24, 16, 8, 0,
    57, 49, 41, 33, 25, 17, 9, 1,
    58, 50, 42, 34, 26, 18, 10, 2,
    59, 51, 43, 35, 62, 54, 46, 38,
    30, 22, 14, 6, 61, 53, 45, 37,
    29, 21, 13, 5, 60, 52, 44, 36,
    28, 20, 12, 4, 27, 19, 11, 3
])
arrayPC_2 = LongArray([
    13, 16, 10, 23, 0, 4, -1, -1,
    2, 27, 14, 5, 20, 9, -1, -1,
    22, 18, 11, 3, 25, 7, -1, -1,
    15, 6, 26, 19, 12, 1, -1, -1,
    40, 51, 30, 36, 46, 54, -1, -1,
    29, 39, 50, 44, 32, 47, -1, -1,
    43, 48, 38, 55, 33, 52, -1, -1,
    45, 41, 49, 35, 28, 31, -1, -1
])
matrixNSBox = [
    [
        14, 4, 3, 15, 2, 13, 5, 3,
        13, 14, 6, 9, 11, 2, 0, 5,
        4, 1, 10, 12, 15, 6, 9, 10,
        1, 8, 12, 7, 8, 11, 7, 0,
        0, 15, 10, 5, 14, 4, 9, 10,
        7, 8, 12, 3, 13, 1, 3, 6,
        15, 12, 6, 11, 2, 9, 5, 0,
        4, 2, 11, 14, 1, 7, 8, 13
    ],
    [
        15, 0, 9, 5, 6, 10, 12, 9,
        8, 7, 2, 12, 3, 13, 5, 2,
        1, 14, 7, 8, 11, 4, 0, 3,
        14, 11, 13, 6, 4, 1, 10, 15,
        3, 13, 12, 11, 15, 3, 6, 0,
        4, 10, 1, 7, 8, 4, 11, 14,
        13, 8, 0, 6, 2, 15, 9, 5,
        7, 1, 10, 12, 14, 2, 5, 9
    ],
    [
        10, 13, 1, 11, 6, 8, 11, 5,
        9, 4, 12, 2, 15, 3, 2, 14,
        0, 6, 13, 1, 3, 15, 4, 10,
        14, 9, 7, 12, 5, 0, 8, 7,
        13, 1, 2, 4, 3, 6, 12, 11,
        0, 13, 5, 14, 6, 8, 15, 2,
        7, 10, 8, 15, 4, 9, 11, 5,
        9, 0, 14, 3, 10, 7, 1, 12
    ],
    [
        7, 10, 1, 15, 0, 12, 11, 5,
        14, 9, 8, 3, 9, 7, 4, 8,
        13, 6, 2, 1, 6, 11, 12, 2,
        3, 0, 5, 14, 10, 13, 15, 4,
        13, 3, 4, 9, 6, 10, 1, 12,
        11, 0, 2, 5, 0, 13, 14, 2,
        8, 15, 7, 4, 15, 1, 10, 7,
        5, 6, 12, 11, 3, 8, 9, 14
    ],
    [
        2, 4, 8, 15, 7, 10, 13, 6,
        4, 1, 3, 12, 11, 7, 14, 0,
        12, 2, 5, 9, 10, 13, 0, 3,
        1, 11, 15, 5, 6, 8, 9, 14,
        14, 11, 5, 6, 4, 1, 3, 10,
        2, 12, 15, 0, 13, 2, 8, 5,
        11, 8, 0, 15, 7, 14, 9, 4,
        12, 7, 10, 9, 1, 13, 6, 3
    ],
    [
        12, 9, 0, 7, 9, 2, 14, 1,
        10, 15, 3, 4, 6, 12, 5, 11,
        1, 14, 13, 0, 2, 8, 7, 13,
        15, 5, 4, 10, 8, 3, 11, 6,
        10, 4, 6, 11, 7, 9, 0, 6,
        4, 2, 13, 1, 9, 15, 3, 8,
        15, 3, 1, 14, 12, 5, 11, 0,
        2, 12, 14, 7, 5, 10, 8, 13
    ],
    [
        4, 1, 3, 10, 15, 12, 5, 0,
        2, 11, 9, 6, 8, 7, 6, 9,
        11, 4, 12, 15, 0, 3, 10, 5,
        14, 13, 7, 8, 13, 14, 1, 2,
        13, 6, 14, 9, 4, 1, 2, 14,
        11, 13, 5, 0, 1, 10, 8, 3,
        0, 11, 3, 5, 9, 4, 15, 2,
        7, 8, 12, 15, 10, 7, 6, 12
    ],
    [
        13, 7, 10, 0, 6, 9, 5, 15,
        8, 4, 3, 10, 11, 14, 12, 5,
        2, 11, 9, 6, 15, 12, 0, 3,
        4, 1, 14, 13, 1, 2, 7, 8,
        1, 2, 12, 15, 10, 4, 0, 3,
        13, 14, 6, 9, 7, 8, 9, 6,
        15, 1, 5, 12, 3, 10, 14, 5,
        8, 7, 11, 0, 4, 13, 2, 11
    ]
]
bitTransform = (t, r, e) => {
    let n = Long(0);
    return range(r).forEach(r => {
        t[r].isNegative() || e.and(arrayMask[t[r].low]).equals(0) || (n = n.or(arrayMask[r]))
    }), n
}
DES64 = (t, r) => {
        e = [],
        n = [];
        f = bitTransform(arrayIP, 64, r);
    return n[0] = f.and(4294967295),
    n[1] = f.and(-4294967296).shiftRight(32),
    range(16).forEach(r => {
        let f = Long(0);
        i = Long(n[1]),
        i = bitTransform(arrayE, 64, i).xor(t[r]),
        range(8).forEach(t => {
            e[t] = i.shiftRight(8 * t).and(255)
        }),
        range(8).reverse().forEach(t => {
            f = f.shiftLeft(4).or(matrixNSBox[t][e[t]])
        }),
        i = bitTransform(arrayP, 32, f),
        o = Long(n[0]),
        n[0] = Long(n[1]),
        n[1] = o.xor(i)
    }),
    n.reverse(),
    f = n[1].shiftLeft(32).and(-4294967296).or(n[0].and(4294967295)),
    f = bitTransform(arrayIP_1, 64, f)
}
subKeys = (t, r, e) => {
    let n = bitTransform(arrayPC_1, 56, t);
    range(16).forEach(t => {
        n = n.and(arrayLsMask[arrayLs[t]]).shiftLeft(28 - arrayLs[t]).or(n.and(arrayLsMask[arrayLs[t]].not()).shiftRight(arrayLs[t])),
        r[t] = bitTransform(arrayPC_2, 64, n)
    });
    if (e === 1)		{
		range(8).forEach(t => {
			let rt = r[t];
			r[t] = r[15-t];
			r[15-t] = rt;
    });
		}
}
encrypt = (t, r, e) => {
    let n = Long(0);
    range(8).forEach(t => {
        n = Long(r[t]).shiftLeft(8 * t).or(n)
    });
    const o = Math.floor(t.length / 8),
        i = range(16).map(() => Long(0));
    subKeys(n, i, e);
    const f = range(o).map(() => Long(0));
    range(o).forEach(r => {
        range(8).forEach(e => {
            f[r] = Long(t[e + 8 * r]).shiftLeft(8 * e).or(f[r])
        })
    });
    const s = [];
    range(o).forEach(t => {
        s[t] = DES64(i, f[t])
    });
    const u = t.slice(8 * o);
    if(u.length&&e!==1){
    let h = Long(0);
    range(t.length % 8).forEach(t => {
        h = Long(u[t]).shiftLeft(8 * t).or(h)
    }), s[o] = DES64(i, h);
    }
    const a = [];
    let c = 0;
    return s.forEach(t => {
        range(8).forEach(r => {
            a[c] = t.shiftRight(8 * r).and(255).low;
            c ++
        })
    }), a;
}
$exports = function(t, e) {
    if (e===1) {
    	t = window.atob(t);
    t = Array.from(t).map((char)=> {
    return char.charCodeAt(0);
});
   }else{
   	t = Buffer.from(t);
   }
    b = encrypt(t, Buffer.from("ylzsxkwm"), e);
    return window.btoa(String.fromCharCode.apply(null, b));
}("$text", $type);`;
$.exports = {
    encrypt: function(t, isAscll) {
        t = isAscll ? encodeURIComponent(t) : t;
        let scriptCode2 = scriptCode.replace("$type", "0");
        return executeWebRule("", $.toString((scriptCode) => {
            eval(scriptCode);
            return $exports;
        }, scriptCode2.replace("$text", t)));
    },
    decrypt: function(t, isAscll) {
        let scriptCode2 = scriptCode.replace("$type", "1");
        let decryptStr = executeWebRule("", $.toString((scriptCode) => {
            eval(scriptCode);
            return $exports;
        }, scriptCode2.replace("$text", t)));
        t = base64Decode(decryptStr);
        return isAscll ? decodeURIComponent(t) : t;
    }
}