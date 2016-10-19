var fs = require('fs');
var path = require('path');
var logging = require('./logging');
var helpers = require('./helpers');
var vFlagModule = require('./vFlag');
var findNodeModules = require('find-node-modules');

var tools = {

    emptyFunction : function () {
        return function () {
        }
    },

    copyBaseComponent : function (base, path, callback) {
        fs.createReadStream(base).pipe(fs.createWriteStream(path)).on('finish', callback);
    },

    replaceInFile : function (input, searches, values, output, callback) {
        fs.readFile(input, 'utf8', function (err, data) {
            if (err) {
                throw err
            }
            var newData = data;
            searches.forEach(function (search, index) {
                newData = newData.split(search).join(values[index]);
                if (index == values.length - 1) {
                    tools.writeFile(output, newData, callback);
                }
            })
        });
    },
    capitalize : helpers.capitalize,

    camelCase : helpers.camelCase,

    pascalCase : helpers.pascalCase,

    containsString : helpers.containsString,

    objectHasNestedProperty : helpers.objectHasNestedProperty,

    fileExists : function (path) {
        return fs.existsSync(path);
    },

    writeFile : function (fileName, fileData, callback) {
        fs.writeFile(fileName, fileData, 'utf8', function (err) {
            if (err) throw err;
            callback ? callback() : null;
        });
    },

    appendFile : function (fileName, dataToAppend, callback) {
        fs.appendFile(fileName, dataToAppend, function (err) {
            if (err) throw err;
            callback ? callback() : null;
        });
    },

    readFile : function (pathToFile) {
        return fs.readFileSync(pathToFile, 'utf8');
    },

    isDirectory : function (path) {
        return fs.lstatSync(path).isDirectory();
    },

    makeDirSync : function (path) {
        return fs.mkdirSync(path);
    },

    getFileNameFromPath : function (filePath) {
        return tools.getLastDirectoryName(filePath);
    },

    getLastDirectoryName : function (filePath) {
        return filePath.split(path.sep).reverse()[0];
    },

    addSlashToPath : function (path) {
        return tools.pathEndsWithSlash(path) ? path : path + '/';
    },

    pathEndsWithSlash : function (path) {
        path = path || '';
        var lastChar = path.charAt(path.length - 1);
        return lastChar === '/' || lastChar === '\\';
    },

    //returns either the absolute path to the project's node_module file or undefined if not found;
    getNodeModulesPath : function () {
        return findNodeModules({relative : false})[0];
    },

    getProjectRootFolder : function () {
        return path.resolve(findNodeModules({relative : false})[0], '../');
    },

    /*
     Match the variables in the templates (component.ts.txt) to the what the user has defined in the command
     */
    getTemplateReplacements : function (name) {
        return {
            templateVariables : ['$name$', '$camelCaseName$', '$PascalCaseName$'],
            userDefinedValues : [name, tools.camelCase(name), tools.pascalCase(name)]
        }
    },

    log : logging.log,
    logSuccess : logging.logSuccess,
    logInfo : logging.logInfo,
    logError : logging.logError,
    logColorYellow : logging.yellowColor,
    logColorRed : logging.redColor,
    logColorCyan : logging.cyanColor,
    throwError : logging.throwError,

    readdirSync : function (path) {
        return fs.readdirSync(path)
    },

    removeFile : function (path) {
        return fs.unlinkSync(path);
    },

    getPlatform : helpers.getPlatform,

    isWinOS : helpers.isWinOS,

    getOSDirCharacter : helpers.getOSDirCharacter,

    getCurrentDirectoryName : helpers.getCurrentDirectoryName,

    getName : helpers.getName,

    /*
     * return file extension. Example: test.component.ts => ts
     */
    getFileExtension : function (fileName) {
        return fileName.substr(fileName.lastIndexOf('.') + 1)
    },
    /*
     * return only the file name without the extension. Example:  test.component.ts => test.component
     */
    getFileName : function (fileNameWithExtension) {
        return fileNameWithExtension.substr(0, fileNameWithExtension.lastIndexOf('.'))
    },

    getRelativePathFromProjectRoot : function (fullPath, projectRootPath, prefix) {
        projectRootPath = projectRootPath || tools.getProjectRootFolder();
        prefix = prefix || '';
        var relativePath = '';
        if (fullPath.indexOf(projectRootPath) === 0) {
            relativePath = prefix + fullPath.substring(projectRootPath.length + 1).replace(/\\/g, "/");
        }
        return relativePath;
    },

    replacePathSlashes : function (path) {
        return path.replace(/\\/g, "/");
    },

    isvFlagPresent : vFlagModule.isvFlagPresent,
    isFlag : vFlagModule.isFlag,
    isVFlag : vFlagModule.isVFlag,
    getFlagMetadata : vFlagModule.getFlagMetadata,
    convertTovFlag : vFlagModule.convertTovFlag,
    getvFlagIdentifier : vFlagModule.getvFlagIdentifier,
    getvFlagPayload : vFlagModule.getvFlagPayload,
    getvFlag : vFlagModule.getvFlag,
    vFlagHasPayload : vFlagModule.vFlagHasPayload

};

module.exports = tools;
