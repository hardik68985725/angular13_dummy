import { Injectable } from '@angular/core';
import { ApiService, I_ApiResponse } from 'src/app/services/api/api.service';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(private _ApiService: ApiService) {}

  async create(p_data: any) {
    return await this._ApiService.Post(`order`, p_data);
  }

  async findAll(p_data: any): Promise<I_ApiResponse> {
    return await this._ApiService.Post(`order/list`, p_data);
  }

  async findOne(_id: string): Promise<I_ApiResponse | null> {
    return await this._ApiService.Post(`order/${_id}`, null);
  }

  async update(p_id: string, p_data: any): Promise<I_ApiResponse> {
    return await this._ApiService.Patch(`order/${p_id}`, p_data);
  }

  async dispatch(p_id: string, p_data: any): Promise<I_ApiResponse> {
    return await this._ApiService.Post(`order/dispatch_order/${p_id}`, p_data);
  }
}
