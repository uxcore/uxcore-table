var util={
    formatValue: (value, type, delimiter) => {
        delimiter = delimiter || " ";
        if (value === null || value === undefined) {
            return value;
        }
        value = value + "";
        if (type == "money") {
            return value.replace(/(\d{3})(?![$|\.|\(])/g, "$1" + delimiter);
        }
        else if (type == "card") {
            return value.replace(/(\d{4})(?!$)/g, "$1" + delimiter);
        }
        else if (type == "cnmobile") {
            return value.replace(/^(\+?0?86)(?!$)/, "$1" + delimiter).replace(/(\d{4})(?!$)/g, "$1" + delimiter);
        }
    }
};

module.exports = util;
