#! /usr/bin/env node
var tools = require('../api/tools');
var blueprint = require('../commands/generate/blueprint');
var project = require('../commands/create/project');

var createCommands = {
	newProject : function (projectDestination, vFlags) {
		vFlags = vFlags || [];
		projectDestination = tools.pathEndsWithSlash(projectDestination) ? projectDestination : projectDestination + '/';
		var pathData = blueprint.extractNameData(projectDestination);

		switch (vFlags[0]) {
			case '--bootstrap':
				project.create('bootstrap', pathData.destinationDirectory);
				break;
			case '--material':
				project.create('material', pathData.destinationDirectory);
				break;
			default:
				project.create('basic', pathData.destinationDirectory);
				break;
		}
	}
};

module.exports = createCommands;

