import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  key;
  error;
  constructor(private router:Router) { }

  ngOnInit(): void {
  }

  onSubmit(){
    this.router.navigate(['results'],{
      queryParams:{
        key:this.key.trim()
      }
    })
  }

  checkKey(event){
    if (event.code =='Quote'){
      this.key="";
      this.error="mmh! This key not allowed!"
    }
  }

}
