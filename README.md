Command Line Interface tools when generating a new Angular 2 project OR for use with your existing Angular 2 project. 

##Install 

`npm install angular-cli-tools -g`

## Table of contents

* [Create a new project [ vanilla | bootstrap | angular material]] (#create-a-new-project)
* [Use with existing project](#use-with-existing-project)
* [Generate Components, Modules, Services, Pipes ...](#generating-components)
* [All Blueprints / Scaffolds](#all-available-blueprints)
* [Generate and Update barrels (index.ts files)](#update-index.ts-files) [ [recursively] ](#update-index.ts-files-recursively)
* [Edit templates](#edit-blueprint-templates)
* [Shortcuts](#shrotcuts)



## Create a new project

New projects created with Angular CLI Tools use a webpack seed from: [https://github.com/preboot/angular2-webpack](https://github.com/preboot/angular2-webpack)
 
To create a basic (vanilla) Angular 2 project:
```bash
ngt new PROJECT-NAME
```

You can also create a Bootstrap (version 4) seed:
  
```bash
ngt new PROJECT-NAME --bootstrap
```

Likewise, an Angular Material seed can be created by:

```bash
ngt new PROJECT-NAME --material
```

## Use with existing project

Angular CLI Tools does not lock you into a specific tooling process. You can choose your own tooling process [(or use a pre-generated seed)](#create-a-new-project) and Angular CLI Tools will help you speed up your ng2 development. Here's how:

* [Just install Angular CLI TOOLS](#install)
* [Start generating components ](#generating-components)

 
## Generating Components
Use `ngt generate` command to generate Angular components:

```bash
ngt generate component new-component
```

Every command has a shorthand alias to speed up development. Same command from above can be written as:

```bash
ngt g c new-component 
```


Components support relative path generation
```bash
ngt g c layout/header/new-component 
```

... will be generated in ./layout/header/new-component directory 

## All available blueprints:

| Scaffold        | Usage (shorthand)| Component Name Mandatory|
|:------------- |:-------|:---:|
| class      | `ngt g class [class-name]`| no |
| [component](#component)      |` ngt g c [component-name]`| yes |
| directive      | `ngt g d [directive-name]`|no |
| enum      | `ngt g e [enum-name]`|no |
| index      | `ngt g i `|no |
| interface      | `ngt g int [interface-name]`|no |
| module      | `ngt g m [module-name]`|no |
| pipe      | `ngt g p [pipe-name]`|no |
| route      | `ngt g r [route-name]`|no |
| service      | `ngt g s [service-name]`|no |

#### Optional Blueprint Names
Notice the *optional 'name' parameter above. For every blueprint (except the 'Component' blueprint) Angular CLI Tools will use the folder name if a name is NOT provided.

If you are running a `ngt generate module` command (without a module name), in a folder:
```bash
...\layout\header\ngt generate module
```

Angular CLI Tools will automatically create:
```bash
header.module.ts
```

Same concept applies to all blueprints except the 'Component' blueprint.


#### Component Blueprint

`ngt generate component [component-name]`

| Options    | |
|:------------- |:-------|
| `--scss`     | generate component with .scss file [default] |
| `--css`      | generate component with .css file|


| Example Usage      | |
|:------------- |:-------|
| `ngt generate component nav-bar`     | generate component with .scss file [default to sass]|
| `ngt g c nav-bar --scss`      | generate component with .scss file|
| `ngt g c nav-bar --css`      | generate component with .css file| 


##Update index.ts files
Angular CLI Tools has commands to generate and update index.ts files (barrels) to rollup exports from several modules into a single convenience module.

```bash
ngt generate index
```

...will create an index.ts file in the current directory if it doesn't already exists.

If the barrel (index.ts) already exists you can update it with 
```bash
ngt update index
```
The `update` command will delete the current index.ts file and generate a new (updated) index.ts file.

###Update index.ts files recursively

```bash
ngt update index --recursive
```

This will update the index.ts file in the current folder plus any other sub-folder it encounters.

## Edit Blueprint Templates
#### If you already started with a [Angular CLI Tools seed](#create-a-new-project):
  
  You're done. Nothing more to do! 
  
  You'll notice a `angular-cli-tools/templates` folder at the root of your project. Inside you'll find all the component blueprints. When generating components, Angular CLI Tools will use the template in that folder first before defaulting to it's own template file. Feel free to edit the local template files to match your project's needs.
 
####If you have an existing project, run the command:
 
```bash
ngt install templates
```

This will install the `angular-cli-tools\templates` folder at the root of your project at which point you can edit  and customize them.


##Shortcuts
| Type        | Verbose        | Shorthand|  |
|:----|:------------- |:-------|:-------|
| Project | `ngt new [PROJECT-NAME]`      | `ngt n [PROJECT-NAME]`|  Basic Project |
| Project | `ngt new [PROJECT-NAME] --bootstrap`      | `ngt n [PROJECT-NAME] -b`| Bootstrap 4 project  |
| Project | `ngt new ./my-projects/[PROJECT-NAME] --material`      | `ngt n ./my-projects/[PROJECT-NAME] -m`|  Angualar Material project|
| Class| `ngt generate class [CLASS-NAME]`      | `ngt g class [class-name]`|  |
| Class| `ngt generate class`      | `ngt g class`| [CLASS-NAME] defaults to folder name|
| Component| `ngt generate component [COMPONENT-NAME]` |` ngt g c [COMPONENT-NAME]`|   |
| Component | `ngt generate component [COMPONENT-NAME] -scss` |` ngt g c [COMPONENT-NAME] -s`| With a .scss style file |
| Component| `ngt generate component [COMPONENT-NAME] -css` |` ngt g c [COMPONENT-NAME] -c`| With a .css style file|
| Directive | `ngt generate directive [DIRECTIVE-NAME]`      | `ngt g d [DIRECTIVE-NAME]`|   |
| Directive | `ngt generate directive`      | `ngt g d`| [DIRECTIVE-NAME] defaults to folder name  |
| Enum | `ngt generate enum`     | `ngt g e [ENUM-NAME]`|  |
| Enum| `ngt generate enum`     | `ngt g e`| [ENUM-NAME] defaults to folder name  |
| Index | `ngt generate index`     | `ngt g i `| Generate a barrel (index.ts file)|
| Index | `ngt update index`     | `ngt u i `| Update a barrel (index.ts file)|
| Index | `ngt update index --recursive`     | `ngt u i -r`| Update a barrel in current folder and all sub folders|
| Interface| `ngt generate interface [INTERFACE-NAME]`     | `ngt g int [INTERFACE-NAME] `|  |
| Interface| `ngt generate interface`     | `ngt g int`|[INTERFACE-NAME] defaults to folder name|
| Module| `ngt generate module [MODULE-NAME]`      | `ngt g m [MODULE-NAME]`|   |
| Module| `ngt generate module`      | `ngt g m`|[MODULE-NAME] defaults to folder name|
| Pipe| `ngt generate pipe [PIPE-NAME]`      | `ngt g p [PIPE-NAME]`|   |
| Pipe| `ngt generate pipe`      | `ngt g p `|[PIPE-NAME] defaults to folder name|
| Route| `ngt generate route`      | `ngt g r [ROUTE-NAME]`| Generates a routing file (not a route)|
| Route| `ngt generate route`      | `ngt g r`|[ROUTE-NAME] defaults to folder name
| Service| `ngt generate service [SERVICE-NAME]`      | `ngt g s [SERVICE-NAME]`|   |
| Service| `ngt generate service`      | `ngt g s`| [service-NAME] defaults to folder name|
| Templates| `ngt install templates`      | `ngt i t`| installs `angular-cli-tools\templates` folder|

 
 
##License
Copyright (c) 2016 Litte Universe Studios
Licensed under the MIT license.
