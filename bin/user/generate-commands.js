#! /usr/bin/env node
var path = require('path');
var cliConfig = require('../cli-config');
var tools = require('../api/tools');
var blueprint = require('../commands/generate/blueprint');
var indexBlueprint = require('../commands/generate/index');
var generalBlueprint = require('../commands/generate/blueprint');
var blueprintMetadataModule = require('../commands/generate/blueprint-metadata');


var generateCommands = {
    generateBlueprint : function (blueprintType, blueprintName, vFlags) {
        blueprintType = cliConfig.command.shorthand.components[blueprintType] || blueprintType; //if blueprint comes in shorthand form

        switch (blueprintType) {
            case 'index':
                blueprintName = tools.pathEndsWithSlash(blueprintName) ? blueprintName : blueprintName + '/';
                var indexData = blueprint.extractNameData(blueprintName);
                indexBlueprint.generateCommand(indexData.destinationDirectory);
                tools.logSuccess('Created ' + indexData.destinationDirectory + 'index.ts');
                break;
            case 'component':
            case 'route':
                // Check if user provided a name. Must have name for component/route
                if (blueprintName == '' || tools.pathEndsWithSlash(blueprintName)) {
                    tools.throwError('You need to provide a name for ' + blueprintType + '.');
                }
            case 'class':
            case 'directive':
            case 'enum':
            case 'html':
            case 'interface':
            case 'module':
            case 'pipe':
            case 'routing':
            case 'service':
            case 'style':
                blueprintMetadataModule.logUserTemplateUsed(vFlags);
                var blueprints = blueprintMetadataModule.getBlueprints(blueprintType, blueprintName, vFlags);
                generalBlueprint.generateFilesFromBlueprints(blueprints, function () {
                    //use the first blueprint's destination directory to create the barrel
                    indexBlueprint.updateCommand(blueprints[0].destinationDirectory);
                });
                break;
            default:
                tools.logError('Blueprint for scaffold: \'' + blueprintType + '\' does not exist. Run: \'ngt -h\' for list of commands');
                break;
        }
    },
    getBlueprintFiles : function (blueprintType, nameMetadata, vFlags) {

    }
};

module.exports = generateCommands;

