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

export interface I_DispatchDetails {
  quantity: number;
  driver_mobile_phone_number: string;
  truck_number: string;
  other_details: string;
}

@Component({
  selector: 'app-dispatch_details',
  templateUrl: './orderdispatch.component.html',
  styleUrls: ['./orderdispatch.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => OrderdispatchComponent),
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: forwardRef(() => OrderdispatchComponent),
    },
  ],
})
export class OrderdispatchComponent
  implements OnInit, ControlValueAccessor, Validator
{
  @Input('disabled') disabled: boolean = false;
  _value: I_DispatchDetails = {
    quantity: 0,
    driver_mobile_phone_number: '',
    truck_number: '',
    other_details: '',
  };

  FormGroupDispatchDetails: FormGroup = new FormGroup({});

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
    if (this.FormGroupDispatchDetails.valid) {
      return null;
    }

    let errors: any = {};
    for (const [control] of Object.entries(
      this.FormGroupDispatchDetails.controls
    )) {
      errors = this.addControlErrors(errors, control);
    }

    return errors;
  }

  addControlErrors(allErrors: any, controlName: string) {
    const errors = { ...allErrors };
    const controlErrors =
      this.FormGroupDispatchDetails.controls[controlName].errors;

    if (controlErrors) {
      errors[controlName] = controlErrors;
    }

    return errors;
  }
  // ---------------------------------------------------------------------------

  async Init() {
    await this.FormGroupDispatchDetailsCreate(this._value);
  }

  async FormGroupDispatchDetailsCreate(p_data: any = '') {
    this.FormGroupDispatchDetails = new FormGroup({});

    if (!this.FormGroupDispatchDetails.controls['quantity']) {
      this.FormGroupDispatchDetails.addControl(
        'quantity',
        new FormControl(
          {
            value: p_data.quantity || '',
            disabled: this.disabled,
          },
          Validators.compose([Validators.required])
        )
      );
    }

    if (!this.FormGroupDispatchDetails.controls['driver_mobile_phone_number']) {
      this.FormGroupDispatchDetails.addControl(
        'driver_mobile_phone_number',
        new FormControl(
          {
            value: p_data.driver_mobile_phone_number || '',
            disabled: this.disabled,
          },
          Validators.compose([Validators.required])
        )
      );
    }

    if (!this.FormGroupDispatchDetails.controls['truck_number']) {
      this.FormGroupDispatchDetails.addControl(
        'truck_number',
        new FormControl(
          { value: p_data.truck_number || '', disabled: this.disabled },
          Validators.compose([Validators.required])
        )
      );
    }

    if (!this.FormGroupDispatchDetails.controls['other_details']) {
      this.FormGroupDispatchDetails.addControl(
        'other_details',
        new FormControl(
          { value: p_data.other_details || '', disabled: this.disabled },
          Validators.compose([Validators.required])
        )
      );
    }
  }

  change_value() {
    if (!this.disabled) {
      this._value = this.FormGroupDispatchDetails.value;
      this._on_change(this._value);
    }
  }
}
