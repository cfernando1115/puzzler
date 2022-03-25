import { Component, OnInit, Output } from '@angular/core';
import { GameService } from '../../_services/game.service';
import { PlayerService } from '../../_services/player.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  constructor( private gameService: GameService, private playerService: PlayerService ) { }

  ngOnInit(): void {
    this.gameService.getGames().subscribe(() => { }, error => { console.log(error); });
    this.playerService.getPlayers().subscribe(() => { }, error => { console.log(error); });
  }
}
