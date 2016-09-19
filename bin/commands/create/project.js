var tools = require('../../api/tools');
var config = require('../../config');
var ncp = require('ncp').ncp;
var mkdirp = require('mkdirp');


var project = {
	getSeedMetadata : function () {
		return {
			basic : {
				dependencies : {
					"font-awesome" : "^4.6.3",
					"moment" : "2.15.0"
				},
				devDependencies : {
					"angular-cli-tools" : "",
				},
				gitignore : [
					'# Angular-cli-Tools #',
					'angular-cli-tools'
				]
			},
			material : {
				ng2SrcFolder : '',
				dependencies : {
					"font-awesome" : "^4.6.3",
					"moment" : "2.15.0"
				}
			},
			bootstrap : {
				ng2SrcFolder : '',
				dependencies : {
					"font-awesome" : "^4.6.3",
					"moment" : "2.15.0"
				}
			}
		}
	},
	create : function (seedType) {

		//default to basic seed
		seedType = seedType || 'basic';

		//where the project will be generated
		var targetInstallDirectory = './';

		// only create new project in empty directory as to not overwrite something else in the folder
		if (tools.readdirSync(targetInstallDirectory).length != 0) {
			tools.throwError('Installation directory: \'' + targetInstallDirectory + '\' must be empty. [Don\'t want to overwrite something important]');
		}

		// get the location of the seed project
		var seedDirectory = config.appRoot + config.seeds.root + config.seeds.basic;

		// copy the seed project
		ncp(seedDirectory, targetInstallDirectory, function (err) {

			if (err) throw err;

			// copy the angular-cli-tools templates so user can edit/customize templates locally
			var localTemplatesDirectory = './angular-cli-tools/templates';

			//first make the './angular-cli-tools/templates' directory
			mkdirp(localTemplatesDirectory, function (err) {
				if (err) throw err;

				//then copy templates to './angular-cli-tools/templates'
				var templatesDirectory = config.appRoot + config.templates.root;
				ncp(templatesDirectory, './angular-cli-tools/templates', function (err) {
					if (err) throw err;

					// add angular-cli-tools to .gitignore file
					var gitIgnoreFileLocation = targetInstallDirectory + '.gitignore';
					tools.appendFile(gitIgnoreFileLocation, project.getGitIgnoreFileAdditions(seedType));

					// add seed dependencies and devDependencies in package.json
					var packageFileLocation = targetInstallDirectory + 'package.json';
					var packageFile = JSON.parse(tools.readFile(packageFileLocation));

					packageFile = project.addDependencies(packageFile, 'basic'); //always add basic seed dev/dependencies
					packageFile = project.addDependencies(packageFile, seedType); //add other seed dev/dependencies on top of basic seed dev/dependencies


					tools.writeFile(packageFileLocation, JSON.stringify(packageFile), function () {

						//hold off on automatically installing dependencies
						// run npm install to install all packages
						//tools.runCommand('npm install');

						//done, notify user to 'npm start' to run angular 2 app
						tools.log(
							tools.logColorCyan('Angular 2 project generated. \n'),
							tools.logColorCyan(' run:'),
							tools.logColorYellow('   npm install'),
							tools.logColorCyan('\n to install all project dependencies. Once dependencies are installed \n'),
							tools.logColorCyan(' run:'),
							tools.logColorYellow('   npm start'),
							tools.logColorCyan('\n to start your ng2 project on: '),
							tools.logColorYellow('localhost:8080')
						);
					});
				});
			});
		});
	},

	getGitIgnoreFileAdditions : function (seedType) {
		seedType = seedType || basic;
		var gitIgnoreAddition = '\n';
		var seedMetaData = project.getSeedMetadata();
		var basicGitIgnoreAdditions = seedMetaData['basic'].gitignore || [];
		var seedGitIgnoreAdditions = seedMetaData[seedType].gitignore || [];

		basicGitIgnoreAdditions.forEach(function (addition) {
			gitIgnoreAddition += addition + '\n';
		});

		if (seedType != 'basic') {
			seedGitIgnoreAdditions.forEach(function (addition) {
				gitIgnoreAddition += addition + '\n';
			});
		}
		return gitIgnoreAddition;
	},

	addDependencies : function (packageFile, seedType) {
		var seedMetaData = project.getSeedMetadata();
		var listOfDependencies = seedMetaData[seedType].dependencies || {};
		var listOfDevDependencies = seedMetaData[seedType].devDependencies || {};

		for (var dependencyName in listOfDependencies) {
			if (listOfDependencies.hasOwnProperty(dependencyName)) {
				packageFile.dependencies[dependencyName] = listOfDependencies[dependencyName];
			}
		}

		for (var devDependencyName in listOfDevDependencies) {
			if (listOfDevDependencies.hasOwnProperty(devDependencyName)) {
				packageFile.devDependencies[devDependencyName] = listOfDevDependencies[devDependencyName];
			}
		}
		return packageFile;
	},

	createMaterial : function () {

		// create basic project

		//overwrite /src folder with: [material /src folder]

		// add following packages to dependencies for bootstrap
		//    "font-awesome": "^4.6.3",
		//    "moment": "2.15.0",

	},

	createBootstrap : function () {
		// create basic project

		//overwrite /src folder with: [bootstrap /src folder]

		// add following packages to dependencies for bootstrap
		//    "bootstrap": "^4.0.0-alpha.4",
		//    "font-awesome": "^4.6.3",
		//    "moment": "2.15.0",
		//    "ng2-bootstrap": "1.1.2",

	}


}

module.exports = project;

