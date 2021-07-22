import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  title = 'Puzzler';
  isCollapsedNav = true;
  isCollapsedDropDown = true;
  loginForm: FormGroup;
  loggedIn = false;

  constructor(public accountService: AccountService) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  toggleCollapsedNav(): void {
    this.isCollapsedNav = !this.isCollapsedNav;
  }

  toggleCollapsedDropDown(): void {
    this.isCollapsedDropDown = !this.isCollapsedDropDown;
  }

  initializeForm() {
    this.loginForm = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    })
  }

  login() {
    this.accountService.login(this.loginForm.value).subscribe(response => {
      this.loginForm.reset();
    })
  }

  logout() {
    this.accountService.logout();
  }
}
