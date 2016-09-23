import {RouterModule, Routes} from '@angular/router';

import {HomeComponent} from './home/home.component';
import {AboutComponent} from './about/about.component';
import {MaterialExamplesComponent} from './material-examples/material-examples.component';
const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'about', component: AboutComponent},
    {path: 'material-examples', component: MaterialExamplesComponent}
];

export const routing = RouterModule.forRoot(routes);
