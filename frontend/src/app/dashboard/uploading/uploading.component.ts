import { Component, OnInit } from '@angular/core';
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {FormGroup} from "@angular/forms";
import {PaperService} from "../../services/paper.service";
import {AuthService} from "../../services/auth.service";
import {MatChipInputEvent} from "@angular/material/chips";
import {AlertService} from "ngx-alerts";
// import {AlertService} from "ngx-alerts";


export interface Tags {
  tag: string;
}

@Component({
  selector: 'app-uploading',
  templateUrl: './uploading.component.html',
  styleUrls: ['./uploading.component.css']
})
export class UploadingComponent implements OnInit {

  uploadForm:FormGroup;

  finalPath:string;
  path:string;
  title:string;
  description:string;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  tags: Tags[] = [];

  files: File[] = [];
  fileString:string[]=[];


  constructor(private uploadService:PaperService,
              private auth:AuthService,
              private alertService: AlertService) { }

  ngOnInit() {
  }


  onSelect(event) {
    this.files.push(...event.addedFiles);
  }



  private async readFile(file: File): Promise<string | ArrayBuffer> {
    return new Promise<string | ArrayBuffer>((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = e => {
        return resolve((e.target as FileReader).result);
      };

      reader.onerror = e => {
        console.error(`FileReader failed on file ${file.name}.`);
        return reject(null);
      };

      if (!file) {
        console.error('No file to read.');
        return reject(null);
      }

      reader.readAsDataURL(file);
    });
  }

  onRemove(event) {
    this.files.splice(this.files.indexOf(event), 1);
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.tags.push({tag: value.trim()});
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(fruit: Tags): void {
    const index = this.tags.indexOf(fruit);

    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

  onSubmit(){
    this.uploadService.setSpinner(true);
    let formdata=new FormData();
    for (let i=0;i<this.files.length;i++){
      formdata.append('file'+i,this.files[i],this.files[i].name);
    }

    formdata.append('title',this.title);
    formdata.append('description',this.description);
    formdata.append('tags',JSON.stringify(this.tags));
    formdata.append('user_id',this.auth.getUser().id);
    this.uploadService.upload(formdata)
      .subscribe(res=>{
        if (res.msg){
          this.title=null;
          this.description=null;
          for (let i=this.tags.length ; i>=0 ;i--){
            this.tags.pop();
          }
          for (let i=this.files.length ; i>=0 ;i--){
            this.files.pop();
          }
        }
        this.uploadService.setSpinner(false);
        this.alertService.info(res.msg)
      },err=>{
        this.title=null;
        this.description=null;
        for (let i=this.tags.length ; i>=0 ;i--){
          this.tags.pop();
        }
        for (let i=this.files.length ; i>=0 ;i--){
          this.files.pop();
        }
        this.uploadService.setSpinner(false);
        this.alertService.danger(err.msg)
      });
  }
}


