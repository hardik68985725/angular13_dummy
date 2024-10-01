import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { CustomValidators } from 'src/app/directives/custom-validator.directive';

import { SwalService } from 'src/app/services/swal/swal.service';
import { FunctionService } from 'src/app/services/function/function.service';
import { environment } from 'src/environments/environment';
import { ProductService } from '../product/product.service';
import { I_ApiResponse } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-productaddedit',
  templateUrl: './productaddedit.component.html',
  styleUrls: ['./productaddedit.component.scss'],
})
export class ProductaddeditComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  IsLoading: boolean = false;
  FormGroupProduct: FormGroup = new FormGroup({});
  FormGroupProductIsCreated: boolean = false;
  Media: any = null;

  constructor(
    private _SwalService: SwalService,
    private _FunctionService: FunctionService,
    private _Router: Router,
    private _ActivatedRoute: ActivatedRoute,
    private _ProductService: ProductService
  ) {}

  ngOnInit(): void {
    this.Init();
  }
  ngAfterViewInit(): void {}
  ngOnDestroy(): void {}

  async Init() {
    await this.FormGroupProductCreate();
    const edit_id: string =
      this._ActivatedRoute.snapshot.paramMap.get('id') || '';
    if (edit_id.length > 0) {
      const Data: any = await this._ProductService.findOne(edit_id);
      if (Data?.data?._id) {
        await this.FormGroupProductCreate({
          _id: Data.data._id,
          product_name: Data.data.product_name,
          product_price: Data.data.product_price,
          product_description: Data.data.product_description,
          status: Data.data.status,
        });

        this.InitMedia(Data?.data?.product_picture);
      }
    }
  }

  async FormGroupProductCreate(p_data: any = '') {
    this.FormGroupProduct = new FormGroup({});

    if (!this.FormGroupProduct.controls['_id']) {
      this.FormGroupProduct.addControl(
        '_id',
        new FormControl(p_data._id || null)
      );
    }

    if (!this.FormGroupProduct.controls['product_name']) {
      this.FormGroupProduct.addControl(
        'product_name',
        new FormControl(
          p_data.product_name || '',
          Validators.compose([Validators.required])
        )
      );
    }

    if (!this.FormGroupProduct.controls['product_price']) {
      this.FormGroupProduct.addControl(
        'product_price',
        new FormControl(
          p_data.product_price || '',
          Validators.compose([Validators.required])
        )
      );
    }

    if (!this.FormGroupProduct.controls['product_description']) {
      this.FormGroupProduct.addControl(
        'product_description',
        new FormControl(
          p_data.product_description || '',
          Validators.compose([Validators.required])
        )
      );
    }

    if (!this.FormGroupProduct.controls['status']) {
      this.FormGroupProduct.addControl(
        'status',
        new FormControl(
          p_data.status || 'active',
          Validators.compose([
            Validators.required,
            CustomValidators.IsInArray(['active', 'inactive']),
          ])
        )
      );
    }

    this.FormGroupProductIsCreated = true;
  }

  async FormGroupProductSubmit() {
    console.log(this.FormGroupProduct);

    if (this.FormGroupProduct.valid) {
      const body = this.FormGroupProduct.value;
      body.product_picture = this.Media?._id ?? '';

      let response: I_ApiResponse | null = null;
      if (body._id) {
        const _id = body._id;
        delete body._id;
        response = await this._ProductService.update(_id, body);
      } else {
        response = await this._ProductService.create(body);
      }

      if (response && response.status) {
        this._SwalService.toast('success', response.messages[0]);
        await this._FunctionService.sleep(500);
        this._Router.navigate(['/', 'panel', 'product']);
      } else {
        this._SwalService.toast('error', response.messages[0]);
      }
    }
  }

  InitMedia(p_data: any) {
    this.Media = p_data;
    this.Media.thumbnail = environment.api_url.concat(
      '/',
      this.Media.thumbnail
    );
  }
  async GetNewMedia(p_data: any) {
    this.IsLoading = true;
    if (p_data && p_data.status) {
      this._SwalService.toast('success', p_data.messages[0]);
      await this._FunctionService.sleep(500);
      this.Media = p_data.data;
    } else {
      this._SwalService.toast('error', p_data.messages[0]);
    }
    this.IsLoading = false;
  }
}
