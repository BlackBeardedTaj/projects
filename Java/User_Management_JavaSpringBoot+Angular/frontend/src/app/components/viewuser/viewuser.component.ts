import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from 'src/app/app.service';
import { User } from 'src/app/User';

@Component({
  selector: 'app-viewusers',
  templateUrl: './viewuser.component.html',
  styleUrls: ['./viewuser.component.css']
})
export class ViewuserComponent implements OnInit {

users: any[] | undefined
  url: string = "http://localhost:8081/";

  constructor(private service: AppService, private router: Router) {}

  ngOnInit(): void {
    this.service.getUsers().subscribe(data => {
      this.users = data;
    })
  }

  deleteUser(id: number){
    this.service.deleteUser(id).subscribe(data => {
      this.users = this.users?.filter(user => user.id !== id);
    })
    
      setTimeout(()=>{
        window.location.reload();
      }, 100);
  }

  updateUser(id: number){
    this.router.navigate(['update', id]);
  }
}