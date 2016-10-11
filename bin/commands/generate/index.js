var path = require('path');
var tools = require('../../api/tools');
var blueprintModule = require('./blueprint');
var blueprintMetadataModule = require('./blueprint-metadata');

var indexBlueprint = {
    generateCommand : function (destinationDirectory) {
        var indexFileGenerated = false;

        //can generate an index in a different file location
        destinationDirectory = destinationDirectory || './'; //default to local directory
        destinationDirectory = tools.pathEndsWithSlash(destinationDirectory) ? destinationDirectory : destinationDirectory + '/';

        // get blueprint for index.ts
        var blueprint = blueprintMetadataModule.getBlueprints('index', 'index', [])[0]; //index template is first

        // set directory and file name of blueprint (see above: destinationDirectory)
        blueprint.fileName = 'index.ts';
        blueprint.destinationDirectory = destinationDirectory;

        //see if index.ts already exists, prompt user to use update command
        if (tools.fileExists(destinationDirectory + blueprint.fileName)) {
            tools.throwError('File ' + destinationDirectory + blueprint.fileName + ' already exists! To update index run: \'ngt update index\' or \'ngt u i\'');
        }

        try {

            //read all files from desired directory (see above: destinationDirectory)
            var files = tools.readdirSync(destinationDirectory);
            var indexFileContents = '';

            //only export .ts files AND other folders in directory
            files.forEach(function (fileName) {

                if (tools.isDirectory(destinationDirectory + '/' + fileName)) {
                    //is it a folder,

                    // DO NOT INDEX FOLDERS any more (as of Oct 2016)

                    //indexFileContents += "export * from './" + fileName + "';\n"
                } else if (tools.getFileExtension(fileName) == 'ts' && !tools.containsString(fileName, 'spec')) {
                    //is it a .ts file
                    indexFileContents += "export * from './" + tools.getFileName(fileName) + "';\n"
                }

            });

            //set template variables for index.ts template file
            blueprint.variables = ['$exports$'];
            blueprint.userDefinedValues = [indexFileContents];

            //create index.ts file only if there are components to export
            if (indexFileContents != '') {
                blueprintModule.makeFileFromTemplate(blueprint);
                indexFileGenerated = true;
            }

        } catch (error) {
            tools.throwError(error);
        }
        return indexFileGenerated;
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
        return indexBlueprint.generateCommand(destinationDirectory);
    },

    updateRecursive : function (startDirectory, updatedFiles) {
        //make sure the current directory has a end slash '/'...easier to combine with other files/folders
        var currentDirectory = tools.pathEndsWithSlash(startDirectory) ? startDirectory : startDirectory + '/';

        //update the index in current directory
        var indexUpdated = indexBlueprint.updateCommand(currentDirectory);

        //add to the list of updated index files
        if (indexUpdated) {
            updatedFiles.push(currentDirectory + 'index.ts');
        }

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
