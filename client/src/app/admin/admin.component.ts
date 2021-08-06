import { Component, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { GameType } from '../_models/game-type';
import { GameService } from '../_services/game.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  constructor( private gameService: GameService ) { }

  ngOnInit(): void {
    this.gameService.getGames().subscribe();
  }
}
