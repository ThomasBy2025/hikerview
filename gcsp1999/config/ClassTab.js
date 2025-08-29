var {
    class_name,
    class_url,
    area_name,
    area_url,
    year_name,
    year_url,
    sort_name,
    sort_url,
    url
} = $.importParam;
const ClassTab = function(classArray, params) {
    Object.assign(this, params)
    this.arr = classArray.map(v => this.init(v))
    this.sign = '$gcsp1999_$' + params.name + '_$'
    this.color = this.color || '#12b668'
    this.boundary = this.boundary || 'blank_block'
}
ClassTab.prototype = {
    constructor: ClassTab,
    load(el) {
        let folded = this.fold && getVar('$fold_' + this.sign, '')
        if (this.arr.length > 1 && this.fold) el.push({
            title: '““””' + (folded ? '▶' : '▼').fontcolor('#049eff'),
            url: $('#noLoading#').lazyRule((sign, folded) => {
                putVar('$fold_' + sign, folded ? '' : 'T')
                refreshPage(false)
                return 'hiker://empty'
            }, this.sign, folded),
            col_type: 'scroll_button'
        })
        let arr = folded ? [this.arr[0]] : this.arr
        arr.forEach((v) => {
            let {
                id,
                class_name,
                class_url
            } = v,
            selected = JSON.stringify(this.getClass(id))
            class_name.forEach((name, i) => {
                let url = class_url[i],
                    now = JSON.stringify({
                        name: name,
                        url: url
                    })
                el.push({
                    title: '““””' + (selected == now ? name.fontcolor(this.color).bold() : name.fontcolor('Gray').bold()),
                    url: selected == now ? 'hiker://empty' : $('#noLoading#').lazyRule((sign, id, now) => {
                        putVar(sign + id, now)
                        refreshPage(false)
                        return 'hiker://empty'
                    }, this.sign, id, now),
                    col_type: 'scroll_button'
                })
            })
            el.push({
                col_type: this.boundary
            })
        });
    },
    init(classObject) {
        if (typeof classObject.class_name == 'string')
            classObject.class_name = classObject.class_name.split('&')
        if (typeof classObject.class_url == 'string')
            classObject.class_url = classObject.class_url.split('&').map((v) => v.trim())
        return classObject
    },
    push(classObject) {
        this.arr.push(this.init(classObject))
    },
    getClass(id) {
        let defaultClass = this.arr.find(item => item.id == id)
        defaultClass = JSON.stringify(defaultClass ? {
            name: defaultClass.class_name[0],
            url: defaultClass.class_url[0]
        } : {
            name: 'cannot find id: ' + id + ' in classTab: ' + this.sign,
            url: ''
        })
        return JSON.parse(getVar(this.sign + id, defaultClass))
    },
    getBaseUrl() {
        url = fyAll ? url.replace(/fyAll/g, '$${fyAll}') : url.replace(/fy(class|area|year|sort)/g, '$${fy$1}');
        url = url.replace(/\$\{([^}]*)\}/g, (_, id) => this.getClass(id).url);

        url = url.replace(/fypage(?:@(-?\d+)@)?(?:\*(\d+)@)?/g, (_, start, space) => parseInt(start || 0) + 1 + (page - 1) * parseInt(space || 1));
        url = /^([\s\S]*?)(?:\[firstPage=([\s\S]*?)\])?(?:(\.js:[\s\S]*?))?$/.exec(url);
        if (page == 1 && url[2]) url[1] = url[2];
        if (url[3] && !url[1].includes('.js:')) url[1] += url[3];
        return function runCode(rule) {
            try {
                let [input, code] = rule.split('.js:')
                return code ? eval(code) : rule
            } catch (e) {
                return rule
            }
        }(url[1]);
    }
}


// 生成头部分类
let fyAll = url.includes('fyAll'),
    tabHeader = []
if (class_name) tabHeader.push({
    id: fyAll ? 'fyAll' : 'fyclass',
    class_name: class_name,
    class_url: class_url
})
if (area_name) tabHeader.push({
    id: fyAll ? 'fyAll' : 'fyarea',
    class_name: area_name,
    class_url: area_url
})
if (year_name) tabHeader.push({
    id: fyAll ? 'fyAll' : 'fyyear',
    class_name: year_name,
    class_url: year_url
})
if (sort_name) tabHeader.push({
    id: fyAll ? 'fyAll' : 'fysort',
    class_name: sort_name,
    class_url: sort_url
})
$.exports = new ClassTab(tabHeader, {
    name: platform,
    fold: true,
});