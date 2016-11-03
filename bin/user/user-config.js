#! /usr/bin/env node
var path = require('path');
var tools = require('../api/tools');
var cliConfig = require('../cli-config');
var merge = require('merge');

//nodeModulesPath can be passed in to most of the function but is optional. Always looking it up
// could get expensive especially if the current working directory is deeply nested in the project

var userConfigModule = {
    getUserConfig : function (projectRootPath) {
        //find the project's node_modules folder
        var userConfig = null;
        projectRootPath = projectRootPath || tools.getProjectRootFolder();
        if (projectRootPath) {
            var userConfigPath = path.resolve(projectRootPath, cliConfig.user.config.location);
            if (tools.fileExists(userConfigPath)) {
                userConfig = JSON.parse(tools.readFile(userConfigPath));
            }
        }
        return userConfig;
    },
    breakIfUserConfigDoesNotExist : function (projectRootPath) {
        if (!userConfigModule.getUserConfig(projectRootPath)) {
            tools.throwError('Local \'angular-cli-tools/config.json\' does not exist for this project. Install config.json before proceeding: ' + tools.logColorYellow('ngt install config'))
        }
    },
    getUserTemplateFilesMap : function (template, projectRootPath) {
        projectRootPath = projectRootPath || tools.getProjectRootFolder();
        var userConfig = userConfigModule.getUserConfig(projectRootPath);
        return userConfig && userConfig.templateMap && userConfig.templateMap[template] ? userConfig.templateMap[template] : null;
    },
    getAbsolutePathToUserBlueprintFile : function (filePath, projectRootPath) {
        projectRootPath = projectRootPath || tools.getProjectRootFolder();
        var absolutePathToFile = path.resolve(projectRootPath, cliConfig.user.localAngularCLITools.location, filePath);

        var fileMetadata = {
            location : absolutePathToFile,
            label : tools.getRelativePathFromProjectRoot(absolutePathToFile, projectRootPath, '[project-root]/'),
            origin : 'mapped'
        };
        if (!tools.fileExists(absolutePathToFile)) {
            fileMetadata = null;
        }
        return fileMetadata;
    },

    getAbsolutePathToSavedComponentsFolder : function (projectRootPath) {
        var projectRootPath = projectRootPath || tools.getProjectRootFolder();
        var savedComponentsLocation = userConfigModule.getSavedComponentsTargetDirectory(projectRootPath);
        return path.resolve(projectRootPath, cliConfig.user.localAngularCLITools.location, savedComponentsLocation);
    },

    getSavedComponentsTargetDirectory : function (projectRootPath) {
        var userConfig = userConfigModule.getUserConfig(projectRootPath);
        var savedComponentsLocation = cliConfig.user.savedComponents.location;
        if (userConfig && userConfig.commands && userConfig.commands.save && userConfig.commands.save.rootDirectory) {
            savedComponentsLocation = userConfig.commands.save.rootDirectory;
        }
        return savedComponentsLocation;
    },

    overwriteConfigProperties : function (propertyObject, projectRootPath) {
        projectRootPath = projectRootPath || tools.getProjectRootFolder();
        var userConfigPath = path.resolve(projectRootPath, cliConfig.user.config.location);
        var userConfig = userConfigModule.getUserConfig(projectRootPath);
        var mergedConfig = merge.recursive(true, userConfig, propertyObject);
        tools.writeFile(userConfigPath, JSON.stringify(mergedConfig, null, 4));
    },

    hasProperty : function (nestedProperty, projectRootPath) {
        projectRootPath = projectRootPath || tools.getProjectRootFolder();
        var userConfig = userConfigModule.getUserConfig(projectRootPath);
        return tools.objectHasNestedProperty(userConfig, nestedProperty);
    },

    getProperty : function (nestedProperty, projectRootPath) {
        projectRootPath = projectRootPath || tools.getProjectRootFolder();
        var userConfig = userConfigModule.getUserConfig(projectRootPath);
        return tools.objectGetNestedProperty(userConfig, nestedProperty);
    }

    // TODO: add a function that checks (and gets) a deeply nested property in an object
};

module.exports = userConfigModule;

