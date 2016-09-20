import {Component, ViewChild, OnInit, OnDestroy} from '@angular/core';
import {ModalDirective} from 'ng2-bootstrap/ng2-bootstrap';
@Component({
    selector: 'bootstrap-modal',
    templateUrl: 'bootstrap-modal.component.html',
    styleUrls: ['bootstrap-modal.component.scss'],
})
export class BootstrapModal implements OnInit,OnDestroy {
    @ViewChild('childModal') public childModal:ModalDirective;

    constructor() {
    }

    public showChildModal():void {
        this.childModal.show();
    }

    public hideChildModal():void {
        this.childModal.hide();
    }

    ngOnInit() {
    }

    ngOnDestroy() {
    }
}
