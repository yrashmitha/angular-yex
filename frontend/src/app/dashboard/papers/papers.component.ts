import { Component, OnInit } from '@angular/core';
import {PaperService} from "../../services/paper.service";
// import {MatDialog,MatDialogRef} from "@angular/material";
import {UpdateComponent} from "../update/update.component";
import {MatDialog} from "@angular/material/dialog";
import {AlertService} from "ngx-alerts";
import {Shared} from "../../shared/Shared";

@Component({
  selector: 'app-papers',
  templateUrl: './papers.component.html',
  styleUrls: ['./papers.component.css']
})
export class PapersComponent implements OnInit {

  papers=[];
  panelOpenState = false;

  staticImagePath=Shared.backendStorageLink;


  constructor(private paperService:PaperService,
              public dialog:MatDialog,
              private alertService: AlertService) { }

  ngOnInit() {
    this.paperService.updateCast.subscribe(res=>{
      if (res==true){
        this.getUserPapers();
        this.paperService.setUpdatedState(false);
      }
    });
    this.getUserPapers();
  }


   getUserPapers() {
    this.paperService.getuserPapers().subscribe(res => {
      this.papers = res.data;
      this.paperService.setSpinner(false);

    })
  }

  openDialogUpdate(paper){
    this.paperService.setSpinner(true);
    let tags=[];
    this.paperService.getTags(paper.paper_id).subscribe(res=>{
      this.paperService.setSpinner(false);
      tags=res;
      let dialogRef=this.dialog.open(UpdateComponent,{
        width:'800px',
        data:{
          'paper':paper,
          'tags':tags
        },
      });

      dialogRef.afterClosed().subscribe(res=>{
        }
      )
    });


  }

  onDelete(id){
    this.paperService.setSpinner(true);
    this.paperService.deletePage(id).subscribe(res=>{
      this.getUserPapers();
      this.alertService.success('Page Deleted!');
    },err=>{
      this.alertService.danger('Some Error Occurred!');

    })
  }

  turnOffline(id){
    this.paperService.turnOffline(id).subscribe(res=>{
      this.paperService.setUpdatedState(true);
      this.alertService.warning('Page Offline!');

    })
  }

  turnOnline(id){
    this.paperService.turnOnline(id).subscribe(res=>{
      this.paperService.setUpdatedState(true);
      this.alertService.warning('Page Online!');

    })
  }



}
