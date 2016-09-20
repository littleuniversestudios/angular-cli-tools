import {Component, OnInit, OnDestroy} from '@angular/core';
@Component({
    selector: 'bootstrap-alerts',
    templateUrl: 'bootstrap-alerts.component.html',
    styleUrls: ['bootstrap-alerts.component.scss'],
})
export class BootstrapAlerts implements OnInit,OnDestroy {
    constructor() {
    }

    ngOnInit() {
    }

    ngOnDestroy() {
    }

    public alerts:Array<Object> = [
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

    public closeAlert(i:number):void {
        this.alerts.splice(i, 1);
    }

    public addAlert():void {
        this.alerts.push({msg: 'Another alert!', type: 'warning', closable: true});
    }
}
