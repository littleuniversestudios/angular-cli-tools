var path = require('path');
var tools = require('../../api/tools');
var config = require('../../config');
var ncp = require('ncp').ncp;
var mkdirp = require('mkdirp');


var install = {
	localTemplates : function (vFlags) {

		//find the project's node_modules folder
		var nodeModulesPath = tools.getNodeModulesPath();
		if (nodeModulesPath) {
			var localTemplatesDirectory = path.resolve(nodeModulesPath, '../angular-cli-tools/templates/');

			//check if local templates already exist
			if (tools.fileExists(localTemplatesDirectory)) {
				if (tools.isvFlagPresent(vFlags, '--force')) {
					install.copyLocalTemplates(localTemplatesDirectory);
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
				install.copyLocalTemplates(localTemplatesDirectory);
			}
		} else {
			tools.throwError('Could not find project\'s node_modules folder. Make sure the node_modules folder is present at the root of your project where local templates will be installed.');
		}
	},
	copyLocalTemplates : function (localTemplatesDirectory, callback) {
		callback = callback || tools.emptyFunction();
		//first make the './angular-cli-tools/templates' directory
		mkdirp(localTemplatesDirectory, function (err) {
			if (err) throw err;

			//then copy templates to './angular-cli-tools/templates'
			var templatesDirectory = config.appRoot + config.templates.root;
			ncp(templatesDirectory, localTemplatesDirectory, {clobber : true}, function (err) {
				if (err) throw err;
				tools.log(
					tools.logColorYellow('Local (editable) templates installed in: '),
					tools.logColorCyan(localTemplatesDirectory)
				);
				callback();
			})
		})
	}
};
module.exports = install;

