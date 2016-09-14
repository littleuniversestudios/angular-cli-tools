#! /usr/bin/env node
var tools = require('./api/tools');
var component = process.argv.slice('2');
var shouldUpdate = component[1] == '--update' || component[2] == '--update';

var data = tools.getRuntimeData(component[1] == '--update' ? component[2] : component[1], 'index', __dirname);

var name = data[0];
var paths = data[1];

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
	console.log(paths);
	var files = tools.readdirSync(paths.pathBefore ? paths.pathBefore : './');
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
