#! /usr/bin/env node
var commands = require('./bin/user/commands');

var userCommand = process.argv.slice(2);
commands.runUserCommand(userCommand);




