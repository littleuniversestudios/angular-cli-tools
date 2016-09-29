Command Line Interface tools when generating a new Angular 2 project OR for use with your existing Angular 2 project.

##Install

`npm install angular-cli-tools -g`

## Table of contents

* [Create a new project: ](#create-a-new-project) [basic](#basic-project) | [bootstrap](#bootstrap-project) | [angular material](#angular-material-project) | [from GitHub](#from-github)
* [Use Angular CLI Tools with an existing project](#use-with-existing-project)
* [Generate Components, Modules, Services, Pipes ...](#generating-components)
* [All Blueprints / Scaffolds](#all-available-blueprints)
* [Generate and Update barrels (index.ts files)](#update-index.ts-files) [ [recursively] ](#update-index.ts-files-recursively)
* [Edit templates](#edit-blueprint-templates)
* [Shortcuts](#shortcuts)
* [Changelog](#changelog)
* [Credits](#credits)
* [License](#license)



## Create a new project

New projects created with Angular CLI Tools use a webpack seed from: [https://github.com/preboot/angular2-webpack](https://github.com/preboot/angular2-webpack)

### Basic Project
To create a basic (vanilla) Angular 2 project:
```bash
ngt new PROJECT-NAME
```

### Bootstrap Project
You can also create a Bootstrap (version 4) seed:

```bash
ngt new PROJECT-NAME --bootstrap
```

### Angular Material Project
Likewise, an Angular Material seed can be created by:

```bash
ngt new PROJECT-NAME --material
```

### From GitHub
Download any Angular 2 seed from github.com by using the seed's github URL:

```bash
ngt new PROJECT-NAME --url:https://github.com/mgechev/angular2-seed
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

... will be generated in `./layout/header/new-component` directory

## All available blueprints:

| Scaffold        | Usage (shorthand)|  Name Optional?|
|:------------- |:-------------|:---:|
| class      | `ngt g class [class-name]`| yes |
| [component](#component)      |` ngt g c [component-name]`| no |
| directive      | `ngt g d [directive-name]`| yes |
| enum      | `ngt g e [enum-name]`| yes |
| index      | `ngt g i `| yes |
| interface      | `ngt g int [interface-name]`| yes |
| module      | `ngt g m [module-name]`| yes |
| pipe      | `ngt g p [pipe-name]`| yes |
| route      | `ngt g r [route-name]`| yes |
| service      | `ngt g s [service-name]`| yes |

#### Optional Blueprint Names
For every blueprint (except the 'Component' blueprint) Angular CLI Tools will use the folder name if a 'name' parameter is NOT provided.

If you are running a `ngt generate module` command (without a module name parameter), in a folder:
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

...will create an `index.ts` file in the current directory if it doesn't already exists.

If the barrel (`index.ts`) already exists you can update it with
```bash
ngt update index
```
The `update` command will delete the current `index.ts` file and generate a new (updated) `index.ts` file.

###Update index.ts files recursively

```bash
ngt update index --recursive
```

This will update the `index.ts` file in the current folder plus any other sub-folder it encounters.

## Edit Blueprint Templates
#### If you already started with a [Angular CLI Tools seed](#create-a-new-project):

  You're done. Nothing more to do!

  You'll notice a `angular-cli-tools/templates` folder at the root of your project directory. Inside you'll find all the component blueprints. When generating components, Angular CLI Tools will use the template in that folder first before defaulting to it's own template file. Feel free to edit the local template files to match your project's needs.

####If you have an existing project, run the command:

```bash
ngt install templates
```

This will install the `angular-cli-tools\templates` folder at the root of your project at which point you can edit  and customize the local templates.


##Shortcuts
| Verbose        | Shorthand|  |
|:------------- |:-------|:-------|
| `ngt new [PROJECT-NAME]`      | `ngt n [PROJECT-NAME]`|  Basic Project |
| `ngt new [PROJECT-NAME] --bootstrap`      | `ngt n [PROJECT-NAME] -b`| Bootstrap 4 project  |
| `ngt new ./my-projects/[PROJECT-NAME] --material`      | `ngt n ./my-projects/[PROJECT-NAME] -m`|  Angualar Material project|
| `ngt new [PROJECT-NAME] --url:[GitHub URL]`      | `ngt n [PROJECT-NAME] -u:[GitHub URL]`| Seed from github.com  |
| `ngt generate class [NAME]`      | `ngt g class [NAME]`| [NAME] optional |
| `ngt generate component [NAME]` |` ngt g c [NAME]`| [NAME] mandatory  |
| `ngt generate component [NAME] -scss` |` ngt g c [NAME] -s`| With a .scss style file |
| `ngt generate component [NAME] -css` |` ngt g c [NAME] -c`| With a .css style file|
| `ngt generate directive [NAME]`      | `ngt g d [NAME]`| [NAME] optional |
| `ngt generate enum`     | `ngt g e [NAME]`| [NAME] optional |
| `ngt generate index`     | `ngt g i `| Generate a barrel (index.ts file)|
| `ngt update index`     | `ngt u i `| Update a barrel (index.ts file)|
| `ngt update index --recursive`     | `ngt u i -r`| Update a barrel in current folder and all sub folders|
| `ngt generate interface [NAME]`     | `ngt g int [NAME] `| [NAME] optional |
| `ngt generate module [NAME]`      | `ngt g m [NAME]`| [NAME] optional |
| `ngt generate pipe [NAME]`      | `ngt g p [NAME]`| [NAME] optional |
| `ngt generate route [NAME]`      | `ngt g r [NAME]`| [NAME] optional |
| `ngt generate service [NAME]`      | `ngt g s [NAME]`| [NAME] optional |
| `ngt install templates`      | `ngt i t`| installs `angular-cli-tools\templates` folder|

Note: `[NAME] optional` means that if the NAME parameter is not provided, [Angular CLI Tools will use the folder name as the name of the component.](#optional-blueprint-names)


##Changelog
v1.2.0 - [Use any seeds from github.com to start a project](#from-github)
v1.1.1 - Do not add spec files to barrels
v1.1.0 - [Create project from scratch (basic|bootstrap|material project seeds)](#create-a-new-project)
v1.0.6 - bug fixes
v1.0.4 - relative path generation for components
v1.0.3 - bug fixes
v1.0.2 - added barrel (index.js) generation
v1.0.0 - initial version

##Credits
Full credit to the team at [https://github.com/preboot/angular2-webpack](https://github.com/preboot/angular2-webpack) for providing an open source Angular 2 webpack seed that is used as the base seed when generating basic | bootstrap | material projects with angular-cli-tools.

##License
Copyright (c) 2016 Little Universe Studios
Licensed under the MIT license.
