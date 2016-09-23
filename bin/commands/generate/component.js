var tools = require('../../api/tools');
var blueprint = require('./blueprint');

var componentBlueprint = {
	/*
	 Create a index.ts file
	 */
	generateCommand : function (tsBlueprintMetaData,htmlBlueprintMetaData, styleBlueprintMetaData,callback) {
		callback = callback || tools.emptyFunction();

		// Check if directory with the user defined component already exists, if not, create directory w/component name
		if (tools.fileExists(componentName)) {
			tools.throwError('Component ' + componentName + ' already exists.');
		} else {
			try {
				tools.makeDirSync(componentName);
			} catch (error) {
				throw error;
			}
		}

		// Get blueprint for .ts file
		var tsScaffoldData = blueprint.getMetadata('component', componentName, 'ts');
		blueprint.create(tsScaffoldData, function () {
			componentBlueprint.logSuccesfullyCreatedFile(tsScaffoldData);

			// Get blueprint for .html file
			var htmlScaffoldData = blueprint.getMetadata('component', componentName, 'html');
			blueprint.create(htmlScaffoldData, function () {
				componentBlueprint.logSuccesfullyCreatedFile(htmlScaffoldData);

				// Get blueprint for .css/.scss file
				var styleScaffoldData = blueprint.getMetadata('component', componentName, styleType);
				blueprint.create(styleScaffoldData, function () {
					componentBlueprint.logSuccesfullyCreatedFile(styleScaffoldData);
					callback();
				});
			});
		});

	},

	logSuccesfullyCreatedFile : function (scaffoldData) {
		var logMessage = 'Created ' + scaffoldData.fileName;
		if (scaffoldData.template.isLocalTemplate) {
			tools.log(tools.logColorYellow(logMessage), tools.logColorCyan('[Using local template: ' + scaffoldData.template.location + ']'));
		} else {
			tools.logSuccess(logMessage);
		}
	}
};
module.exports = componentBlueprint;
