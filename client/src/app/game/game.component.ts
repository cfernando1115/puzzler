import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs/operators';
import { Game } from '../_models/game';
import { Score } from '../_models/score';
import { User } from '../_models/user';
import { AccountService } from '../_services/account.service';
import { GameService } from '../_services/game.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  game: Game;
  user: User;
  score: Score;

  constructor(private route: ActivatedRoute, private gameService: GameService, private accountService: AccountService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
      this.user = user;
    })

    this.route.queryParams.subscribe(params => {
      this.gameService.currentGame$.pipe(take(1)).subscribe(games => {
        this.game = games.newGames.find(g => g.name === params.gameName);
      })
    })
  }

  addGameToUser(event: boolean) {
    this.gameService.addGameToUser(this.game.id).subscribe(score => {
      this.score = score;
      this.gameService.getGames().subscribe();
    })
  }

  updateScore(newTotal: number) {
    if (this.score.total != newTotal) {
      this.score.total = newTotal;
      this.gameService.updateScore(this.score).subscribe(() => {
        this.gameService.getGames().subscribe();
      }, error => {
        error instanceof Object
        ? this.toastr.error(error.error)
        : this.toastr.error(error);
      });
    }
  }

}
