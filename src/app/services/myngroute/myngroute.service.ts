import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class MyngrouteService {
  constructor(
    private _Router: Router,
    private _ActivatedRoute: ActivatedRoute,
  ) { }

  GetCurrentRoutePath() {
    const UrlTree: any = this._Router.parseUrl(this._Router.url);
    UrlTree.queryParams = {};
    UrlTree.fragment = null;
    return UrlTree.toString();
  }

  GetQueryParameters(p_Data: string = ''): any {
    let PageQueryParameters: any = {};
    this._ActivatedRoute.queryParamMap.subscribe((params: any) => {
      // PageQueryParameters = { ...params.keys, ...params };
      PageQueryParameters = params.params;
    });

    if (p_Data.toString().trim().length > 0) {
      return PageQueryParameters[p_Data.toString().trim()] || '';
    }

    return PageQueryParameters;
  }
}
