#! /usr/bin/env node
var tools = require('../api/tools');
var cliConfig = require('../cli-config');
var helpCommands = require('../commands/help/help');
var listModule = require('../commands/list/list');

var listCommandModule = {
    list : function (command, vFlags) {
        command = cliConfig.command.shorthand.list[command] || command;
        vFlags = vFlags || [];
        switch (command) {
            case 'templates':
                listModule.listTemplates();
                break;
            case 'blueprints':
                listModule.listBlueprints();
                break;
            case 'commands':
                listModule.listCommands();
                break;
            case 'seeds':
                listModule.listSeeds();
                break;
            case 'help':
            case undefined:
            default:
                listModule.listHelp();
                break;
        }
    }
};

module.exports = listCommandModule;

