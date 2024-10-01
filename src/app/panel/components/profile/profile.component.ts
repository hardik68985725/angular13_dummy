import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { CustomValidators } from 'src/app/directives/custom-validator.directive';

import { SwalService } from 'src/app/services/swal/swal.service';
import { FunctionService } from 'src/app/services/function/function.service';
import { UserService } from '../user/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  IsLoading: boolean = false;
  FormGroupProfile: FormGroup = new FormGroup({});
  Media: any = null;

  profile_role: string = '';

  constructor(
    private _SwalService: SwalService,
    private _FunctionService: FunctionService,
    private _Router: Router,
    private _UserService: UserService
  ) {}

  ngOnInit(): void {
    this.Init();
  }

  async Init() {
    await this.FormGroupProfileCreate();
    const Data: any = await this._UserService.profile();
    if (Data?.data?._id) {
      this.profile_role = Data.data.role;

      Data.data.dealer = {};
      Data.data.dealer.firm_address = Data.data.profile.address;

      await this.FormGroupProfileCreate({
        _id: Data.data._id,
        email: Data.data.email,
        profile: Data.data.profile,
        dealer: Data.data.dealer,
      });

      console.log(Data.data.profile);
      if (Data?.data?.profile?.profile_picture) {
        this.InitMedia(Data?.data?.profile?.profile_picture);
      }
    }
  }

  async FormGroupProfileCreate(p_data: any = '') {
    console.log(p_data);
    this.FormGroupProfile = new FormGroup({});

    if (!this.FormGroupProfile.controls['_id']) {
      this.FormGroupProfile.addControl(
        '_id',
        new FormControl(p_data._id || '')
      );
    }

    if (!this.FormGroupProfile.controls['email']) {
      this.FormGroupProfile.addControl(
        'email',
        new FormControl(
          p_data.email || '',
          Validators.compose([Validators.required, CustomValidators.validEmail])
        )
      );
    }

    if (!this.FormGroupProfile.controls['password']) {
      this.FormGroupProfile.addControl(
        'password',
        new FormControl('', Validators.compose([Validators.required]))
      );
    }

    if (!this.FormGroupProfile.controls['new_password']) {
      this.FormGroupProfile.addControl(
        'new_password',
        new FormControl(
          '',
          Validators.compose([
            // Validators.required,
          ])
        )
      );
    }

    if (!this.FormGroupProfile.controls['new_password_confirm']) {
      this.FormGroupProfile.addControl(
        'new_password_confirm',
        new FormControl(
          '',
          Validators.compose([
            // Validators.required
          ])
        )
      );
    }

    if (!this.FormGroupProfile.controls['profile']) {
      console.log(p_data.profile);
      this.FormGroupProfile.addControl(
        'profile',
        new FormControl(p_data.profile || '')
      );
    }

    if (!this.FormGroupProfile.controls['dealer']) {
      this.FormGroupProfile.addControl(
        'dealer',
        new FormControl(p_data.dealer || '')
      );
    }
  }

  async FormGroupProfileSubmit() {
    if (this.FormGroupProfile.value.new_password.trim().length > 0) {
      CustomValidators.compareWith(
        'new_password',
        'new_password_confirm',
        'New Password and Confirm New Password are not same'
      )(this.FormGroupProfile);
    }

    console.log(this.FormGroupProfile);
    console.log(this.Media);

    if (0 && this.FormGroupProfile.valid) {
      const body = { ...this.FormGroupProfile.value };
      const _id = body._id;
      delete body._id;
      console.log(_id);

      // delete body.email;
      // delete body.password;
      if (this.Media?._id) {
        body.profile.profile_picture = this.Media._id;
      }
      console.log(body);

      const response: any = await this._UserService.save_profile(_id, body);
      console.log('response', response);
      if (response && response.status) {
        this._SwalService.toast('success', response.messages[0]);
        await this._FunctionService.sleep(500);
        this._Router.navigate(['/', 'panel', 'profile']);
      } else {
        this._SwalService.toast('error', response.messages[0]);
      }
    }
  }

  InitMedia(p_data: any) {
    this.Media = p_data;
    this.Media.thumbnail = environment.api_url.concat(
      '/',
      this.Media.thumbnail
    );
  }
  async GetNewMedia(p_data: any) {
    console.log(p_data);
    this.IsLoading = true;
    if (p_data && p_data.status) {
      this._SwalService.toast('success', p_data.messages[0]);
      await this._FunctionService.sleep(500);
      this.Media = p_data.data;
    } else {
      this._SwalService.toast('error', p_data.messages[0]);
    }
    this.IsLoading = false;
  }
}
