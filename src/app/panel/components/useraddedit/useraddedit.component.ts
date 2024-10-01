import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { CustomValidators } from 'src/app/directives/custom-validator.directive';

import { SwalService } from 'src/app/services/swal/swal.service';
import { FunctionService } from 'src/app/services/function/function.service';
import { UserService } from '../user/user.service';
import { environment } from 'src/environments/environment';
import { I_ApiResponse } from 'src/app/services/api/api.service';
import { GlobalvarService } from 'src/app/services/globalvar/globalvar.service';

@Component({
  selector: 'app-useraddedit',
  templateUrl: './useraddedit.component.html',
  styleUrls: ['./useraddedit.component.scss'],
})
export class UseraddeditComponent implements OnInit {
  IsLoading: boolean = false;
  FormGroupUser: FormGroup = new FormGroup({});
  parent_users: Array<{ value: string; text: string }> = [];

  user_roles: Array<{ value: string; text: string }> =
    this._FunctionService.get_user_roles();
  status: Array<{ value: string; text: string }> =
    this._FunctionService.get_status();

  constructor(
    private _SwalService: SwalService,
    private _FunctionService: FunctionService,
    private _GlobalvarService: GlobalvarService,
    private _Router: Router,
    private _ActivatedRoute: ActivatedRoute,
    private _UserService: UserService
  ) {}

  ngOnInit(): void {
    this.Init();
  }

  async Init() {
    // this._SwalService.toast('success', 'success', 3000);

    await this.FormGroupUserCreate();
    const edit_id: string =
      this._ActivatedRoute.snapshot.paramMap.get('id') || '';
    if (edit_id.length > 0) {
      const Data: I_ApiResponse | null = await this._UserService.findOne(
        edit_id
      );
      if (Data?.data?._id) {
        await this.OnChange_Role(Data.data.role);
        await this.FormGroupUserCreate({
          _id: Data.data._id,
          parent_user: Data.data.parent_user,
          email: Data.data.email,
          role: Data.data.role,
          status: Data.data.status,
        });
      }
    }

    // update user role array according to signedin user
    console.log(this._GlobalvarService.signedin_user_data.value.role);
    /* this.user_roles = this.user_roles.filter(
      (v) => v.value === user.role
    )[0] */
  }

  async FormGroupUserCreate(p_data: any = '') {
    console.log(p_data);
    this.FormGroupUser = new FormGroup({});

    if (!this.FormGroupUser.controls['_id']) {
      this.FormGroupUser.addControl('_id', new FormControl(p_data._id || ''));
    }

    if (!this.FormGroupUser.controls['parent_user']) {
      this.FormGroupUser.addControl(
        'parent_user',
        new FormControl(
          p_data.parent_user || '',
          Validators.compose([Validators.required])
        )
      );
    }

    if (!this.FormGroupUser.controls['email']) {
      this.FormGroupUser.addControl(
        'email',
        new FormControl(
          p_data.email || '',
          Validators.compose([Validators.required, CustomValidators.validEmail])
        )
      );
    }

    if (!this.FormGroupUser.controls['role']) {
      this.FormGroupUser.addControl(
        'role',
        new FormControl(
          p_data.role || '',
          Validators.compose([Validators.required])
        )
      );
    }

    if (!this.FormGroupUser.controls['status']) {
      this.FormGroupUser.addControl(
        'status',
        new FormControl(p_data.status || 'active')
      );
    }
  }

  async FormGroupUserSubmit() {
    console.log(this.FormGroupUser);

    if (this.FormGroupUser.valid) {
      const body = this.FormGroupUser.value;

      let response: I_ApiResponse | null = null;
      if (body._id) {
        const _id = body._id;
        delete body._id;
        // response = await this._UserService.update(_id, body);
        response = await this._UserService.create(body);
      } else {
        response = await this._UserService.create(body);
      }

      if (response && response.status) {
        this._SwalService.toast('success', response.messages[0]);
        await this._FunctionService.sleep(500);
        this._Router.navigate(['/', 'panel', 'user']);
      } else {
        this._SwalService.toast('error', response.messages[0]);
      }
    }
  }

  async OnChange_Role(_selected_role: string) {
    console.log('_selected_role -----', _selected_role);
    // need to work on new api to get user list for the role

    this.IsLoading = true;
    const response: I_ApiResponse = (await this._UserService.get_user_of_role(
      _selected_role
    )) as I_ApiResponse;
    console.log('response', response);
    this.parent_users = [];
    if (response && response.status) {
      for (const [i, v] of Object.entries(response.data)) {
        const user: any = v;
        user.role = this.user_roles.filter(
          (v) => v.value === user.role
        )[0].text;
        this.parent_users.push({
          value: user._id,
          text: `${user.profile?.first_name || ''} ${
            user.profile?.last_name || ''
          } (${user.email}) - ${user.role}`,
        });
      }
    }
    this.IsLoading = false;
  }
}
