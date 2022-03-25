import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Game } from 'src/app/_models/game';
import { SearchWord } from 'src/app/_models/search-word';
import { WordSearchLetter } from 'src/app/_models/word-search-letter';

@Component({
  selector: 'app-word-search',
  templateUrl: './word-search.component.html',
  styleUrls: ['./word-search.component.css']
})
export class WordSearchComponent implements OnInit {
  @Input() game: Game;
  totalMin: string = '00';
  totalSec: string = '00';
  gameLoaded: boolean = false;
  @Output() gamePlayed = new EventEmitter<boolean>();
  gameOver: boolean = false;
  gameMessage: string;
  lettersArray: WordSearchLetter[] = [];
  wordSearchWords: SearchWord[] = [];
  selectedCount: number = 0;
  wordStartIndex: number;
  wordEndIndex: number;
  @Output() scoreCalculated = new EventEmitter<number>();
  @ViewChild('grid') wordGrid: ElementRef<HTMLDivElement>;
  startTime: Date;
  totalTime: number;
  timer: ReturnType<typeof setInterval>;

  constructor() { }

  ngOnInit(): void {
    this.lettersArray = this.game.lettersGrid.split(',').map((letter: string) => {
      return {
        letter: letter,
        selected: false,
        correct: false,
        incorrect: false
      }
    });


    this.wordSearchWords = this.game.words.split(',').map((word: string) => {
      return {
        word: word,
        found: false
      }
    });
  }

  loadGame() {
    this.gameLoaded = true;
    this.startTime = new Date();
    this.timer = setInterval(this.logTime.bind(this), 1000);
    this.gamePlayed.emit(true);
  }

  logTime() {
    const now = new Date();
    this.totalTime = Math.abs(now.getTime() - this.startTime.getTime());
    
    if (this.totalTime >= 1800000) { 
      clearInterval(this.timer);
      this.gameMessage = `Time's Up!`;
      this.gameOver = true;
      this.scoreCalculated.emit(1800);
    }

    this.totalSec = String(Math.floor((this.totalTime / 1000) % 60)).padStart(2, '0');
    this.totalMin = String(Math.floor((this.totalTime / 1000) / 60)).padStart(2, '0');
  }

  selectLetter(letterIndex: number) {
    const selectedLetter = this.lettersArray[letterIndex];

    selectedLetter.selected = !selectedLetter.selected;

    if (!selectedLetter.selected && this.wordStartIndex === letterIndex) {
      return this.selectedCount = 0;
    }

    if (selectedLetter.selected && this.selectedCount === 0) {
      this.wordStartIndex= letterIndex;
      return this.selectedCount++;
    }

    if (selectedLetter.selected && this.selectedCount === 1) {
      this.wordEndIndex = letterIndex;
      this.verifyWord();
    }
  }

  verifyWord() {
    const indexDiff = Math.abs(this.wordStartIndex - this.wordEndIndex);
    let selectedDirectionFound = false;
    let wordFound = false;

    let selectedWord = '';
    let wordIndexArray: number[] = [];
    const low = Math.min(this.wordStartIndex, this.wordEndIndex);
    const high = Math.max(this.wordStartIndex, this.wordEndIndex);

    if (indexDiff < 10 && (low % 10 < high % 10)) {
      for (let i = low; i <= high; i++) {
        selectedWord += this.lettersArray[i].letter;
        wordIndexArray.push(i);
      }
      selectedDirectionFound = true;
    }

    if ((indexDiff % 10) === 0 && !selectedDirectionFound) {
      for (let i = low; i <= high; i += 10) {
        selectedWord += this.lettersArray[i].letter;
        wordIndexArray.push(i);
      }
      selectedDirectionFound = true;
    }

    if ((low % 10 > high % 10) && !selectedDirectionFound) {
      for (let i = low; i <= high; i += 9) {
        selectedWord += this.lettersArray[i].letter;
        wordIndexArray.push(i);
      }

      if (wordIndexArray[wordIndexArray.length - 1] !== high) {
        return this.resetSelectedWord();
      }
      selectedDirectionFound = true;
    }

    if ((low % 10 < high % 10) && !selectedDirectionFound) {
      for (let i = low; i <= high; i += 11) {
        selectedWord += this.lettersArray[i].letter;
        wordIndexArray.push(i);
      }

      if (wordIndexArray[wordIndexArray.length -1 ] !== high) {
        return this.resetSelectedWord();
      }
      selectedDirectionFound = true;
    }

    this.wordSearchWords.forEach(wsWord => {
      if (!wordFound && (wsWord.word === selectedWord || wsWord.word === selectedWord.split('').reverse().join(''))) {
        wordIndexArray.forEach(index => {
          this.lettersArray[index].correct = true;
        });

        wordFound = true;
        wsWord.found = true;

        this.checkAllWordsFound();
      }
    });

    if (!wordFound) {
      wordIndexArray.forEach(index => {
        if (!this.lettersArray[index].correct) {
          this.lettersArray[index].incorrect = true;
        }

        setTimeout(() => {
          wordIndexArray.forEach(index => this.lettersArray[index].incorrect = false);
        }, 500);
      });
    }

    this.resetSelectedWord();
  }

  resetSelectedWord() {
    this.selectedCount = 0;
    this.wordStartIndex = null;
    this.wordEndIndex = null;

    this.lettersArray.forEach(letter => letter.selected = false);
  }

  checkAllWordsFound() {
    if (!this.wordSearchWords.some(word => word.found === false)) {
      clearInterval(this.timer);
      this.gameMessage = 'You Win!';
      this.gameOver = true;
      this.scoreCalculated.emit(Math.floor(this.totalTime/1000));
    }
  }
}
