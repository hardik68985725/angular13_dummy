import { Injectable } from '@angular/core';
import { ApiService, I_ApiResponse } from 'src/app/services/api/api.service';



@Injectable({
  providedIn: 'root'
})
export class MediaService {

  constructor(
    private _ApiService: ApiService,
  ) { }

  async upload(p_Data: any): Promise<I_ApiResponse | null> {
    return await this._ApiService.Post(`media/upload`, p_Data);
  }
}
