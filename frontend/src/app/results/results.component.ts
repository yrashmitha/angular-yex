import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {PaperService} from "../services/paper.service";
import {SearchComponent} from "../homepage/search/search.component";
import {Shared} from "../shared/Shared";

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {

  searchKey;
  err=null;
  resultsArray = [];
  staticImagePath = Shared.backendStorageLink;

  constructor(private route: ActivatedRoute,
              private paperService: PaperService,
              private router: Router
  ) {
  }

  ngOnInit(): void {

    this.searchKey = this.route.snapshot.queryParams['key'];
    this.paperService.getResults(this.searchKey).subscribe(res => {
      this.resultsArray = res;
      if (this.resultsArray.length<=0){
        this.err='No results'
      }
    })
  }

  onSubmit() {
    this.err=null;
    this.paperService.getResults(this.searchKey).subscribe(res => {
      this.resultsArray = res;
      if (this.resultsArray.length<=0){
        this.err='No results'
      }
    })

  }
}
