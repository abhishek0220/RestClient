import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }
  getReq(uri:string) {
    return this.http.get(`${uri}`);
  }
  postReq(uri, data, header) {
    return this.http.post(uri, data, {headers : header});
  }
}
