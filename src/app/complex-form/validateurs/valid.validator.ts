import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function validValidator():ValidatorFn{
  return(ctrl:AbstractControl):null |ValidationErrors=>{
    if(ctrl.value.includes('VLAID')){
      return null;
    }else{
      return{
        validValidator:ctrl.value
      };
    }
  }
}
