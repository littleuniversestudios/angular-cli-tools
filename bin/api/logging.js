var logging = {
	log : function (message) {
		console.log(message);
	},
	logSuccess : function (message) {
		console.log('\x1b[33m%s\x1b[0m', message);
	},
	logError : function (message) {
		console.log('\x1b[31m%s\x1b[0m', message);
	},
	// if we know what the problem is notify user [without the error line info/stack trace] and exit
	throwError : function (error) {
		logging.logError(error);
		process.exit(0);
	},
}

module.exports = logging;
