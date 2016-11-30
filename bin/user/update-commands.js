#! /usr/bin/env node
var cliConfig = require('../cli-config');
var tools = require('../api/tools');
var blueprintMetadataModule = require('../commands/generate/blueprint-metadata');
var indexBlueprint = require('../commands/generate/index');
var installModule = require('../commands/install/install');
var versionCommands = require('../commands/version/version');

var updateCommands = {
    update : function (updateSubCommand, destinationDirectory, vFlags) {
        updateSubCommand = cliConfig.command.shorthand.update[updateSubCommand] || updateSubCommand; //if blueprint comes in shorthand form
        switch (updateSubCommand) {
            case undefined:
            case 'templates':
                // update the cli with the latest templates and config
                vFlags.push('--force');
                installModule.createRootFolder(function () {
                    installModule.localConfig(vFlags);
                    installModule.localTemplates(vFlags, function () {
                        tools.logInfo('Updated '+ versionCommands.getVersion() + ' for local project');
                    });
                });
                break;
            case 'config':
                // update the cli with the latest config
                installModule.createRootFolder(function () {
                    installModule.localConfig(vFlags);
                });
                break;
            case 'index':
                var blueprintName = tools.pathEndsWithSlash(updateSubCommand) ? updateSubCommand : updateSubCommand + '/';
                var indexData = blueprintMetadataModule.extractNameData(blueprintName);
                if (tools.isvFlagPresent(vFlags, '--recursive')) {
                    var updatedFiles = indexBlueprint.updateRecursive(indexData.destinationDirectory, []);
                    tools.logSuccess('Updated: \n' + updatedFiles.map(function (path) {
                            return '   ' + path + '\n';
                        }).join(''));
                } else {
                    indexBlueprint.updateCommand(indexData.destinationDirectory);
                    tools.logSuccess('Updated ' + indexData.destinationDirectory + 'index.ts');
                }
                break;

            default:
                tools.logError('Update: \'' + updateSubCommand + '\' is not supported. Run: \'ngt -h\' for list of commands');
                break;
        }
    }
};

module.exports = updateCommands;

