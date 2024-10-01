import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { GlobalvarService } from 'src/app/services/globalvar/globalvar.service';
import { SwalService } from 'src/app/services/swal/swal.service';
import { FunctionService } from 'src/app/services/function/function.service';
import { I_ApiResponse } from 'src/app/services/api/api.service';
import { ProductService } from '../product/product.service';
import { OrderService } from '../order/order.service';
import { CustomValidators } from 'src/app/directives/custom-validator.directive';
import { UserService } from '../user/user.service';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-orderaddedit',
  templateUrl: './orderaddedit.component.html',
  styleUrls: ['./orderaddedit.component.scss'],
})
export class OrderaddeditComponent implements OnInit, AfterViewInit, OnDestroy {
  IsLoading: boolean = false;

  is_dispatcher: boolean = false;

  FormGroupOrder: FormGroup = new FormGroup({});
  FormGroupOrderIsCreated: boolean = false;

  product_list: Array<{ value: string; text: string; image: string }> = [];
  dealer_list: Array<{ value: string; text: string }> = [];

  user_role: string = '';

  user_roles_allowed: Array<string> = [
    'owner',
    'marketing_head',
    'area_marketing_head',
    'sales_officer',
  ];

  selected_product_image: string = '';

  constructor(
    private _GlobalvarService: GlobalvarService,
    private _SwalService: SwalService,
    private _FunctionService: FunctionService,
    private _Router: Router,
    private _ActivatedRoute: ActivatedRoute,
    private _ProductService: ProductService,
    private _OrderService: OrderService,
    private _UserService: UserService
  ) {}

  ngOnInit(): void {
    this.Init();
  }
  ngAfterViewInit(): void {}
  ngOnDestroy(): void {}

  async Init() {
    const route_url_segments = await firstValueFrom(this._ActivatedRoute.url);
    const route_url_path =
      route_url_segments.length > 0 ? route_url_segments[0].path : '';

    if (route_url_path === 'orderdispatch') {
      this.is_dispatcher = true;
    }

    this.user_role = this._GlobalvarService.signedin_user_data.value.role || '';

    if (this.user_roles_allowed.includes(this.user_role)) {
      await this.SetDealerData();
    }
    await this.SetProductData();
    await this.FormGroupOrderCreate();
    const edit_id: string =
      this._ActivatedRoute.snapshot.paramMap.get('id') || '';
    if (edit_id.length > 0) {
      const Data: any = await this._OrderService.findOne(edit_id);
      if (Data?.data?._id) {
        await this.FormGroupOrderCreate({
          _id: Data.data._id,
          product: Data.data.product._id,
          dealer: Data.data.dealer,
          quantity: Data.data.quantity,
          address: Data.data.address,
          dispatch_details: Data.data.dispatch_details,
        });
      }

      this.OnSelectProduct(Data.data.product._id);
    }
  }

  async SetProductData() {
    this.IsLoading = true;
    const response: I_ApiResponse = (await this._ProductService.findAll({
      limit: -1,
      page_no: 1,
    })) as I_ApiResponse;

    this.product_list = [];
    if (response && response.status) {
      for (const [i, v] of Object.entries(response.data?.records)) {
        const product: any = v;
        this.product_list.push({
          value: product._id,
          text: `${product.product_name || ''}`,
          image: `${product.product_picture || ''}`,
        });
      }
    }
    this.IsLoading = false;
  }

  async SetDealerData() {
    this.IsLoading = true;
    const response: I_ApiResponse = (await this._UserService.get_users_has_role(
      'dealer'
    )) as I_ApiResponse;
    this.dealer_list = [];
    if (response && response.status) {
      for (const [i, v] of Object.entries(response.data)) {
        const user: any = v;
        this.dealer_list.push({
          value: user._id,
          text: `${user.profile?.first_name || ''} ${
            user.profile?.last_name || ''
          } (${user.email})`,
        });
      }
    }
    this.IsLoading = false;
  }

  async FormGroupOrderCreate(p_data: any = '') {
    this.FormGroupOrder = new FormGroup({});

    if (!this.FormGroupOrder.controls['_id']) {
      this.FormGroupOrder.addControl(
        '_id',
        new FormControl(p_data._id || null)
      );
    }

    if (!this.FormGroupOrder.controls['product']) {
      this.FormGroupOrder.addControl(
        'product',
        new FormControl(
          { value: p_data.product || '', disabled: this.is_dispatcher },
          Validators.compose([Validators.required])
        )
      );
    }

    if (
      this.dealer_list &&
      this.dealer_list.length > 0 &&
      !this.FormGroupOrder.controls['dealer']
    ) {
      this.FormGroupOrder.addControl(
        'dealer',
        new FormControl(
          { value: p_data.dealer || '', disabled: this.is_dispatcher },
          Validators.compose([Validators.required])
        )
      );
    }

    if (!this.FormGroupOrder.controls['quantity']) {
      this.FormGroupOrder.addControl(
        'quantity',
        new FormControl(
          { value: p_data.quantity || '', disabled: this.is_dispatcher },
          Validators.compose([
            Validators.required,
            Validators.min(2),
            CustomValidators.validNumber,
          ])
        )
      );
    }

    if (!this.FormGroupOrder.controls['address']) {
      this.FormGroupOrder.addControl(
        'address',
        new FormControl({
          value: p_data.address || '',
          disabled: this.is_dispatcher,
        })
      );
    }

    if (
      !this.FormGroupOrder.controls['dispatch_details'] &&
      this.is_dispatcher
    ) {
      this.FormGroupOrder.addControl(
        'dispatch_details',
        new FormControl(p_data.dispatch_details || {})
      );
    }

    this.FormGroupOrderIsCreated = true;
  }

  async FormGroupOrderSubmit() {
    if (this.FormGroupOrder.valid) {
      const body = this.FormGroupOrder.value;

      let response: I_ApiResponse | null = null;
      if (body._id) {
        const _id = body._id;
        delete body._id;
        if (!this.is_dispatcher) {
          response = await this._OrderService.update(_id, body);
        } else {
          response = await this._OrderService.dispatch(
            _id,
            body.dispatch_details
          );
        }
      } else {
        response = await this._OrderService.create(body);
      }

      if (response && response.status) {
        this._SwalService.toast('success', response.messages[0]);
        await this._FunctionService.sleep(500);
        this._Router.navigate(['/', 'panel', 'order']);
      } else {
        this._SwalService.toast('error', response.messages[0]);
      }
    }
  }

  OnSelectProduct(_value: string) {
    if (_value.trim().length > 0) {
      this.selected_product_image = environment.api_url
        .concat('/')
        .concat(this.product_list.filter((v) => v.value === _value)[0]?.image);
    }
  }
}
