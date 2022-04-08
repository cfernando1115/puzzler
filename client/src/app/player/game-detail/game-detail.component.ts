import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Game } from 'src/app/_models/game';

@Component({
  selector: 'app-game-detail',
  templateUrl: './game-detail.component.html',
  styleUrls: ['./game-detail.component.css']
})
export class GameDetailComponent implements OnInit {
  @Input() game: Game;
  userId: number;
  @Output() gameCleared = new EventEmitter<boolean>();

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.userId = +params['id'];
    })
    this.game.gameTypeName === 'Hangman'
    ? this.game.scores.sort((a, b) => b.total - a.total)
    : this.game.scores.sort((a, b) => a.total - b.total);
  }
}
