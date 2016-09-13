var fs = require('fs');
var exec = require('child_process').exec;
var execSync = require('child_process').execSync;
var windows = process.platform == 'win32';
var logging = require('./logging');
var helpers = require('./helpers');

var tools = {

	copyBaseComponent : function (base, path, callback) {
		fs.createReadStream(base).pipe(fs.createWriteStream(path)).on('finish', callback);
	},

	replaceInFile : function (input, searches, values, output, callback) {
		fs.readFile(input, 'utf8', function (err, data) {
			if (err) {
				throw err
			}
			var newData = data;
			searches.forEach(function (search, index) {
				newData = newData.split(search).join(values[index]);
				if (index == values.length - 1) {
					fs.writeFile(output, newData, 'utf8', function (err) {
						if (err) throw err;
						callback ? callback() : null;
					});
				}
			})
		});
	},

	camelCase : helpers.camelCase,

	pascalCase : helpers.pascalCase,

	fileExists : function (path) {
		return fs.existsSync(path);
	},

	makeDirSync : function (path) {
		return fs.mkdirSync(path);
	},

	setupReplace : function (name) {
		return {
			query : ['$name$', '$camelCaseName$', '$PascalCaseName$'],
			result : [name, tools.camelCase(name), tools.pascalCase(name)]
		}
	},

	log : logging.log,
	logSuccess : logging.logSuccess,
	logError : logging.logError,
	throwError : logging.throwError,

	readdirSync : function (path) {
		return fs.readdirSync(path)
	},

	runCommand : function (command) {
		exec(command, function (error, stdout, stderr) {
			if (error || stderr) {
				tools.logError('Could not execute command.');
				tools.logError(stderr);
			} else if (stdout) {
				console.log(stdout)
			}
		});
	},
	runCommandSync : function (command) {
		return execSync(command);
	},

	removeFile : function (path) {
		return fs.unlinkSync(path);
	},

	updateIndex : function (pathBefore, command) {
		tools.runCommand((command ? command : '') + 'cd \'' + pathBefore + '\' && ngt g i --update')
	},

	getPlatform : helpers.getPlatform,

	isWinOS : helpers.isWinOS,

	getOSDirCharacter : helpers.getOSDirCharacter,

	getCurrentDirectoryName : helpers.getCurrentDirectoryName,

	getName : helpers.getName,

	getRuntimeData : function (component, type, paths) {
		var name = helpers.getName(component);

		if (name.indexOf(helpers.getOSDirCharacter()) != -1) {
			paths.pathBefore = name.split(helpers.getOSDirCharacter());
			name = paths.pathBefore.pop();
			paths.pathBefore = paths.pathBefore.join(helpers.getOSDirCharacter()) + helpers.getOSDirCharacter();
			tools.runCommandSync('mkdir -p \'' + paths.pathBefore + '\'');
		}
		if (!name || !name.length) {
			name = paths.pathBefore.split(helpers.getOSDirCharacter()).reverse()[0];
			if (!name.length) { //if the name passed in ended with a '/'
				name = paths.pathBefore.split(helpers.getOSDirCharacter()).reverse()[1];
			}
		}

		paths.ts = paths.pathBefore + name + '.' + type + '.ts';

		return [name, paths]
	},
};

module.exports = tools;
