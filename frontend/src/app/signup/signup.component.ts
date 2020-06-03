import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../services/auth.service";
import {Router} from "@angular/router";
import {AlertService} from "ngx-alerts";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  obj;
  hide = true;
  signUpForm:FormGroup;

  constructor(private auth:AuthService,
              private router:Router,
              private alertService: AlertService) { }

  ngOnInit() {
    this.signUpForm=new FormGroup({
      name:new FormControl(null,[Validators.required,Validators.minLength(5)]),
      email:new FormControl(null,[Validators.required,Validators.email]),
      password:new FormControl(null,[Validators.minLength(5),Validators.required])
    })


  }


  onSubmit(){
    this.auth.signUp(this.signUpForm.value.name,this.signUpForm.value.email,this.signUpForm.value.password)
      .subscribe(res=>{
        this.router.navigate(['/'],{
          queryParams:{
            up:'1'
          }
        })

      },);
    this.signUpForm.reset();
  }
}
