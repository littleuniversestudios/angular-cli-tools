import {NgModule}      from '@angular/core';
import {CommonModule}  from '@angular/common';
import {FormsModule}  from '@angular/forms';
import {AlertModule, DatepickerModule, DropdownModule, ModalModule, TabsModule, TypeaheadModule, Ng2BootstrapModule} from 'ng2-bootstrap/ng2-bootstrap';
import {BootstrapExamples}  from './bootstrap-examples.component';
import {BootstrapAlerts}  from './bootstrap-alerts/bootstrap-alerts.component';
import {BootstrapDropdown}  from './bootstrap-dropdown/bootstrap-dropdown.component';
import {BootstrapDatePicker}  from './bootstrap-date-picker/bootstrap-date-picker.component';
import {BootstrapModal}  from './bootstrap-modal/bootstrap-modal.component';
import {BootstrapTabs}  from './bootstrap-tabs/bootstrap-tabs.component';
import {BootstrapTypeahead}  from './bootstrap-typeahead/bootstrap-typeahead.component';

@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        Ng2BootstrapModule,
        AlertModule,
        DatepickerModule,
        DropdownModule,
        ModalModule,
        TabsModule,
        TypeaheadModule
    ],
    providers: [],
    declarations: [
        BootstrapExamples,
        BootstrapAlerts,
        BootstrapDropdown,
        BootstrapDatePicker,
        BootstrapModal,
        BootstrapTabs,
        BootstrapTypeahead
    ],
    exports: [
        BootstrapExamples
    ]
})
export class BootstrapExamplesModule {
}
