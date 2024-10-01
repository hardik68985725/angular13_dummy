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
import {
  E_user_roles,
  FunctionService,
} from 'src/app/services/function/function.service';
import { environment } from 'src/environments/environment';
import { OrderService } from './order.service';
import { I_ApiResponse } from 'src/app/services/api/api.service';
import { DOCUMENT, TitleCasePipe, DatePipe } from '@angular/common';
import { ADTSettings } from 'angular-datatables/src/models/settings';
import { Subject } from 'rxjs';
import { GlobalvarService } from 'src/app/services/globalvar/globalvar.service';

export enum order_status {
  inprogress = 'inprogress',
  approved = 'approved',
  declined = 'declined',
  canceled = 'canceled',
  completed = 'completed',
}

export enum order_status_text {
  inprogress = 'In Progress',
  approved = 'Approved',
  declined = 'Declined',
  canceled = 'Canceled',
  completed = 'Completed',
}

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
})
export class OrderComponent implements OnInit, AfterViewInit, OnDestroy {
  IsLoading: boolean = false;
  DataTable_Order: ADTSettings =
    this._FunctionService.get_datatable_default_settings();
  DataTableTrigger_Order: Subject<any> = new Subject();

  E_user_roles = E_user_roles;
  SignedInUserRole: E_user_roles | null = null;

  constructor(
    @Inject(DOCUMENT) private _HTMLElement: HTMLElement,
    private _Renderer2: Renderer2,
    private _SwalService: SwalService,
    private _FunctionService: FunctionService,
    private _Router: Router,
    private _ActivatedRoute: ActivatedRoute,
    private _OrderService: OrderService,
    private _TitleCasePipe: TitleCasePipe,
    private _DatePipe: DatePipe,
    private _GlobalvarService: GlobalvarService
  ) {}

  ngOnInit(): void {
    this.Init();
  }
  ngOnDestroy(): void {
    this.DataTableTrigger_Order.unsubscribe();
  }
  ngAfterViewInit(): void {
    this.InitActionButtonDataTableOrder();
  }

  async Init() {
    this.SignedInUserRole = this._GlobalvarService.signedin_user_data.value
      .role as unknown as E_user_roles;
    await this.LoadDataTableOrder();
  }

  async LoadDataTableOrder() {
    this.DataTable_Order.order = [[1, 'desc']];
    this.DataTable_Order.columnDefs = [
      {
        targets: [0],
        orderable: false,
      },
      {
        targets: [2],
        orderable: false,
      },
      {
        targets: [4],
        orderable: false,
      },
    ];
    this.DataTable_Order.columns = [
      {
        title: 'Actions',
        data: 'actions',
        render: (data: any, type: any, full: any) => {
          /* const actions: string = `
          <button id="button_delete_${full._id}" class="btn btn-sm btn-danger button_action" data-id="${full._id}" data-action="delete">Delete</button>
          `; */
          let actions: string = ``;

          if (
            this.SignedInUserRole &&
            [E_user_roles.owner, E_user_roles.dealer].includes(
              this.SignedInUserRole
            )
          ) {
            actions = actions.concat(
              `<button id="button_edit_${full._id}" class="btn btn-sm btn-primary button_action" data-id="${full._id}" data-action="edit">Edit</button>`
            );
          }

          if (
            this.SignedInUserRole &&
            [E_user_roles.owner, E_user_roles.dispatcher].includes(
              this.SignedInUserRole
            )
          ) {
            actions = actions.concat(
              `<button id="button_dispatch_${
                full._id
              }" class="btn btn-sm btn-primary button_action" data-id="${
                full._id
              }" data-action="dispatch">Dispatch ${
                full.dispatch_details ? 'Edit' : ''
              }</button>`
            );
          }

          return actions;
        },
      },
      {
        title: 'Ordered At',
        data: '_created_at',
        // render: (_data) => this._DatePipe.transform(_data, 'dd-MM-yyyy hh:mm a'),
        ngPipeInstance: this._DatePipe,
        ngPipeArgs: ['dd-MM-yyyy hh:mm a'],
      },
      {
        title: 'Product Name',
        data: 'product.product_name',
      },
      {
        title: 'Quantity',
        data: 'quantity',
      },
      {
        title: 'Dealer',
        data: 'dealer',
        render: (_data) =>
          ''.concat(
            '(',
            _data?.email,
            ') ',
            _data?.profile?.first_name,
            ' ',
            _data?.profile?.last_name
          ),
      },

      {
        title: 'Status',
        data: 'status',
        // ngPipeInstance: this._TitleCasePipe,
        render: (_data) => (order_status_text as any)[_data],
      },
    ];
    this.DataTable_Order.ajax = async (
      dataTablesParameters: any,
      callback: Function
    ): Promise<any> => {
      console.log('dataTablesParameters -----', dataTablesParameters);

      const page_no: number =
        dataTablesParameters.start / dataTablesParameters.length + 1;

      let sort_by = null;
      let sort_type = dataTablesParameters.order[0].dir;
      if (this.DataTable_Order.columns) {
        sort_by =
          this.DataTable_Order.columns[dataTablesParameters.order[0].column]
            .data;
      }

      const Data: I_ApiResponse = await this._OrderService.findAll({
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
    await this.DataTableTrigger_Order.next(null);
  }

  InitActionButtonDataTableOrder() {
    console.log('InitActionButtonDataTableOrder -----');

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

            if (action === 'view') {
              console.log('view -----', id);
            } else if (action === 'edit') {
              this._Router.navigate(['/', 'panel', 'orderaddedit', id]);
            } else if (action === 'dispatch') {
              console.log('dispatch -----', id);
              this._Router.navigate(['/', 'panel', 'orderdispatch', id]);
            } else if (action === 'delete') {
              await this.DataTableTrigger_Order.next(null);
            }
          }
        })();
      }
    );
  }
}
