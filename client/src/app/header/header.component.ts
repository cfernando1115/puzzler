import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { User } from '../_models/user';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  title = 'Puzzler';
  loginForm: FormGroup;
  loggedIn = false;
  user: User;

  constructor(public accountService: AccountService, private router: Router) { }

  ngOnInit(): void {
    this.initializeForm();
    this.accountService.currentUser$.pipe(
      map(user => {
        this.user = user;
      })
    ).subscribe();
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
