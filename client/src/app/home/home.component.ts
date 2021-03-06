import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { User } from '../_models/user';
import { AccountService } from '../_services/account.service';
import { GameService } from '../_services/game.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  user: User;

  constructor(public accountService: AccountService, private gameService: GameService) { }

  ngOnInit(): void {
    this.accountService.currentUser$.pipe(
      map(user => {
        this.user = user;
      })
    ).subscribe();
  }
}
