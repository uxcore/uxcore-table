module.exports = {
    isIE: (version) => {
        if (navigator.appName == "Microsoft Internet Explorer") {
            if (!version) {
                return true;
            }
            else {
                return navigator.appVersion.split(";")[1].replace(/[ ]/g,"") == "MSIE" + version + ".0";
            }
        }
        else {
            return false;
        }
    }
}