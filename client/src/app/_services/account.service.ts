import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Login } from '../_models/login';
import { User } from '../_models/user';
import { map } from 'rxjs/operators';
import { ReplaySubject } from 'rxjs';
import { Register } from '../_models/register';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = environment.baseUrl;
  private currentUserSource = new ReplaySubject<User>(1);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient) { }

  login(model: Login) {
    return this.http.post(`${this.baseUrl}account/login`, model).pipe(
      map((response: User) => {
        const user = response;
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUserSource.next(user);
        }
      })
    )
  }

  register(model: Register) {
    return this.http.post(`${this.baseUrl}account/register`, model).pipe(
      map((response: User) => {
        const user = response;
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUserSource.next(user);
        }
      })
    )
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
  }

  setCurrentUser(user: User) {
    this.currentUserSource.next(user);
  }

}
