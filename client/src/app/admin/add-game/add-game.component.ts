import { Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Game } from 'src/app/_models/game';
import { GameType } from 'src/app/_models/game-type';
import { GameService } from 'src/app/_services/game.service';

@Component({
  selector: 'app-add-game',
  templateUrl: './add-game.component.html',
  styleUrls: ['./add-game.component.css']
})
export class AddGameComponent implements OnInit {
  game: any = {
    gameTypeId: 1
  };

  @Input() gameTypes: GameType[];
  @ViewChild('newGameForm') newGameForm: NgForm;

  constructor(private gameService: GameService, private toastr: ToastrService) { }

  ngOnInit(): void {
  }

  addGame() {
    this.gameService.createGame(this.game).subscribe(game => {
      this.gameService.addGame(game);
      this.game = {
        gameTypeId: 1
      };
    }, error => {
      error instanceof Object
        ? this.toastr.error(error.error)
        : this.toastr.error(error);
    });
  }

  setGameTypeId(event: number) {
    this.game.gameTypeId = +event;
  }
}
