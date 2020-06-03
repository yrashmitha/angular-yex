import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import {Shared} from "../shared/Shared";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // URL = 'https://angular.csupweb.com/api/';
  URL = Shared.backendApi;



  public logged =new BehaviorSubject(this.isLoggedInUser());
  IsLogged=this.logged.asObservable();

  public avatar =new BehaviorSubject('/assets/images/user.png');
  getAvatar=this.avatar.asObservable();

  constructor(private http:HttpClient) { }

  signUp(name,email,password):Observable<any>{
    return this.http.post(this.URL+'signup',{
      "name":name,
      "email":email,
      "password":password
    });
  }

  login(email,password):Observable<any>{
    return this.http.post(this.URL+'login',{
      email:email,
      password:password
    });
  }

  getToken(){
    return localStorage.getItem('auth');
  }

  isLoggedInUser(){
    return !!localStorage.getItem('auth');
  }

  getUser(){
    return JSON.parse(localStorage.getItem('user'))
  }

  setUserState(state){
    this.logged.next(state);
  }

  logOut():Observable<any>{
    return this.http.get(this.URL+'logout');
  }

  changePass(formdata:FormData):Observable<any>{
    return this.http.post(this.URL+'changepass',formdata);
  }

  deleteLocalStorage(){
    localStorage.clear();
  }

  setAvatarState(state){
    this.avatar.next(state)
  }

}
