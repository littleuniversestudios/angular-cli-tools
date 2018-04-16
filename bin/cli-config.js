var config = {
	appRoot : __dirname,
	config : {
		root : '/cli/config.json',
	},
	templates : {
		root : '/cli/templates/',
		names : {
			'class' : '.class.ts',
			'component' : '.component.ts',
			'directive' : '.directive.ts',
			'enum' : '.enum.ts',
			'html' : '.component.html',
			'index' : 'index.ts',
			'interface' : '.interface.ts',
			'module' : '.module.ts',
			'pipe' : '.pipe.ts',
			'routing' : '.routing.ts',
			'service' : '.service.ts',
			'spec' : '.component.spec.ts',
			'style' : '.component.'
		},
		map : {
			component : {
				component : 'component.ts',
				html : 'component.html',
				spec : 'component.spec.ts',
				style : 'component.scss'
			},
			route : {
				component : 'component.ts',
				html : 'component.html',
				style : 'component.scss',
				routing : 'lazy-load-routing.ts',
				module : 'lazy-load-module.ts'
			},
			class : {
				class : 'class.ts'
			},
			style : {
				style : 'component.scss'
			},
			routing : {
				routing : 'routing.ts'
			},
			directive : {
				directive : 'directive.ts'
			},
			enum : {
				enum : 'enum.ts'
			},
			index : {
				index : 'index.ts'
			},
			interface : {
				interface : 'interface.ts'
			},
			module : {
				module : 'module.ts'
			},
			pipe : {
				pipe : 'pipe.ts'
			},
			service : {
				service : 'service.ts'
			},
			html : {
				html : 'component.html'
			}
		}
	},
	cli : {
		root : '/cli/'
	},
	user : {
		//location gets resolved by finding the projects 'node_modules' folder
		// then using that path resolve 'angular-cli-tools' folder hence the '../'
		localAngularCLITools : {
			location : './angular-cli-tools/',
			cleanName : 'angular-cli-tools'
		},
		templates : {
			location : './angular-cli-tools/templates/'
		},
		savedComponents : {
			location : './templates/saved'
		},
		config : {
			location : './angular-cli-tools/config.json'
		},
		gitIgnore : {
			location : './angular-cli-tools/.gitignore'
		}
	},
	component : {
		barrels : {
			"addFolders" : false
		}
	},
	seeds : {
		basic : {
			url : 'https://github.com/littleuniversestudios/ng2-basic-seed'
		},
		material : {
			url : 'https://github.com/littleuniversestudios/ng2-material-seed'
		},
		bootstrap : {
			url : 'https://github.com/littleuniversestudios/ng2-bootstrap-seed'
		},
		firebase : {
			url : 'https://github.com/littleuniversestudios/ng4-firebase-seed'
		}
	},
	command : {
		shorthand : {
			commands : {
				'b' : 'blueprints',
				'c' : 'commands',
				'g' : 'generate',
				'h' : 'help',
				'i' : 'install',
				'l' : 'list',
				'n' : 'new',
				's' : 'save',
				't' : 'templates',
				'u' : 'update',
				'v' : 'version'
			},
			install : {
				't' : 'templates',
				'c' : 'config'
			},
			list : {
				't' : 'templates',
				'b' : 'blueprints',
				'c' : 'commands'
			},
			update : {
				'i' : 'index',
				't' : 'templates',
				'c' : 'config'
			},
			components : {
				'c' : 'component',
				'cl' : 'class',
				'd' : 'directive',
				'h' : 'html',
				'i' : 'interface',
				'index' : 'index',
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
				'-r' : '--recursive',
				'-u' : '--url',
				'-t' : '--template',
				'-fir' : '--firebase',
				'-p' : '--prefix'
			},
			seeds : {}
		}
	}
};

module.exports = config;
