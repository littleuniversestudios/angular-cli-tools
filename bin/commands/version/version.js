var pjson = require('../../../package.json');

var version = {
	getVersion : function () {
		return 'angular-cli-tools v' + pjson.version;
	}
}

module.exports = version;

