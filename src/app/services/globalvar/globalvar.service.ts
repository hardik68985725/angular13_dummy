import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { I_SignedinData } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class GlobalvarService {
  public signedin_user_data: BehaviorSubject<I_SignedinData> =
    new BehaviorSubject({
      id: '',
      token: '',
      email: '',
      role: '',
    });
}
