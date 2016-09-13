#! /usr/bin/env node
var tools = require('./api/tools');

var paths = {
	baseTs : __dirname + '/base/index-ts.txt',
	ts : tools.prefix + 'index.ts',
};

if (tools.fileExists(paths.ts)) {
	tools.throwError('File ' + paths.ts + ' already exists!');
}

try {

	var files = tools.readdirSync('./');
	var indexFileContents = '';
	files.forEach(function (element, index) {
		if (element.indexOf('ts') != -1) indexFileContents += "export * from './" + element.split('.ts').join('') + "';\n"
	});

	try {
		tools.copyBaseComponent(paths.baseTs, (paths.ts), function () {
			try {
				tools.replaceInFile(paths.ts, ['$exports$'], [indexFileContents], (paths.ts), function () {
					tools.logSuccess('Created Index');
					tools.logSuccess('Created ' + paths.ts);
				});
			} catch (error) {
				throw error;
			}
		});
	} catch (error) {
		tools.throwError(error);
	}
} catch (error) {
	tools.throwError(error);
}
