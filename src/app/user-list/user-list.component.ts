import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {map, startWith} from 'rxjs/operators';
import {combineLatest, Observable, of} from 'rxjs';
import {FormControl} from '@angular/forms';

import { UserService } from '../user.service';
import { User } from '../user';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  loading = false;
  p = 1;
  users$: Observable<User[]>;
  filteredUsers$: Observable<User[]>;
  filter: FormControl;
  filter$: Observable<string>;

  constructor(private userService: UserService, private router: Router) {
    this.filter = new FormControl('');
    this.filter$ = this.filter.valueChanges.pipe(startWith(''));
  }

  ngOnInit() {
    this.reloadData();
  }

  reloadData() {
    this.loading = true;
    this.userService.getUsersList()
    .subscribe(response => {
      console.log('******  response combine latest', response);
      this.users = response;

      this.users$ = of(response);
      this.filter = new FormControl('');
      this.filter$ = this.filter.valueChanges.pipe(startWith(''));
      this.filteredUsers$ = combineLatest(this.users$, this.filter$)
      .pipe(
        map(([result, filterString]) =>
        result.filter(data => data.userName.toLowerCase().indexOf(filterString.toLowerCase()) !== -1))
      );
      this.loading = false;
    });
  }

  deleteUser(id: number) {
    this.userService.deleteUser(id)
      .subscribe(
        data => {
          console.log('****** deleted' + data);
          const deletedIndex = this.users.findIndex(item => item.id === id );
          // this.filteredUsers$ = this.filteredUsers$.map(data => data.id !== id);
          // this.users.splice(deletedIndex, 1);
          // this.filteredUsers$.subscribe(resp => console.log('****** deleted', resp));
          // console.log('****** deleted ', this.filteredUsers$);
          this.filteredUsers$ = this.filteredUsers$.pipe(
            map((result) => result.filter(response => response.id !== id)));
          //  .subscribe((data: any) => console.log('****** subsc ', data));
          this.filteredUsers$.subscribe(resp => console.log('****** deleted after', resp));
        },
        error => console.log(error));
  }

  userDetails(id: number){
    this.router.navigate(['details', id]);
  }

  updateUser(id: number){
    this.router.navigate(['update', id]);
  }
}
