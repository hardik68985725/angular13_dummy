import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {
  AuthGuardForNonSignedinRoutesService,
  AuthGuardForSignedinRoutesService,
} from 'src/app/services/authguard/authguard.service';

import { SigninComponent } from 'src/app/components/signin/signin.component';

const routes: Routes = [
  {
    path: 'signin',
    component: SigninComponent,
    canActivate: [AuthGuardForNonSignedinRoutesService],
  },
  {
    path: 'panel',
    loadChildren: () =>
      import('src/app/panel/panel.module').then((m) => m.PanelModule),
    canActivateChild: [AuthGuardForSignedinRoutesService],
  },

  { path: '', redirectTo: '/signin', pathMatch: 'full' },
  { path: '**', redirectTo: '/signin', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
