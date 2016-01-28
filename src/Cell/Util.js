
let Formatter = require('uxcore-formatter');
var util={
    formatValue: (value, type, delimiter) => {
        delimiter = delimiter || " ";
        if (value === null || value === undefined) {
            return value;
        }
        value = value + "";
        if (type == "money") {
            return Formatter.money(value, delimiter);
        }
        else if (type == "card") {
            return Formatter.card(value, delimiter);
        }
        else if (type == "cnmobile") {
            return Formatter.cnmobile(value, delimiter);
        }
    }
};

module.exports = util;
