var util={
    formatValue: (value, type) => {
        if (type == "money") {
            return value.replace(/(\d{3})(?!$)/g, "$1 ");
        }
        else if (type == "card") {
            return value.replace(/(\d{4})(?!$)/g, "$1 ");
        }
        else if (type == "cnmobile") {
            return value.replace(/^(\+?0?86)(?!$)/, "$1 ").replace(/(\d{4})(?!$)/g, "$1 ");
        }
    }
};

module.exports=util;
