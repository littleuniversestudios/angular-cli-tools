var path = require('path');
var tools = require('../../api/tools');
var config = require('../../config');
var findNodeModules = require('find-node-modules');
var mkdirp = require('mkdirp');

var blueprint = {
	getMetadata : function (scaffoldType, userDefinedName, fileType) {
		scaffoldType = config.command.shorthand[scaffoldType] || scaffoldType;
		userDefinedName = scaffoldType == 'index' ? 'index' : userDefinedName; // index scaffold always reverts to index.js (no filename necessary)
		var nameData = blueprint.extractNameData(userDefinedName);
		var fileName = scaffoldType == 'index' ? nameData.name + '.ts' : nameData.name + '.' + scaffoldType + '.' + fileType;
		var templateData = tools.getTemplateReplacements(nameData.name);
		var templateLocation = blueprint.getTemplateLocation(scaffoldType, fileType);
		if (scaffoldType === 'component') {
			nameData.destinationDirectory += nameData.name + '/';
		}
		return {
			type : scaffoldType,
			name : nameData.name,
			fileName : fileName,
			destinationDirectory : nameData.destinationDirectory,
			currentDirectory : process.cwd(),
			template : {
				location : templateLocation.path,
				isLocalTemplate : templateLocation.isLocalTemplate,
				variables : templateData.templateVariables,
				userDefinedValues : templateData.userDefinedValues,
			}
		}
	},
	/*
	 * Name can be blank, regular name, or name with a relative path
	 */
	extractNameData : function (blueprintName) {
		console.log('name:', blueprintName);
		var nameData = {};
		if (blueprintName == '' || blueprintName == undefined) {
			nameData.name = tools.getCurrentDirectoryName();
			nameData.destinationDirectory = './';
		} else {

			//strip last char if '/' or '\'
			var nameEndsWithSlash = false;
			if (tools.pathEndsWithSlash(blueprintName)) {
				blueprintName = blueprintName.substring(0, blueprintName.length - 1);
				nameEndsWithSlash = true;
			}

			//split name on '/' or '\'
			var pathParts = blueprintName.split(/[\\/]+/);

			//add '.' if doesn't exist to make it a relative path
			if (pathParts[0] != '.') {
				pathParts.unshift('.');
			}

			//if last char '/' or '\' then component name is last folder name otherwise use last part of the path as name
			var componentName = nameEndsWithSlash ? pathParts[pathParts.length - 1] : pathParts.pop();

			nameData.name = componentName;
			nameData.destinationDirectory = pathParts.join('/') + '/';
		}
		return nameData;
	},

	/*
	 * Determine where the template file for generating a blueprint comes from.
	 * Two options:
	 *   1) from node_modules/angular-cli/templates/... (this is the default location as it comes packaged with ngt)
	 *   2) from user's project directory (/project_directory/angular-cli-tools/templates/...)
	 *
	 *  Option 2 only occurs if the templates folder/file (/project_directory/angular-cli-tools/templates/template-file) is present.
	 */
	getTemplateLocation : function (scaffoldType, fileType) {
		var templateFileName = scaffoldType + '.' + fileType + config.templates.fileFormat;
		var isLocalTemplate = false;

		//default to global template (node_modules/angular-cli/templates/...)
		var templateLocation = config.appRoot + config.templates.root + scaffoldType + '.' + fileType + config.templates.fileFormat;

		//is it using the templates from user's project directory (/project_directory/angular-cli-tools/templates/...)
		var nodeModulesPath = findNodeModules({relative : false});

		if (nodeModulesPath.length > 0) {
			var localTemplateLocation = path.resolve(nodeModulesPath[0], '../angular-cli-tools/templates/' + templateFileName);

			if (tools.fileExists(localTemplateLocation)) {
				templateLocation = localTemplateLocation;
				isLocalTemplate = true;
			}
		}

		return {
			path : templateLocation,
			isLocalTemplate : isLocalTemplate
		};
	},
	generate : function (blueprintMetadata, callback) {
		callback = callback || tools.emptyFunction();
		if (tools.fileExists(blueprintMetadata.destinationDirectory + blueprintMetadata.fileName)) {
			tools.throwError(tools.capitalize(blueprintMetadata.type) + ' already exists!');
		}

		if (!tools.fileExists(blueprintMetadata.destinationDirectory)) {
			mkdirp(blueprintMetadata.destinationDirectory, function (err) {
				if (err) throw err;
				blueprint.makeGenericBlueprint(blueprintMetadata, callback);
			})
		} else {
			blueprint.makeGenericBlueprint(blueprintMetadata, callback);
		}

	},
	makeGenericBlueprint : function (blueprintMetadata, callback) {
		callback = callback || tools.emptyFunction();
		blueprint.makeFileFromTemplate(blueprintMetadata, function () {
			var logMessage = 'Created ' + blueprintMetadata.destinationDirectory + blueprintMetadata.fileName;
			if (blueprintMetadata.template.isLocalTemplate) {
				tools.log(tools.logColorYellow(logMessage), tools.logColorCyan('[Using local template: ' + blueprintMetadata.template.location + ']'));
				callback();
			} else {
				tools.logSuccess(logMessage);
				callback();
			}
		});
	},

	makeFileFromTemplate : function (scaffold, callback) {
		callback = callback || function () {
			};
		try {
			tools.copyBaseComponent(scaffold.template.location, scaffold.destinationDirectory + scaffold.fileName, function () {
				try {
					tools.replaceInFile(scaffold.destinationDirectory + scaffold.fileName, scaffold.template.variables, scaffold.template.userDefinedValues, scaffold.destinationDirectory + scaffold.fileName, function () {
						callback.apply(null);
					});
				} catch (error) {
					throw error;
				}
			});
		} catch (error) {
			throw error;
		}
	}
}

module.exports = blueprint;

