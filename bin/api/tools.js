var fs = require('fs');
var exec = require('child_process').exec;

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

	camelCase : function (str) {
		var pascalCaseName = tools.pascalCase(str);
		return pascalCaseName[0].toLowerCase() + pascalCaseName.slice(1);
	},

	pascalCase : function (str) {
		return str.split('-').map(function (word) {
			return word.charAt(0).toUpperCase() + word.slice(1);
		}).join('');

	},

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
	log : function (message) {
		console.log(message);
	},
	logSuccess : function (message) {
		console.log('\x1b[33m%s\x1b[0m', message);
	},
	logError : function (message) {
		console.log('\x1b[31m%s\x1b[0m', message);
	},
	// if we know what the problem is notify user [without the error line info/stack trace] and exit
	throwError : function (error) {
		tools.logError(error);
		process.exit(0);
	},
	prefix : '',

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

	removeFile: function (path) {
		return fs.unlinkSync(path);
	},

	updateIndex: function (command) {
		tools.runCommand(command ? command : '' + 'ngt g i --update')
	}
};

module.exports = tools;
