var path = require('path');
var tools = require('../../api/tools');
var userConfigModule = require('../../user/user-config');

var templatesModule = {

    getTemplateName : function (templateIndex, componentName) {

        if (!componentName) {
            tools.throwError('You need to provide a name when generating this template.');
        }

        var allTemplates = userConfigModule.getProperty('templateMap');
        var templateNames = Object.keys(allTemplates).sort();

        if (!templateNames[templateIndex]) {
            tools.throwError('Template does not exist.');
        }

        return templateNames[templateIndex];

    }
};

module.exports = templatesModule;

