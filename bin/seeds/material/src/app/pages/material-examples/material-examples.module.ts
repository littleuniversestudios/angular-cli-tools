import {NgModule}      from '@angular/core';
import {CommonModule}  from '@angular/common';
import {routing} from './material-examples.routing';
import {MdButtonModule} from '@angular2-material/button';
import {MdCardModule} from '@angular2-material/card';
import {MaterialExamplesComponent} from './material-examples.component';

@NgModule({
    imports: [
        CommonModule,
        routing,
        MdButtonModule.forRoot(),
        MdCardModule.forRoot(),
    ],
    providers: [],
    declarations: [
        MaterialExamplesComponent
    ],
    exports: []
})
export class MaterialExamplesModule {

}
