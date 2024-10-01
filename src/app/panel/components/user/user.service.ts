import { Injectable } from '@angular/core';
import { ApiService, I_ApiResponse } from 'src/app/services/api/api.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private _ApiService: ApiService) {}

  async create(p_data: any): Promise<I_ApiResponse> {
    return await this._ApiService.Post(`user`, p_data);
  }

  async findOne(_id: string): Promise<I_ApiResponse | null> {
    return await this._ApiService.Post(`user/${_id}`, null);
  }

  async findAll(p_data: any): Promise<I_ApiResponse> {
    return await this._ApiService.Post(`user/list`, p_data);
  }

  async profile(): Promise<I_ApiResponse | null> {
    return await this._ApiService.Post(`user/profile`, null);
  }

  async save_profile(p_id: string, p_data: any): Promise<I_ApiResponse | null> {
    return await this._ApiService.Post(`user/profile/${p_id}`, p_data);
  }

  async get_user_of_role(p_data: string) {
    return await this._ApiService.Post(`user/get_user_of_role/${p_data}`, null);
  }

  async get_users_has_role(p_data: string) {
    return await this._ApiService.Post(
      `user/get_users_has_role/${p_data}`,
      null
    );
  }

  async change_status(p_data: any): Promise<I_ApiResponse> {
    return await this._ApiService.Post(`user/change_status`, p_data);
  }

  async gsud(): Promise<string | boolean> {
    const response: I_ApiResponse = await this._ApiService.Post(
      `user/gsud`,
      null
    );
    if (response && response.status) {
      return response.data.role;
    }
    return false;
  }
}
