import {Component, Inject, OnInit} from '@angular/core';
import {UploadingComponent} from "../uploading/uploading.component";
import {PaperService} from "../../services/paper.service";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MatChipInputEvent} from "@angular/material/chips";

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.css']
})
export class UpdateComponent implements OnInit {
  title: string;
  description: string;
  paperId: number;
  status;
  tags = [];

  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  constructor(
    private paper: PaperService,
    public dialogRef: MatDialogRef<UploadingComponent>,
    @Inject(MAT_DIALOG_DATA) public data) {
  }

  ngOnInit() {
    this.title = this.data.paper.title;
    this.description = this.data.paper.description;
    this.paperId = this.data.paper.paper_id;
    this.tags = this.data.tags.data;
    this.status=String(this.data.paper.status);
  }


  getPaperTags(id) {
    this.paper.getTags(id).subscribe(res => {
      this.tags = res.data;
    });

  }


  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      this.tags.push({tag: value.trim()});
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(tag): void {
    const index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }


  onUpdate(data) {
    this.paper.setSpinner(true);
    let formData = new FormData();
    formData.append('paper_id', data.paper_id);
    formData.append('title', this.title);
    formData.append('description', this.description);
    formData.append('tags', JSON.stringify(this.tags));
    this.paper.update(formData).subscribe(res => {
      this.paper.setUpdatedState(true);
    })
  }

  onDelete(data) {
    this.paper.setSpinner(true);
    this.paper.deletePaper(data.paper_id).subscribe(res => {
      this.paper.setUpdatedState(true);
    })
  }

}
