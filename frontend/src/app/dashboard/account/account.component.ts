import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {AccountService} from "../../services/account.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {ThemePalette} from "@angular/material/core";
import {AlertService} from "ngx-alerts";
import {Shared} from "../../shared/Shared";

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  detailsUpdateForm:FormGroup;
  passwordUpdateForm:FormGroup

  color: ThemePalette = 'primary';

  value = 0;
  bufferValue = 75;
  name;
  email;
  upload=false;
  selectedFile;
  avatar:string;
  error;
  hide=true;
  staticUrl=Shared.backendStorageLink;


  constructor(private auth:AuthService,
              private accountService:AccountService,
              private router:Router,
              private alertService: AlertService) { }

  ngOnInit() {
    this.getDetaisl();
    this.detailsUpdateForm=new FormGroup({
      name:new FormControl(this.auth.getUser().name,[Validators.required,Validators.minLength(5)]),
      email:new FormControl(this.auth.getUser().email,[Validators.required,Validators.email]),
    });
    this.passwordUpdateForm=new FormGroup({
      c_password:new FormControl(null,[Validators.required]),
      n_password:new FormControl(null,[Validators.required])
    });

    navigator.geolocation.getCurrentPosition(res=>{
    })
  }

  getDetaisl(){
    let user=this.auth.getUser();
    this.accountService.getAvatar(user.id).subscribe(res=>{
      if (res!=null){
        this.avatar=this.staticUrl+res.path;
      }
      else{
        this.avatar='/assets/images/user.png';
      }
    });
    this.name=user.name;
    this.email=user.name;
  }

  onChange(event){
    this.selectedFile=event.target.files[0];
  }

  onUpload(){
    let formdata=new FormData();
    formdata.append('avatar',this.selectedFile);
    formdata.append('user_id',this.auth.getUser().id);
    this.accountService.uploadAvatar(formdata).subscribe(res=>{
      this.upload=false;
      this.alertService.success('Profile photo updated!');
      this.auth.setAvatarState(this.staticUrl+res.avatar.path);

      this.getDetaisl();
    },err=>{
      this.alertService.danger('Some error occurred!')

    });

  }

  onClick(){
    this.upload=true;
  }

  onRemove(){
    let user_id=this.auth.getUser().id;
    this.accountService.removeAvatar(user_id).subscribe(res=>{
      this.getDetaisl();
      this.alertService.success('Profile photo removed!');
      let mypath='/assets/images/user.png';
      this.auth.setAvatarState(mypath);
    });

  }


  onSubmit(){
    let formdata=new FormData();
    formdata.append('email',this.detailsUpdateForm.get('email').value);
    formdata.append('name',this.detailsUpdateForm.get('name').value);
    formdata.append('user_id',this.auth.getUser().id);

    this.accountService.updateDetails(formdata).subscribe(res=>{
      this.auth.logOut().subscribe(res=>{
        this.auth.deleteLocalStorage();
        this.auth.setUserState(false);
      });
      this.router.navigate(['/'],{
        queryParams:{
          logged:'ud'
        }
      })

    })
  }


  onPasswordChange(){
    let formdata=new FormData();
    formdata.append('c_password',this.passwordUpdateForm.get('c_password').value);
    formdata.append('n_password',this.passwordUpdateForm.get('n_password').value);
    formdata.append('user_id',this.auth.getUser().id);
    this.auth.changePass(formdata).subscribe(res=>{
      if (res.message){
        this.auth.logOut().subscribe(res=>{
          this.auth.deleteLocalStorage();
          this.auth.setUserState(false);
        });

        this.router.navigate(['/'],{
          queryParams:{
            logged:'pc'
          }
        })
      }

      else{
      }
    })
  }
}
