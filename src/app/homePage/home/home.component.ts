import { Component, OnInit } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ApiService } from '../../Servise/api.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { RouterModule } from '@angular/router';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { concatMap, debounceTime, distinctUntilChanged, switchMap, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { HighlightSearch } from '../../Servise/highlight-search.pipe';


@Component({
  providers: [HighlightSearch],
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, MatGridListModule, MatInputModule, MatPaginatorModule, MatFormFieldModule, MatCardModule, MatIconModule, MatButtonModule, CommonModule, HighlightSearch],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  articles: any[] = [];
  resultCount!: number
  searchSubject = new Subject<string>();
  destroy$ = new Subject<void>();

  pageEvent!: PageEvent;
  titleResultsNumber = 0;
  summaryResultsNumber = 0;
  pageSize = 10;

  searchTerm: string = '';
  searchPrompt: string = '';
  pagedArticles: any[] = [];
  constructor(private apiServise: ApiService, private highlight: HighlightSearch) { }
  ngOnInit(): void {
    this.apiServise.getArticles().subscribe(data => {
      this.articles = data.results;
      this.resultCount = data.count;
    })
    this.searchSubject.pipe(
      debounceTime(100),
      distinctUntilChanged(),
      switchMap(searchTerm => {
        this.searchTerm = searchTerm;
        this.searchPrompt = searchTerm.replaceAll(",", "").replaceAll(" ", ",");
     
        return this.apiServise.getArticleByTitle(this.searchPrompt);
      }),
      takeUntil(this.destroy$)
    ).subscribe(data => {
    
      this.resultCount = data.count;
      this.titleResultsNumber = data.count;
      this.apiServise.getArticleBySummary(this.searchPrompt).subscribe(summaryData => {
     
        this.resultCount += summaryData.count;
        this.summaryResultsNumber = summaryData.count;
        this.getArticles(0);
      });
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  searchArticles(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchSubject.next(input.value);
  }

  getServerData(event: PageEvent) {
    this.getArticles(event.pageIndex);
    return event
  }

  getArticles(pageIndex: number) {
    let lastResponseSize = 0;
    if (pageIndex < this.titleResultsNumber) {
      this.apiServise.getArticlesPageByTitle(this.searchPrompt, pageIndex * this.pageSize, this.pageSize).pipe(
        concatMap(data => {
          lastResponseSize = data.results.length;
          this.articles = data.results;

          if (lastResponseSize < this.pageSize) {
            return this.apiServise.getArticlesPageBySummary(this.searchPrompt, pageIndex * this.pageSize + lastResponseSize - this.titleResultsNumber, this.pageSize - lastResponseSize);
          } else {
            return [];
          }
        })
      ).subscribe(data => {
        if (data.results) {
          this.articles = this.articles.concat(data.results);
        }
      });
    }
    else {
      if (lastResponseSize < this.pageSize) {
        this.apiServise.getArticlesPageBySummary(this.searchPrompt, pageIndex * this.pageSize + lastResponseSize - this.titleResultsNumber, this.pageSize - lastResponseSize).subscribe(data => {
          this.articles = data.results;
        });
      }
    }
  }

}
