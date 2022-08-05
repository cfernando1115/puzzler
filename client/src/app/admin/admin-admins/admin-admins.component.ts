import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Admin } from 'src/app/_models/admin';
import { AdminService } from 'src/app/_services/admin.service';

@Component({
  selector: 'app-admin-admins',
  templateUrl: './admin-admins.component.html',
  styleUrls: ['./admin-admins.component.css']
})
export class AdminAdminsComponent implements OnInit {
  adminSubscription: Subscription;
  admins: Admin[];
  adminId: number;
  admin: Admin;
  addAdmin = false;

  newAdminForm: FormGroup;

  constructor(private adminService: AdminService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.adminSubscription = this.adminService.admins$.subscribe((admins: Admin[]) => {
      this.admins = admins;
    });
  }

  matchValues(matchTo: string): ValidatorFn{
    return (control: AbstractControl) => {
      return control?.value === control?.parent?.controls[matchTo].value
        ? null
        : {isMatching: true}
    }
  }

  initializeForm() {
    this.newAdminForm = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(10)]),
      confirmPassword: new FormControl('', [Validators.required, this.matchValues("password")])
    });

    this.newAdminForm.controls.password.valueChanges.subscribe(() => {
      this.newAdminForm.controls.confirmPassword.updateValueAndValidity();
    });
  }

  addAdminClicked(): void {
    this.addAdmin = !this.addAdmin;

    if (this.addAdmin) {
      this.initializeForm();
    }
  }

  submitNewAdmin() {
    this.adminService.registerAdmin(this.newAdminForm.value).subscribe(response => {
      this.toastr.success("Admin successfully registered");
    }, error => {
      if (error.status === 500) {
        this.toastr.error("Registration failed. Make sure password meets requirements");
        return;
      } 

      if (error.status === 400) {
        this.toastr.error("Registration failed. Username is taken");
        return;
      } 

      this.toastr.error(error.error);
    });
  }

}
