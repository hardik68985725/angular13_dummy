import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, firstValueFrom } from 'rxjs';
import { timeout } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/services/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private ApiUrl: string = environment.api_url;

  constructor(
    private _Router: Router,
    private _HttpClient: HttpClient,
    private _AuthService: AuthService
  ) {}

  private GetHttpOptions() {
    const ReturnObject: any = {};
    ReturnObject.responseType = 'json';
    ReturnObject.headers = new HttpHeaders({
      Authorization: this._AuthService.GetToken(),
    });

    return ReturnObject;
  }

  private async PrepareResponse(
    p_HttpObservable: Observable<any>
  ): Promise<I_ApiResponse> {
    // let ApiResponse: I_ApiResponse | null = null;
    let ApiResponse: I_ApiResponse = {
      status: false,
      code: 400,
      messages: [],
      data: null,
    };
    try {
      // ApiResponse = await p_HttpObservable.pipe(timeout(1000 * 60 * 1)).toPromise();
      ApiResponse = await firstValueFrom(
        await p_HttpObservable.pipe(timeout(1000 * 60 * 1))
      );
    } catch (e: any) {
      ApiResponse = e.error;
    } finally {
      if (
        ApiResponse !== null &&
        ApiResponse.status === false &&
        ApiResponse.code === 401
      ) {
        this._AuthService.RemoveAuthData();
        this._Router.navigate(['/', 'signin']);
      }
      return ApiResponse;
    }
  }

  GetApiUrl(p_Url: string): string {
    return this.ApiUrl.concat(p_Url);
  }

  async Get(p_Url: string): Promise<I_ApiResponse | null> {
    return await this.PrepareResponse(
      this._HttpClient.get(
        this.ApiUrl.concat('/').concat(p_Url),
        this.GetHttpOptions()
      )
    );
  }

  async Post(p_Url: string, p_Data: any): Promise<I_ApiResponse> {
    return await this.PrepareResponse(
      this._HttpClient.post(
        this.ApiUrl.concat('/').concat(p_Url),
        p_Data,
        this.GetHttpOptions()
      )
    );
  }

  async Patch(p_Url: string, p_Data: any): Promise<I_ApiResponse> {
    return await this.PrepareResponse(
      this._HttpClient.patch(
        this.ApiUrl.concat('/').concat(p_Url),
        p_Data,
        this.GetHttpOptions()
      )
    );
  }

  async Delete(p_Url: string): Promise<I_ApiResponse | null> {
    return await this.PrepareResponse(
      this._HttpClient.delete(
        this.ApiUrl.concat('/').concat(p_Url),
        this.GetHttpOptions()
      )
    );
  }
}

export interface I_ApiResponse {
  status: boolean;
  code: number;
  // message: string | null,
  messages: Array<string>;
  data: any;
}
