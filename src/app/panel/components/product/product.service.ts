import { Injectable } from '@angular/core';
import { ApiService, I_ApiResponse } from 'src/app/services/api/api.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private _ApiService: ApiService) {}

  async create(p_data: any) {
    return await this._ApiService.Post(`product`, p_data);
  }

  async findAll(p_data: any): Promise<I_ApiResponse> {
    return await this._ApiService.Post(`product/list`, p_data);
  }

  async findOne(_id: string): Promise<I_ApiResponse | null> {
    return await this._ApiService.Post(`product/${_id}`, null);
  }

  async update(p_id: string, p_data: any): Promise<I_ApiResponse> {
    return await this._ApiService.Patch(`product/${p_id}`, p_data);
  }
}
