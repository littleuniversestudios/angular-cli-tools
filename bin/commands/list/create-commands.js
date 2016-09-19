#! /usr/bin/env node

var tools = require('../api/tools');
var config = require('../config');

var indexBlueprint = require('./generate/index');
var componentBlueprint = require('./generate/component');
var generalBlueprint = require('./generate/blueprint');
var project = require('./create/project');

var commands = {
	runUserCommand : function (command) {
		var primaryCommand = command[2] = config.command.shorthand.commands[command[2]] || command[2]; //todo: clean this up re: command[2] converts to long form
		command[3] = config.command.shorthand.components[command[3]] || command[3]; //todo: clean this up re: command[3] converts to long form
		var commandParams = command.slice('3');

		switch (primaryCommand) {

			case 'generate':
				var secondaryCommand = config.command.shorthand.components[command[3]] || command[3];
				//todo: instead of sending the params to each generate command, get the scaffold/blueprint metadata here and pass that object to the gen command
				switch (secondaryCommand) {
					case 'index':
						indexBlueprint.generateCommand();
						tools.logSuccess('Created index.ts');
						break;
					case 'component':

						componentBlueprint.generateCommand(commandParams, function () {
							//this is a bit of a hack to determine the correct index.ts location for a new component
							//TODO: move index.ts generation inside generate command or use the scaffold metadata to determine where to generate index
							indexBlueprint.generateCommand('./' + commandParams[1] + '/');
						});

						break;
					case 'class':
					case 'directive':
					case 'module':
					case 'pipe':
					case 'route':
					case 'service':
						generalBlueprint.generateCommand(commandParams);
						indexBlueprint.updateCommand();
						break;
					default:
						tools.logError('Blueprint for scaffold: \'' + secondaryCommand + '\' does not exist. Run: \'ngt -h\' for list of commands');
						break;
				}
				break;

			case 'update':
				var secondaryCommand = config.command.shorthand.components[command[3]] || command[3];
				switch (secondaryCommand) {
					case 'index':
						indexBlueprint.updateCommand();
						tools.logSuccess('Updated index.ts');
						break;
					default:
						tools.logError('Update: \'' + secondaryCommand + '\' is not supported. Run: \'ngt -h\' for list of commands');
						break;
				}
				break;

			case 'create':
				var secondaryCommand = config.command.shorthand.seeds[command[3]] || command[3];
				switch (secondaryCommand) {
					case '--bootstrap':
						//create bootstrap ng2 project
						project.createBootstrap();
						break;
					case '--material':
						//create angular-material ng2 project
						project.createMaterial();
						break;
					default:
						project.create();
						//create basic ng2 seed project
						break;
				}
				break;
			default:
				break;
		}
	}
}

module.exports = commands;

