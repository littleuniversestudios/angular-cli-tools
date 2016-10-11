#! /usr/bin/env node
var path = require('path');
var tools = require('../api/tools');
var cliConfig = require('../cli-config');

//nodeModulesPath can be passed in to most of the function but is optional. Always looking it up
// could get expensive especially if the current working directory is deeply nested in the project

var userConfigModule = {
    getUserConfig : function (nodeModulesPath) {
        //find the project's node_modules folder
        var userConfig = null;
        nodeModulesPath = nodeModulesPath || tools.getNodeModulesPath();
        if (nodeModulesPath) {
            var userConfigPath = path.resolve(nodeModulesPath, cliConfig.user.config.location);
            if (tools.fileExists(userConfigPath)) {
                userConfig = JSON.parse(tools.readFile(userConfigPath));
            }
        }
        return userConfig;
    },
    getUserTemplateFilesMap : function (template, nodeModulesPath) {
        nodeModulesPath = nodeModulesPath || tools.getNodeModulesPath();
        var userConfig = userConfigModule.getUserConfig(nodeModulesPath);
        return userConfig && userConfig.templateMap && userConfig.templateMap[template] ? userConfig.templateMap[template] : null;
    },
    getAbsolutePathToUserBlueprintFile : function (filePath, nodeModulesPath) {
        nodeModulesPath = nodeModulesPath || tools.getNodeModulesPath();
        var absolutePathToFile = path.resolve(nodeModulesPath, cliConfig.user.localAngularCLITools.location, filePath);

        var fileMetadata = {
            location : absolutePathToFile,
            label : tools.getRelativePathFromProjectRoot(absolutePathToFile, nodeModulesPath, '[project-root]/'),
            origin : 'mapped'
        };
        if (!tools.fileExists(absolutePathToFile)) {
            fileMetadata = null;
        }
        return fileMetadata;
    }
};

module.exports = userConfigModule;

