import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Login } from '../_models/login';
import { User } from '../_models/user';
import { map } from 'rxjs/operators';
import { ReplaySubject } from 'rxjs';
import { Register } from '../_models/register';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { GameService } from './game.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = environment.baseUrl;
  private currentUserSource = new ReplaySubject<User>(1);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient, private router: Router, private gameService: GameService) { }

  login(model: Login) {
    return this.http.post(`${this.baseUrl}account/login`, model).pipe(
      map((response: User) => {
        const user = response;
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
          this.setCurrentUser(user);
          this.currentUserSource.next(user);
          this.gameService.getGames().subscribe();
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
          this.gameService.getGames().subscribe();
        }
      })
    )
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
    this.router.navigateByUrl('');
  }

  setCurrentUser(user: User) {
    user.roles = [];
    const roles = this.getToken(user.token).role;
    Array.isArray(roles)
      ? user.roles = roles
      : user.roles.push(roles);
    
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSource.next(user);
    this.gameService.getGames().subscribe();
  }

  getToken(token) {
    return JSON.parse(atob(token.split('.')[1]));
  }

}
