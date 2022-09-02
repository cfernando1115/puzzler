import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Admin } from 'src/app/_models/admin';
import { ReqRes } from 'src/app/_models/reqres';
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
  changePassword = false;

  newAdminForm: FormGroup;
  changePasswordForm: FormGroup;

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

  initializeNewAdminForm() {
    this.newAdminForm = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(10)]),
      confirmPassword: new FormControl('', [Validators.required, this.matchValues("password")])
    });

    this.newAdminForm.controls.password.valueChanges.subscribe(() => {
      this.newAdminForm.controls.confirmPassword.updateValueAndValidity();
    });
  }

  initializeChangePasswordForm() {
    this.changePasswordForm = new FormGroup({
      username: new FormControl({ value: this.admin.userName, disabled: true }, [Validators.required,]),
      id: new FormControl(this.admin.id),
      currentPassword: new FormControl('', [Validators.required]),
      newPassword: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(10)]),
      confirmPassword: new FormControl('', [Validators.required, this.matchValues("newPassword")])
    });

    this.changePasswordForm.controls.newPassword.valueChanges.subscribe(() => {
      this.changePasswordForm.controls.confirmPassword.updateValueAndValidity();
    });
  }

  addAdminClicked(): void {
    this.addAdmin = !this.addAdmin;

    if (this.addAdmin) {
      this.initializeNewAdminForm();
    }
  }

  submitNewAdmin() {
    this.adminService.registerAdmin(this.newAdminForm.value).subscribe((response: ReqRes) => {
      this.toastr.success(response.message);
      this.addAdmin = false;
    }, error => {
      if (error.status === 400) {
        this.toastr.error(error.error.message);
        return;
      } else {
        this.toastr.error("Registration failed. Make sure password meets requirements");
      }
    });
  }

  submitChangePassword() {
    this.adminService.changePassword(this.changePasswordForm.value).subscribe((response: ReqRes) => {
      this.toastr.success(response.message);
      this.changePassword = false;
    }, error => {
      if (error.status === 400) {
        this.toastr.error(error.error.message);
        return;
      } else {
        this.toastr.error("Registration failed. Make sure password meets requirements");
      }
    });
  }

  changePasswordClicked(id: number) {
    this.changePassword = !this.changePassword;

    if (this.changePassword) {
      this.admin = this.admins.find(admin => admin.id === id);
      this.initializeChangePasswordForm();
    }
  }

  deleteAdminClicked(id: number) {
    this.adminService.deleteAdmin(id).subscribe((response: ReqRes) => {
      this.toastr.success(response.message);
    }, error => {
      if (error.status === 400) {
        this.toastr.error(error.error.message);
      } else {
        this.toastr.error("An error occurred. Please try again.");
      }
    });
  }

}
