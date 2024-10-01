import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

import { AppComponent } from './app.component';

import {
  AuthGuardForSignedinRoutesService,
  AuthGuardForNonSignedinRoutesService,
} from 'src/app/services/authguard/authguard.service';

import { SigninComponent } from 'src/app/components/signin/signin.component';

@NgModule({
  declarations: [AppComponent, SigninComponent],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    SharedModule,
  ],
  providers: [
    AuthGuardForSignedinRoutesService,
    AuthGuardForNonSignedinRoutesService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
