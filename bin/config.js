var config = {
	appRoot : __dirname,
	templates : {
		root : '/templates/',
		fileFormat : '.txt'
	},
	seeds : {
		root : '/seeds/',
		basic : 'basic'
	},
	command : {
		shorthand : {
			commands : {
				'c' : 'create',
				'g' : 'generate',
				'i' : 'install',
				'h' : 'help',
				'u' : 'update',
				'v' : 'version',
			},
			components : {
				'c' : 'component',
				'cl' : 'class',
				'd' : 'directive',
				'i' : 'index',
				'in' : 'interface',
				'int' : 'interface',
				'e' : 'enum',
				'm' : 'module',
				'p' : 'pipe',
				'r' : 'route',
				's' : 'service',
			},
			flags:{
				'-b' : '--bootstrap',
				'-m' : '--material',
				'-v' : '--version',
				'-h' : '--help',
			},
			seeds : {
			}
		}
	}
};

module.exports = config;
