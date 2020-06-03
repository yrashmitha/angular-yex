import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import {AuthService} from "./auth.service";
import {NgProgressRef} from "ngx-progressbar";
import {Shared} from "../shared/Shared";

@Injectable({
  providedIn: 'root'
})
export class PaperService {


  progressRef: NgProgressRef;

  // URL = 'https://angular.csupweb.com/api/';
  URL = Shared.backendApi;

  public spin=new BehaviorSubject(false);
  spinner=this.spin.asObservable();

  public updated=new BehaviorSubject(false);
  updateCast=this.updated.asObservable();

  constructor(private http:HttpClient,private auth:AuthService) { }


  upload(formdata:FormData):Observable<any>{
    return this.http.post(this.URL+'upload',formdata);
  }

  getuserPapers():Observable<any>{
    return this.http.get(this.URL+'getpepers/'+this.auth.getUser().id);
  }

  getTags(id):Observable<any>{
    return this.http.get(this.URL + 'gettags/'+id)
  }

  update(formdata:FormData):Observable<any>{

    return this.http.post(this.URL+'updatepaper',formdata);
  }

  deletePaper(id):Observable<any>{
    return this.http.delete(this.URL + id);
  }

  deletePage(id):Observable<any>{
    return this.http.delete(this.URL+'page/'+ id);
  }

  getResults(key):Observable<any>{
    return this.http.post(this.URL+'results',{
      key:key
    });
  }

  turnOffline(id):Observable<any>{
    return this.http.get(this.URL+'offline/'+id);
  }
  turnOnline(id):Observable<any>{
    return this.http.get(this.URL+'online/'+id);
  }

  setUpdatedState(state){
    this.updated.next(state);
  }

  setSpinner(state){
    this.spin.next(state);
  }


  startLoading() {
    this.progressRef.start();
  }

  completeLoading() {
    this.progressRef.complete();
  }

}
