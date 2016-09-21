var config = {
	appRoot : __dirname,
	templates : {
		root : '/templates/',
		fileFormat : '.txt'
	},
	seeds : {
		root : '/seeds',
		basic : {
			root : '/basic',
			dependencies : {},
			devDependencies : {},
			gitignore : [
				'# Angular-cli-Tools #',
				'angular-cli-tools'
			]
		},
		material : {
			srcFolder : '/material/src',
			devDependencies : {},
			dependencies : {},
			gitignore : []
		},
		bootstrap : {
			srcFolder : '/bootstrap/src',
			devDependencies : {},
			dependencies : {
				"font-awesome" : "^4.6.3",
				"moment" : "2.15.0",
				"ng2-bootstrap" : "^1.1.5",
				"bootstrap" : "^4.0.0-alpha.4"
			},
			gitignore : []
		}
	},
	command : {
		shorthand : {
			commands : {
				'n' : 'new',
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
				'-f' : '--force',
				'-r' : '--recursive'
			},
			seeds : {}
		}
	}
};

module.exports = config;
