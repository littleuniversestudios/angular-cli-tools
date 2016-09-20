#! /usr/bin/env node
var tools = require('../api/tools');
var helpCommands = require('../commands/help/help');
var install = require('../commands/install/install');

var installCommands = {
	install : function (fileType, vFlags) {
		vFlags = vFlags || [];

		switch (fileType) {
			case 'templates':
				install.localTemplates(vFlags);
				break;
			case 'config': //coming soon
			default:
				tools.logError('Install command: ' + fileType + ' not found. See help file for usage:');
				process.stdout.write(helpCommands.default());
				break;
		}
	}
};

module.exports = installCommands;

