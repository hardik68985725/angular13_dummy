import { Injectable } from '@angular/core';

import { FunctionService } from 'src/app/services/function/function.service';



@Injectable({
  providedIn: 'root'
})
export class JsonService {

  constructor(
    private _FunctionService: FunctionService,
  ) { }

  is_json(p_value: string, p_is_just_check: boolean = true) {
    let json_data: any = null;
    try {
      if (p_value === null) { p_value = ''; }
      if (!this._FunctionService.is_string(p_value)) { p_value = JSON.stringify(p_value); }
      json_data = JSON.parse(p_value);
    } catch(e) {
      console.log('JsonService > is_json > error -----', e);
      console.log('JsonService > is_json > error > data -----', p_value.length);
      return false;
    }

    if (p_is_just_check === true) { return true; }
    return json_data;
  }

  circular_replacer() {
    const seen = new WeakSet();
    return (key: string, value: any) => {
      if ((typeof value === 'object') && (value !== null)) {
        if (seen.has(value)) { return; }
        seen.add(value);
      }
      return value;
    };
  }
}
