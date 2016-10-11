import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { routing } from './$name$.routing';
import { $PascalCaseName$Component } from './$name$.component';

@NgModule({
  imports:      [
  	CommonModule,
  	routing
  ],
  providers: [],
  declarations: [
      $PascalCaseName$Component
  ],
  exports: []
})
export class $PascalCaseName$Module {

}
