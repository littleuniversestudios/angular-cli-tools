import {NgModule}      from '@angular/core';
import {CommonModule}  from '@angular/common';
import {MdButtonModule} from '@angular2-material/button';
import {MdCardModule} from '@angular2-material/card';
import {MaterialExamplesComponent} from './material-examples.component';

@NgModule({
    imports: [
        CommonModule,
        MdButtonModule.forRoot(),
        MdCardModule.forRoot(),
    ],
    providers: [],
    declarations: [MaterialExamplesComponent],
    exports: [MaterialExamplesComponent]
})
export class MaterialExamplesModule {

}
