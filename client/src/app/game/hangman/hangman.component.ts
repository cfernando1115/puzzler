import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Game } from 'src/app/_models/game';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-hangman',
  templateUrl: './hangman.component.html',
  styleUrls: ['./hangman.component.css']
})
export class HangmanComponent implements OnInit {
  letters = environment.letters;
  @Input() game: Game;
  total: number;
  gameLoaded: boolean = false;
  @Output() gamePlayed = new EventEmitter<boolean>();
  answerArray: string[];
  guessArray: string[];
  maxGuesses = environment.hangmanGuesses;
  gameOver: boolean = false;
  gameMessage: string;
  @Output() scoreCalculated = new EventEmitter<number>();

  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.answerArray = [...this.game.answer.toUpperCase()];
    this.total = this.maxGuesses;
    this.guessArray = Array.from({ length: this.answerArray.length }, () => '?');
  }

  loadGame() {
    this.gameLoaded = true;
    this.gamePlayed.emit(true);
  }

  cancelLoadGame() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  selectLetter(event: any) {
    const letterBtn = event.closest('button');

    if (!letterBtn) {
      return;
    }

    const letter = letterBtn.value;
    const letterIndices = [];

    this.answerArray.forEach((curLetter, index) => {
      if (curLetter === letter) {
        letterIndices.push(index);
      }
    })

    if (letterIndices.length) {
      letterIndices.forEach((curIndex) => {
        this.guessArray[curIndex] = letter;
      })
    }
    else {
      this.total--;
    }

    this.setGameStatus();
  }

  setGameStatus() {
    if (this.total === 0 || !this.guessArray.includes('?')) {
      this.gameOver = true;
      if (this.total === 0 && this.guessArray.includes('?')) {
        this.gameMessage = 'You Lose!';
      }
      else {
        this.gameMessage = 'You Win!';
      }
      this.scoreCalculated.emit(this.total);
    }
  }
}
