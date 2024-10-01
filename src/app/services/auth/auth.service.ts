import { Injectable } from '@angular/core';

import { JsonService } from 'src/app/services/json/json.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private _JsonService: JsonService) {
    // this.SetAuthData(JSON.stringify({id: 1}));
  }

  IsSignedin(): boolean {
    const ad: any = this._JsonService.is_json(
      localStorage.getItem('ad') || '',
      false
    );
    if (ad && ad !== null) {
      // return ad.id > 0;
      return true;
    }
    return false;
  }

  SetAuthData(p_Data: any) {
    const ad: any = this._JsonService.is_json(p_Data, false);
    if (ad && ad !== null) {
      localStorage.setItem('ad', JSON.stringify(ad));
    }
  }

  GetAuthData() {
    const ad: any = this._JsonService.is_json(
      localStorage.getItem('ad') || '',
      false
    );
    if (ad && ad !== null) {
      return ad;
    }
    return false;
  }

  RemoveAuthData() {
    localStorage.removeItem('ad');
  }

  GetToken(): string {
    const user: I_AuthData = this.GetAuthData();
    return 'Bearer '.concat(user.token);
  }
}

export interface I_AuthData {
  id: string;
  token: string;
  email: string;
}

export interface I_SignedinData extends I_AuthData {
  role: string;
}
