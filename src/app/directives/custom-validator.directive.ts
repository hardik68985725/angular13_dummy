import {
  FormArray,
  FormControl,
  FormGroup,
  ValidationErrors,
} from '@angular/forms';

export class CustomValidators {
  static isValid: boolean;

  static validEmail(c: FormControl): ValidationErrors | null {
    const email = c.value;
    if (email) {
      const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
      let isValid = true;
      const message = {
        validEmail: {
          message: 'Please enter a valid email address',
        },
      };
      if (reg.test(email)) {
        isValid = true;
      } else {
        isValid = false;
      }
      return isValid ? null : message;
    }
    return null;
  }

  static validNumber(c: FormControl): ValidationErrors | null {
    const value = c.value;
    // const reg = /^[0-9]*$/;
    const reg = /^[+-]?([0-9]*[.])?[0-9]+$/;
    let isValid = true;
    const message = {
      validNumber: {
        message: 'Please enter number only',
      },
    };
    if (reg.test(value)) {
      isValid = true;
    } else {
      isValid = false;
    }
    return isValid ? null : message;
  }

  static validPhone(c: FormControl): ValidationErrors | null {
    const phone = c.value;
    const reg = /^\d{10}$/;
    let isValid = true;
    const message = {
      validPhone: {
        message: 'The phone must have a valid 10-digit number',
      },
    };
    if (reg.test(phone)) {
      isValid = true;
    } else {
      isValid = false;
    }
    return isValid ? null : message;
  }

  static Alphanumric(c: FormControl): ValidationErrors | null {
    const address1 = c.value;
    const reg = /^[a-zA-Z0-9]+$/;
    let isValid = true;
    const message = {
      address1: {
        message: 'Please provide a valid value',
      },
    };
    if (reg.test(address1)) {
      isValid = true;
    } else {
      isValid = false;
    }
    return isValid ? null : message;
  }

  /**
   * @description : Validator "numbersOnly" allow user to enter only numbers in form field
   */
  static numbersOnly(c: FormControl): ValidationErrors | null {
    const inputFieldValue = c.value;
    const reg = /^[0-9]*$/;
    let isValid = true;
    const message = {
      numbersOnly: {
        message: 'Please enter number only',
      },
    };
    if (reg.test(inputFieldValue)) {
      isValid = true;
    } else {
      isValid = false;
    }
    return isValid ? null : message;
  }

  /**
   * Function to validate the telephone
   * @param c
   */
  static validTelephone(c: FormControl): ValidationErrors | null {
    const value = c.value;
    if (value) {
      const cnpj = value.replace(/[_./-]/g, '');
      let isValid = true;
      const message = {
        validEmail: {
          message: 'Digite Telefone válido',
        },
      };
      if (cnpj.length >= 13) {
        isValid = true;
      } else {
        isValid = false;
      }
      return isValid ? null : message;
    }
    return null;
  }

  static passwordValidation(c: FormControl): ValidationErrors | null {
    const inputFieldValue = c.value;
    const reg = /^(?=.*[!@#$%^&*])(?=.*?[0-9])/;
    let isValid = true;
    const message = {
      numbersOnly: {
        message: 'A senha deve conter um caractere especial e um número.',
      },
    };
    if (reg.test(inputFieldValue)) {
      isValid = true;
    } else {
      isValid = false;
    }
    return isValid ? null : message;
  }

  static compareWith(_control_1: any, _control_2: any, _message: string) {
    return (group: FormGroup) => {
      const control_1 = group.controls[_control_1];
      const control_2 = group.controls[_control_2];

      if (control_2.errors && !control_2.errors['compareWith']) {
        return;
      }

      if (control_2.value.length < 1 || control_1.value !== control_2.value) {
        // control_2.setErrors({ compareWith: true });
        control_2.setErrors({ compareWith: { message: _message } });
      } else {
        control_2.setErrors(null);
      }
    };
  }

  static IsInArray(a: Array<any>): any {
    return (c: FormControl): ValidationErrors | null => {
      const value = c.value;
      if (value && !a.includes(value)) {
        return {
          IsInArray: {
            message: `${value} is invalid`,
          },
        };
      }
      return null;
    };
  }
}
