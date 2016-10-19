#! /usr/bin/env node
var tools = require('../api/tools');
var helpCommands = require('../commands/help/help');
var installModule = require('../commands/install/install');

var installCommands = {
    install : function (fileType, vFlags) {
        vFlags = vFlags || [];

        switch (fileType) {
            case 'templates':
                installModule.createRootFolder(function () {
                    installModule.localTemplates(vFlags);
                    installModule.localConfig(vFlags);
                });
                break;
            case 'config':
                installModule.createRootFolder(function () {
                    installModule.localConfig(vFlags);
                });
                break;
            default:
                tools.logError('Install command: ' + fileType + ' not found. See help file for usage:');
                process.stdout.write(helpCommands.default());
                break;
        }
    }
};

module.exports = installCommands;

