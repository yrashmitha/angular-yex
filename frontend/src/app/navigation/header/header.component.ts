import { Component, OnInit } from '@angular/core';
import {LoginComponent} from "../../login/login.component";
import {AuthService} from "../../services/auth.service";
import { NgxSpinnerService } from "ngx-spinner";
import {PaperService} from "../../services/paper.service";
import {NgProgress} from "ngx-progressbar";
import {Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {AlertService} from "ngx-alerts";
import {Shared} from "../../shared/Shared";
// import {AlertService} from "ngx-alerts";


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

 // opened=false;
  loggedIn=false;
  staticImagePath=Shared.backendStorageLink;
  path;

  constructor(public dialog:MatDialog,
              private auth:AuthService,
              private paperService:PaperService,
              private spinner: NgxSpinnerService,
              private router:Router,
              private alertService: AlertService
             ) { }

  ngOnInit() {
    this.paperService.spinner.subscribe(res=>{
      if (res==true){
        this.spinner.show();
      }
      else {
        this.spinner.hide();
      }
    });
    this.auth.IsLogged.subscribe(res=>{
      this.loggedIn=res;
    });
    this.auth.getAvatar.subscribe(res=>{
      let got=res;
      if (got.startsWith('avatars')){
        this.path=this.staticImagePath+got;
      }
      else {
        this.path=got;
      }
    });
  }



  openLogin(){
    this.dialog.open(LoginComponent,{
      width:'500px'
    });

  }

  logOut(){
    this.auth.logOut().subscribe(res=>{
      this.auth.deleteLocalStorage();
      this.auth.setUserState(false);
      this.alertService.success(res.message);
      this.router.navigate(['/'],{
        queryParams:{
          logged:'out'
        }
      })

    },err=>{
      this.alertService.danger('Error Occurred!');

    })
  }

  check(){
    alert(this.loggedIn)
  }




}
