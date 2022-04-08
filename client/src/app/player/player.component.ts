import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Game } from '../_models/game';
import { GameList } from '../_models/game-list';
import { GameService } from '../_services/game.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit, OnDestroy {
  playedGames: Game[];
  gameSubscription: Subscription;
  game: Game;

  constructor(private gameService: GameService) { }

  ngOnInit(): void {
    this.gameSubscription = this.gameService.userGames$.subscribe((gameList: GameList) => {
      this.playedGames = gameList?.playedGames;
    });
  }

  loadGameDetail(gameId: number) {
    this.gameService.getGame(gameId).subscribe((game: Game) => {
      this.game = game;
      this.game.gameTypeName === 'Hangman'
        ? this.game.scores.sort((a, b) => b.total - a.total)
        : this.game.scores.sort((a, b) => a.total - b.total);
    }, error => {
      console.log(error.error);
    });
  }

  ngOnDestroy(): void {
    this.gameSubscription.unsubscribe();
  }

  clearGameDetail(event: boolean) {
    if (event === true) {
      this.game = null;
    }
  }
}
