import { NgModule } from '@angular/core';
import { CommonModule, TitleCasePipe, DatePipe } from '@angular/common';

import { DataTablesModule } from 'angular-datatables';
import { TabsModule } from 'ngx-bootstrap/tabs';

import { PanelRoutingModule } from './panel-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

import { PanelComponent } from './panel.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MediaComponent } from './components/media/media.component';
import { UserComponent } from './components/user/user.component';
import { AddressComponent } from './components/address/address.component';
import { ProfileComponent } from './components/profile/profile.component';
import { UserprofileComponent } from './components/userprofile/userprofile.component';
import { ProductComponent } from './components/product/product.component';
import { ProductaddeditComponent } from './components/productaddedit/productaddedit.component';
import { UseraddeditComponent } from './components/useraddedit/useraddedit.component';
import { UserdealerComponent } from './components/userdealer/userdealer.component';
import { OrderComponent } from './components/order/order.component';
import { OrderaddeditComponent } from './components/orderaddedit/orderaddedit.component';
import { OrderdispatchComponent } from './components/orderdispatch/orderdispatch.component';

@NgModule({
  declarations: [
    PanelComponent,
    SidebarComponent,
    NavbarComponent,
    FooterComponent,
    DashboardComponent,
    MediaComponent,

    UserComponent,
    AddressComponent,
    ProfileComponent,
    UserprofileComponent,
    ProductComponent,
    ProductaddeditComponent,
    UseraddeditComponent,
    UserdealerComponent,
    OrderComponent,
    OrderaddeditComponent,
    OrderdispatchComponent,
  ],
  imports: [
    CommonModule,
    DataTablesModule,
    TabsModule.forRoot(),

    PanelRoutingModule,
    SharedModule,
  ],
  providers: [TitleCasePipe, DatePipe],
})
export class PanelModule {}
