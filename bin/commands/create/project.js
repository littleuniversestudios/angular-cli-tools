var tools = require('../../api/tools');
var config = require('../../config');
var ncp = require('ncp').ncp;
var mkdirp = require('mkdirp');
const download = require('download-github-repo'); //experimental


var projectModule = {
    create : function (seedType, targetInstallDirectory) {
        //where the project will be generated
        targetInstallDirectory = targetInstallDirectory || './';

        //default to basic seed
        seedType = seedType || 'basic';

        projectModule.makeProjectDirectory(targetInstallDirectory, function () {
            projectModule.makeProject(seedType, targetInstallDirectory);
        });
        // if (!tools.fileExists(targetInstallDirectory)) {
        //     mkdirp(targetInstallDirectory, function (err) {
        //         if (err) throw err;
        //     })
        // } else {
        //     projectModule.makeProject(seedType, targetInstallDirectory);
        // }
    },

    makeProjectDirectory : function (targetInstallDirectory, callback) {
        if (!tools.fileExists(targetInstallDirectory)) {
            mkdirp(targetInstallDirectory, function (err) {
                if (err) throw err;
                callback();
            })
        } else {
            callback();
        }
    },

    //experimental
    createFromURL : function (url, targetInstallDirectory) {

        url = projectModule.sanitizeGitHubURL(url);

        projectModule.makeProjectDirectory(targetInstallDirectory, function () {

            // only create new project in empty directory as to not overwrite something else in the folder
            projectModule.checkIfInstallationDirectoryIsEmpty(targetInstallDirectory);

            mkdirp(targetInstallDirectory, function (err) {
                if (err) throw err;

                download(url, targetInstallDirectory, function (error) {
                    if (error) {
                        tools.throwError('Could not find repository: ' + url);
                    }

                    // todo: find the localhost port in the readme file
                    var port = projectModule.findLocalhostPort(targetInstallDirectory + 'README.md');

                    projectModule.copyCLIToolsToProject(targetInstallDirectory, function () {
                        //add angular-cli-tools folder to .gitignore file
                        projectModule.appendGitIgnoreFile('basic', targetInstallDirectory);
                        projectModule.displaySuccessMessage('From GITHUB', targetInstallDirectory, port);
                    });

                });
            })
        });
    },
    findLocalhostPort : function (fileLocation) {
        var file = tools.readFile(fileLocation);
        var searchTerm = 'localhost:';
        var indexLocation = file.indexOf(searchTerm);
        var port = null;
        if (indexLocation >= 0) {
            var startIndex = indexLocation + searchTerm.length;
            port = file.substring(startIndex, startIndex + 4);
        }
        return port;
    },

    sanitizeGitHubURL : function (url) {
        var urlParts = [
            'https://github.com/',
            'http://github.com/',
            'https://www.github.com',
            'http://www.github.com/',
        ];

        urlParts.forEach(function (urlPart) {
            if (url.indexOf(urlPart) === 0) {
                url = url.substring(urlPart.length);
            }
        });
        return url;
    },

    checkIfInstallationDirectoryIsEmpty : function (targetInstallDirectory) {
        // only create new project in empty directory as to not overwrite something else in the folder
        if (tools.readdirSync(targetInstallDirectory).length != 0) {
            tools.throwError('Installation directory: \'' + targetInstallDirectory + '\' must be empty. [Don\'t want to overwrite something important]');
        }
    },

    copyCLIToolsToProject : function (targetInstallDirectory, callback) {
        // copy the angular-cli-tools templates so user can edit/customize templates locally
        var localTemplatesDirectory = targetInstallDirectory + 'angular-cli-tools/templates';

        //first make the './angular-cli-tools/templates' directory
        mkdirp(localTemplatesDirectory, function (err) {
            if (err) throw err;

            //then copy templates to './angular-cli-tools/templates'
            var templatesDirectory = config.appRoot + config.templates.root;
            ncp(templatesDirectory, localTemplatesDirectory, function (err) {
                if (err) throw err;

                callback();

            });
        });
    },

    appendGitIgnoreFile : function (seedType, targetInstallDirectory) {
        // add angular-cli-tools to .gitignore file
        var gitIgnoreFileLocation = targetInstallDirectory + '.gitignore';
        tools.appendFile(gitIgnoreFileLocation, projectModule.getGitIgnoreFileAdditions(seedType));
    },

    makeProject : function (seedType, targetInstallDirectory) {

        // only create new project in empty directory as to not overwrite something else in the folder
        projectModule.checkIfInstallationDirectoryIsEmpty(targetInstallDirectory);


        // get the location of the seed project
        var seedDirectory = config.appRoot + config.seeds.root + config.seeds.basic.root;

        // copy the seed project
        ncp(seedDirectory, targetInstallDirectory, function (err) {

            if (err) throw err;

            // copy the angular-cli-tools templates so user can edit/customize templates locally
            projectModule.copyCLIToolsToProject(targetInstallDirectory, function () {

                //add angular-cli-tools folder to .gitignore file //TODO: clean this up.... maybe have a default object in config because url seeds are neither basic/boot/material
                projectModule.appendGitIgnoreFile(seedType, targetInstallDirectory);

                // add seed dependencies and devDependencies in package.json
                var packageFileLocation = targetInstallDirectory + 'package.json';
                var packageFile = JSON.parse(tools.readFile(packageFileLocation));

                packageFile = projectModule.addDependencies(packageFile, 'basic'); //always add basic seed dev/dependencies
                packageFile = projectModule.addDependencies(packageFile, seedType); //add other seed dev/dependencies on top of basic seed dev/dependencies


                tools.writeFile(packageFileLocation, JSON.stringify(packageFile, null, 4), function () {

                    // if any other seed than the 'basic' seed, overwrite 'src' directory using selected seed's src (bootstrap|material)
                    if (seedType != 'basic') {
                        ncp(config.appRoot + config.seeds.root + config.seeds[seedType].srcFolder, targetInstallDirectory + '/src', {clobber : true}, function (err) {
                            if (err) throw err;
                            projectModule.displaySuccessMessage(seedType, targetInstallDirectory, '8080');
                        });
                    } else {
                        projectModule.displaySuccessMessage(seedType, targetInstallDirectory, '8080');
                    }
                });
            });
        });
    },


    displaySuccessMessage : function (seedType, targetInstallDirectory, port) {
        //done, notify user to 'npm start' to run angular 2 app
        if (!projectModule.successMessageDisplayed) {
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
            if (port) {
                logMessage += tools.logColorCyan('           (to start your ng2 project on: ');
                logMessage += tools.logColorYellow('localhost:' + port + tools.logColorCyan(')'));
            } else {
                logMessage += tools.logColorCyan('           (see project\'s ' + tools.logColorYellow('README.md') + tools.logColorCyan(' file for setup instructions)'));
            }

            tools.log(logMessage);
            //this is bit of a hack to prevent ncp from displaying the success message on every recursive folder copy
            // currently ncp fires the callback on every folder copy (so with a deeply nested folder callback might fire a few times)
            //TODO: find a more suited recursive copy folder module w/ few dependencies.
            projectModule.successMessageDisplayed = true;
        }
    },
    successMessageDisplayed : false,

    getGitIgnoreFileAdditions : function (seedType) {
        seedType = seedType || 'basic';
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
};

module.exports = projectModule;

