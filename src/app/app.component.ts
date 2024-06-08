import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from './homePage/home/home.component';
import { LayoutComponent } from './layout/layout/layout.component';
import { ArticleDetailsComponent } from './articleDetails/article-details/article-details.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HomeComponent, LayoutComponent, ArticleDetailsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'testTask';
}
