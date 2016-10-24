import {ModuleWithProviders}  from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import { MaterialExamplesComponent } from './material-examples.component';

const routes: Routes = [
    {path: '', component: MaterialExamplesComponent},
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
