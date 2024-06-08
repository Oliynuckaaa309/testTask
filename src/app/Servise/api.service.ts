import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'https://api.spaceflightnewsapi.net/v4/articles';

  constructor(private http: HttpClient) {}
  getArticles(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
  getOneArticle(id:any):Observable<any>{
    return this.http.get<any>(this.apiUrl+'/'+id)
  }
  getArticleByTitle(value:string){
    return this.http.get<any>(this.apiUrl+'/?title_contains_all='+value)
  }
  getArticleBySummary(value:string){
    return this.http.get<any>(this.apiUrl+'/?summary_contains_all='+value)
  }
  getArticlesPageByTitle(title:string, offset: number, limit: number){
    return this.http.get<any>(this.apiUrl+'/?title_contains_all='+title+'&offset='+offset+'&limit='+limit)
  }
  getArticlesPageBySummary(title:string, offset: number, limit: number){
    return this.http.get<any>(this.apiUrl+'/?summary_contains_all='+title+'&offset='+offset+'&limit='+limit)
  }
}
