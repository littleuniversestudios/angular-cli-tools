import {Component, OnInit, OnDestroy} from '@angular/core';
@Component({
    selector: 'bootstrap-alert',
    templateUrl: 'bootstrap-alert.component.html',
    styleUrls: ['bootstrap-alert.component.scss'],
})
export class BootstrapAlertComponent implements OnInit, OnDestroy {

    public alerts: Array<Object> = [
        {
            type: 'danger',
            msg: 'Oh snap! Change a few things up and try submitting again.'
        },
        {
            type: 'success',
            msg: 'Well done! You successfully read this important alert message.',
            closable: true
        }
    ];

    constructor() {

    }

    ngOnInit() {

    }

    public closeAlert(i: number): void {
        this.alerts.splice(i, 1);
    }

    public addAlert(): void {
        this.alerts.push({msg: 'Another alert!', type: 'warning', closable: true});
    }

    ngOnDestroy() {

    }


}
