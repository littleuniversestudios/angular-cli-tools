#! /usr/bin/env node
var path = require('path');
var config = require('../config');
var tools = require('../api/tools');
var blueprint = require('../commands/generate/blueprint');
var indexBlueprint = require('../commands/generate/index');
var generalBlueprint = require('../commands/generate/blueprint');


var generateCommands = {
	generateBlueprint : function (blueprintType, blueprintName, vFlags) {
		blueprintType = config.command.shorthand.components[blueprintType] || blueprintType; //if blueprint comes in shorthand form

		switch (blueprintType) {
			case 'index':
				blueprintName = tools.pathEndsWithSlash(blueprintName) ? blueprintName : blueprintName + '/';
				var indexData = blueprint.extractNameData(blueprintName);
				indexBlueprint.generateCommand(indexData.destinationDirectory);
				tools.logSuccess('Created ' + indexData.destinationDirectory + 'index.ts');
				break;
			case 'component':

				// Check if user provided a name. Must have name for component
				if (blueprintName == '' || tools.pathEndsWithSlash(blueprintName)) {
					tools.throwError('You need to provide a name for component.');
				}

				//Check if user provided a style type. Default to 'scss'.
				var styleType = tools.isvFlagPresent(vFlags, '--css') ? 'css' : 'scss';
				var generateTestFile = tools.isvFlagPresent(vFlags, '--spec'); //TODO: use this flag to generate test file

				//generate blueprints for ts, html, css.scss
				var tsBlueprintMetaData = generalBlueprint.getMetadata('component', blueprintName, 'ts');
				var htmlBlueprintMetaData = generalBlueprint.getMetadata('component', blueprintName, 'html');
				var styleBlueprintMetaData = generalBlueprint.getMetadata('component', blueprintName, styleType);

				//create the files
				blueprint.generate(tsBlueprintMetaData, function () {
					blueprint.generate(htmlBlueprintMetaData, function () {
						blueprint.generate(styleBlueprintMetaData, function () {
							//TODO: generateTestFile here if(generateTestFile){ //create the spec.ts file}
							indexBlueprint.updateCommand(tsBlueprintMetaData.destinationDirectory); //update index in component dir
							indexBlueprint.updateCommand(path.resolve(tsBlueprintMetaData.destinationDirectory + './..')); //update index one dir before component to include this newly created component
						});
					});
				});
				break;
			case 'class':
			case 'directive':
			case 'enum':
			case 'interface':
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

