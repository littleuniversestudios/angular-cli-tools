import {Component, OnInit, OnDestroy} from '@angular/core';
@Component({
    selector: 'about',
    templateUrl: 'about.component.html',
    styleUrls: ['about.component.scss'],
})
export class AboutComponent implements OnInit, OnDestroy {

    constructor() {

    }

    ngOnInit() {
      console.log('Hello From the About Page');
    }

    ngOnDestroy() {

    }
}
