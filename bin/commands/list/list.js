var path = require('path');
var tools = require('../../api/tools');
var CLITable = require('cli-table');
var userConfigModule = require('../../user/user-config');
var cliConfig = require('../../cli-config');

var listModule = {
    listBlueprints : function () {

        var table = new CLITable({
            head : ['Blueprint', 'Usage (verbose)', 'Usage (shorthand)'],
            chars : {'mid' : '', 'left-mid' : '', 'mid-mid' : '', 'right-mid' : ''}
        });

        var blueprintNames = Object.keys(cliConfig.templates.map).sort();
        var shorthandNames = listModule.swapKeyValuePairs(cliConfig.command.shorthand.components);
        blueprintNames.forEach(function (blueprintName) {
            table.push([
                blueprintName,
                'ngt generate ' + blueprintName + ' ' + listModule.getComponentName(blueprintName),
                'ngt g ' + (shorthandNames[blueprintName] || blueprintName) + ' ' + listModule.getComponentName(blueprintName)
            ]);
        });

        console.log(table.toString());
    },
    listHelp : function () {

        var table = new CLITable({
            head : ['Help for: ', 'Usage (verbose)', 'Usage (shorthand)'],
            chars : {'mid' : '', 'left-mid' : '', 'mid-mid' : '', 'right-mid' : ''}
        });

        table.push(
            ['commands', 'ngt commands', 'ngt c'],
            ['blueprints', 'ngt blueprints', 'ngt b'],
            ['templates', 'ngt templates', 'ngt t'],
            ['seeds', 'ngt seeds', '---']
        );

        console.log(table.toString());
    },
    listCommands : function () {

        var table = new CLITable({
            head : ['Commands: ', 'Description', 'More info w/command:'],
            chars : {'mid' : '', 'left-mid' : '', 'mid-mid' : '', 'right-mid' : ''}
        });

        table.push(
            ['ngt new <project-name>', 'create a new project', 'ngt seeds'],
            ['ngt generate <component>', 'generate components, modules, services...', 'ngt blueprints'],
            ['ngt save <component>', 'turn components into re-usable templates', 'ngt templates'],
            ['ngt install', 'install config/templates to existing ng2 project', ''],
            ['ngt update', 'update config/templates in local ng2 project', ''],
            ['ngt version', 'current version of Angular CLI Tools', 'ngt -v'],
            ['ngt help', 'see list of blueprints, templates, commands...', 'ngt help']
        );

        console.log(table.toString());
    },
    listSeeds : function () {

        var table = new CLITable({
            head : ['Project Seeds: ', 'Description', 'More info w/command:'],
            chars : {'mid' : '', 'left-mid' : '', 'mid-mid' : '', 'right-mid' : ''}
        });

        table.push(
            ['basic', 'ngt new <project-name>', 'ngt n <project-name>'],
            ['bootstrap', 'ngt new <project-name> --bootstrap', 'ngt n <project-name> -b'],
            ['material design', 'ngt new <project-name> --material', 'ngt n <project-name> -m'],
            ['from gitHub', 'ngt new <project-name> --url:<github-url>', 'ngt n <project-name> -u:<gitHub-url>']
        );

        console.log(table.toString());
    },
    swapKeyValuePairs : function (obj) {
        var swappedObject = {};
        for (var key in obj) {
            swappedObject[obj[key]] = key;
        }
        return swappedObject;
    },

    getComponentName : function (blueprint) {
        return blueprint == 'index' ? '' : '<name>'
    },

    listTemplates : function () {

        var table = new CLITable({
            head : ['Template', 'Usage (shorthand)'],
            chars : {'mid' : '', 'left-mid' : '', 'mid-mid' : '', 'right-mid' : ''}
        });

        var allTemplates = userConfigModule.getProperty('templateMap');
        var templateNames = Object.keys(allTemplates).sort();

        templateNames.forEach(function (templateName) {
            table.push([templateName, 'ngt g <name> -t:' + templateName]);
        });

        console.log(table.toString());
    }
};

module.exports = listModule;

