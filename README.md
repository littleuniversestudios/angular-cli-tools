Command Line Interface tools for using with existing Angular 2 projects. Speed up development of NG2 projects by generating components | modules | services | pipes | classes right from the command line.  

Note: this is not the official NG2 CLI and does not create new Angular 2 projects. Visit [Angular CLI](https://cli.angular.io/) for official NG2 CLI  

##Install 

`npm install angular-cli-tools --save-dev`


##Commands

| Command        | Usage|
|:------------- |:-------|
| [generate](#generate)      | `ngt generate`|
| [update](#update)      | `ngt update `|


### Generate 

| Scaffold        | Usage|
|:------------- |:-------|
| [component](#component)      |` ngt g c [component-name]`|
| service      | `ngt g c [service-name]`|
| pipe      | `ngt g p [pipe-name]`|
| module      | `ngt g m [module-name]`|
| index      | `ngt g i `|
| class      | `ngt g class [class-name]`|


#### Component 

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


### Update
 (coming soon)


##License
Copyright (c) 2016 Litte Universe Studios
Licensed under the MIT license.
