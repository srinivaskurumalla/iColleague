import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostQueryComponent } from './components/post-query/post-query.component';
import { SearchComponent } from './components/search/search.component';

const routes: Routes = [
  {path:'',component:SearchComponent,pathMatch:'full'},
  {path:'post',component:PostQueryComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
