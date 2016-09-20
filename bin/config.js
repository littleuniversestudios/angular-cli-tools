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
				'v' : 'version'
			},
			install : {
				't' : 'templates',
				'c' : 'config'
			},
			components : {
				'c' : 'component',
				'cl' : 'class',
				'd' : 'directive',
				'i' : 'index',
				'int' : 'interface',
				'e' : 'enum',
				'm' : 'module',
				'p' : 'pipe',
				'r' : 'route',
				's' : 'service'
			},
			flags : {
				'-b' : '--bootstrap',
				'-c' : '--css',
				'-css' : '--css',
				'-m' : '--material',
				'-v' : '--version',
				'-h' : '--help',
				'-f' : '--force'
			},
			seeds : {}
		}
	}
};

module.exports = config;
