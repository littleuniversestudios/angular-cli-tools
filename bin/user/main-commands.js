#! /usr/bin/env node

var tools = require('../api/tools');
var cliConfig = require('../cli-config');
var versionCommands = require('../commands/version/version');
var helpCommands = require('../commands/help/help');
var generateCommands = require('./generate-commands');
var updateCommands = require('./update-commands');
var createCommands = require('./create-commands');
var installCommands = require('./install-commands');
var saveCommandModule = require('./save-commands');

var mainCommands = {
    run : function (mainCommand, restOfCommands, vFlags) {
        mainCommand = cliConfig.command.shorthand.commands[mainCommand] || mainCommand;
        switch (mainCommand) {
            case 'generate':
                var blueprintType = cliConfig.command.shorthand.components[restOfCommands[0]] || restOfCommands[0];
                var blueprintName = restOfCommands[1] || './';
                generateCommands.generateBlueprint(blueprintType, blueprintName, vFlags);
                break;
            case 'update':
                var updateSubCommand = cliConfig.command.shorthand.update[restOfCommands[0]] || restOfCommands[0];
                var destinationDirectory = restOfCommands[1] || './';
                updateCommands.update(updateSubCommand, destinationDirectory, vFlags);
                break;
            case 'new':
                var destinationDirectory = restOfCommands[0] || './';
                createCommands.newProject(destinationDirectory, vFlags);
                break;
            case 'install':
                var fileType = cliConfig.command.shorthand.install[restOfCommands[0]] || restOfCommands[0];
                installCommands.install(fileType, vFlags);
                break;
            case 'save':
                var componentFolder = restOfCommands[0] || './';
                saveCommandModule.saveComponent(componentFolder, vFlags);
                break;
            case 'help':
                process.stdout.write(helpCommands.default());
                break;
            case 'version':
                tools.logSuccess(versionCommands.getVersion());
                break;
            default:
                tools.logError('Command: ' + mainCommand + ' not found. See help file for usage:');
                process.stdout.write(helpCommands.default());
                break;
        }
    }
}

module.exports = mainCommands;

