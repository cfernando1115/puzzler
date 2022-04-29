import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { GameList } from 'src/app/_models/game-list';
import { User } from 'src/app/_models/user';
import { GameService } from 'src/app/_services/game.service';

@Component({
  selector: 'app-game-list',
  templateUrl: './game-list.component.html',
  styleUrls: ['./game-list.component.css'],
})
export class GameListComponent implements OnInit, OnDestroy {
  allGames: GameList;
  @Input() user: User;
  gameSubscription: Subscription;

  constructor(private gameService: GameService, private changeDetector: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.gameSubscription = this.gameService.userGames$.subscribe((gameList: GameList) => {
      this.allGames = { newGames: gameList.newGames, playedGames: gameList.playedGames };
      this.changeDetector.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.gameSubscription.unsubscribe();
  }

}
