var fs = require('fs');
var logging = require('./logging');
var helpers = require('./helpers');

var tools = {

	emptyFunction : function () {
		return function () {
		}
	},

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
					tools.writeFile(output, newData, callback);
				}
			})
		});
	},
	capitalize : helpers.capitalize,

	camelCase : helpers.camelCase,

	pascalCase : helpers.pascalCase,

	fileExists : function (path) {
		return fs.existsSync(path);
	},

	writeFile : function (fileName, fileData, callback) {
		fs.writeFile(fileName, fileData, 'utf8', function (err) {
			if (err) throw err;
			callback ? callback() : null;
		});
	},

	appendFile : function (fileName, dataToAppend, callback) {
		fs.appendFile(fileName, dataToAppend, function (err) {
			if (err) throw err;
			callback ? callback() : null;
		});
	},

	readFile : function (pathToFile) {
		return fs.readFileSync(pathToFile, 'utf8');
	},

	isDirectory : function (path) {
		return fs.lstatSync(path).isDirectory();
	},

	makeDirSync : function (path) {
		return fs.mkdirSync(path);
	},
	pathEndsWithSlash : function (path) {
		path = path || '';
		var lastChar = path.charAt(path.length - 1);
		return lastChar === '/' || lastChar === '\\';
	},

	/*
	 Match the variables in the templates (component.ts.txt) to the what the user has defined in the command
	 */
	getTemplateReplacements : function (name) {
		return {
			templateVariables : ['$name$', '$camelCaseName$', '$PascalCaseName$'],
			userDefinedValues : [name, tools.camelCase(name), tools.pascalCase(name)]
		}
	},

	log : logging.log,
	logSuccess : logging.logSuccess,
	logError : logging.logError,
	logColorYellow : logging.yellowColor,
	logColorRed : logging.redColor,
	logColorCyan : logging.cyanColor,
	throwError : logging.throwError,

	readdirSync : function (path) {
		return fs.readdirSync(path)
	},

	removeFile : function (path) {
		return fs.unlinkSync(path);
	},

	getPlatform : helpers.getPlatform,

	isWinOS : helpers.isWinOS,

	getOSDirCharacter : helpers.getOSDirCharacter,

	getCurrentDirectoryName : helpers.getCurrentDirectoryName,

	getName : helpers.getName

};

module.exports = tools;
