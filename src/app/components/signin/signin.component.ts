import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { CustomValidators } from 'src/app/directives/custom-validator.directive';

import { SwalService } from 'src/app/services/swal/swal.service';
import { FunctionService } from 'src/app/services/function/function.service';
import { AuthService, I_AuthData } from 'src/app/services/auth/auth.service';
import { SigninService } from 'src/app/components/signin/signin.service';

import {
  faEnvelope as fasEnvelope,
  faUnlockKeyhole as fasUnlockKeyhole,
} from '@fortawesome/free-solid-svg-icons';
import { GlobalvarService } from 'src/app/services/globalvar/globalvar.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
})
export class SigninComponent implements OnInit {
  fasEnvelope = fasEnvelope;
  fasUnlockKeyhole = fasUnlockKeyhole;

  isCollapsed: boolean = true;

  FormGroupSignin: FormGroup = new FormGroup({});

  constructor(
    private _Router: Router,
    private _SwalService: SwalService,
    private _FunctionService: FunctionService,
    private _GlobalvarService: GlobalvarService,
    private _AuthService: AuthService,
    private _SigninService: SigninService
  ) {}

  ngOnInit(): void {
    this.Init();
  }

  async Init() {
    await this.FormGroupSigninCreate();
  }

  async FormGroupSigninCreate() {
    this.FormGroupSignin.addControl(
      'email',
      new FormControl(
        '',
        Validators.compose([Validators.required, CustomValidators.validEmail])
      )
    );

    this.FormGroupSignin.addControl(
      'password',
      new FormControl('', Validators.compose([Validators.required]))
    );
  }

  async FormGroupSigninSubmit() {
    if (this.FormGroupSignin.valid) {
      const response: any = await this._SigninService.SignIn(
        this.FormGroupSignin.value
      );
      console.log('response', response);
      if (response && response.status) {
        this._GlobalvarService.signedin_user_data.value.role =
          response.data.role;

        const authData: I_AuthData = {
          id: '',
          token: response.data.token,
          email: this.FormGroupSignin.value.email,
        };
        this._AuthService.SetAuthData(authData);
        this._SwalService.toast('success', response.messages[0]);
        await this._FunctionService.sleep(500);
        this._Router.navigate(['/', 'panel', 'dashboard']);
      } else {
        this._SwalService.toast('error', response.messages[0]);
      }
    }
  }
}
