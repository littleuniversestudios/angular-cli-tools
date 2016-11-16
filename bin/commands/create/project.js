var tools = require('../../api/tools');
var cliConfig = require('../../cli-config');
var ncp = require('ncp').ncp;
var mkdirp = require('mkdirp');
const download = require('download-github-repo'); //experimental

var projectModule = {

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

    createFromURL     : function (url, targetInstallDirectory, forceCreate, messageToUser) {

        url = projectModule.sanitizeGitHubURL(url);

        projectModule.makeProjectDirectory(targetInstallDirectory, function () {

            // only create new project in empty directory as to not overwrite something else in the folder
            projectModule.checkIfInstallationDirectoryIsEmpty(targetInstallDirectory, forceCreate);

            mkdirp(targetInstallDirectory, function (err) {
                if (err) throw err;

                download(url, targetInstallDirectory, function (error) {
                    if (error) {
                        tools.throwError('Could not find repository: ' + url);
                    }

                    // todo: find the localhost port in the readme file
                    var port = projectModule.findLocalhostPort(targetInstallDirectory + 'README.md');

                    projectModule.copyCLIToolsToProject(targetInstallDirectory, function () {
                        projectModule.displaySuccessMessage(messageToUser, targetInstallDirectory, port);
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

    checkIfInstallationDirectoryIsEmpty : function (targetInstallDirectory, forceCreate) {
        // only create new project in empty directory as to not overwrite something else in the folder
        if (tools.readdirSync(targetInstallDirectory).length != 0 && !forceCreate) {
            tools.throwError('Installation directory: \'' + targetInstallDirectory + '\' must be empty. Use \'-f\' to to ignore this warning.');
        }
    },

    copyCLIToolsToProject : function (targetInstallDirectory, callback) {
        // copy the angular-cli-tools templates so user can edit/customize templates locally
        var localTemplatesDirectory = targetInstallDirectory + 'angular-cli-tools/';

        //first make the './angular-cli-tools/templates' directory
        mkdirp(localTemplatesDirectory, function (err) {
            if (err) throw err;

            //then copy templates + config.json to '[project-root]/angular-cli-tools'
            var templatesDirectory = cliConfig.appRoot + cliConfig.cli.root;
            ncp(templatesDirectory, localTemplatesDirectory, {clobber : true}, function (err) {
                if (err) throw err;
                callback();
            });

            //then create a .gitignore file for angualr-cli-tools folder (folder and its contents shouldn't be picket up by git)
            tools.writeFile(localTemplatesDirectory + '.gitignore', '# do not add angular-cli-tools folder to repository \r\n*');

        });
    },

    displaySuccessMessage   : function (seedType, targetInstallDirectory, port) {
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
    successMessageDisplayed : false
};

module.exports = projectModule;

