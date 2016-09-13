var tools = require('./tools');

var helpers = {
	getPlatform : function () {
		return process.platform;
	},

	isWinOS : function () {
		return helpers.getPlatform() === 'win32';
	},

	getOSDirCharacter : function () {
		return helpers.isWinOS() ? '\\' : '/';
	},

	getCurrentDirectoryName : function () {
		return process.cwd().split(helpers.getOSDirCharacter()).reverse()[0];
	},

	getName : function (component) {
		return component ? component : helpers.getCurrentDirectoryName();
	},

	camelCase : function (str) {
		var pascalCaseName = helpers.pascalCase(str);
		return pascalCaseName[0].toLowerCase() + pascalCaseName.slice(1);
	},

	pascalCase : function (str) {
		return str.split('-').map(function (word) {
			return word.charAt(0).toUpperCase() + word.slice(1);
		}).join('');

	},
};

module.exports = helpers;
