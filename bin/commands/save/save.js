var path = require('path');
var tools = require('../../api/tools');
var mkdirp = require('mkdirp');
var merge = require('merge');
var userConfigModule = require('../../user/user-config')


var saveModule = {
    saveComponent : function (relativePathToComponent, vFlags) {
        var projectRootPath = tools.getProjectRootFolder();
        var pathToComponent = path.resolve(process.cwd(), relativePathToComponent);
        var vFlagTemplate = tools.getvFlag(vFlags, '--template');
        var forceSave = tools.isvFlagPresent(vFlags, '--force');

        //see if user has a local config file installed
        userConfigModule.breakIfUserConfigDoesNotExist(projectRootPath);

        //check if the directory of the component to save exists
        if (tools.fileExists(pathToComponent)) {

            //determine component name: either folder name or file name identifier
            var componentName = saveModule.determineComponentName(pathToComponent);

            //determine template name: either passed in from user or default to folder name of component
            var templateName = tools.getvFlagPayload(vFlagTemplate) || componentName;


            //get the metadata for the saved files
            var fileMetadata;

            //if is a folder save every file in the folder otherwise only the specific file
            if (tools.isDirectory(pathToComponent)) {

                // create the metadata for the files
                fileMetadata = saveModule.getFileMetadata(pathToComponent, tools.readdirSync(pathToComponent), componentName, templateName, projectRootPath);

                //if template name exists in the user's config.json file (and --force flag isn't present) throw an error warning the user they are overwriting existing files
                saveModule.checkIfTemplateNameAlreadyExists(forceSave, projectRootPath, templateName);

            } else {
                var pathParts = pathToComponent.split(path.sep);
                var fileName = pathParts.pop(); //last item is the file name
                pathToComponent = pathParts.join(path.sep); // rest is the path to the file
                fileMetadata = saveModule.getFileMetadata(pathToComponent, [fileName], componentName, templateName, projectRootPath);

                //if template name exists in the user's config.json file (and --force flag isn't present) throw an error warning the user they are overwriting existing files
                saveModule.checkIfTemplateNameAlreadyExists(forceSave, projectRootPath, templateName, fileMetadata[0].componentType);
            }

            //save the files
            fileMetadata.forEach(function (metadata) {
                saveModule.saveFile(metadata);
            });

            //save the template data in user's config file
            saveModule.updateUserConfigFile(fileMetadata, templateName, projectRootPath);

            // alert the user template was created successfully
            saveModule.logSuccess(templateName, fileMetadata);
        } else {
            tools.throwError('No component found at: ' + pathToComponent);
        }
    },

    logSuccess : function (templateName, fileMetadata) {
        var message = 'Template \'' + templateName + '\' added. To use it run: ngt g c -t:' + templateName;
        if (fileMetadata.length == 1) {
            var componentType = fileMetadata[0].componentType;
            message = '\''+componentType + '\' mapping added to template \'' + templateName + '\'. To use it run: ngt g ' + componentType + ' -t:' + templateName;
        }
        tools.logSuccess(message)
    },

    updateUserConfigFile : function (fileMetadata, templateName, projectRootPath) {
        var configJSON = {
            templateMap : {}
        };

        configJSON.templateMap[templateName] = {};

        fileMetadata.forEach(function (metadata) {
            configJSON.templateMap[templateName][metadata.componentType] = metadata.relativeTarget;
        });

        userConfigModule.overwriteConfigProperties(configJSON, projectRootPath);
    },

    determineComponentName : function (pathToComponent) {
        var componentName = tools.getLastDirectoryName(pathToComponent);
        //if pathToComponent is a file, component name is the file identifier: card.module.ts [card];
        if (!tools.isDirectory(pathToComponent)) {
            var fileName = pathToComponent.split(path.sep).reverse()[0];
            componentName = fileName.split('.')[0];
        }
        return componentName;
    },

    checkIfTemplateNameAlreadyExists : function (forceSave, projectRootPath, templateName, componentType) {
        if (!forceSave) {
            var nestedConfigProperty = 'templateMap.' + templateName;
            nestedConfigProperty += componentType ? '.' + componentType : '';

            if (userConfigModule.hasProperty(nestedConfigProperty)) {
                var errorMessage = 'Template \'' + templateName + '\' already exists in: angular-cli-tools/config.json => ' + nestedConfigProperty;
                if (componentType) {
                    errorMessage = 'Template \'' + templateName + '\' already contains a mapping to \'' + componentType + '\' blueprint in: angular-cli-tools/config.json => ' + nestedConfigProperty;
                }
                tools.throwError(errorMessage + '\n' +
                    'To overwrite the template run the same command with: ' + tools.logColorYellow('-f') + ' \n' +
                    tools.logColorRed('To use a different template name run the same command with: ' + tools.logColorYellow('-t:some-other-template-name')));
            }
        }
    },

    getFileMetadata : function (pathToFiles, fileArray, componentName, templateName, projectRootPath) {

        var projectRootPath = projectRootPath || tools.getProjectRootFolder();
        var absoluteTargetDirectory = userConfigModule.getAbsolutePathToSavedComponentsFolder(projectRootPath);
        var relativeTargetDirectory = tools.addSlashToPath(userConfigModule.getSavedComponentsTargetDirectory(projectRootPath));
        var templateReplacements = tools.getTemplateReplacements(componentName, '$selectorPrefix$');

        var metaData = [];
        fileArray.forEach(function (fileName) {
            var fileMetadata = {};
            if (saveModule.isFilePartOfComponent(fileName, componentName)) {
                fileMetadata.componentType = saveModule.getComponentType(fileName);
                fileMetadata.componentFileType = saveModule.getFileType(fileName);
                fileMetadata.componentFileName = saveModule.getComponentName(fileName) + '.' + fileMetadata.componentFileType;
                fileMetadata.fileOrigin = path.resolve(pathToFiles, fileName);
                fileMetadata.relativeTarget = saveModule.formatRelativeTargetPath(relativeTargetDirectory, templateName, fileMetadata.componentFileName);
                fileMetadata.destinationDirectory = tools.addSlashToPath(path.resolve(absoluteTargetDirectory, templateName));
                fileMetadata.variables = templateReplacements.templateVariables;
                fileMetadata.userDefinedValues = templateReplacements.userDefinedValues;
                metaData.push(fileMetadata);
            }
        });
        return metaData;
    },

    saveFile : function (fileMetadata) {
        if (!tools.fileExists(fileMetadata.destinationDirectory)) {
            mkdirp(fileMetadata.destinationDirectory, function (err) {
                if (err) throw err;
                saveModule.createTemplateFile(fileMetadata);
            })
        } else {
            saveModule.createTemplateFile(fileMetadata);
        }
    },

    createTemplateFile : function (fileMetadata) {
        try {
            tools.copyBaseComponent(fileMetadata.fileOrigin, fileMetadata.destinationDirectory + fileMetadata.componentFileName, function () {
                try {
                    if (fileMetadata.componentFileType === 'ts') {
                        tools.replaceInFile(fileMetadata.destinationDirectory + fileMetadata.componentFileName, fileMetadata.userDefinedValues, fileMetadata.variables, fileMetadata.destinationDirectory + fileMetadata.componentFileName);
                    }
                } catch (error) {
                    throw error;
                }
            });
        } catch (error) {
            throw error;
        }
    },

    formatRelativeTargetPath : function (relativeTargetDirectory, templateName, componentFileName) {
        var relativePath = tools.addSlashToPath(relativeTargetDirectory + templateName);
        relativePath += componentFileName;
        return tools.replacePathSlashes(relativePath);
    },

    isFilePartOfComponent : function (fileName, componentName) {
        var fileParts = fileName.split('.');
        return fileParts[0] === componentName;
    },

    getComponentType : function (fileName) {
        var type = null;
        var fileParts = fileName.split('.').reverse();
        if (fileParts[0] && fileParts[0].toLowerCase() === 'ts') {
            type = fileParts[1];
        } else {
            if (fileParts[0] && ['scss', 'css', 'less'].indexOf(fileParts[0]) >= 0) {
                type = 'style';
            } else {
                type = fileParts[0];
            }
        }
        return type;
    },
    getComponentName : function (fileName) {
        return fileName.split('.').reverse()[1];
    },
    getFileType : function (fileName) {
        return fileName.split('.').reverse()[0];
    }
};

module.exports = saveModule;

