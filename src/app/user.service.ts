import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = 'https://ng-crud-c9c4f.firebaseio.com/';
  public checkUsers = new Subject<boolean>();
  public existUsers = [];
  constructor(private http: HttpClient) { }

  getUser(id: number): Observable<any> {
    return this.http.get(this.baseUrl + '/posts/' + id + '.json');
  }

  checkUser(user: User): boolean {
    console.log('****** user ', user);
    console.log('****** this.existUsers ', this.existUsers);
    let userExists = false;
    for (const getUser of this.existUsers) {
      if (getUser.userName === user.userName) {
        console.log('TESTED SUCCESS');
        // this.getUsers.next(true);
        userExists = true;
        return userExists;
      }
    }
    return userExists;
  }

  createUser(user: User): Observable<Object> {
    // console.log('****** user ', user);
    // console.log('****** this.existUsers ', this.existUsers);
    // for (const getUser of this.existUsers) {
    //   if (getUser.userName === user.userName) {
    //     console.log('TESTED SUCCESS');
    //     this.getUsers.next(true);
    //     return;
    //   }
    // }
    return this.http.post(this.baseUrl + '/posts.json', user);
  }

  updateUser(id: number, value: any): Observable<Object> {
    return this.http.patch(this.baseUrl + '/posts/' + id + '.json', value);
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(this.baseUrl + '/posts/' + id + '.json', { responseType: 'text' });
  }

  getUsersList(): Observable<any> {
    return this.http.get(this.baseUrl + '/posts.json')
    .pipe(map(responseData => {
      console.log('****** TESTING 123');
      const postsArray: User[] = [];
      for (const key in responseData) {
        if (responseData.hasOwnProperty(key)) {
          postsArray.push({ ...responseData[key], id: key });
        }
      }
      this.existUsers = postsArray;
      // this.getUsers.next(postsArray);
      return postsArray;
    }));
  }
}
