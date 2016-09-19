#! /usr/bin/env node
var config = require('../config');
var tools = require('../api/tools');
var blueprint = require('../commands/generate/blueprint');
var indexBlueprint = require('../commands/generate/index');
var componentBlueprint = require('../commands/generate/component');
var generalBlueprint = require('../commands/generate/blueprint');
var project = require('../commands/create/project');

var generateCommands = {
	generateBlueprint : function (blueprintType, blueprintName, vFlags) {
		blueprintType = config.command.shorthand.components[blueprintType] || blueprintType; //if blueprint comes in shorthand form
		console.log('blueprint type:', blueprintType);
		console.log('blueprint name:', blueprintName);
		console.log('blueprint vFlags:', vFlags);

		switch (blueprintType) {
			case 'index':
				blueprintName = tools.pathEndsWithSlash(blueprintName) ? blueprintName : blueprintName + '/';
				var indexData = blueprint.extractNameData(blueprintName);
				indexBlueprint.generateCommand(indexData.destinationDirectory);
				tools.logSuccess('Created index.ts');
				break;
			case 'component':

				// Check if user provided a name. Must have name for component
				if (blueprintName == '' || tools.pathEndsWithSlash(blueprintName)) {
					tools.throwError('You need to provide a name for component.');
				}

				//Check if user provided a style type. Default to 'scss'.
				var styleType = vFlags.indexOf('--css') >= 0 ? 'css' : 'scss';

				//generate blueprints for ts, html, css.scss
				var tsBlueprintMetaData = generalBlueprint.getMetadata('component', blueprintName, 'ts');
				var htmlBlueprintMetaData = generalBlueprint.getMetadata('component', blueprintName, 'html');
				var styleBlueprintMetaData = generalBlueprint.getMetadata('component', blueprintName, styleType);

				//create the files
				blueprint.generate(tsBlueprintMetaData, function () {
					blueprint.generate(htmlBlueprintMetaData, function () {
						blueprint.generate(styleBlueprintMetaData, function () {
							indexBlueprint.updateCommand(tsBlueprintMetaData.destinationDirectory);
						});
					});
				});
				break;
			case 'class':
			case 'directive':
			case 'module':
			case 'pipe':
			case 'route':
			case 'service':
				var blueprintMetaData = generalBlueprint.getMetadata(blueprintType, blueprintName, 'ts');
				blueprint.generate(blueprintMetaData, function () {
					indexBlueprint.updateCommand(blueprintMetaData.destinationDirectory);
				});
				break;
			default:
				tools.logError('Blueprint for scaffold: \'' + blueprintType + '\' does not exist. Run: \'ngt -h\' for list of commands');
				break;
		}
	}
}

module.exports = generateCommands;

