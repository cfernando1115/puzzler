import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { Game } from '../_models/game';
import { GameList } from '../_models/game-list';
import { environment } from 'src/environments/environment';
import { GameType } from '../_models/game-type';
import { Score } from '../_models/score';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  baseUrl = environment.baseUrl;
  private currentGameSource = new ReplaySubject<GameList>();
  currentGame$ = this.currentGameSource.asObservable();

  constructor(private http: HttpClient) { }

  getGames() {
    return this.http.get(`${this.baseUrl}Game/user-games`).pipe(
      map((response: GameList) => {
        this.currentGameSource.next(response);
      })
    )
  }

  getGameTypes() {
    return this.http.get(`${this.baseUrl}Game/game-types`);
  }

  createGame(newGame: Game){
    return this.http.post<Game>(`${this.baseUrl}Game/add-game`, newGame);
  }

  addGame(newGame: Game) {
    this.currentGame$.pipe(take(1)).subscribe(games => {
      const currentGames = games;
      currentGames.newGames.push(newGame);
      this.currentGameSource.next(currentGames);
    })
  }

  addGameToUser(gameId: number) {
    return this.http.post<Score>(`${this.baseUrl}Game/add-user-game/${gameId}`, {});
  }

  updateScore(score: Score) {
    return this.http.put<String>(`${this.baseUrl}Game/update-score`, score);
  }
}
