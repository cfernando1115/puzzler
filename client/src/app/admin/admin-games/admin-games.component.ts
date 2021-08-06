import { Component, ElementRef, Input, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { map } from 'rxjs/operators';
import { Game } from 'src/app/_models/game';
import { GameDetail } from 'src/app/_models/game-detail';
import { GameType } from 'src/app/_models/game-type';
import { GameService } from 'src/app/_services/game.service';

@Component({
  selector: 'app-admin-games',
  templateUrl: './admin-games.component.html',
  styleUrls: ['./admin-games.component.css']
})
export class AdminGamesComponent implements OnInit, OnDestroy {
  games: Game[];
  modalRef: BsModalRef;
  @ViewChild('gameDetailModal') gameDetailModal: TemplateRef<any>;
  game: GameDetail;
  gameSubscription: any;
  @Input()gameTypes: GameType[] = [];


  constructor(private gameService: GameService, private modalService: BsModalService) { }

  ngOnInit(): void {
    this.gameSubscription = this.gameService.currentGames$.subscribe((games: Game[]) => {
      this.games = games;
    })

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
    this.gameService.getGame(gameId).subscribe((game: GameDetail) => {
      this.game = game;
      console.log(this.game);
      this.game.scores.sort((a, b) => b.total - a.total);
      this.openModal(this.gameDetailModal);
    })
  }

  deleteGame(gameId: number) {
    this.gameService.deleteGame(gameId).subscribe();
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  ngOnDestroy(): void {
    this.gameSubscription.unsubscribe();
  }
}
