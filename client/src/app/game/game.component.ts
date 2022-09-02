import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs/operators';
import { Game } from '../_models/game';
import { Score } from '../_models/score';
import { User } from '../_models/user';
import { AccountService } from '../_services/account.service';
import { GameService } from '../_services/game.service';
import { ReqRes } from '../_models/reqres';

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
      this.gameService.userGames$.pipe(take(1)).subscribe(games => {
        this.game = games.newGames.find(g => g.id === +params.gameId);
      })
    })
  }

  addGameToUser(event: boolean) {
    this.gameService.addGameToUser(this.game.id).subscribe(score => {
      this.score = score;
      
      //on cheater-refresh, game will be marked as played
      this.gameService.getUserGames().subscribe();
    })
  }

  updateScore(newTotal: number) {
    if (this.score.total != newTotal) {
      this.score.total = newTotal;
      this.gameService.updateScore(this.score).subscribe((response: ReqRes) => {
        this.toastr.success(response.message);
        this.gameService.getUserGames().subscribe();
      }, error => {
        this.toastr.error(error.error);
      });
    }
  }

}
