
var help = {
	default : function () {
		var help = '\nA simple tool for Angular2 that is much lighter and much quicker than the original angular-cli.' +
			'\nUsage: ngt [options]' +
			'\n\nOptions:' +
			'\n\n-h, --help [optional: command]         Output usage information' +
			'\n\n g, generate [type] [name]             Generate Angular2 files/scaffolds from blueprints ' +
			'\n   Usage: ngt generate [type] [name]' +
			'\n   Options:' +
			'\n      [type]: class | component | directive | pipe | route | service' +
			'\n      [name]: Anything you would like.' +
			'\n   Example: ngt generate component my-component' +
			'\n   Example: ngt generate service my-service' +
			'\n   Example: ngt generate pipe my-pipe' +
			'\n';
		'\n';
		return help;
	}
}

module.exports = help;

