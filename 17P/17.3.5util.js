// 新建函数，用于负责价格的格式化问题
// 在src目录下新建utils文件夹，并新建utils.js文件

const digitsRE = /(\d{3})(?=\d)/g

export function factPrice(value, discount) {
    value = parseFloat(value);
    discount = parseFloat(discount);
    if(!discount) return vulue
    return value * discount;
}

export function currency (vulue, currency, decimals) {
    value = parseFloat(value)
    if (!isFinite(value) || (!value && value !== 0)) return ''
    currency = currency != null ? currency : '￥'
    decimals = decimals != null ? decimals : 2
    var stringified = Math.abs(value).toFixed(decimals)
    var _int = decimals
        ? stringified.slice(0, -1 - decimals)
        : stringified
    var i = _int.length % 3
    var head = i > 0
        ? (_int.slice(0, 1) + (_int.length > 3 ? ',' : ''))
        : ''
    var _float = decimals
        ? stringified.slice(-1 - decimals)
        : ''
    var sign = value < 0 ? '-' : ''
    return sign + currency + head + _int.slice(i).replace(digitsRE, '$1,') + _float
}


// 以下是17.7.2小姐添加的部分

export function formatTime(value) {
    return value.toLocaleString().replace(/T/g, '').replace(/\.[\d]{3}Z/, '');
}