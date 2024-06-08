import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../Servise/api.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-article-details',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './article-details.component.html',
  styleUrl: './article-details.component.scss'
})
export class ArticleDetailsComponent implements OnInit {
  article:any;
  constructor(private apiServise:ApiService,
    private route: ActivatedRoute,
    private router:Router
  ){}
  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      const id = params['id'];
     this.apiServise.getOneArticle(id).subscribe(data=>{
      this.article=data;

     })
     
    });
  }
  goHome() {
    this.router.navigate(['/']);
  }

}
