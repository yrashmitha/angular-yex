import { Injectable } from '@angular/core';
import {AuthService} from "../services/auth.service";
import {CanActivate, Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class RouteGuardService implements CanActivate{

  constructor(private auth:AuthService,private router:Router) { }

  canActivate():boolean{
    if (this.auth.isLoggedInUser()){
      return true;
    }
    else {
      this.router.navigate(['/']);
      return false;
    }
  }


}
