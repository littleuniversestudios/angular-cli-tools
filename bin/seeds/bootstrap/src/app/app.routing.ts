import {RouterModule, Routes} from '@angular/router';

import {HomeComponent} from './home/home.component';
import {AboutComponent} from './about/about.component';
import {BootstrapExamplesComponent} from './bootstrap-examples/bootstrap-examples.component';

const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'about', component: AboutComponent},
    {path: 'bootstrap-examples', component: BootstrapExamplesComponent}
];

export const routing = RouterModule.forRoot(routes);
