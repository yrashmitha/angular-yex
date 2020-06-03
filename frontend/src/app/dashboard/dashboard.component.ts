import { Component, OnInit } from '@angular/core';
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  opened=false;
  name;
  constructor(private auth:AuthService) { }

  ngOnInit() {
    this.name=this.auth.getUser().name;
  }

  check(){
   this.auth.IsLogged.subscribe(res=>{
      alert(res);
    })
  }
}
