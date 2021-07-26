import { Component, OnInit, Output } from '@angular/core';
import { map } from 'rxjs/operators';
import { GameType } from '../_models/game-type';
import { GameService } from '../_services/game.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  gameTypes: GameType[] = [];

  constructor(private gameService: GameService) { }

  ngOnInit(): void {
    this.getGameTypes();
  }

  getGameTypes() {
    this.gameService.getGameTypes().pipe(
      map((response: GameType[]) => {
        this.gameTypes = response;
      })
    ).subscribe();
  }
}
