var fs = require('fs');
var exec = require('child_process').exec;
var execSync = require('child_process').execSync;
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
		tools.runCommand(command ? command : '' + (pathBefore ? ('cd "' + pathBefore + '"') : '') + ' && ngt g i --update');
	},

	getPlatform : helpers.getPlatform,

	isWinOS : helpers.isWinOS,

	getOSDirCharacter : helpers.getOSDirCharacter,

	getCurrentDirectoryName : helpers.getCurrentDirectoryName,

	getName : helpers.getName,

	getPathOnOs : function (win32, path) {
		if (win32) return path.split('/').join('\\'); //if windows
		return path.split('\\').join('/'); //if anything else
	},

	getPath : {
		baseTs : function (dirname, type) {
			return dirname + tools.getOSDirCharacter() + 'base' + tools.getOSDirCharacter() + type + '-ts.txt';
		},
		ts : function (paths, name, type) {
			return paths.pathBefore + (name == 'index' ? '' :name + '.') + type + '.ts';
		},
	},

	getCreateDirCommand : function (path) {
		if (tools.isWinOS()) return 'if not exist "' + path + '" mkdir "' + path + '"';
		return 'mkdir -p "' + path + '"'
	},

	createDirs : function (path) {
		tools.runCommandSync(tools.getCreateDirCommand(path));
	},

	processRecursiveRequest : function (name, paths) {
		name = tools.getPathOnOs(tools.isWinOS, name);
		if (name.indexOf(tools.getOSDirCharacter()) != -1) {
			paths.pathBefore = name.split(helpers.getOSDirCharacter());
			name = paths.pathBefore.pop();
			paths.pathBefore = paths.pathBefore.join(helpers.getOSDirCharacter()) + helpers.getOSDirCharacter();
			tools.createDirs(paths.pathBefore);
		}
		return [name, paths];
	},

	getRuntimeData : function (component, type, dirname) {
		var paths = {
			baseTs : '',
			pathBefore : ''
		};
		var name = helpers.getName(component);
		var data = tools.processRecursiveRequest(name, paths);
		name = data[0];
		paths = data[1];

		if (!name || !name.length) {
			name = paths.pathBefore.split(helpers.getOSDirCharacter()).reverse()[0];
			if (!name.length) { //if the name passed in ended with a '/'
				name = paths.pathBefore.split(helpers.getOSDirCharacter()).reverse()[1];
			}
		}

		paths.baseTs = tools.getPath.baseTs(dirname, type);
		paths.ts = tools.getPath.ts(paths, type == 'index' ? type : name, type);

		return [name, paths]
	},
};

module.exports = tools;
