var helpers = {
    getPlatform : function () {
        return process.platform;
    },

    isWinOS : function () {
        return helpers.getPlatform() === 'win32';
    },

    getOSDirCharacter : function () {
        return helpers.isWinOS() ? '\\' : '/';
    },

    getCurrentDirectoryName : function () {
        return process.cwd().split(helpers.getOSDirCharacter()).reverse()[0];
    },

    getName : function (component) {
        return component ? component : helpers.getCurrentDirectoryName();
    },

    camelCase : function (str) {
        var pascalCaseName = helpers.pascalCase(str);
        return pascalCaseName[0].toLowerCase() + pascalCaseName.slice(1);
    },

    pascalCase : function (str) {
        return str.split('-').map(function (word) {
            return word.charAt(0).toUpperCase() + word.slice(1);
        }).join('');

    },
    capitalize : function (string) {
        return string && string.length > 1 ? string.charAt(0).toUpperCase() + string.slice(1).toLowerCase() : '';
    },

    containsString : function (string, search) {
        return string.lastIndexOf(search) != -1
    },

    objectHasNestedProperty : function (obj, propertyPath) {
        if (!propertyPath)
            return false;
        var properties = propertyPath.split('.');
        for (var i = 0; i < properties.length; i++) {
            var prop = properties[i];

            if (!obj || !obj.hasOwnProperty(prop)) {
                return false;
            } else {
                obj = obj[prop];
            }
        }

        return true;
    },

    objectGetNestedProperty : function (obj, propertyPath) {
        if (propertyPath == '')return obj;
        var properties = propertyPath.split('.');
        for (var i = 0; i < properties.length; i++) {
            var prop = properties[i];

            if (!obj || !obj.hasOwnProperty(prop)) {
                return undefined;
            } else {
                obj = obj[prop];
            }
        }
        return obj;
    }
};

module.exports = helpers;
