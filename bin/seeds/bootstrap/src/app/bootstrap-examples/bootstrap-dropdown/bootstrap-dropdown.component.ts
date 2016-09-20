import {Component, OnInit, OnDestroy} from '@angular/core';
@Component({
    selector: 'bootstrap-dropdown',
    templateUrl: 'bootstrap-dropdown.component.html',
    styleUrls: ['bootstrap-dropdown.component.scss'],
})
export class BootstrapDropdown implements OnInit,OnDestroy {
    constructor() {
    }

    ngOnInit() {
    }

    public disabled:boolean = false;
    public status:{isopen:boolean} = {isopen: false};
    public items:Array<string> = ['The first choice!',
        'And another choice for you.', 'but wait! A third!'];

    public toggled(open:boolean):void {
        console.log('Dropdown is now: ', open);
    }

    public toggleDropdown($event:MouseEvent):void {
        $event.preventDefault();
        $event.stopPropagation();
        this.status.isopen = !this.status.isopen;
    }

    ngOnDestroy() {
    }
}
