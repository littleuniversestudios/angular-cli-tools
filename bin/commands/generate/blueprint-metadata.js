var path = require('path');
var tools = require('../../api/tools');
var cliConfig = require('../../cli-config');
var userConfigModule = require('../../user/user-config');
var mkdirp = require('mkdirp');
var merge = require('merge');

var blueprintMetadataModule = {
	getBlueprints : function (blueprintType, blueprintName, vFlags, projectRootPath) {

		//1. Figure out the name and destination for the component to generate
		var nameMetadata = blueprintMetadataModule.extractNameData(blueprintName, blueprintType, vFlags);

		//2. Get all files that are required fo this component + their metadata
		var blueprintTemplates = blueprintMetadataModule.getBlueprintFiles(blueprintType, nameMetadata, vFlags, projectRootPath);

		return blueprintTemplates;

	},

	logUserTemplateUsed : function (vFlags) {
		var userTemplate = tools.getvFlagPayload(tools.getvFlag(vFlags, '--template'));
		if (userTemplate) {
			if (userConfigModule.getUserTemplateFilesMap(userTemplate)) {
				tools.logInfo("Using template '" + userTemplate + "' from 'angular-cli-tools/config.json'");
			} else {
				tools.throwError("Template '" + userTemplate + "' not found in 'angular-cli-tools/config.json'");
			}
		}
	},

	getBlueprintFiles : function (blueprintType, nameMetadata, vFlags, projectRootPath) {

		projectRootPath = projectRootPath || tools.getProjectRootFolder();
		var userTemplate = tools.getvFlagPayload(tools.getvFlag(vFlags, '--template'));
		var userBlueprintFiles = userConfigModule.getUserTemplateFilesMap(userTemplate, projectRootPath);
		var cliConfigGeneratedFileNames = merge({}, cliConfig.templates.names, userConfigModule.getProperty('fileNames.' + userTemplate, projectRootPath));
		var cliConfigBlueprintFiles = cliConfig.templates.map[blueprintType];
		var styleType = blueprintMetadataModule.determineStyleType(vFlags);
		var blueprintFiles = [];

		//default to angular-cli-tools list of files for a specific component
		var blueprintFileList = cliConfigBlueprintFiles;

		// if a user has provided a template and type to be generated is a complex one [component,route] use
		// the list of files in the user's template
		if (userTemplate && ['component', 'route'].indexOf(blueprintType) >= 0) {
			blueprintFileList = userBlueprintFiles;
		}

		// override the CLI blueprint files with files specified by user
		for (var blueprintFileType in blueprintFileList) {

			//ignore the description property if present as it is used for describing what the template does and serves no other purpose
			if (blueprintFileType != 'description') {

				var fileMetadata = null;

				//1. Try getting the file from templateMap in user's config.json file

				if (userBlueprintFiles && userBlueprintFiles[blueprintFileType]) {
					fileMetadata = userConfigModule.getAbsolutePathToUserBlueprintFile(userBlueprintFiles[blueprintFileType], projectRootPath);
				}

				//1b. Style file is different in that it can have a different extension (css|scss|less?) so we need to pull the right template
				// if --css flag present default to component.css
				// if --scss flag present default to component.scss
				// if --less flag present default to component.less
				var templateFileName = cliConfigBlueprintFiles[blueprintFileType];
				if (blueprintFileType === 'style') {
					templateFileName = blueprintMetadataModule.determineStyleFile(templateFileName, styleType);
				}

				//2. Try getting the file from local user templates in [project-root]/angular-cli-tools/templates/[file-name]
				if (!fileMetadata) {
					fileMetadata = blueprintMetadataModule.getAbsolutePathToLocalBlueprintFile(templateFileName, projectRootPath);
				}

				//3. Lastly, if above fails get the default file from angular-cli-tools/bin/cli/templates (global installation)
				if (!fileMetadata) {
					fileMetadata = blueprintMetadataModule.getAbsolutePathToCliBlueprintFile(templateFileName);
				}

				//4 Prune files that are in the templateMap (config) but template file can't be found anywhere in the project
				if (blueprintMetadataModule.isValidFile(fileMetadata)) {

					fileMetadata.type = blueprintType;
					fileMetadata.fileType = blueprintFileType;
					fileMetadata.fileName = nameMetadata.name + cliConfigGeneratedFileNames[blueprintFileType];
					fileMetadata.destinationDirectory = nameMetadata.destinationDirectory;

					//get replacements for template placeholders

					var templateData;
					if (tools.isvFlagPresent(vFlags, '--prefix')) {
						templateData = tools.getTemplateReplacements(nameMetadata.name,
							tools.getvFlagPayload(tools.getvFlag(vFlags, '--prefix')));
					} else {
						templateData = tools.getTemplateReplacements(nameMetadata.name, userConfigModule.getProperty('globalSelectorPrefix.' + blueprintType));
					}

					// Go through the vFlags and look for custom variables
					tools.each(vFlags, function (flag) {
						var key = tools.getvFlagIdentifier(flag).replace(/-/g, '');
						if (key.indexOf('#') === 0) {
							templateData.templateVariables.push(key + '#');
							templateData.userDefinedValues.push(tools.getvFlagPayload(flag));
						}
					});

					// Go through the config.json and get the custom variables
					tools.each(userConfigModule.getProperty('customVariables'), function (value, key) {
						if (key.indexOf('#') === 0) {
							if (templateData.templateVariables.indexOf(key + '#') === -1) {
								templateData.templateVariables.push(key + '#');
								templateData.userDefinedValues.push(value);
							}
						} else {
							tools.log(
								tools.logColorYellow('Custom variable ') + tools.logColorCyan(key) + tools.logColorYellow(' must start with \'#\' character!')
							);
						}
					});

					fileMetadata.variables = templateData.templateVariables;
					fileMetadata.userDefinedValues = templateData.userDefinedValues;

					//store name formats for displaying usage info after generation
					fileMetadata.componentName = {
						original : nameMetadata.name,
						camelCase : tools.camelCase(nameMetadata.name),
						pascalCase : tools.pascalCase(nameMetadata.name)
					};

					// style file is a little bit different in that it could have different
					// file type ending .css / .scss so we check for it

					if (blueprintFileType === 'style') {
						fileMetadata.fileName += styleType;
					}

					//let component.ts file know which style file it is using
					if (blueprintFileType === 'component') {
						fileMetadata.variables.push('$styleFileType$');
						fileMetadata.userDefinedValues.push(styleType);
					}

					blueprintFiles.push(fileMetadata);
				}
			}

		}
		return blueprintFiles;
	},
	//the user can add files to a template but they may not physically exist so remove them from the metadata if they were not found
	isValidFile : function (fileMetaData) {
		var fileLocation = fileMetaData.location.split(tools.getOSDirCharacter());
		return fileLocation[fileLocation.length - 1] != 'undefined';
	},

	determineStyleType : function (vFlags) {
		var styleType = 'scss'; //default
		styleType = tools.isvFlagPresent(vFlags, '--css') ? 'css' : styleType;
		styleType = tools.isvFlagPresent(vFlags, '--less') ? 'less' : styleType;
		return styleType;
	},

	determineStyleFile : function (templateFileName, styleExtension) {
		var fileParts = templateFileName.split('.');
		fileParts[fileParts.length - 1] = styleExtension;
		return fileParts.join('.');
	},

	/*
	 * Name can be blank, regular name, or name with a relative path
	 */
	extractNameData : function (blueprintName, blueprintType, vFlags) {
		var isFlat = tools.isvFlagPresent(vFlags, '--flat')

		var nameData = {};
		if (blueprintName == './' || blueprintName == '.' || blueprintName == undefined || blueprintName == '') {
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

		if (['component', 'route'].indexOf(blueprintType) >= 0 && !isFlat) {
			nameData.destinationDirectory += nameData.name + '/';
		}

		return nameData;
	},

	getAbsolutePathToLocalBlueprintFile : function (templateFileName, projectRootPath) {
		projectRootPath = projectRootPath || tools.getProjectRootFolder();
		var localTemplateLocation = path.resolve(projectRootPath, cliConfig.user.templates.location + templateFileName);

		var fileMetadata = {
			location : localTemplateLocation,
			label : tools.getRelativePathFromProjectRoot(localTemplateLocation, projectRootPath, '[project-root]/'),
			origin : 'local'
		};
		if (!tools.fileExists(localTemplateLocation)) {
			fileMetadata = null;
		}
		return fileMetadata;

	},

	getAbsolutePathToCliBlueprintFile : function (filePath) {
		return {
			location : cliConfig.appRoot + cliConfig.templates.root + filePath,
			label : '',
			origin : 'default'
		};

	}

};

module.exports = blueprintMetadataModule;

