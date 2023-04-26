import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from './User';


@Injectable({
  providedIn: 'root'
})
export class AppService {

  private url = "http://localhost:8081/";

  constructor(private http: HttpClient) { }

  // Add user - Create
  adduser(user: User){
    return this.http.post<User>(`${this.url}add`, user)
  }

  // Get users - Read
  getUsers(): Observable<any[]>{
    return this.http.get<any[]>(this.url+'users')
  }

  // Get user by id - Read
  getUserById(id: number): Observable<User>{
    return this.http.get<User>(`${this.url}user/${id}`)
  }

  // Update user
  updateUser(id?: number, user?: any): Observable<any>{
    return this.http.put<any>(`${this.url}update/${id}`, user)
  }

  // Delete user
  deleteUser(id: number): Observable<any>{
    return this.http.delete<any>(`${this.url}delete/${id}`)
  }
}


