var path = require('path');
var async = require('async');
var tools = require('../../api/tools');
var mkdirp = require('mkdirp');

var blueprintModule = {

    generateFilesFromBlueprints : function (blueprints, callback) {
        var calls = [];
        blueprints.forEach(function (blueprint) {
            calls.push(function (callback) {
                blueprintModule.generate(blueprint,callback);
            })
        });
        async.parallel(calls, function (err, result) {
            callback ? callback() : null;
        });
    },

    generate : function (blueprintMetadata, callback) {
        callback = callback || tools.emptyFunction();
        if (tools.fileExists(blueprintMetadata.destinationDirectory + blueprintMetadata.fileName)) {
            tools.throwError(tools.capitalize(blueprintMetadata.type) + ' already exists!');
        }

        if (!tools.fileExists(blueprintMetadata.destinationDirectory)) {
            mkdirp(blueprintMetadata.destinationDirectory, function (err) {
                if (err) throw err;
                blueprintModule.makeGenericBlueprint(blueprintMetadata, callback);
            })
        } else {
            blueprintModule.makeGenericBlueprint(blueprintMetadata, callback);
        }
    },

    makeGenericBlueprint : function (blueprintMetadata, callback) {
        callback = callback || tools.emptyFunction();
        blueprintModule.makeFileFromTemplate(blueprintMetadata, function () {
            var logMessage = 'Created ' + blueprintMetadata.destinationDirectory + blueprintMetadata.fileName;
            if (['mapped', 'local'].indexOf(blueprintMetadata.origin) >= 0) {
                //TODO: set 'verbose' flag in ucer config.json to show more info
                // tools.log(tools.logColorYellow(logMessage), tools.logColorCyan('[Using: ' + blueprintMetadata.label + ']'));
                tools.log(tools.logColorYellow(logMessage));
                callback();
            } else {
                tools.logSuccess(logMessage);
                callback();
            }
        });
    },

    makeFileFromTemplate : function (blueprint, callback) {
        callback = callback || function () {
            };
        try {
            tools.copyBaseComponent(blueprint.location, blueprint.destinationDirectory + blueprint.fileName, function () {
                try {
                    tools.replaceInFile(blueprint.destinationDirectory + blueprint.fileName, blueprint.variables, blueprint.userDefinedValues, blueprint.destinationDirectory + blueprint.fileName, function () {
                        callback.apply(null);
                    });
                } catch (error) {
                    throw error;
                }
            });
        } catch (error) {
            throw error;
        }
    }
};

module.exports = blueprintModule;

