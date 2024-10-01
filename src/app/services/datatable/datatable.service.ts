import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';

import { SwalService } from 'src/app/services/swal/swal.service';

import { ApiService, I_ApiResponse } from 'src/app/services/api/api.service';
import { AuthService, I_AuthData } from 'src/app/services/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class DatatableService {
  reqParam: any = null;
  selectedRow: any = [];
  recordsTotal = 0;
  currentUser: I_AuthData = this._AuthService.GetAuthData();
  token: string = 'Bearer '.concat(this.currentUser.token);

  constructor(
    private _Router: Router,
    private _SwalService: SwalService,
    private _ApiService: ApiService,
    private _AuthService: AuthService
  ) {}

  /**
   * Method for Date-Format
   * @param tableId tableId
   * @param url url
   * @param postArray postarray
   */
  commonDataTableReload(tableId: any, url: any, postArray: any) {
    this.reqParam = postArray;
    const tableElem: any = $('#' + tableId).DataTable();
    tableElem.ajax.url(this._ApiService.GetApiUrl('/'.concat(url))).load();
    // tableElem.draw();
  }

  /**
   * Main Function to create dataTable
   * @param tableId tableID
   * @param url url
   * @param pagingType pagingType
   * @param columns columns
   * @param pageLength pageLength
   * @param serverSide serverSide
   * @param processing processing
   * @param topDom topDom
   * @param bottomDom bottomDom
   * @param checkboxCol checkboxCol
   * @param defaultOrderBy defaultOrderBy
   * @param actionCol actionCol
   * @param reqParam reqParam
   * @param tableActions tableActions
   * @param actionColumn actionColum
   * @param dateCols dateCols
   * @param isRedirect isRedirect
   */
  commonDataTable(
    tableId: any,
    url: string,
    pagingType: any,
    columns: any,
    pageLength: number,
    serverSide: boolean,
    processing: boolean,
    topDom: string,
    bottomDom: string,
    checkboxCol: number | undefined,
    defaultOrderBy: any,
    actionCol: string,
    reqParam: any,
    tableActions: any,
    actionColumn: any,
    dateCols: any = null,
    isRedirect: any = null,
    amountColumn: any = null,
    statusColumn: any = null,
    readMoreColumn: any = null,
    countsColumn: any = null,
    hyperLinkColumn: any = null
  ) {
    const self: any = this;
    self.reqParam = reqParam;
    const token: any = this.token;
    const that: any = this;
    const finalDom: any =
      '<"top"' + topDom + '<"clear">>' + bottomDom + '<"bottom"<"clear">>';
    const tableElem: any = $('#' + tableId).DataTable({
      language: {
        emptyTable: 'No matches found',
        searchPlaceholder: 'Search',
        search: "<i class='fa fa-search'></i>",
        paginate: {
          first: '',
          last: '',
          next: '&#8594;', // or '→'
          previous: '&#8592;', // or '←'
        },
      },
      pagingType: 'simple_numbers',
      processing: false, //processing,
      serverSide: serverSide,
      pageLength: pageLength,
      ordering: false,
      createdRow: function (row: any, data: any, dataIndex: any) {
        if (data['sale_type'] === 2) {
          $(row).addClass('updatedRow');
        } else {
          $(row).addClass('cancelRow');
        }
      },
      //show+entries fields starts here.
      lengthMenu: [
        [5, 10, 25, 50, 100],
        [5, 10, 25, 50, 100],
      ],
      columnDefs: [
        {
          targets: actionColumn,
          searchable: false,
          orderable: false,
          className: 'select-checkbox',
          render: function (data: any, type: any, full: any, meta: any) {
            var str = '';
            for (var i = 0; i < tableActions.length; i++) {
              if (tableActions[i]['showAction'] !== 'F') {
                if (
                  tableId == 'admins-list' ||
                  tableId == 'category-list' ||
                  tableId == 'product-list'
                ) {
                  if (full.is_active == 0 && tableActions[i].name == 'active') {
                    str =
                      str +
                      '<button class="extra-class ' +
                      tableActions[i]['class'] +
                      '" title="' +
                      tableActions[i]['title'] +
                      '"data-toggle="tooltip"><img src="assets/img/icons/common/' +
                      tableActions[i]['img'] +
                      '" href="' +
                      tableId +
                      '" name="' +
                      tableActions[i]['name'] +
                      '" data-id = "' +
                      data +
                      '" /></button>';
                  } else if (
                    full.is_active == 1 &&
                    tableActions[i].name == 'inactive'
                  ) {
                    str =
                      str +
                      '<button class="extra-class ' +
                      tableActions[i]['class'] +
                      '" title="' +
                      tableActions[i]['title'] +
                      '"data-toggle="tooltip"><img src="assets/img/icons/common/' +
                      tableActions[i]['img'] +
                      '" href="' +
                      tableId +
                      '" name="' +
                      tableActions[i]['name'] +
                      '" data-id = "' +
                      data +
                      '" /></button>';
                  } else if (
                    tableActions[i].name == 'view' ||
                    tableActions[i].name == 'edit' ||
                    tableActions[i].name == 'accept' ||
                    tableActions[i].name == 'decline' ||
                    tableActions[i].name == 'delete'
                  ) {
                    str =
                      str +
                      '<button class="extra-class ' +
                      tableActions[i]['class'] +
                      '" title="' +
                      tableActions[i]['title'] +
                      '"data-toggle="tooltip"><img src="assets/img/icons/common/' +
                      tableActions[i]['img'] +
                      '" href="' +
                      tableId +
                      '" name="' +
                      tableActions[i]['name'] +
                      '" data-id = "' +
                      data +
                      '" /></button>';
                  }
                } else if (tableId == 'order-list') {
                  str =
                    str +
                    '<button class="extra-class ' +
                    tableActions[i]['class'] +
                    '" title="' +
                    tableActions[i]['title'] +
                    '"data-toggle="tooltip"><img src="assets/img/icons/common/' +
                    tableActions[i]['img'] +
                    '" href="' +
                    tableId +
                    '" name="' +
                    tableActions[i]['name'] +
                    '" data-id = "' +
                    data +
                    '" /></button>';
                } else if (tableId == 'user-list') {
                  if (tableActions[i]['name'] === 'delete') {
                    str =
                      str +
                      '<button class="extra-class ' +
                      tableActions[i]['class'] +
                      '" title="' +
                      tableActions[i]['title'] +
                      '"data-toggle="tooltip"><img src="assets/img/icons/common/' +
                      tableActions[i]['img'] +
                      '" href="' +
                      tableId +
                      '" name="' +
                      tableActions[i]['name'] +
                      '" data-id="' +
                      data +
                      '" /></button>';
                  } else if (
                    tableActions[i]['name'] === 'btn_outgoing_order' ||
                    tableActions[i]['name'] === 'btn_incoming_order'
                  ) {
                    str =
                      str +
                      '<button type="button" class="' +
                      tableActions[i]['class'] +
                      '" title="' +
                      tableActions[i]['title'] +
                      '"data-toggle="tooltip" name="' +
                      tableActions[i]['name'] +
                      '" data-id="' +
                      data +
                      '" data-type="' +
                      tableActions[i]['type'] +
                      '">' +
                      tableActions[i]['text'] +
                      '</button>';
                  }
                }
              }
            }
            return str;
          },
        },
        {
          targets: amountColumn,
          searchable: false,
          orderable: true,
          className: '',
          render: function (data: any, type: any, full: any, meta: any) {
            if (tableId === 'admins-list') {
              if (data) {
                return data.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                });
              }
              return 'N/A';
            } else {
              return data;
            }
          },
        },
        {
          targets: dateCols,
          searchable: false,
          orderable: true,
          className: '',
          render: function (
            data: any,
            type: any,
            full: any,
            meta: any
          ): string {
            if (tableId === 'user-list' || tableId === 'admins-list') {
              if (data) {
                return self.changeDateByMonthName(data);
              }
              return 'N/A';
            } else {
              return data;
            }
          },
        },
        {
          targets: statusColumn,
          searchable: false,
          orderable: true,
          className: '',
          render: function (data: any, type: any, full: any, meta: any) {
            /*if (
                tableId === 'product-list'
            ) {
              return `<button class="statusBtn active-btn${data} '" id="active-inactive"> ${data == false ? "Block" : "UnBlock"}</button>`;
            } {
              return (
                '<button class="statusBtn active-btn ' + data + '">' + data + "</button>"
              );
            }*/

            if (data === 1) {
              return 'Active';
            }
            if (data === 2) {
              return 'Approval is pending';
            }
            return 'Inactive';
          },
        },
        {
          targets: readMoreColumn,
          searchable: false,
          orderable: true,
          className: '',
          render: function (data: any, type: any, full: any, meta: any) {
            if (data && data.length >= 10) {
              return `${data.substring(
                0,
                10
              )}...<button class="readMoreBtn active-btn" id="active-inactive">read more </button>`;
            } else {
              return data;
            }
          },
        },
        {
          targets: checkboxCol,
          orderable: false,
          className: 'select-checkbox',
          render: function (data: any, type: any, full: any, meta: any) {
            if (data) {
              return (
                '<input type="checkbox" name="checkbox" value="' +
                $('<div/>').text(data).html() +
                '">'
              );
            } else {
              return 'N/A';
            }
          },
        },
        {
          targets: countsColumn,
          orderable: false,
          className: 'count-col',
          render: function (data: any, type: any, full: any, meta: any) {
            return data;
          },
        },
        {
          targets: hyperLinkColumn,
          orderable: false,
          className: '',
          render: function (data: any, type: any, full: any, meta: any) {
            if (data) {
              return `<a href=${data} target=_blank>${data}</a>`;
            }
            return '';
          },
        },
      ],
      order: defaultOrderBy,
      rowCallback: (row: Node, data: any[] | Object, index: number) => {
        $('td', row).unbind('click');
        $('td', row).bind('click', () => {
          const tableID: any = $(row).closest('table').attr('id');
          if (
            tableId === 'admins-list' ||
            tableId == 'category-list' ||
            tableId == 'product-list'
          ) {
            this.selectedRow = data;
          }
        });
        return row;
      },
      ajax: {
        url: this._ApiService.GetApiUrl('/'.concat(url)),
        contentType: 'application/json; charset=utf-8',
        type: 'POST',
        dataType: 'json',
        error: function (xhr, error, code) {
          if (xhr !== null && xhr.readyState === 4 && xhr.status === 401) {
            that._AuthService.RemoveAuthData();
            that._Router.navigate(['/', 'signin']);
          }
        },
        xhr: function () {
          $('#' + tableId + '_processing').show();
          const xhr: any = $.ajaxSettings.xhr;
          return xhr();
        },
        data: function (d: any) {
          for (var i = 0; i < self.reqParam.length; i++) {
            d[self.reqParam[i]['key']] = self.reqParam[i]['value'];
          }
          const b: any = {
            length: d['length'],
            search: d['search'],
            start: d['start'],
            type: d['type'],
            fields: d['fields'],
            extra_body: d['extra_body'],
          };
          return JSON.stringify(b);
        },
        dataSrc: function (json: any) {
          console.log(json);
          const tfoot: any = $('#' + tableId + ' tfoot tr');
          $('#' + tableId + ' thead').prepend(tfoot);
          if (json.code === 200) {
            that.recordsTotal = json.data.length;
            return json.data;
          } else if (json.code === 404) {
            return '';
          } else {
            return '';
          }
        },
        beforeSend: function (request: any) {
          request.setRequestHeader('Authorization', token);
          request.setRequestHeader('Content-Type', 'application/json');
        },
      },
      columns: columns,
    });
    $.fn.dataTable.ext.errMode = 'throw';
  }

  /**
   * Function to convert date string to Nov,15,2019 formate
   * @param dateString
   */
  changeDateByMonthName(dateTimeString: any) {
    if (dateTimeString) {
      dateTimeString = dateTimeString.split('T');
      dateTimeString = dateTimeString[0];
      const monthLabels: any = {
        1: 'January',
        2: 'February',
        3: 'March',
        4: 'April',
        5: 'May',
        6: 'June',
        7: 'July',
        8: 'August',
        9: 'September',
        10: 'October',
        11: 'Novmber',
        12: 'December',
      };
      const dateArr: any = dateTimeString.split('-');
      let day = dateArr[2];
      let month = monthLabels[parseInt(dateArr[1], 10)];
      const year: any = dateArr[0];
      if (day.length < 2) {
        day = '0' + day;
      }
      if (month.length < 2) {
        month = '0' + month;
      }
      if (day === 'NaN' || month === 'NaN' || year.toString() === 'NaN') {
        return '';
      } else {
        return month + ' ' + day + ', ' + year;
      }
    } else {
      return '';
    }
  }
}
