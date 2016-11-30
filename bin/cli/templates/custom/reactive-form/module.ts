import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { $PascalCaseName$Component } from './$name$.component';
import { ReactiveFormsModule, FormsModule } from "@angular/forms";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule
    ],
    providers: [],
    declarations: [
        $PascalCaseName$Component
    ],
    exports: [
        $PascalCaseName$Component
    ]
})
export class $PascalCaseName$Module {

}
