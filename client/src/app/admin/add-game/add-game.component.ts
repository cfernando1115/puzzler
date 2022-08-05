import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { GameType } from 'src/app/_models/game-type';
import { SearchWord } from 'src/app/_models/search-word';
import { GameService } from 'src/app/_services/game.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-game',
  templateUrl: './add-game.component.html',
  styleUrls: ['./add-game.component.css']
})
export class AddGameComponent implements OnInit {
  defaultGameTypeId = 1;
  gameTypeId: number = 1;
  wordSearchSquares = Array(environment.wordSearchLetters).fill(1);
  wordSearchLetters: string[] = Array(environment.wordSearchLetters).fill('');
  letters = environment.letters;
  newWord: string = '';
  wordSearchWords: SearchWord[] = [];
  letter: string = '';
  @ViewChild('grid') wordGrid: ElementRef<HTMLDivElement>;
  wordSearchLocked = false;
  wordSearchInvalid = false;
  
  @Input() gameTypes: GameType[];
  @ViewChild('newGameForm') newGameForm: NgForm;

  constructor(private gameService: GameService, private toastr: ToastrService) { }

  ngOnInit(): void {
  }

  addGame() {
    this.newGameForm.value.gameTypeName = this.gameTypes.find(t => t.id === +this.newGameForm.value.gameTypeId).name;
    this.newGameForm.value.gameTypeId = this.gameTypeId;

    const lettersGrid = [];
    for (let i = 0; i < 100; i++) {
      lettersGrid.push(this.newGameForm.value[`letter${i}`]);
      delete this.newGameForm.value[`letter${i}`];
    }
    
    if (this.gameTypeId === 2) {
      this.newGameForm.value.words = this.wordSearchWords.map(w => w.word).join(',');
      this.newGameForm.value.lettersGrid = lettersGrid.join(',');
    }

    this.gameService.createGame(this.newGameForm.value, this.gameService.hubConnection).then((response: string) => {
      this.toastr.success(response);
      this.newGameForm.reset();
      this.newGameForm.form.patchValue({
        gameTypeId: this.defaultGameTypeId
      });
      this.wordSearchWords = [];
      this.gameTypeId = 1;
    }, error => {
      console.log(error.error);
    });
  }

  setGameTypeId() {
    this.gameTypeId = +this.newGameForm.value.gameTypeId;
  }

  fillGrid() {
    this.wordSearchLetters = this.wordSearchLetters.slice().map((letter, i) => {
      if (letter === '') {
        return this.letters[Math.floor(Math.random() * this.letters.length)];
      }
      this.wordGrid.nativeElement.children[i].children[0].classList.add('highlight');
    
      return letter.toUpperCase();
    });

  }

  verifyGrid() {
    if (this.wordSearchWords.length === 0) return;

    this.wordSearchWords.forEach((searchWord, index) => {
      let found = false;
      const wordLength = searchWord.word.length;
      const wordArr = Array.from(searchWord.word);

      this.wordSearchLetters = this.wordSearchLetters.map(letter => letter.toUpperCase());

      this.wordSearchLetters.forEach((letter, index) => {
          if (found) return;

          if (letter === wordArr[0]) {
            let rowsUp = Math.floor(index / 10);
            let rowsDown = Math.floor((100 - index) / 10);
            let colsRight = 9 - (index % 10);
            let colsLeft = index % 10;

            if (rowsUp >= wordLength - 1) {
              for (var i = 1; i < wordLength; i++) {
                if (wordArr[i].toUpperCase() != this.wordSearchLetters[index - (i * 10)]) {
                  break;
                }  
                if (i === wordLength - 1) {
                  found = true;
                }
              }
            }

            if (rowsDown >= wordLength - 1 && !found) {
              for (var i = 1; i < wordLength; i++) {
                if (wordArr[i].toUpperCase() != this.wordSearchLetters[index + (i * 10)]) {
                  break;
                }  
                if (i === wordLength - 1) {
                  found = true;
                }
              }
            }

            if (colsRight >= wordLength - 1 && !found) {
              for (var i = 1; i < wordLength; i++) {
                if (wordArr[i].toUpperCase() != this.wordSearchLetters[index + i]) {
                  break;
                }
                if (i === wordLength - 1) {
                  found = true;
                }
              }

              if (rowsUp >= wordLength - 1 && !found) {
                for (var i = 1; i < wordLength; i++) {
                  if (wordArr[i].toUpperCase() != this.wordSearchLetters[index - (i * 10) + i]) {
                    break;
                  }  
                  if (i === wordLength - 1) {
                    found = true;
                  }
                }
              }

              if (rowsDown >= wordLength - 1 && !found) {
                for (var i = 1; i < wordLength; i++) {
                  if (wordArr[i].toUpperCase() != this.wordSearchLetters[index + (i * 10) + i]) {
                    break;
                  }  
                  if (i === wordLength - 1) {
                    found = true;
                  }
                }
              }
            }

            if (colsLeft >= wordLength - 1 && !found) { 
              for (var i = 1; i < wordLength; i++) {
                if (wordArr[i].toUpperCase() != this.wordSearchLetters[index - i]) {
                  break;
                }
                if (i === wordLength - 1) {
                  found = true;
                }
              }

              if (rowsUp >= wordLength - 1 && !found) {
                for (var i = 1; i < wordLength; i++) {
                  if (wordArr[i].toUpperCase() != this.wordSearchLetters[index - (i * 10) - i]) {
                    break;
                  }  
                  if (i === wordLength - 1) {
                    found = true;
                  }
                }
              }

              if (rowsDown >= wordLength - 1 && !found) {
                for (var i = 1; i < wordLength; i++) {
                  if (wordArr[i].toUpperCase() != this.wordSearchLetters[index + (i * 10) - i]) {
                    break;
                  }  
                  if (i === wordLength - 1) {
                    found = true;
                  }
                }
              }
            }
          }
      });
      searchWord.found = found;
    });

    if (!this.wordSearchWords.some(word => !word.found)) {
      this.fillGrid();
      this.wordSearchInvalid = false;

      return this.lockWordSearch();
    }

    this.wordSearchInvalid = true;
  }

  lockWordSearch() {
    this.wordSearchLocked = true;

    this.wordGrid.nativeElement.childNodes.forEach(el => {
      let input = el?.firstChild as HTMLInputElement;
      if (input) {
        input.disabled = true;
      }
    });
  }

  saveWord() {
    if (this.newWord != '') {
      this.wordSearchWords.push({ word: this.newWord.toUpperCase(), found: true });
      this.newWord = '';
    }
  }

  deleteWord(index: number) {
    this.wordSearchWords.splice(index, 1);
  }

  moveSquare(index: number, direction: string) {
    let nextActiveIndex;

    if (direction === 'up') {
      if (index < 10) return;
      nextActiveIndex = index - 10;
    }

    if (direction === 'down') {
      if (index > 89) return;
      nextActiveIndex = index + 10;
    }

    if (direction === 'left') {
      if (index === 0) return;
      nextActiveIndex = index - 1;
    }

    if (direction === 'right') {
      if (index === 99) return;
      nextActiveIndex = index + 1;
    }

    const nextActive: HTMLElement = this.wordGrid.nativeElement.children[nextActiveIndex].children[0] as HTMLElement;
    nextActive.focus();
  }
}
