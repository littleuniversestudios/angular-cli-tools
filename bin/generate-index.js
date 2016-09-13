#! /usr/bin/env node
var tools = require('./api/tools');
var shouldUpdate = process.argv.slice('2')[1] == '--update';

var paths = {
	baseTs : __dirname + '/base/index-ts.txt',
	ts : tools.prefix + 'index.ts',
};

var success = ['Created Index', 'Created ' + paths.ts];

if (shouldUpdate) {
	if (tools.fileExists(paths.ts)) {
		tools.removeFile(paths.ts);
		success = ['Updated index.ts'];
	}
}

if (tools.fileExists(paths.ts)) {
	tools.throwError('File ' + paths.ts + ' already exists! To update run with the flag --update.');
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
					success.forEach(function (element) {
						tools.logSuccess(element);
					})
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
