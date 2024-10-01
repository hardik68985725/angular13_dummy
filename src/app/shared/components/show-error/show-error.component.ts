import { Component, Input } from '@angular/core';
import {
  AbstractControlDirective,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';

@Component({
  selector: 'app-show-error',
  templateUrl: './show-error.component.html',
  styleUrls: ['./show-error.component.scss'],
})
export class ShowErrorComponent {
  private static readonly errorMessages: any = {
    required: (params: any) => 'This field is required',
    minlength: (params: any) =>
      'Must be the minimum '
        .concat(params.requiredLength)
        .concat(' Characters'),
    maxlength: (params: any) =>
      'Must not be greater than '
        .concat(params.requiredLength)
        .concat(' Characters'),
    passwordMismatch: (params: any) =>
      'Password and confirm password does not match',
    validNumber: (params: any) => params.message,
    validEmail: (params: any) => params.message,
    numbersOnly: (params: any) => params.message,
    validPhone: (params: any) => params.message,
    onlyAlphabets: (params: any) => params.message,
    dateCheck: (params: any) => 'Invalid date',
    compareWith: (params: any) => params.message,
    min: (params: any) => {
      return `The value must be greater than or equals to ${params.min}`;
    },
    IsInArray: (params: any) => params.message,
  };

  @Input('control') control: AbstractControlDirective | AbstractControl | null =
    null;

  private listOfErrors(): (string | null)[] {
    if (!this.control) {
      return [];
    }
    const validationErrors: any = this.control.errors;
    return Object.keys(validationErrors).map((field) =>
      this.getMessage(field, validationErrors[field], this.control)
    );
  }

  private getMessage(type: string, params: any, control: any) {
    let fname: string | null = this.getControlName(control);
    if (fname) {
      fname = fname.replace('_', ' ').replace(' id', '').toLowerCase();
      fname = fname.replace(/\b\w/g, (l) => l.toUpperCase());
    }

    const msg: string | null = ShowErrorComponent.errorMessages[type](params);
    return msg;
  }

  private getControlName(c: AbstractControl): string | null {
    const control: AbstractControl | any = c;
    if (control !== null) {
      const formGroup: any = control.parent.controls;
      return (
        Object.keys(formGroup).find((name) => c === formGroup[name]) || null
      );
    }

    return null;
  }

  shouldShowErrors(): boolean | null {
    if (this.control && this.control.errors) {
      return true;
    }
    return null;
    /* return (
      this.control &&
      this.control.errors &&
      (this.control.dirty || this.control.touched)
    ); */
  }

  getError(): string {
    if (!this.control) {
      return '';
    }
    const validationErrors: any = this.control.errors;
    const errors: any = Object.keys(validationErrors).map((field) =>
      this.getMessage(field, validationErrors[field], this.control)
    );
    return errors[0];
  }
}
