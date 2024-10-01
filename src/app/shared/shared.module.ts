import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { CollapseModule } from 'ngx-bootstrap/collapse';

import { LoaderComponent } from 'src/app/shared/components/loader/loader.component';
import { ShowErrorComponent } from 'src/app/shared/components/show-error/show-error.component';

@NgModule({
  declarations: [ShowErrorComponent, LoaderComponent],
  exports: [
    ShowErrorComponent,
    LoaderComponent,

    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,

    FontAwesomeModule,
    SweetAlert2Module,
    BsDatepickerModule,

    CollapseModule,
  ],
  imports: [CommonModule],
})
export class SharedModule {}
