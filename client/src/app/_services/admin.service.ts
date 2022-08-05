import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { Admin } from '../_models/admin';
import { Register } from '../_models/register';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  baseUrl = environment.baseUrl;
  private adminSource = new ReplaySubject<Admin[]>(1);
  admins$ = this.adminSource.asObservable();

  constructor(private http: HttpClient) { }

  getAdmins() {
    return this.http.get<Admin[]>(`${this.baseUrl}Admins`).pipe(
      map((response: Admin[]) => {
        this.adminSource.next(response);
      })
    );
  }

  registerAdmin(model: Register) {
    return this.http.post(this.baseUrl + 'account/register-admin', model).pipe(
      map((newAdmin: Admin) => {
        this.admins$.pipe(take(1)).subscribe((admins: Admin[]) => {
          this.adminSource.next([...admins, newAdmin]);
        })
      })
    );
  }
}
