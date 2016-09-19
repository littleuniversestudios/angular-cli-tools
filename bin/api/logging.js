var logging = {
	log : console.log,
	logSuccess : function (message) {
		console.log(logging.yellowColor(message));
	},
	logError : function (message) {
		console.log(logging.redColor(message));
	},
	redColor : function (str) {
		return '\x1b[31m' + str + '\x1b[0m';
	},
	yellowColor : function (str) {
		return '\x1b[33m' + str + '\x1b[0m';
	},
	cyanColor : function (str) {
		return '\x1b[36m' + str + '\x1b[0m';
	},
	// if we know what the problem is notify user [without the error line info/stack trace] and exit
	throwError : function (error) {
		logging.logError(error);
		process.exit(0);
	},
}

module.exports = logging;
