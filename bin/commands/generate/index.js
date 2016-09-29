var path = require('path');
var tools = require('../../api/tools');
var blueprint = require('./blueprint');

var indexBlueprint = {
	generateCommand : function (destinationDirectory) {

		//can generate an index in a different file location
		destinationDirectory = destinationDirectory || './'; //default to local directory
		destinationDirectory = tools.pathEndsWithSlash(destinationDirectory) ? destinationDirectory : destinationDirectory + '/';

		// get blueprint for index.ts
		var scaffoldData = blueprint.getMetadata('index', 'index', 'ts');

		//set directory of blueprint (see above: destinationDirectory)
		scaffoldData.destinationDirectory = destinationDirectory;

		//see if index.ts already exists, prompt user to use update command
		if (tools.fileExists(destinationDirectory + scaffoldData.fileName)) {
			tools.throwError('File ' + destinationDirectory + scaffoldData.fileName + ' already exists! To update index run: \'ngt update index\' or \'ngt u i\'');
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
				} else if (tools.getFileExtension(fileName) == 'ts' && !tools.containsString(fileName, 'spec')) {
					//is it a .ts file
					indexFileContents += "export * from './" + tools.getFileName(fileName) + "';\n"
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
		destinationDirectory = destinationDirectory || './';
		destinationDirectory = tools.pathEndsWithSlash(destinationDirectory) ? destinationDirectory : destinationDirectory + '/';


		//index.ts file is always 'index.ts'
		var fileName = 'index.ts';

		//delete 'index.ts' if exists
		if (tools.fileExists(destinationDirectory + 'index.ts')) {
			tools.removeFile(destinationDirectory + fileName);
		}

		//create new 'index.ts' file
		indexBlueprint.generateCommand(destinationDirectory);
	},

	updateRecursive : function (startDirectory, updatedFiles) {
		//make sure the current directory has a end slash '/'...easier to combine with other files/folders
		var currentDirectory = tools.pathEndsWithSlash(startDirectory) ? startDirectory : startDirectory + '/';

		//update the index in current directory
		indexBlueprint.updateCommand(currentDirectory);

		//add to the list of updated index files
		updatedFiles.push(currentDirectory + 'index.ts');

		//read all files from directory
		var files = tools.readdirSync(currentDirectory);
		files.forEach(function (file) {
			if (tools.isDirectory(currentDirectory + file)) {
				var nextDirectory = tools.pathEndsWithSlash(currentDirectory) ? currentDirectory + file : currentDirectory + '/' + file;
				return indexBlueprint.updateRecursive(nextDirectory, updatedFiles);
			}
		});
		return updatedFiles;

	}
};
module.exports = indexBlueprint;
