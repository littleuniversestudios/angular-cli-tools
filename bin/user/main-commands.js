#! /usr/bin/env node

var tools = require('../api/tools');
var cliConfig = require('../cli-config');
var versionCommands = require('../commands/version/version');
var generateCommands = require('./generate-commands');
var updateCommands = require('./update-commands');
var createCommands = require('./create-commands');
var installCommands = require('./install-commands');
var saveCommandModule = require('./save-commands');
var listCommandModule = require('./list-commands');
var templatesModule = require('../commands/templates/templates');

var mainCommands = {
    run : function (mainCommand, restOfCommands, vFlags) {
        var destinationDirectory;
        mainCommand = cliConfig.command.shorthand.commands[mainCommand] || mainCommand;
        switch (mainCommand) {
            case 'generate':
                var blueprintType = cliConfig.command.shorthand.components[restOfCommands[0]] || restOfCommands[0];
                var blueprintName = restOfCommands[1] || './';
                generateCommands.generateBlueprint(blueprintType, blueprintName, vFlags);
                break;
            case 'blueprint':
            case 'blueprints':
                //just a placeholder in case anyone types 'ngt blueprint(s)' looking for list of blueprints
                listCommandModule.list('blueprints', vFlags);
                break;
            case 'command':
            case 'commands':
                //just a placeholder in case anyone types 'ngt command' looking for a command list
                listCommandModule.list('commands', vFlags);
                break;
            case 'install':
                var fileType = cliConfig.command.shorthand.install[restOfCommands[0]] || restOfCommands[0];
                installCommands.install(fileType, vFlags);
                break;
            case 'list':
                var subCommand = cliConfig.command.shorthand.list[restOfCommands[0]] || restOfCommands[0];
                listCommandModule.list(subCommand, vFlags);
                break;
            case 'new':
                destinationDirectory = restOfCommands[0] || './';
                createCommands.newProject(destinationDirectory, vFlags);
                break;
            case 'save':
                var componentFolder = restOfCommands[0] || './';
                saveCommandModule.saveComponent(componentFolder, vFlags);
                break;
            case 'seed':
            case 'seeds':
                //just a placeholder in case anyone types 'ngt template(s)' looking for the list of templates
                listCommandModule.list('seeds', vFlags);
                break;
            case 'template':
            case 'templates':
                if (!isNaN(parseInt(restOfCommands[0]))) {
                    var templateName = templatesModule.getTemplateName(restOfCommands[0], restOfCommands[1]);
                    mainCommands.run('generate', [restOfCommands[1]], ['--template:' + templateName])
                } else {
                    listCommandModule.list('templates', vFlags);
                }
                break;
            case 'update':
                var updateSubCommand = cliConfig.command.shorthand.update[restOfCommands[0]] || restOfCommands[0];
                destinationDirectory = restOfCommands[1] || './';
                updateCommands.update(updateSubCommand, destinationDirectory, vFlags);
                break;
            case 'version':
                tools.logSuccess(versionCommands.getVersion());
                break;
            case 'help':
            default:
                listCommandModule.list('help', vFlags);
                break;
        }
    }
}

module.exports = mainCommands;

