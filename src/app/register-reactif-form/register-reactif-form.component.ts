import { Component, OnInit } from '@angular/core';
import { AbstractControl, AbstractControlOptions, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs';

function ratingRangeValidator(min: number, max: number): ValidatorFn {
  return (c: AbstractControl): { [key: string]: boolean } | null => {
    //l'expression "!!c.value " = à "c.value !== null "
    if (!!c.value && isNaN(c.value) || c.value < 1 || c.value > 5) {
      return { "rangeError": true };
    }
    return null;
  };
}

function MustMatch(controlName: string, matchingControlName: string) {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    const matchingControl = formGroup.controls[matchingControlName];

    if (matchingControl.errors && !matchingControl.errors['mustMatch']) {

      // return if another validator has already found an error on the matchingControl
      return;
    }

    // set error on matchingControl if validation fails
    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({ mustMatch: true });
    } else {
      matchingControl.setErrors(null);
    }
  };
}


//cette fonction n'a pas fonctionner!! à revoir

/*function emailMatcher(c: AbstractControl): { [key: string]: boolean } | null {
  const emailControl = c.get('email');
  const emailConfirmControl = c.get('confirmEmail');
  console.log({ emailControl })
  console.log({ emailConfirmControl })
  if (emailControl?.value === emailConfirmControl?.value) {
    return null;
  }
  return { match: true };
}*/



@Component({
  selector: 'app-register-reactif-form',
  templateUrl: './register-reactif-form.component.html',
  styleUrls: ['./register-reactif-form.component.css']
})
export class RegisterReactifFormComponent implements OnInit {


  registreFormReactif!: FormGroup;

  public errorMsg!: string;
  private validationErrorMessages : any = {
    required: 'Entrez votre Email',
    email: 'Email Invalid'
  }

  constructor(private fb: FormBuilder) { }



  ngOnInit(): void {
    this.registreFormReactif = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(4)]],
      lastName: ['', [Validators.required, Validators.minLength(20)]],
      email: ['', [Validators.required, Validators.email]],
      confirmEmail: ['', Validators.required],
      rating: [null, ratingRangeValidator(1, 5)],
      phone: '',
      notification: 'email',
      sendCatalog: true,
      addressType:['home'],
      street1:[''],
      street2:[''],
      city:[''],
      state:[''],
      zip:[''],
    }, { validator: MustMatch('email', 'confirmEmail') }  as AbstractControlOptions);

    this.registreFormReactif.get('notification')?.valueChanges.subscribe(value => {
      this.setNotificationSetting(value);
    });

    const emailControl = this.registreFormReactif.get('email');
    emailControl?.valueChanges.pipe(debounceTime(1200)).subscribe(val => {
      //console.log(val);
      this.setMessage(emailControl);
    });

  }

  saveData() {
    console.log(this.registreFormReactif);
    console.log('valeurs : ', JSON.stringify(this.registreFormReactif.value));
  }

  public setNotificationSetting(method: String): void {
    const phoneControl = this.registreFormReactif.get('phone');
    if (method === 'text') {
      phoneControl?.setValidators(Validators.required);
    } else {
      phoneControl?.clearValidators();
    }
    phoneControl?.updateValueAndValidity();
  }



  public fillFormData(): void {
    this.registreFormReactif.setValue({
      firstName: 'John',
      lastName: 'Doe B',
      email: 'John@doe.com',
      sendCatalog: true

    })
  }

  private setMessage(val: AbstractControl): void {
    this.errorMsg = '';
    if ((val.touched || val.dirty)&& val.errors) {
      //console.log(Object.keys(val.errors));
      this.errorMsg = Object.keys(val.errors).map(
        key => this.validationErrorMessages[key]
      ).join('');
    }
    //console.log(this.errorMsg);
  }

}
