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
            'style' : '.component.'
        },
        map : {
            component : {
                component : 'component.ts',
                html : 'component.html',
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
    user : {
        //location gets resolved by finding the projects 'node_modules' folder
        // then using that path resolve 'angular-cli-tools' folder hence the '../'
        localAngularCLITools : {
            location : '../angular-cli-tools/'
        },
        templates : {
            location : '../angular-cli-tools/templates/'
        },
        config : {
            location : '../angular-cli-tools/config.json'
        }
    },
    component : {
        barrels : {
            "addFolders" : true
        }
    },
    seeds : {
        root : '/seeds',
        basic : {
            root : '/basic',
            dependencies : {},
            devDependencies : {
                "angular2-router-loader" : "^0.2.2"
            },
            gitignore : [
                '# Angular-cli-Tools #',
                'angular-cli-tools'
            ]
        },
        material : {
            srcFolder : '/material/src',
            devDependencies : {},
            dependencies : {
                "@angular2-material/core" : "^2.0.0-alpha.8-2",
                "@angular2-material/button" : "^2.0.0-alpha.8-2",
                "@angular2-material/card" : "^2.0.0-alpha.8-2"
            },
            gitignore : []
        },
        bootstrap : {
            srcFolder : '/bootstrap/src',
            devDependencies : {},
            dependencies : {
                "font-awesome" : "^4.6.3",
                "moment" : "^2.15.0",
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
                'h' : 'html',
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
                '-r' : '--recursive',
                '-u' : '--url',
                '-t' : '--template'
            },
            seeds : {}
        }
    }
};

module.exports = config;
