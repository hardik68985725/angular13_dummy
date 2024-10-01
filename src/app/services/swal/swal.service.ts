import { Injectable } from '@angular/core';

// import { SweetAlert2LoaderService } from '@sweetalert2/ngx-sweetalert2';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class SwalService {
  Swal: any = Swal;

  constructor() // private readonly _SweetAlert2LoaderService: SweetAlert2LoaderService,
  {}

  async toast(p_Type: string, p_Message: string, p_Timer: number = 5000) {
    // const Swal: any = await this._SweetAlert2LoaderService.swal;
    this.Swal.fire({
      toast: true,
      icon: p_Type,
      title: p_Message,
      timer: p_Timer,
      // position: 'top-right',
      position: 'bottom',
      showCancelButton: false,
      showConfirmButton: false,
    });
  }

  async confirm(
    p_Message: string,
    p_Type: string = 'warning',
    p_Title: string = 'Are you sure?'
  ) {
    return await this.Swal.fire({
      text: p_Message,
      icon: p_Type,
      title: p_Title,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#D33',
      confirmButtonText: 'Yes',
    });
  }
}
