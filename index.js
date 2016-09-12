#! /usr/bin/env node

var tools = require('./bin/api/tools');
var exec = require('child_process').exec;
function resolvePath(path) {
	return process.platform == 'win32' ? __dirname + path : '\'' + __dirname + path + '\'';
}

var matchCommands = {
	'generate component' : function (cmd) {
		return resolvePath('/bin/generate-component.js') + ' ' + cmd.slice(3).join(' ');
	},
	'generate service' : function (cmd) {
		return resolvePath('/bin/generate-service.js') + ' ' + cmd.slice(3).join(' ');
	},
	'generate pipe' : function (cmd) {
		return resolvePath('/bin/generate-pipe.js') + ' ' + cmd.slice(3).join(' ');
	},
	'generate class' : function (cmd) {
		return resolvePath('/bin/generate-class.js') + ' ' + cmd.slice(3).join(' ');
	},
	'generate directive' : function (cmd) {
		return resolvePath('/bin/generate-directive.js') + ' ' + cmd.slice(3).join(' ');
	},
	'generate route' : function (cmd) {
		return resolvePath('/bin/generate-route.js') + ' ' + cmd.slice(3).join(' ');
	},
	'generate index' : function (cmd) {
		return resolvePath('/bin/generate-index.js') + ' ' + cmd.slice(3).join(' ');
	},
	'--help' : function () {
		return resolvePath('/bin/help/default.js')
	},
	'--help generate' : function () {
		return resolvePath('/bin/help/generate.js')
	},
};

var command = process.argv;
var runJob;

expandShort('-h', '--help');
expandShort('g', 'generate');
expandShort('c', 'component');
expandShort('p', 'pipe');
expandShort('r', 'route');
expandShort('d', 'directive');
expandShort('s', 'service');
expandShort('i', 'index');

runJob = matchCommands[command[2] + (command[3] ? ' ' + command[3] : '')];
typeof runJob != 'function' ? runJob = matchCommands['--help'] : null;

exec("node " + runJob(command), function (error, stdout, stderr) {
	if (error || stderr) {
		tools.logError('Could not execute command.');
		tools.logError(stderr);
	} else if (stdout) {
		console.log(stdout)
	}
});

function expandShort(short, full) {
	command[2] == short ? command[2] = full : null;
	command[3] == short ? command[3] = full : null;
}
