#! /usr/bin/env node
var tools = require('../api/tools');
var helpCommands = require('../commands/help/help');
var installModule = require('../commands/install/install');

var installCommands = {
	install : function (command, vFlags) {
		vFlags = vFlags || [];
		switch (command) {
			case undefined:
			case 'templates':
				installModule.createRootFolder(function () {
					installModule.localTemplates(vFlags);
					installModule.localConfig(vFlags);
					if (!tools.isvFlagPresent(vFlags, '--no-gitignore')) {
						installModule.gitIgnore();
					}
				});
				break;
			case 'config':
				installModule.createRootFolder(function () {
					installModule.localConfig(vFlags);
					if (!tools.isvFlagPresent(vFlags, '--no-gitignore')) {
						installModule.gitIgnore();
					}
				});
				break;

			default:
				tools.logError('Install command: ' + command + ' not found. See help file for usage:');
				process.stdout.write(helpCommands.default());
				break;
		}
	}
};

module.exports = installCommands;

