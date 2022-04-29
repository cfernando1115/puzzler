import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Game } from 'src/app/_models/game';
import { GameType } from 'src/app/_models/game-type';
import { ReqRes } from 'src/app/_models/reqres';
import { GameService } from 'src/app/_services/game.service';

@Component({
  selector: 'app-admin-games',
  templateUrl: './admin-games.component.html',
  styleUrls: ['./admin-games.component.css'],
})
export class AdminGamesComponent implements OnInit, OnDestroy {
  currentGames: Game[];
  archivedGames: Game[];
  modalRef: BsModalRef;
  @ViewChild('gameDetailModal') gameDetailModal: TemplateRef<any>;
  game: Game;
  gameSubscription: Subscription;
  @Input()gameTypes: GameType[] = [];


  constructor(private gameService: GameService, private modalService: BsModalService, private toastr: ToastrService, private changeDetector: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.gameSubscription = this.gameService.currentGames$.subscribe((games: Game[]) => {
      this.currentGames = games.filter(g => g.status === 'active');
      this.archivedGames = games.filter(g => g.status === 'archived');
      this.changeDetector.detectChanges();
    });

    this.getGameTypes();
  }

  getGameTypes() {
    this.gameService.getGameTypes().pipe(
      map((response: GameType[]) => {
        this.gameTypes = response;
      })
    ).subscribe();
  }

  getGame(gameId: number) {
    this.gameService.getGame(gameId).subscribe((game: Game) => {
      this.game = game;
      this.game.gameTypeName === 'Hangman'
        ? this.game.scores.sort((a, b) => b.total - a.total)
        : this.game.scores.sort((a, b) => a.total - b.total);
      
      this.openModal(this.gameDetailModal);
    }, error => {
      console.log(error.error);
    });
  }

  deleteGame(gameId: number) {
    this.gameService.deleteGame(gameId, this.gameService.hubConnection).then((response: string) => {
      this.toastr.success(response);
    }, error => {
      this.toastr.error(error.error);
    });
  }

  updateGameStatus(gameId: number) {
    this.gameService.updateGameStatus(gameId).subscribe((response: ReqRes) => {
      this.toastr.success(response.message);
    }, error => {
      this.toastr.error(error.error);
    });
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  ngOnDestroy(): void {
    this.gameSubscription.unsubscribe();
  }
}
