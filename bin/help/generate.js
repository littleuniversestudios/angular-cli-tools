#! /usr/bin/env node

var help = '\nUsage: ngt generate [type] [name]' +
	'\nGenerate components for angular2. This will created the wanted component in the directory the command is run in.' +
	'\n\nOptions:' +
	'\n\n[type]: class | component | directive | pipe | route | service' +
	'\n[name]: Anything you would like.' +
	'\n\nExample: ngt generate component my-component' +
	'\nExample: ngt generate service my-service' +
	'\nExample: ngt generate pipe my-pipe' +
	'\n';

process.stdout.write(help);
