import { DOCUMENT, TitleCasePipe } from '@angular/common';
import {
  AfterViewInit,
  Component,
  Inject,
  OnDestroy,
  OnInit,
  Renderer2,
} from '@angular/core';
import { Router } from '@angular/router';
import { ADTSettings } from 'angular-datatables/src/models/settings';
import { Subject } from 'rxjs';
import { I_ApiResponse } from 'src/app/services/api/api.service';
import { FunctionService } from 'src/app/services/function/function.service';
import { UserService } from './user.service';
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit, AfterViewInit, OnDestroy {
  IsLoading: boolean = false;

  user_roles: Array<{ value: string; text: string }> =
    this._FunctionService.get_user_roles();

  // DataTable_User: DataTables.Settings = {
  DataTable_User: ADTSettings =
    this._FunctionService.get_datatable_default_settings();
  DataTableTrigger_User: Subject<any> = new Subject();

  constructor(
    @Inject(DOCUMENT) private _HTMLElement: HTMLElement,
    private _Renderer2: Renderer2,
    private _Router: Router,
    private _TitleCasePipe: TitleCasePipe,
    private _FunctionService: FunctionService,
    private _UserService: UserService
  ) {}
  ngOnInit(): void {
    this.Init();
  }
  ngOnDestroy(): void {
    this.DataTableTrigger_User.unsubscribe();
  }
  ngAfterViewInit(): void {
    this.InitActionButtonDataTableUser();
  }

  async Init() {
    await this.LoadDataTableUser();
  }

  async LoadDataTableUser() {
    this.DataTable_User.columnDefs = [];
    this.DataTable_User.columns = [
      {
        title: 'Email',
        data: 'email',
      },
      {
        title: 'Full Name',
        data: 'full_name',
        render: (data: any, type: any, full: any) => {
          return `${full.profile?.first_name || ''} ${
            full.profile?.last_name || ''
          }`;
        },
      },
      {
        title: 'Role',
        data: 'role',
        render: (data: any, type: any, full: any) => {
          return this.user_roles.filter((v) => v.value === full.role)[0].text;
        },
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
          const change_status_to: string =
            full.status === 'active' ? 'inactive' : 'active';
          const status_button_text: string = `Make ${
            full.status === 'active' ? 'Inactive' : 'Active'
          }`;

          // <button id="button_edit_${full._id}" class="btn btn-sm btn-primary button_action" data-id="${full._id}" data-action="edit">Edit</button>
          // <button id="button_delete_${full._id}" class="btn btn-sm btn-danger button_action" data-id="${full._id}" data-action="delete">Delete</button>
          const actions: string = `
            <button id="button_change_status_${full._id}" class="btn btn-sm btn-warning button_action" data-id="${full._id}" data-action="change_status" data-change_status_to="${change_status_to}">${status_button_text}</button>
          `;
          return actions;
        },
      },
    ];
    this.DataTable_User.ajax = async (
      dataTablesParameters: any,
      callback: Function
    ): Promise<any> => {
      console.log('dataTablesParameters -----', dataTablesParameters);

      const page_no: number =
        dataTablesParameters.start / dataTablesParameters.length + 1;

      let sort_by = null;
      let sort_type = dataTablesParameters.order[0].dir;
      if (this.DataTable_User.columns) {
        sort_by =
          this.DataTable_User.columns[dataTablesParameters.order[0].column]
            .data;
      }

      const Data: I_ApiResponse = await this._UserService.findAll({
        fields: '_id email role status profile.first_name profile.last_name',
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
    await this.DataTableTrigger_User.next(null);
  }

  InitActionButtonDataTableUser() {
    console.log('InitActionButtonDataTableUser -----');

    this._Renderer2.listen(
      this._Renderer2.selectRootElement('table'),
      'click',
      (event) => {
        // this._Renderer2.listen('document', 'click', (event) => {
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

            if (0 && action === 'change_status') {
              const change_status_to =
                SelectedButtonElement.dataset['change_status_to'];
              console.log(id);
              console.log(change_status_to);

              await this._UserService.change_status({
                id: id,
                status: change_status_to,
              });
              await this.DataTableTrigger_User.next(null);
            }
          }
        })();
      }
    );
  }
}
