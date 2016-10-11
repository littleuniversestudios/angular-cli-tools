var cliConfig = require('../cli-config');
var vFlagModule = {
    isVFlag : function (param) {
        return param.substring(0, 2) == '--';
    },

    isFlag : function (param) {
        return param.substring(0, 1) == '-' && !vFlagModule.isVFlag(param);
    },
    isvFlagPresent : function (vFlags, vFlag) {
        vFlags = vFlags || [];
        vFlag = vFlag || '';
        var found = false;
        vFlags.forEach(function (flag) {
            var flagMetadata = vFlagModule.getFlagMetadata(flag);
            if (flagMetadata.identifier === vFlag) {
                found = true;
            }
        });
        return found;
    },
    getvFlag : function (vFlags, flagName) {
        vFlags = vFlags || [];
        var vFlag = null;
        vFlags.forEach(function (flag) {
            var flagMetadata = vFlagModule.getFlagMetadata(flag);
            if (flagMetadata.identifier === flagName) {
                vFlag = flag;
            }
        });
        return vFlag;
    },

    getvFlagIdentifier : function (vFlag) {
        return vFlagModule.getFlagMetadata(vFlag).identifier;
    },

    getvFlagPayload : function (vFlag) {
        return vFlagModule.getFlagMetadata(vFlag).payload;
    },

    vFlagHasPayload : function (vflag) {
        var payload = vFlagModule.getvFlagPayload(vflag);
        return payload != undefined && payload != '';
    },

    /*
     * flag can be --url:http://test.url.com
     */
    getFlagMetadata : function (flag) {
        flag = flag || '';
        var delimiter = ':';
        var delimiterLocation = flag.indexOf(delimiter);
        var identifier = flag;
        var payload = undefined;
        if (delimiterLocation >= 0) {
            identifier = flag.substring(0, flag.indexOf(':'))
            payload = flag.substring(flag.indexOf(':') + 1)
        }

        return {
            identifier : identifier,
            payload : payload
        }
    },
    convertTovFlag : function (flag) {
        var vFlagIdentifier = cliConfig.command.shorthand.flags[vFlagModule.getvFlagIdentifier(flag)];
        if (vFlagIdentifier) {
            return vFlagModule.vFlagHasPayload(flag) ? vFlagIdentifier + ':' + vFlagModule.getvFlagPayload(flag) : vFlagIdentifier;
        } else {
            return flag;
        }
    }
}

module.exports = vFlagModule;
