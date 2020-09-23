import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { UserService } from '../user.service';
import { User } from '../user';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent implements OnInit {

  public signupForm: FormGroup;
  userNameExists = false;
  existingUsers: any;
  userSubscription: Subscription;

  constructor(private fb: FormBuilder, private userService: UserService, private router: Router) {
  }
  ngOnInit() {
      this.signupForm = this.fb.group({
        userName: ['', [Validators.required]],
        firstName: ['', [Validators.required]],
        lastName: ['', [Validators.required]],
        contactNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
        emailId: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')]],
        address: ['', [Validators.required]]
    });
  }

  get signupFormFn(): any { return this.signupForm.controls; }
  // newUser(): void {
  //   this.submitted = false;
  // }

  // onSubmit() {
  //   this.userSubscription = this.userService.getUsers.subscribe(value => {
  //     this.userNameExists = value;
  //     console.log('****** his.userNameExists ', this.userNameExists);
  //     if (this.userNameExists) {
  //       this.save();
  //     }
  //   });
  // }

  onSubmit() {
    // this.userSubscription = this.userService.getUsers.subscribe(value => {
    //   this.userNameExists = true;
    //   console.log('***** subject ', value);
    // });
      // console.log('***** %%%%%', this.userService.checkUser(this.signupForm.value));
      this.userNameExists = this.userService.checkUser(this.signupForm.value);
    // this.userService.checkUser(this.signupForm.value).subscribe(data => {
    //   console.log('****** this.userNameExists ', this.userNameExists);
    // });
    // console.log('****** this.signupForm.value ', this.signupForm.value);
    // if (!this.userNameExists) {
     // console.log('****** this.userNameExists ', this.userNameExists);
      if (!this.userNameExists) {
        this.userService.createUser(this.signupForm.value)
        .subscribe(data =>
          {
            // console.log('****** create ', data);
            this.gotoList();
          },
          error => console.log(error));
      }
    // }
  }

  gotoList() {
    this.router.navigate(['/users']);
  }

  // ngOnDestroy() {
  //   this.userSubscription.unsubscribe();
  // }
}
