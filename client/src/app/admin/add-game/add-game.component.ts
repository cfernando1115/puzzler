import { Component, ElementRef, Input, OnInit, ViewChild, ViewChildren} from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { GameType } from 'src/app/_models/game-type';
import { GameService } from 'src/app/_services/game.service';

@Component({
  selector: 'app-add-game',
  templateUrl: './add-game.component.html',
  styleUrls: ['./add-game.component.css']
})
export class AddGameComponent implements OnInit {
  defaultGameTypeId = 1;
  gameTypeId: number = 1;

  @Input() gameTypes: GameType[];
  @ViewChild('newGameForm') newGameForm: NgForm;

  constructor(private gameService: GameService, private toastr: ToastrService) { }

  ngOnInit(): void {
  }

  addGame() {
    this.newGameForm.value.gameTypeName = this.gameTypes.find(t => t.id === this.newGameForm.value.gameTypeId).name;
    this.gameService.createGame(this.newGameForm.value).subscribe(() => {
      this.newGameForm.reset();
      this.newGameForm.form.patchValue({
        gameTypeId: this.defaultGameTypeId
      });
    }, error => {
      console.log(error.error);
    });
  }

  setGameTypeId(event: number) {
    this.gameTypeId = this.newGameForm.value.gameTypeId;
  }
}
