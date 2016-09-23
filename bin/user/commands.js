#! /usr/bin/env node

var tools = require('../api/tools');
var mainCommands = require('./main-commands');

var commands = {
	runUserCommand : function (userCommand) {
		var cliCommand = commands.formatUserCommand(userCommand);
		var mainCommand = cliCommand.commands[0];

		//if no main command found show help file unless --version present
		if (!mainCommand) {
			mainCommand = cliCommand.vFlags[0] == '--version' ? 'version' : 'help';
		}

		var restOfCommands = cliCommand.commands.slice(1);

		mainCommands.run(mainCommand, restOfCommands, cliCommand.vFlags);
	},

	formatUserCommand : function (userCommand) {

		var cliCommand = commands.initCLICommand();

		userCommand.forEach(function (command) {

			if (tools.isVFlag(command)) {
				cliCommand.vFlags.push(command);
			} else if (tools.isFlag(command)) {
				var convertedvFlag = tools.convertTovFlag(command);
				if (tools.isVFlag(convertedvFlag)) {
					cliCommand.vFlags.push(convertedvFlag);
				}
			} else {
				cliCommand.commands.push(command);
			}
		});
		return cliCommand;

	},

	initCLICommand : function () {
		return {
			commands : [],
			vFlags : [],
		};
	}
}

module.exports = commands;

