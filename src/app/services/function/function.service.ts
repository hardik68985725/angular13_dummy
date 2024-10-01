import { Injectable } from '@angular/core';
import { GlobalvarService } from '../globalvar/globalvar.service';
import { ADTSettings } from 'angular-datatables/src/models/settings';

export enum E_user_roles {
  owner = 'owner',
  marketing_head = 'marketing_head',
  area_marketing_head = 'area_marketing_head',
  sales_officer = 'sales_officer',
  dealer = 'dealer',
  dispatcher = 'dispatcher',
  accountant = 'accountant',
}

@Injectable({
  providedIn: 'root',
})
export class FunctionService {
  constructor(private _GlobalvarService: GlobalvarService) {}

  is_number(p_Data?: any) {
    // return p_Data.constructor == Number;
    return Object.prototype.toString.call(p_Data).split(/\W/)[2] == 'Number';
  }

  is_string(p_Data?: any) {
    // return p_Data.constructor == String;
    return Object.prototype.toString.call(p_Data).split(/\W/)[2] == 'String';
  }

  is_array(p_Data?: any) {
    // return p_Data.constructor == Array;
    return Object.prototype.toString.call(p_Data).split(/\W/)[2] == 'Array';
  }

  is_object(p_Data?: any) {
    // return p_Data.constructor == Object;
    return Object.prototype.toString.call(p_Data).split(/\W/)[2] == 'Object';
  }

  is_valid_date(p_Date: any = ''): boolean {
    if (p_Date && !isNaN(Date.parse(p_Date))) {
      return true;
    }
    return false;
  }

  async sleep(p_Miliseconds: number = 0) {
    return new Promise((resolve) => setTimeout(resolve, p_Miliseconds));
  }

  add_remove_html_body_cssclass(p_Data: boolean = true) {
    if (p_Data) {
      const html: any = document.getElementsByTagName('html')[0];
      html.classList.add('auth-layout');

      const body: any = document.getElementsByTagName('body')[0];
      body.classList.add('bg-default');
    } else {
      const html: any = document.getElementsByTagName('html')[0];
      html.classList.remove('auth-layout');

      const body: any = document.getElementsByTagName('body')[0];
      body.classList.remove('bg-default');
    }
  }

  get_user_roles(): Array<{ value: string; text: string }> {
    const p_role: string = this._GlobalvarService.signedin_user_data.value.role;

    const ROLES: Array<{ value: string; text: string }> = [
      {
        value: E_user_roles.owner,
        text: 'Owner',
      },
      {
        value: E_user_roles.marketing_head,
        text: 'Marketing Head',
      },
      {
        value: E_user_roles.area_marketing_head,
        text: 'Area Marketing Head',
      },
      {
        value: E_user_roles.sales_officer,
        text: 'Sales Officer',
      },
      {
        value: E_user_roles.dealer,
        text: 'Dealer',
      },
      {
        value: E_user_roles.dispatcher,
        text: 'Dispatcher',
      },
      {
        value: E_user_roles.accountant,
        text: 'Accountant',
      },
    ];
    const user_roles: typeof ROLES = [];

    for (const [i, v] of ROLES.entries()) {
      if (
        p_role === E_user_roles.marketing_head &&
        v.value === E_user_roles.area_marketing_head
      ) {
        user_roles.push(v);
      }

      if (
        p_role === E_user_roles.area_marketing_head &&
        v.value === E_user_roles.sales_officer
      ) {
        user_roles.push(v);
      }

      if (
        p_role === E_user_roles.sales_officer &&
        v.value === E_user_roles.dealer
      ) {
        user_roles.push(v);
      }
    }

    if (user_roles.length === 0) {
      return ROLES;
    }
    return user_roles;
  }

  get_status(): Array<{ value: string; text: string }> {
    return [
      {
        value: 'active',
        text: 'Active',
      },
      {
        value: 'inactive',
        text: 'Inactive',
      },
    ];
  }

  firm_types(): Array<{ value: string; text: string }> {
    return [
      {
        value: 'proprietor',
        text: 'Proprietor',
      },
      {
        value: 'partnership',
        text: 'Partnership',
      },
      {
        value: 'private_limited',
        text: 'Private limited',
      },
      {
        value: 'other',
        text: 'Other',
      },
    ];
  }

  get_datatable_default_settings(): ADTSettings {
    return {
      destroy: true,
      serverSide: true,
      processing: true,
      autoWidth: false,
      lengthMenu: [
        [5, 10, 15, 20],
        [5, 10, 15, 20],
      ],
      searching: false,
      paging: true,
      pageLength: 5,
      pagingType: 'first_last_numbers',
      ordering: true,
      order: [[0, 'asc']],
    };
  }
}
