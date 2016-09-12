#! /usr/bin/env node

var tools = require('./api/tools');

var component = process.argv.slice('2');
var name = component[1];
var styleType = component[2] == '--css' ? 'css' : 'scss';

var paths = {
	directory : tools.prefix + name,
	htmlBase : __dirname + '/base/component/html.txt',
	scssBase : __dirname + '/base/component/'+ styleType +'.txt',
	tsBase : __dirname + '/base/component/ts.txt'
};
paths.html = paths.directory + '/' + name + '.component.html';
paths.scss = paths.directory + '/' + name + '.component.' + styleType;
paths.ts = paths.directory + '/' + name + '.component.ts';

var replace = tools.setupReplace(name);

if (tools.fileExists(paths.directory)) {
	tools.throwError('Directory ' + paths.directory + ' already exists!');
}

try {
	tools.makeDirSync(paths.directory);
} catch (error) {
	throw error;
}

try {
	tools.copyBaseComponent(paths.htmlBase, (paths.html), function () {
		try {
			tools.copyBaseComponent(paths.scssBase, (paths.scss), function () {
				try {
					tools.copyBaseComponent(paths.tsBase, (paths.ts), function () {
						try {
							tools.replaceInFile((paths.ts), replace.query, replace.result, (paths.ts), function () {
								tools.replaceInFile((paths.html), replace.query, replace.result, (paths.html), function () {
									tools.logSuccess('Successfully created component \'' + name + '\'')
									tools.logSuccess('Created: ./' + paths.ts);
									tools.logSuccess('Created: ./' + paths.html);
									tools.logSuccess('Created: ./' + paths.scss);
								});
							})
						} catch (error) {
							throw error;
						}
					});
				} catch (error) {
					throw error;
				}
			});
		} catch (error) {
			throw error;
		}
	});
} catch (error) {
	throw error;
}
