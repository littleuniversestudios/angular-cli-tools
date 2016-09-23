var tools = require('../../api/tools');
var config = require('../../config');
var ncp = require('ncp').ncp;
var mkdirp = require('mkdirp');
// const download = require('download'); //experimental


var project = {
	create : function (seedType, targetInstallDirectory) {
		//where the project will be generated
		targetInstallDirectory = targetInstallDirectory || './';

		//default to basic seed
		seedType = seedType || 'basic';

		if (!tools.fileExists(targetInstallDirectory)) {
			mkdirp(targetInstallDirectory, function (err) {
				if (err) throw err;
				project.makeProject(seedType, targetInstallDirectory);
			})
		} else {
			project.makeProject(seedType, targetInstallDirectory);
		}
	},
	//experimental
	// createFromURL : function (url, targetInstallDirectory) {
	// 	console.log('url: ', url);
	//
	// 	var dl = download(url, targetInstallDirectory, {extract : true, strip : 1});
	// 	dl.on('error', function (err) {
	// 		throw err;
	// 	});
	//
	// 	dl.on('close', function () {
	// 		console.log('hmmmmmm');
	// 	});
	// },
	makeProject : function (seedType, targetInstallDirectory) {

		// only create new project in empty directory as to not overwrite something else in the folder
		if (tools.readdirSync(targetInstallDirectory).length != 0) {
			tools.throwError('Installation directory: \'' + targetInstallDirectory + '\' must be empty. [Don\'t want to overwrite something important]');
		}

		// get the location of the seed project
		var seedDirectory = config.appRoot + config.seeds.root + config.seeds.basic.root;

		// copy the seed project
		ncp(seedDirectory, targetInstallDirectory, function (err) {

			if (err) throw err;

			// copy the angular-cli-tools templates so user can edit/customize templates locally
			var localTemplatesDirectory = targetInstallDirectory + 'angular-cli-tools/templates';

			//first make the './angular-cli-tools/templates' directory
			mkdirp(localTemplatesDirectory, function (err) {
				if (err) throw err;

				//then copy templates to './angular-cli-tools/templates'
				var templatesDirectory = config.appRoot + config.templates.root;
				ncp(templatesDirectory, localTemplatesDirectory, function (err) {
					if (err) throw err;

					// add angular-cli-tools to .gitignore file
					var gitIgnoreFileLocation = targetInstallDirectory + '.gitignore';
					tools.appendFile(gitIgnoreFileLocation, project.getGitIgnoreFileAdditions(seedType));

					// add seed dependencies and devDependencies in package.json
					var packageFileLocation = targetInstallDirectory + 'package.json';
					var packageFile = JSON.parse(tools.readFile(packageFileLocation));

					packageFile = project.addDependencies(packageFile, 'basic'); //always add basic seed dev/dependencies
					packageFile = project.addDependencies(packageFile, seedType); //add other seed dev/dependencies on top of basic seed dev/dependencies


					tools.writeFile(packageFileLocation, JSON.stringify(packageFile, null, 4), function () {

						//hold off on automatically installing dependencies
						// run npm install to install all packages
						//tools.runCommand('npm install');

						// if any other seed than the 'basic' seed, overwrite 'src' directory using selected seed's src (bootstrap|material)
						if (seedType != 'basic') {
							ncp(config.appRoot + config.seeds.root + config.seeds[seedType].srcFolder, targetInstallDirectory + '/src', {clobber : true}, function (err) {
								if (err) throw err;
								project.displaySuccessMessage(seedType, targetInstallDirectory);
							});
						} else {
							project.displaySuccessMessage(seedType, targetInstallDirectory);
						}
					});
				});
			});
		});
	},
	displaySuccessMessage : function (seedType, targetInstallDirectory) {
		//done, notify user to 'npm start' to run angular 2 app
		if (!project.successMessageDisplayed) {
			var logMessage = '';

			logMessage += tools.logColorCyan('****************************************************************************\n');
			logMessage += tools.logColorYellow('              Angular 2');
			if (seedType != 'basic') {
				logMessage += tools.logColorYellow(' [' + seedType + ']');
			}
			logMessage += tools.logColorYellow(' project generated!  ' + ' \n');
			logMessage += tools.logColorCyan('****************************************************************************\n');
			if (targetInstallDirectory != './') {
				logMessage += tools.logColorCyan(' run:');
				logMessage += tools.logColorYellow('   cd ' + targetInstallDirectory);
				logMessage += tools.logColorCyan('    (to go to your new project root directory)' + ' \n');
			}
			logMessage += tools.logColorCyan(' run:');
			logMessage += tools.logColorYellow('   npm install');
			logMessage += tools.logColorCyan('         (to install all project dependencies)\n');
			logMessage += tools.logColorCyan(' run:');
			logMessage += tools.logColorYellow('   npm start');
			logMessage += tools.logColorCyan('           (to start your ng2 project on: ');
			logMessage += tools.logColorYellow('localhost:8080' + tools.logColorCyan(')'));

			tools.log(logMessage);
			//this is bit of a hack to prevent ncp from displaying the success message on every recursive folder copy
			// currently ncp fires the callback on every folder copy (so with a deeply nested folder callback might fire a few times)
			//TODO: find a more suited recursive copy folder module w/ few dependencies.
			project.successMessageDisplayed = true;
		}
	},
	successMessageDisplayed : false,

	getGitIgnoreFileAdditions : function (seedType) {
		seedType = seedType || basic;
		var gitIgnoreAddition = '\n';
		var basicGitIgnoreAdditions = config.seeds['basic'].gitignore || [];
		var seedGitIgnoreAdditions = config.seeds[seedType].gitignore || [];

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
		var listOfDependencies = config.seeds[seedType].dependencies || {};
		var listOfDevDependencies = config.seeds[seedType].devDependencies || {};

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
	}
}

module.exports = project;

