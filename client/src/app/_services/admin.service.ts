import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReplaySubject, throwError } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { Admin } from '../_models/admin';
import { ChangePassword } from '../_models/change-password';
import { Register } from '../_models/register';
import { ReqRes } from '../_models/reqres';

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
      map((response: ReqRes) => {
        this.admins$.pipe(take(1)).subscribe((admins: Admin[]) => {
          this.adminSource.next([...admins, response.data]);
        })
        return response;
      })
    );
  }

  changePassword(model: ChangePassword) {
    return this.http.put(this.baseUrl + 'account/change-password', model);
  }

  deleteAdmin(adminId: number) {
    return this.http.delete(this.baseUrl + 'admins/delete/' + adminId).pipe(
      map((response: ReqRes) => {
        this.admins$.pipe(take(1)).subscribe((admins: Admin[]) => {
          const deletedIndex = admins.findIndex(admin => admin.id === adminId);
          admins.splice(deletedIndex, 1);
          this.adminSource.next(admins);
        })
        return response;
      })
    );
  }
}
