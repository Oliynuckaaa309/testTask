import { Routes } from '@angular/router';
import { HomeComponent } from './homePage/home/home.component';
import { ArticleDetailsComponent } from './articleDetails/article-details/article-details.component';

export const routes: Routes = [
    {path:'', component:HomeComponent},
    {path:'article/:id', component: ArticleDetailsComponent}
];
