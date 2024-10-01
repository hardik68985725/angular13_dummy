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
import { FunctionService } from 'src/app/services/function/function.service';

interface I_Userdealer {
  dealer_code: string;
  authorized_person_name: string;
  firm_type: string;
  firm_address: I_Address | null;
  godown_address: I_Address | null;
  godown_capacity: string;
  gst_number: string;
  pan_detail: string;
}

@Component({
  selector: 'app-userdealer',
  templateUrl: './userdealer.component.html',
  styleUrls: ['./userdealer.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => UserdealerComponent),
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: forwardRef(() => UserdealerComponent),
    },
  ],
})
export class UserdealerComponent
  implements OnInit, ControlValueAccessor, Validator
{
  @Input('disabled') disabled: boolean = false;
  _value: I_Userdealer = {
    dealer_code: '',
    authorized_person_name: '',
    firm_type: '',
    firm_address: null,
    godown_address: null,
    godown_capacity: '',
    gst_number: '',
    pan_detail: '',
  };

  FormGroupUserdealer: FormGroup = new FormGroup({});

  firm_types: Array<{ value: string; text: string }> =
    this._FunctionService.firm_types();

  constructor(private _FunctionService: FunctionService) {}

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
    if (this.FormGroupUserdealer.valid) {
      return null;
    }

    let errors: any = {};
    for (const [control] of Object.entries(this.FormGroupUserdealer.controls)) {
      errors = this.addControlErrors(errors, control);
    }

    return errors;
  }

  addControlErrors(allErrors: any, controlName: string) {
    const errors = { ...allErrors };
    const controlErrors = this.FormGroupUserdealer.controls[controlName].errors;

    if (controlErrors) {
      errors[controlName] = controlErrors;
    }

    return errors;
  }
  // ---------------------------------------------------------------------------

  // ---------------------------------------------------------------------------
  change_value() {
    if (!this.disabled) {
      this._value = this.FormGroupUserdealer.value;
      this._on_change(this._value);
    }
  }
  // ---------------------------------------------------------------------------

  async Init() {
    await this.FormGroupUserdealerCreate(this._value);
  }

  async FormGroupUserdealerCreate(p_data: any = '') {
    this.FormGroupUserdealer = new FormGroup({});

    if (!this.FormGroupUserdealer.controls['dealer_code']) {
      this.FormGroupUserdealer.addControl(
        'dealer_code',
        new FormControl(
          p_data.dealer_code || '',
          Validators.compose([Validators.required])
        )
      );
    }

    if (!this.FormGroupUserdealer.controls['authorized_person_name']) {
      this.FormGroupUserdealer.addControl(
        'authorized_person_name',
        new FormControl(
          p_data.authorized_person_name || '',
          Validators.compose([Validators.required])
        )
      );
    }

    if (!this.FormGroupUserdealer.controls['firm_type']) {
      this.FormGroupUserdealer.addControl(
        'firm_type',
        new FormControl(
          p_data.firm_type || '',
          Validators.compose([Validators.required])
        )
      );
    }

    if (!this.FormGroupUserdealer.controls['firm_address']) {
      this.FormGroupUserdealer.addControl(
        'firm_address',
        new FormControl(p_data.firm_address || '')
      );
    }

    if (!this.FormGroupUserdealer.controls['godown_address']) {
      this.FormGroupUserdealer.addControl(
        'godown_address',
        new FormControl(p_data.godown_address || '')
      );
    }

    if (!this.FormGroupUserdealer.controls['godown_capacity']) {
      this.FormGroupUserdealer.addControl(
        'godown_capacity',
        new FormControl(
          p_data.godown_capacity || '',
          Validators.compose([Validators.required])
        )
      );
    }

    if (!this.FormGroupUserdealer.controls['gst_number']) {
      this.FormGroupUserdealer.addControl(
        'gst_number',
        new FormControl(
          p_data.gst_number || '',
          Validators.compose([Validators.required])
        )
      );
    }

    if (!this.FormGroupUserdealer.controls['pan_detail']) {
      this.FormGroupUserdealer.addControl(
        'pan_detail',
        new FormControl(
          p_data.pan_detail || '',
          Validators.compose([Validators.required])
        )
      );
    }
  }
}
