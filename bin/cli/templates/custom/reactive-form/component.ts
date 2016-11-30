import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, FormControl } from "@angular/forms";
@Component({
    selector: '$name$',
    templateUrl: '$name$.component.html',
    styleUrls: ['$name$.component.scss'],
})
export class $PascalCaseName$Component implements OnInit, OnDestroy {

    private form: any;

    constructor(public formBuilder: FormBuilder) {

        this.form = this.formBuilder.group({
            'username': ['', [Validators.required, Validators.minLength(5)]],
            'email': ['', [Validators.required, Validators.pattern(/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i)]],
        });

    }

    ngOnInit() {

    }

    isValidInput(input: FormControl): boolean {
        return input.valid || input.pristine;
    }

    /* event provided in cases where event.preventDefault(); or event.stopPropagation(); is required */
    submitForm(event: Event): void {
        console.log(event);
        console.log(this.form.value);
    }

    ngOnDestroy() {

    }
}
