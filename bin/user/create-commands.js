#! /usr/bin/env node
var tools = require('../api/tools');
var blueprintMetadataModule = require('../commands/generate/blueprint-metadata');
var project = require('../commands/create/project');
var cliConfig = require('../cli-config');

var createCommands = {
    newProject : function (projectDestination, vFlags) {
        vFlags = vFlags || [];
        projectDestination = tools.pathEndsWithSlash(projectDestination) ? projectDestination : projectDestination + '/';
        var pathData = blueprintMetadataModule.extractNameData(projectDestination);
        var forceCreate = tools.getvFlag(vFlags, '--force') ? true : false;
        switch (createCommands.getProjectType(vFlags)) {
            case 'bootstrap':
                project.createFromURL(cliConfig.seeds.bootstrap.url, pathData.destinationDirectory, forceCreate, 'Bootstrap');
                break;
            case 'material':
                project.createFromURL(cliConfig.seeds.material.url, pathData.destinationDirectory, forceCreate, 'Material Design');
                break;
            case 'github':
                project.createFromURL(tools.getvFlagPayload(tools.getvFlag(vFlags, '--url')), pathData.destinationDirectory, forceCreate, 'From GitHub');
                break;
            default:
                project.createFromURL(cliConfig.seeds.basic.url, pathData.destinationDirectory, forceCreate,'basic');
                break;
        }
    },

    getProjectType : function (vFlags) {
        var projectType = 'basic';
        if (tools.getvFlag(vFlags, '--bootstrap')) {
            projectType = 'bootstrap';
        } else if (tools.getvFlag(vFlags, '--material')) {
            projectType = 'material';
        } else if (tools.getvFlag(vFlags, '--url')) {
            projectType = 'github';
        }
        return projectType;
    }


};

module.exports = createCommands;

