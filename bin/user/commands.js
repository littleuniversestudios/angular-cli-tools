#! /usr/bin/env node
var config = require('../config');
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

			if (commands.isVFlag(command)) {
				cliCommand.vFlags.push(command);
			} else if (commands.isFlag(command)) {
				if (config.command.shorthand.flags[command]) {
					cliCommand.vFlags.push(config.command.shorthand.flags[command]);
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
	},

	isVFlag : function (param) {
		return param.substring(0, 2) == '--';
	},

	isFlag : function (param) {
		return param.substring(0, 1) == '-' && !commands.isVFlag(param);
	}
}

module.exports = commands;

