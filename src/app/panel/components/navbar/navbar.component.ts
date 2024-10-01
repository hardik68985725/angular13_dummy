import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService, I_AuthData } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  menu: boolean = false;
  currentUser: I_AuthData = this._AuthService.GetAuthData();

  constructor(private _Router: Router, private _AuthService: AuthService) {}

  ngOnInit(): void {}

  showMenu() {
    this.menu = !this.menu;
  }

  logout() {
    this._AuthService.RemoveAuthData();
    this._Router.navigate(['/', 'signin']);
  }
}
