import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, map, startWith, tap } from 'rxjs';

@Component({
  selector: 'app-complex-form',
  templateUrl: './complex-form.component.html',
  styleUrls: ['./complex-form.component.scss']
})
export class ComplexFormComponent implements OnInit{
  mainForm!:FormGroup;
  personalInfoForm!:FormGroup;
  contactPreferenceCtrl!:FormControl;
  phoneCtrl!: FormControl;

  emailForm!:FormGroup;
  emailCtrl!:FormControl;
  confirmEmailCtrl!:FormControl;

  loginInfoForm!:FormGroup;
  passwordCtrl!:FormControl;
  confirmPasswordCtrl!:FormControl;

  showEmailCtrl$!: Observable<boolean>;
  showPhoneCtrl$!: Observable<boolean>;

  constructor(private formBuilder: FormBuilder){}

  ngOnInit(): void {
    this.initFormControles();
    this.initMainForm();
    this.initFormObservables();

  }
  private initMainForm():void{
    this.mainForm= this.formBuilder.group({
      personalInfo: this.personalInfoForm,
      contactPreference: this.contactPreferenceCtrl,
      email: this.emailForm,
      phone: this.phoneCtrl,
      loginInfo: this.loginInfoForm
    });
  }
  private initFormControles():void {
    this.personalInfoForm=this.formBuilder.group({
      firstName:['',Validators.required],
      lastName:['',Validators.required]
    })
    this.contactPreferenceCtrl= this.formBuilder.control('email');
    this.emailCtrl=this.formBuilder.control('');
    this.confirmEmailCtrl=this.formBuilder.control('');
    this.emailForm=this.formBuilder.group({
      email:this.emailCtrl,
      confirm:this.confirmEmailCtrl
    })
    this.phoneCtrl= this.formBuilder.control('');
    this.passwordCtrl=this.formBuilder.control('',Validators.required);
    this.confirmPasswordCtrl=this.formBuilder.control('',Validators.required);
    this.loginInfoForm=this.formBuilder.group({
      username:['',Validators.required],
      password:this.passwordCtrl,
      confirmPassword:this.confirmPasswordCtrl
    })
  }
  private initFormObservables() {
    this.showEmailCtrl$ = this.contactPreferenceCtrl.valueChanges.pipe(
        startWith(this.contactPreferenceCtrl.value),
        map(preference => preference === 'email'),
        tap(showEmailCtrl => this.setEmailValidators(showEmailCtrl))
    );
    this.showPhoneCtrl$ = this.contactPreferenceCtrl.valueChanges.pipe(
        startWith(this.contactPreferenceCtrl.value),
        map(preference => preference === 'phone'),
        tap(showPhoneCtrl => this.setPhoneValidators(showPhoneCtrl))
    );
}
private setEmailValidators(showEmailCtrl: boolean) {
    if (showEmailCtrl) {
        this.emailCtrl.addValidators([
            Validators.required,
            Validators.email
        ]);
        this.confirmEmailCtrl.addValidators([
            Validators.required,
            Validators.email
        ]);
    } else {
        this.emailCtrl.clearValidators();
        this.confirmEmailCtrl.clearValidators();
    }
    this.emailCtrl.updateValueAndValidity();
    this.confirmEmailCtrl.updateValueAndValidity();
}

private setPhoneValidators(showPhoneCtrl: boolean) {
    if (showPhoneCtrl) {
        this.phoneCtrl.addValidators([
            Validators.required,
            Validators.minLength(10),
            Validators.maxLength(10)
        ]);
    } else {
        this.phoneCtrl.clearValidators();
    }
    this.phoneCtrl.updateValueAndValidity();
}

getFormControlErrorText(ctrl: AbstractControl) {
  if (ctrl.hasError('required')) {
      return 'Ce champ est requis';
  } else {
      return 'Ce champ contient une erreur';
  }
}
  onSubmitForm(){

  }
}
