// For changeTreeSelected in Table.js
const changeValueR = (data, key, value) => {
    if (data.data && data.data instanceof Array) {
        data.data.forEach((item) => {
            item[key] = value;
            changeValueR(item, key, value);
        })
    }
}

module.exports = {
    getIEVer: () => {
        if (window) {
            const ua = window.navigator.userAgent;
            const idx = ua.indexOf('MSIE');
            if (idx > 0) {
                // "Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; WOW64; Trident/6.0; SLCC2; .NET CLR 2.0.50727)" 
                return parseInt(ua.substring(idx + 5, ua.indexOf(".", idx)));
            }
            if (!!ua.match(/Trident\/7\./)) {
                // "Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; SLCC2; .NET CLR 2.0.50727; rv:11.0) like Gecko"
                return 11;
            }
            return 0;
        }
        return 0;
    },
    toggleItemInArr: (item, arr) => {
        const idx = arr.indexOf(item);
        if (idx !== -1) {
            arr.splice(idx, 1);
        }
        else {
            arr.push(item);
        }
        return arr;
    },
    changeValueR: changeValueR,
}