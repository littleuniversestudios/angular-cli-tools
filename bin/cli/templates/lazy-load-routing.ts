import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { $PascalCaseName$Component } from './$name$.component';

const routes: Routes = [
    { path: '', component: $PascalCaseName$Component },
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
