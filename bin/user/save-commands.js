#! /usr/bin/env node
var saveModule = require('../commands/save/save');

var saveCommandModule = {
    saveComponent : function (componentFolder, vFlags) {
        saveModule.saveComponent(componentFolder, vFlags);
    }
};

module.exports = saveCommandModule;

