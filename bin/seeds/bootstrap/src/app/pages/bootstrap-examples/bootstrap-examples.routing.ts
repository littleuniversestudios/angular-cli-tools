import {ModuleWithProviders}  from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import { BootstrapExamplesComponent } from './bootstrap-examples.component';

const routes: Routes = [
    {path: '', component: BootstrapExamplesComponent},
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
