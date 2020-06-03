import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
  out=false;
  msg='';
  constructor(private router: ActivatedRoute) {
  }

  ngOnInit() {
    if (this.router.snapshot.queryParams['logged']){
      let para=this.router.snapshot.queryParams['logged'];
      if (para=='pc'){
        this.msg='Your password changed! Please log again.';
        this.out=true;
      }
      else if (para=='ud'){
        this.msg='Your details are changed! Please log again.';
        this.out=true;
      }
      else if (para=='out'){
        this.msg='You are logged out.';
        this.out=true;
      }
    }
    if (this.router.snapshot.queryParams['up']){
      let para=this.router.snapshot.queryParams['up'];
      if (para=='1'){
        this.msg='Sign up succeed. Please log in now.';
        this.out=true;
      }
    }
  }
}
