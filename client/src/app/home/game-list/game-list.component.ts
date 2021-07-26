import { Component, Input, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { Game } from 'src/app/_models/game';
import { GameList } from 'src/app/_models/game-list';
import { User } from 'src/app/_models/user';
import { GameService } from 'src/app/_services/game.service';

@Component({
  selector: 'app-game-list',
  templateUrl: './game-list.component.html',
  styleUrls: ['./game-list.component.css']
})
export class GameListComponent implements OnInit {
  allGames: GameList;
  @Input() user: User;

  constructor(private gameService: GameService) { }

  ngOnInit(): void {
    this.gameService.currentGame$.pipe(take(1)).subscribe(response => {
      this.allGames = response;
    })
  }

}
