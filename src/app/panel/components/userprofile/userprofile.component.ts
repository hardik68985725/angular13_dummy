import { Component, forwardRef, Input, OnInit } from '@angular/core';
import {
  NG_VALUE_ACCESSOR,
  ControlValueAccessor,
  NG_VALIDATORS,
  Validator,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { I_Address } from '../address/address.component';

interface I_Userprofile {
  mobile_phone_number: string;
  first_name: string;
  last_name: string;
  birth_date: Date | null;
  address: I_Address | null;
}

@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => UserprofileComponent),
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: forwardRef(() => UserprofileComponent),
    },
  ],
})
export class UserprofileComponent
  implements OnInit, ControlValueAccessor, Validator
{
  @Input('disabled') disabled: boolean = false;
  _value: I_Userprofile = {
    mobile_phone_number: '',
    first_name: '',
    last_name: '',
    birth_date: null,
    address: null,
  };

  FormGroupUserprofile: FormGroup = new FormGroup({});

  constructor() {}

  ngOnInit(): void {
    this.Init();
  }

  // ---------------------------------------------------------------------------
  _on_change: any;
  registerOnChange(_: any) {
    this._on_change = _;
  }

  _on_touched: any;
  registerOnTouched(_: any) {
    this._on_touched = _;
  }

  writeValue(p_value: any) {
    this._value = p_value;
    this.Init();
  }

  setDisabledState(p_value: boolean) {
    this.disabled = p_value;
  }
  // ---------------------------------------------------------------------------

  // ---------------------------------------------------------------------------
  validate(control: AbstractControl): ValidationErrors | null {
    if (this.FormGroupUserprofile.valid) {
      return null;
    }

    let errors: any = {};
    for (const [control] of Object.entries(
      this.FormGroupUserprofile.controls
    )) {
      errors = this.addControlErrors(errors, control);
    }

    return errors;
  }

  addControlErrors(allErrors: any, controlName: string) {
    const errors = { ...allErrors };
    const controlErrors =
      this.FormGroupUserprofile.controls[controlName].errors;

    if (controlErrors) {
      errors[controlName] = controlErrors;
    }

    return errors;
  }
  // ---------------------------------------------------------------------------

  // ---------------------------------------------------------------------------
  change_value() {
    if (!this.disabled) {
      this._value = this.FormGroupUserprofile.value;
      this._on_change(this._value);
    }
  }
  // ---------------------------------------------------------------------------

  async Init() {
    await this.FormGroupUserprofileCreate(this._value);

    if (this.FormGroupUserprofile.get('birth_date') !== null) {
      this.FormGroupUserprofile.get('birth_date')?.valueChanges.subscribe(
        (value) => {
          this._value.birth_date = value;
        }
      );
    }
  }

  async FormGroupUserprofileCreate(p_data: any = '') {
    this.FormGroupUserprofile = new FormGroup({});

    if (!this.FormGroupUserprofile.controls['mobile_phone_number']) {
      this.FormGroupUserprofile.addControl(
        'mobile_phone_number',
        new FormControl(
          p_data.mobile_phone_number || '',
          Validators.compose([Validators.required])
        )
      );
    }

    if (!this.FormGroupUserprofile.controls['birth_date']) {
      const birth_date = p_data.birth_date
        ? new Date(p_data.birth_date)
        : new Date();
      this.FormGroupUserprofile.addControl(
        'birth_date',
        new FormControl(birth_date, Validators.compose([Validators.required]))
      );
    }

    if (!this.FormGroupUserprofile.controls['first_name']) {
      this.FormGroupUserprofile.addControl(
        'first_name',
        new FormControl(
          p_data.first_name || '',
          Validators.compose([Validators.required])
        )
      );
    }

    if (!this.FormGroupUserprofile.controls['last_name']) {
      this.FormGroupUserprofile.addControl(
        'last_name',
        new FormControl(
          p_data.last_name || '',
          Validators.compose([Validators.required])
        )
      );
    }

    if (!this.FormGroupUserprofile.controls['address']) {
      this.FormGroupUserprofile.addControl(
        'address',
        new FormControl(p_data.address || '')
      );
    }
  }
}
