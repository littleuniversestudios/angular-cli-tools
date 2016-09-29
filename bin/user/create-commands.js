#! /usr/bin/env node
var tools = require('../api/tools');
var blueprint = require('../commands/generate/blueprint');
var project = require('../commands/create/project');

var createCommands = {
	newProject : function (projectDestination, vFlags) {
		vFlags = vFlags || [];
		projectDestination = tools.pathEndsWithSlash(projectDestination) ? projectDestination : projectDestination + '/';
		var pathData = blueprint.extractNameData(projectDestination);
		var vFlagIdentifier = tools.getvFlagIdentifier(vFlags[0]);
		switch (vFlagIdentifier) {
			case '--bootstrap':
				project.create('bootstrap', pathData.destinationDirectory);
				break;
			case '--material':
				project.create('material', pathData.destinationDirectory);
				break;
			//experimental
			case '--url':
                project.createFromURL(tools.getvFlagPayload(vFlags[0]), pathData.destinationDirectory);
                break;
			default:
				project.create('basic', pathData.destinationDirectory);
				break;
		}
	}
};

module.exports = createCommands;

