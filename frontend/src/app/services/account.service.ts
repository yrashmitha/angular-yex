import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Shared} from "../shared/Shared";

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  URL = Shared.backendApi;

  constructor(private http:HttpClient) { }

  uploadAvatar(formdata):Observable<any>{
    return this.http.post(this.URL+'updateavatar',formdata);
  }

  getAvatar(id):Observable<any>{
    return this.http.get(this.URL+'avatar/'+id);
  }

  removeAvatar(id):Observable<any>{
    return this.http.get(this.URL+'removeavatar/'+id);
  }

  updateDetails(formdata:FormData):Observable<any>{
    return this.http.post(this.URL+'detailsupdate',formdata);
  }
}
