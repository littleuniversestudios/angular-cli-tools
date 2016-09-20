import {Component, OnInit, OnDestroy} from '@angular/core';
@Component({
    selector: 'bootstrap-tabs',
    templateUrl: 'bootstrap-tabs.component.html',
    styleUrls: ['bootstrap-tabs.component.scss'],
})
export class BootstrapTabs implements OnInit,OnDestroy {
    public tabs:Array<any> = [
       {title: 'Dynamic Title 1', content: 'Dynamic content 1'},
       {title: 'Dynamic Title 2', content: 'Dynamic content 2', disabled: true},
       {title: 'Dynamic Title 3', content: 'Dynamic content 3', removable: true}
     ];

    constructor() {
    }
     public alertMe():void {
       setTimeout(function ():void {
         alert('You\'ve selected the alert tab!');
       });
     };

     public setActiveTab(index:number):void {
       this.tabs[index].active = true;
     };

     public removeTabHandler(/*tab:any*/):void {
       console.log('Remove Tab handler');
     };

    ngOnInit() {
    }
    ngOnDestroy() {
    }
}
