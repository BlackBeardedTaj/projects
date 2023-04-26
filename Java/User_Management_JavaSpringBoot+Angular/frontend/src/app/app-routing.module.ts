import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewuserComponent } from './components/viewuser/viewuser.component';
import { AdduserComponent } from './components/adduser/adduser.component';
import { UpdateuserComponent } from './components/updateuser/updateuser.component';

const routes: Routes = [
  { path: '', component: ViewuserComponent},
  { path: 'add', component: AdduserComponent },
  { path: 'update/:id', component: UpdateuserComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
