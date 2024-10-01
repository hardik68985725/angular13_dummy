import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  IconDefinition,
  faHouse,
  faGauge,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { UserService } from '../user/user.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { GlobalvarService } from 'src/app/services/globalvar/globalvar.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  menuItems: RouteInfo[] = [];
  isCollapsed: boolean = true;

  constructor(
    private _Router: Router,
    private _GlobalvarService: GlobalvarService,
    private _AuthService: AuthService,
    private _UserService: UserService
  ) {}

  ngOnInit(): void {
    this.Init();
  }

  async Init() {
    // const user_role: string | boolean = await this._UserService.gsud();
    const user_role: string | boolean =
      this._GlobalvarService.signedin_user_data.value.role || false;
    if ((user_role as boolean) === false) {
      this._AuthService.RemoveAuthData();
      this._Router.navigate(['/', 'signin']);
    } else {
      this.menuItems = ROUTES.filter((_route: RouteInfo) => {
        return _route.role.length === 0 ||
          _route.role.includes(user_role as string)
          ? _route
          : false;
      });
    }
  }
}

interface RouteInfo {
  path: Array<string>;
  title: string;
  icon: IconDefinition | null;
  class: string;
  has_sidebar_menu: number;
  role: Array<string>;
}
export const ROUTES: RouteInfo[] = [
  {
    path: ['/', 'panel', 'dashboard'],
    title: 'Dashboard',
    icon: faHouse,
    class: '',
    has_sidebar_menu: 1,
    role: [],
  },
  {
    path: ['/', 'panel', 'user'],
    title: 'Users',
    icon: faUser,
    class: '',
    has_sidebar_menu: 1,
    role: ['owner', 'marketing_head', 'area_marketing_head', 'sales_officer'],
  },
  {
    path: ['/', 'panel', 'product'],
    title: 'Products',
    icon: faGauge,
    class: '',
    has_sidebar_menu: 1,
    role: ['owner'],
  },
  {
    path: ['/', 'panel', 'order'],
    title: 'Orders',
    icon: faGauge,
    class: '',
    has_sidebar_menu: 1,
    role: [
      'owner',
      'marketing_head',
      'area_marketing_head',
      'sales_officer',
      'dealer',
      'dispatcher',
    ],
  },
  {
    path: ['/', 'panel', 'profile'],
    title: 'Profile',
    icon: null,
    class: '',
    has_sidebar_menu: 0,
    role: [],
  },
  {
    path: ['/', 'panel', 'dashboard'],
    title: 'Dashboard',
    icon: null,
    class: '',
    has_sidebar_menu: 0,
    role: [],
  },
  {
    path: ['/', 'panel', 'productaddedit'],
    title: 'Product Add/Edit',
    icon: null,
    class: '',
    has_sidebar_menu: 0,
    role: ['owner'],
  },
  {
    path: ['/', 'panel', 'useraddedit'],
    title: 'User Add/Edit',
    icon: null,
    class: '',
    has_sidebar_menu: 0,
    role: ['owner', 'marketing_head', 'area_marketing_head', 'sales_officer'],
  },
];
