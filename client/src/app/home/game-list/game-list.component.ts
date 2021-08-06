import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { GameList } from 'src/app/_models/game-list';
import { User } from 'src/app/_models/user';
import { GameService } from 'src/app/_services/game.service';

@Component({
  selector: 'app-game-list',
  templateUrl: './game-list.component.html',
  styleUrls: ['./game-list.component.css']
})
export class GameListComponent implements OnInit, OnDestroy {
  allGames: GameList;
  @Input() user: User;
  gameSubscription: any;

  constructor(private gameService: GameService) { }

  ngOnInit(): void {
    this.gameSubscription = this.gameService.userGames$.subscribe((gameList: GameList) => {
      this.allGames = gameList;
    })
  }

  ngOnDestroy(): void {
    this.gameSubscription.unsubscribe();
  }

}
