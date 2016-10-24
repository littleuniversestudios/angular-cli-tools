import {NgModule} from'@angular/core';
import {CommonModule}  from '@angular/common';
import {routing} from './bootstrap-examples.routing';
import {BootstrapExamplesComponent} from './bootstrap-examples.component';
import {BootstrapAlertComponent} from './bootstrap-alert/bootstrap-alert.component';
import {BootstrapDatePickerComponent} from './bootstrap-date-picker';
import {BootstrapDropdownComponent} from './bootstrap-dropdown';
import {BootstrapTabsComponent} from './bootstrap-tabs';
import {
    AlertModule,
    DatepickerModule,
    DropdownModule,
    ModalModule,
    TabsModule,
    TypeaheadModule,
    Ng2BootstrapModule
} from 'ng2-bootstrap/ng2-bootstrap';

@NgModule({
    imports: [
        routing,
        CommonModule,
        AlertModule,
        DatepickerModule,
        DropdownModule,
        ModalModule,
        TabsModule,
        TypeaheadModule,
        Ng2BootstrapModule
    ],
    providers: [],
    declarations: [
        BootstrapExamplesComponent,
        BootstrapAlertComponent,
        BootstrapDatePickerComponent,
        BootstrapDropdownComponent,
        BootstrapTabsComponent
    ],
    exports: []
})
export class BootstrapExamplesModule {

}

