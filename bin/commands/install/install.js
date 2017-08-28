var path = require('path');
var tools = require('../../api/tools');
var cliConfig = require('../../cli-config');
var ncp = require('ncp').ncp;
var mkdirp = require('mkdirp');
var merge = require('merge');

var installModule = {
	localTemplates : function (vFlags, callback) {

		//find the project's root folder
		var projectRootPath = tools.getProjectRootFolder();
		if (projectRootPath) {
			var localTemplatesDirectory = path.resolve(projectRootPath, cliConfig.user.templates.location);

			//check if local templates already exist
			if (tools.fileExists(localTemplatesDirectory)) {
				if (tools.isvFlagPresent(vFlags, '--force')) {
					installModule.copyLocalTemplates(localTemplatesDirectory, 'update', callback);
				} else {
					tools.throwError(
						'Local templates already exist in directory: ' + tools.logColorYellow(localTemplatesDirectory) +
						tools.logColorRed('\nTo overwrite local templates run command with ' +
							tools.logColorYellow('\'-f\'') +
							tools.logColorRed('. For example: ') +
							tools.logColorYellow('\'ngt install templates -f\'') +
							tools.logColorRed(' or ') +
							tools.logColorYellow('\'ngt i t -f\''))
					);
				}

			} else {
				installModule.copyLocalTemplates(localTemplatesDirectory, 'install', callback);
			}
		} else {
			tools.throwError('Could not find project\'s node_modules folder. Make sure the node_modules folder is present at the root of your project where local templates will be installed.');
		}
	},
	copyLocalTemplates : function (localTemplatesDirectory, updateOrInstall, callback) {
		callback = callback || tools.emptyFunction();

		//first make the './angular-cli-tools/templates' directory
		mkdirp(localTemplatesDirectory, function (err) {
			if (err) throw err;

			//then copy templates to './angular-cli-tools/templates'
			var templatesDirectory = cliConfig.appRoot + cliConfig.templates.root;
			ncp(templatesDirectory, localTemplatesDirectory, {clobber : true}, function (err) {
				if (err) throw err;
				if (!installModule.installMessageDisplayed) {
					//display message only once
					installModule.installMessageDisplayed = true;
					if (updateOrInstall == 'update') {
						tools.log(tools.logColorYellow('Local (editable) templates were updated.'));
					} else {
						tools.log(tools.logColorYellow('Local (editable) templates were installed in: '), tools.logColorCyan(localTemplatesDirectory));
					}
					//run callback only once (ncp runs callback on every folder creation, not necessary for us so this is quick way of only running the update logger once)
					callback();
				}
			})
		})
	},
	installMessageDisplayed : false,
	createRootFolder : function (callback) {
		callback = callback || tools.emptyFunction();

		//find the project's root folder
		var projectRootPath = tools.getProjectRootFolder();

		mkdirp(path.resolve(projectRootPath, cliConfig.user.localAngularCLITools.location), function (err) {
			if (err) throw err;
			callback();
		})
	},

	localConfig : function () {

		//find the project's node_modules folder
		var projectRootPath = tools.getProjectRootFolder();
		if (projectRootPath) {
			var localConfigFilePath = path.resolve(projectRootPath, cliConfig.user.config.location);

			//check if local templates already exist
			if (tools.fileExists(localConfigFilePath)) {
				var userConfig = JSON.parse(tools.readFile(localConfigFilePath));
				var templateConfig = JSON.parse(tools.readFile(cliConfig.appRoot + cliConfig.config.root));
				var mergedConfig = merge.recursive(true, templateConfig, userConfig);
				tools.writeFile(localConfigFilePath, JSON.stringify(mergedConfig, null, 4));
				tools.log(
					tools.logColorYellow('Config file for Angular CLI Tools was updated ')
				);

			} else {
				installModule.createRootFolder(function () {
					installModule.copyLocalConfig(localConfigFilePath);
				});
			}
		} else {
			tools.throwError('Could not find project\'s node_modules folder. Make sure the node_modules folder is present at the root of your project where local templates will be installed.');
		}
	},
	copyLocalConfig : function (localConfigFilePath, callback) {
		callback = callback || tools.emptyFunction();
		//then copy config.json to './angular-cli-tools/config.json'
		var configFileRoot = cliConfig.appRoot + cliConfig.config.root;
		ncp(configFileRoot, localConfigFilePath, function (err) {
			if (err) throw err;
			tools.log(
				tools.logColorYellow('Config file for Angular CLI Tools installed in: '),
				tools.logColorCyan(localConfigFilePath)
			);
			callback();
		})
	},
	gitIgnore : function () {
		const gitIgnore = '# --- Do not add angular-cli-tools to git ---\n*';
		var projectRootPath = tools.getProjectRootFolder();
		if (!tools.fileExists(path.resolve(projectRootPath, cliConfig.user.gitIgnore.location))) {
			tools.writeFile(path.resolve(projectRootPath, cliConfig.user.gitIgnore.location), gitIgnore);
			tools.log(
				tools.logColorYellow('Added .gitignore file at: ') +
				tools.logColorCyan(path.resolve(projectRootPath, cliConfig.user.gitIgnore.location))
			);
		}
	}
};
module.exports = installModule;

