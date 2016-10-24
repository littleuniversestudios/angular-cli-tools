import {Component, OnInit, OnDestroy} from '@angular/core';
@Component({
    selector: 'app-footer',
    templateUrl: 'app-footer.component.html',
    styleUrls: ['app-footer.component.scss'],
})
export class AppFooterComponent implements OnInit, OnDestroy {
    private url = 'https://github.com/preboot/angular2-webpack';
    constructor() {

    }

    ngOnInit() {

    }

    ngOnDestroy() {

    }
}
