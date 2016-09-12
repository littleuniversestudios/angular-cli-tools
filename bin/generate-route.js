#! /usr/bin/env node

var tools = require('./api/tools');

var component = process.argv.slice('2');
var name = component[1];

var paths = {
	baseTs : __dirname + '/base/route-ts.txt',
	ts : tools.prefix + name + '.route.ts',
};

var replace = tools.setupReplace(name);

if (tools.fileExists(paths.ts)) {
	tools.throwError("Route already exists!");
}

try {
	tools.copyBaseComponent(paths.baseTs, (paths.ts), function () {
		try {
			tools.replaceInFile(paths.ts, replace.query, replace.result, (paths.ts), function () {
				tools.logSuccess('Successfully created route \'' + name + '\'')
				tools.logSuccess('Created ' + paths.ts)
			});
		} catch (error) {
			throw error;
		}
	});
} catch (error) {
	throw error;
}
