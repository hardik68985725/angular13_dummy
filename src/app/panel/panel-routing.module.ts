import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PanelComponent } from 'src/app/panel/panel.component';
import { DashboardComponent } from 'src/app/panel/components/dashboard/dashboard.component';
import { ProfileComponent } from 'src/app/panel/components/profile/profile.component';
import { ProductComponent } from './components/product/product.component';
import { ProductaddeditComponent } from './components/productaddedit/productaddedit.component';
import { UserComponent } from './components/user/user.component';
import { UseraddeditComponent } from './components/useraddedit/useraddedit.component';
import { OrderComponent } from './components/order/order.component';
import { OrderaddeditComponent } from './components/orderaddedit/orderaddedit.component';

const routes: Routes = [
  {
    path: '',
    component: PanelComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'user', component: UserComponent },
      { path: 'useraddedit', component: UseraddeditComponent },
      { path: 'useraddedit/:id', component: UseraddeditComponent },
      { path: 'product', component: ProductComponent },
      { path: 'productaddedit', component: ProductaddeditComponent },
      { path: 'productaddedit/:id', component: ProductaddeditComponent },
      { path: 'order', component: OrderComponent },
      { path: 'orderaddedit', component: OrderaddeditComponent },
      { path: 'orderaddedit/:id', component: OrderaddeditComponent },
      { path: 'orderdispatch/:id', component: OrderaddeditComponent },

      { path: '', redirectTo: '/panel/dashboard', pathMatch: 'full' },
      { path: '**', redirectTo: '/panel/dashboard', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PanelRoutingModule {}
