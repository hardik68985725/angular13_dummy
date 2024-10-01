import { Component, forwardRef, Input, OnInit } from '@angular/core';
import {
  NG_VALUE_ACCESSOR,
  ControlValueAccessor,
  NG_VALIDATORS,
  Validator,
  AbstractControl,
  ValidationErrors,
  AbstractControlDirective,
} from '@angular/forms';
import { FormGroup, FormControl, Validators } from '@angular/forms';

export interface I_Address {
  address_line_1: string;
  village_town_city: string;
  taluka: string;
  district: string;
  pin_code: string;
  state: states;
}

export interface I_AddressSameAs {
  control_title: string;
  address_control: AbstractControl | AbstractControlDirective;
}

enum states {
  gujarat = 'Gujarat',
}

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => AddressComponent),
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: forwardRef(() => AddressComponent),
    },
  ],
})
export class AddressComponent
  implements OnInit, ControlValueAccessor, Validator
{
  @Input('disabled') disabled: boolean = false;
  _value: I_Address = {
    address_line_1: '',
    village_town_city: '',
    taluka: '',
    district: '',
    pin_code: '',
    state: states.gujarat,
  };

  @Input('title') title: string = 'Address';
  // @Input('same_as') same_as: AbstractControl | AbstractControlDirective | null = null;
  @Input('same_as') same_as: null | I_AddressSameAs = null;

  FormGroupAddress: FormGroup = new FormGroup({});

  constructor() {}

  ngOnInit(): void {
    // this.Init();
  }

  // ---------------------------------------------------------------------------
  _on_change: any;
  registerOnChange(_: any) {
    console.log('registerOnChange');
    this._on_change = _;
  }

  _on_touched: any;
  registerOnTouched(_: any) {
    console.log('registerOnTouched');
    this._on_touched = _;
  }

  writeValue(p_value: any) {
    console.log('writeValue');
    this._value = p_value;
    this.Init();
  }

  setDisabledState(p_value: boolean) {
    console.log('setDisabledState');
    this.disabled = p_value;
    this.Init();
  }
  // ---------------------------------------------------------------------------

  // ---------------------------------------------------------------------------
  validate(control: AbstractControl): ValidationErrors | null {
    if (this.FormGroupAddress.valid) {
      return null;
    }

    let errors: any = {};
    for (const [control] of Object.entries(this.FormGroupAddress.controls)) {
      errors = this.addControlErrors(errors, control);
    }

    return errors;
  }

  addControlErrors(allErrors: any, controlName: string) {
    const errors = { ...allErrors };
    const controlErrors = this.FormGroupAddress.controls[controlName].errors;

    if (controlErrors) {
      errors[controlName] = controlErrors;
    }

    return errors;
  }
  // ---------------------------------------------------------------------------

  async Init() {
    await this.FormGroupAddressCreate(this._value);
  }

  async FormGroupAddressCreate(p_data: any = '') {
    this.FormGroupAddress = new FormGroup({});

    if (!this.FormGroupAddress.controls['address_line_1']) {
      this.FormGroupAddress.addControl(
        'address_line_1',
        new FormControl(
          {
            value: p_data.address_line_1 || '',
            disabled: this.disabled,
          },
          Validators.compose([Validators.required])
        )
      );
    }

    if (!this.FormGroupAddress.controls['village_town_city']) {
      this.FormGroupAddress.addControl(
        'village_town_city',
        new FormControl(
          { value: p_data.village_town_city || '', disabled: this.disabled },
          Validators.compose([Validators.required])
        )
      );
    }

    if (!this.FormGroupAddress.controls['taluka']) {
      this.FormGroupAddress.addControl(
        'taluka',
        new FormControl(
          { value: p_data.taluka || '', disabled: this.disabled },
          Validators.compose([Validators.required])
        )
      );
    }

    if (!this.FormGroupAddress.controls['district']) {
      this.FormGroupAddress.addControl(
        'district',
        new FormControl(
          { value: p_data.district || '', disabled: this.disabled },
          Validators.compose([Validators.required])
        )
      );
    }

    if (!this.FormGroupAddress.controls['pin_code']) {
      this.FormGroupAddress.addControl(
        'pin_code',
        new FormControl(
          { value: p_data.pin_code || '', disabled: this.disabled },
          Validators.compose([Validators.required])
        )
      );
    }

    if (!this.FormGroupAddress.controls['state']) {
      this.FormGroupAddress.addControl(
        'state',
        new FormControl(
          { value: p_data.state || '', disabled: this.disabled },
          Validators.compose([Validators.required])
        )
      );
    }
  }

  change_value() {
    if (!this.disabled) {
      this._value = this.FormGroupAddress.value;
      this._on_change(this._value);
    }
  }

  onclick_copy_address_from() {
    if (!this.disabled) {
      this.FormGroupAddress.setValue(this.same_as?.address_control.value);
    }
  }
}
