import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "../services/auth.service";
import {AlertService} from "ngx-alerts";
import {Shared} from "../shared/Shared";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MatDialogRef} from "@angular/material/dialog";


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {


  loginForm:FormGroup;
  email:string;
  password:string;
  mypath;
  close=false;

  hide = true;
  constructor(private router:Router,
              private auth:AuthService,
              private alertService:AlertService,
              public dialogRef: MatDialogRef<LoginComponent>,
) { }

  ngOnInit() {
    this.loginForm=new FormGroup({
      email:new FormControl(null,[Validators.required,Validators.email]),
      password:new FormControl(null,[Validators.required])
    })
  }

  onLogin(){
    this.auth.login(this.loginForm.value.email,this.loginForm.value.password).subscribe(res=>{
      if (!res.token) {
        this.alertService.danger(res.msg);

      }
      if (res.token){
        this.auth.setUserState(true);
        localStorage.setItem('auth',res.token);
        localStorage.setItem('user',JSON.stringify(res.user));
        this.alertService.success('Logged in successfully.');
        if (!res.path){
          this.mypath='/assets/images/user.png';
          localStorage.setItem('path','/assets/images/user.png');

        }
        else {
          this.mypath=Shared.backendStorageLink+res.path;
          localStorage.setItem('path',res.path);
        }
        this.auth.setAvatarState(this.mypath);
        this.router.navigate(['dashboard']);
      }


    },err=>{
      this.alertService.danger('Some error occurred!')
    });
  }

  keyup(event){
    if (event.key=='Enter' && !this.loginForm.invalid) {
      this.dialogRef.close()  ;
      this.onLogin();
    }
  }

}
