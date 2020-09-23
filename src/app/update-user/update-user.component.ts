import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { User } from '../user';
import { UserService } from '../user.service';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.css']
})
export class UpdateUserComponent implements OnInit {

  id: number;
  user: User;
  public updateForm: FormGroup;
  loading = false;
  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router, private userService: UserService) { }

  ngOnInit() {

    this.updateForm = this.fb.group({
      userName: [{ value: '', disabled: true }, [Validators.required]],
      // userName: ['', [Validators.required]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      contactNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      emailId: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')]],
      address: ['', [Validators.required]]
    });
    this.loading = true;
    this.id = this.route.snapshot.params['id'];
    this.userService.getUser(this.id)
      .subscribe(data => {
        console.log('****** data ', data);
        this.updateForm.patchValue(data);
        this.loading = false;
        console.log('****** this.updateForm ', this.updateForm);
      }, error => console.log(error));
  }

  get updateFormFn(): any { return this.updateForm.controls; }

  updateUser() {
    this.userService.updateUser(this.id, this.updateForm.value)
      .subscribe(data =>
        {
          console.log(data);
          // this.user = new User();
          this.gotoList();
        }, error => console.log(error));
  }

  onSubmit() {
    this.updateUser();
  }

  gotoList() {
    this.router.navigate(['/users']);
  }
}
