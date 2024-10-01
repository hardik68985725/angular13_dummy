import {
  AfterViewInit,
  Component,
  Inject,
  OnDestroy,
  OnInit,
  Renderer2,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { SwalService } from 'src/app/services/swal/swal.service';
import { FunctionService } from 'src/app/services/function/function.service';
import { environment } from 'src/environments/environment';
import { ProductService } from './product.service';
import { I_ApiResponse } from 'src/app/services/api/api.service';
import { DOCUMENT, TitleCasePipe } from '@angular/common';
import { ADTSettings } from 'angular-datatables/src/models/settings';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit, AfterViewInit, OnDestroy {
  IsLoading: boolean = false;
  DataTable_Product: ADTSettings =
    this._FunctionService.get_datatable_default_settings();
  DataTableTrigger_Product: Subject<any> = new Subject();

  constructor(
    @Inject(DOCUMENT) private _HTMLElement: HTMLElement,
    private _Renderer2: Renderer2,
    private _SwalService: SwalService,
    private _FunctionService: FunctionService,
    private _Router: Router,
    private _ActivatedRoute: ActivatedRoute,
    private _ProductService: ProductService,
    private _TitleCasePipe: TitleCasePipe
  ) {}

  ngOnInit(): void {
    this.Init();
  }
  ngOnDestroy(): void {
    this.DataTableTrigger_Product.unsubscribe();
  }
  ngAfterViewInit(): void {
    this.InitActionButtonDataTableProduct();
  }

  async Init() {
    await this.LoadDataTableProduct();
  }

  async LoadDataTableProduct() {
    this.DataTable_Product.order = [[1, 'asc']];
    this.DataTable_Product.columnDefs = [
      {
        targets: [0],
        orderable: false,
      },
      {
        targets: [3],
        orderable: false,
      },
    ];
    this.DataTable_Product.columns = [
      {
        title: 'Product Picture',
        data: 'product_picture',
        render: (data: any, type: any, full: any) => {
          const img: string = `<img class="img_product" crossorigin="anonymous" src="${environment.api_url.concat(
            '/',
            full.product_picture
          )}" />`;

          return img;
        },
      },
      {
        title: 'Product Name',
        data: 'product_name',
      },
      {
        title: 'Product Price',
        data: 'product_price',
      },
      {
        title: 'Product Description',
        data: 'product_description',
      },
      {
        title: 'Status',
        data: 'status',
        ngPipeInstance: this._TitleCasePipe,
      },
      {
        title: 'Actions',
        data: 'actions',

        render: (data: any, type: any, full: any) => {
          const actions: string = `
            <button id="button_edit_${full._id}" class="btn btn-sm btn-primary button_action" data-id="${full._id}" data-action="edit">Edit</button>
            <button id="button_delete_${full._id}" class="btn btn-sm btn-danger button_action" data-id="${full._id}" data-action="delete">Delete</button>
          `;
          return actions;
        },
      },
    ];
    this.DataTable_Product.ajax = async (
      dataTablesParameters: any,
      callback: Function
    ): Promise<any> => {
      console.log('dataTablesParameters -----', dataTablesParameters);

      const page_no: number =
        dataTablesParameters.start / dataTablesParameters.length + 1;

      let sort_by = null;
      let sort_type = dataTablesParameters.order[0].dir;
      if (this.DataTable_Product.columns) {
        sort_by =
          this.DataTable_Product.columns[dataTablesParameters.order[0].column]
            .data;
      }

      const Data: I_ApiResponse = await this._ProductService.findAll({
        limit: dataTablesParameters.length,
        page_no: page_no,
        sort_by: sort_by,
        sort_type: sort_type,
      });
      console.log('Data', Data);
      callback({
        data: Data.data?.records || [],
        recordsTotal: Data.data?.paging?.total_no_of_records || 0,
        recordsFiltered: Data.data?.paging?.total_no_of_records || 0,
      });
    };

    await this._FunctionService.sleep(500);
    await this.DataTableTrigger_Product.next(null);
  }

  InitActionButtonDataTableProduct() {
    console.log('InitActionButtonDataTableProduct -----');

    this._Renderer2.listen(
      this._Renderer2.selectRootElement('table'),
      'click',
      (event) => {
        (async () => {
          let SelectedButtonElement: HTMLButtonElement | null = null;
          if ((event.target as HTMLButtonElement).id) {
            SelectedButtonElement = this._HTMLElement.querySelector(
              'button.button_action#'.concat(
                (event.target as HTMLButtonElement).id
              )
            ) as HTMLButtonElement;
          }

          if (SelectedButtonElement) {
            console.log(SelectedButtonElement);
            console.log(SelectedButtonElement.dataset['id']);
            console.log(SelectedButtonElement.dataset['action']);

            const id = SelectedButtonElement.dataset['id'];
            const action = SelectedButtonElement.dataset['action'];

            if (action === 'edit') {
              this._Router.navigate(['/', 'panel', 'productaddedit', id]);
            } else if (action === 'delete') {
              await this.DataTableTrigger_Product.next(null);
            }
          }
        })();
      }
    );
  }
}
