#! /usr/bin/env node

var tools = require('../api/tools');
var config = require('../config');
var versionCommands = require('../commands/version/version');
var helpCommands = require('../commands/help/help');
var generateCommands = require('./generate-commands');

var mainCommands = {
	run : function (mainCommand, restOfCommands, vFlags) {
		mainCommand = config.command.shorthand.commands[mainCommand] || mainCommand;
		console.log('mainCommand', mainCommand);

		switch (mainCommand) {
			case 'generate':
				var blueprintType = config.command.shorthand.components[restOfCommands[0]] || restOfCommands[0];
				var blueprintName = restOfCommands[1]
				generateCommands.generateBlueprint(blueprintType, blueprintName, vFlags);
				break;
			case 'update':
				break;
			case 'create':
				break;
			case 'install':
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

