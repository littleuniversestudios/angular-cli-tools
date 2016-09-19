var tools = require('../../api/tools');
var blueprint = require('./blueprint');

var indexBlueprint = {
	generateCommand : function (destinationDirectory) {

		//can generate an index in a different file location
		destinationDirectory = destinationDirectory || './'; //default to local directory

		// get blueprint for index.ts
		var scaffoldData = blueprint.getMetadata('index', 'index', 'ts');

		//set directory of blueprint (see above: destinationDirectory)
		scaffoldData.destinationDirectory = destinationDirectory;

		//see if index.ts already exists, prompt user to use update command
		if (tools.fileExists(destinationDirectory + scaffoldData.fileName)) {
			tools.throwError('File ' + scaffoldData.fileName + ' already exists! To update index run: \'ngt update index\' or \'ngt u i\'');
		}

		try {

			//read all files from desired directory (see above: destinationDirectory)
			var files = tools.readdirSync(destinationDirectory);
			var indexFileContents = '';

			//only export .ts files AND other folders in directory
			files.forEach(function (fileName) {

				if (tools.isDirectory(destinationDirectory + '/' + fileName)) {
					//is it a folder
					indexFileContents += "export * from './" + fileName + "';\n"
				} else if (fileName.indexOf('ts') != -1) {
					//is it a .ts file
					indexFileContents += "export * from './" + fileName.split('.ts').join('') + "';\n"
				}

			});

			//set template variables for index.ts template file
			scaffoldData.template.variables = ['$exports$'];
			scaffoldData.template.userDefinedValues = [indexFileContents];

			//create index.ts file
			blueprint.makeFileFromTemplate(scaffoldData);

		} catch (error) {
			tools.throwError(error);
		}
	},

	updateCommand : function (destinationDirectory) {

		//can update an index in a different file location
		destinationDirectory = destinationDirectory || '';

		//index.ts file is always 'index.ts'
		var fileName = 'index.ts';

		//delete 'index.ts' if exists
		if (tools.fileExists(destinationDirectory + 'index.ts')) {
			tools.removeFile(destinationDirectory + fileName);
		}

		//create new 'index.ts' file
		indexBlueprint.generateCommand(destinationDirectory);
	}
};
module.exports = indexBlueprint;
