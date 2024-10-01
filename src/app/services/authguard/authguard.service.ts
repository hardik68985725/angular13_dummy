import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  CanActivateChild,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { FunctionService } from 'src/app/services/function/function.service';
import { UserService } from 'src/app/panel/components/user/user.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ROUTES } from 'src/app/panel/components/sidebar/sidebar.component';
import { GlobalvarService } from '../globalvar/globalvar.service';

@Injectable()
export class AuthGuardForNonSignedinRoutesService implements CanActivate {
  constructor(
    private _Router: Router,
    private _FunctionService: FunctionService,
    private _AuthService: AuthService
  ) {}

  async canActivate() {
    const IsAuth: boolean = await this._AuthService.IsSignedin();
    if (!IsAuth) {
      this._FunctionService.add_remove_html_body_cssclass(true);
      this._AuthService.RemoveAuthData();
      return true;
    }
    this._FunctionService.add_remove_html_body_cssclass(false);
    this._Router.navigate(['/', 'panel', 'dashboard']);
    return false;
  }
}

@Injectable()
export class AuthGuardForSignedinRoutesService implements CanActivateChild {
  constructor(
    private _Router: Router,
    private _FunctionService: FunctionService,
    private _GlobalvarService: GlobalvarService,
    private _AuthService: AuthService,
    private _UserService: UserService
  ) {}

  async canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) {
    const path_array: string = state.url
      .split('/')
      .map((v) => {
        if (v === '') {
          return '/';
        }
        return v;
      })
      .join('/')
      .replace('//', '/');

    const IsAuth: boolean = await this._AuthService.IsSignedin();
    if (IsAuth) {
      this._FunctionService.add_remove_html_body_cssclass(false);
      let user_role: string | boolean = false;
      if (!this._GlobalvarService.signedin_user_data.value.role) {
        user_role = await this._UserService.gsud();
        this._GlobalvarService.signedin_user_data.value.role =
          user_role as string;
      } else {
        user_role = this._GlobalvarService.signedin_user_data.value.role;
      }

      if (user_role) {
        for (const [i, v] of ROUTES.entries()) {
          const v_path: string = v.path.join('/').replace('//', '/');
          if (path_array.includes(v_path)) {
            if (v.role.length === 0 || v.role.includes(user_role as string)) {
              return true;
            }
          }
        }
        this._Router.navigate(['/']);
        return false;
      }
      return true;
    }

    this._FunctionService.add_remove_html_body_cssclass(true);
    this._AuthService.RemoveAuthData();
    this._Router.navigate(['/']);
    return false;
  }
}
