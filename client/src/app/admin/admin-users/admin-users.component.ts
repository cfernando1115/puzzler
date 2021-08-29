import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { Player } from 'src/app/_models/player';
import { PlayerService } from 'src/app/_services/player.service';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css']
})
export class AdminUsersComponent implements OnInit, OnDestroy {
  playersSubscription: Subscription;
  players: Player[];
  playerId: number;
  player: Player;

  constructor(private playerService: PlayerService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.playersSubscription = this.playerService.currentPlayers$.subscribe((players: Player[]) => {
      this.players = players;
      this.route.params.subscribe((params: Params) => {
        if (params['id']) {
          this.playerId = +params['id'];
          if (this.playerId) {
            this.player = this.players.find(p => p.id === this.playerId);
          }
        };
      })
    })

  }

  ngOnDestroy(): void {
    this.playersSubscription.unsubscribe();
  }

}
