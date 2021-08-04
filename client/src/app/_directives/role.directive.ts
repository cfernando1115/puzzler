import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { take } from 'rxjs/operators';
import { User } from '../_models/user';
import { AccountService } from '../_services/account.service';

@Directive({
  selector: '[appRole]'
})
export class RoleDirective implements OnInit{
  user: User;
  @Input() appRole: string[];

  constructor(private accountService: AccountService, private viewContainerRef: ViewContainerRef, private templateRef: TemplateRef<any>) {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
      this.user = user;
    })
  }

  ngOnInit(): void {
    if (this.user === null || !this.user?.roles) {
      this.viewContainerRef.clear();
    }

    if (this.user?.roles.some(role => this.appRole.includes(role))) {
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    }

    else {
      this.viewContainerRef.clear();
    }
  }

}
