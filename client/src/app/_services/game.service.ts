import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { Game } from '../_models/game';
import { GameList } from '../_models/game-list';
import { environment } from 'src/environments/environment';
import { Score } from '../_models/score';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  baseUrl = environment.baseUrl;
  private userGameSource = new ReplaySubject<GameList>(1);
  userGames$ = this.userGameSource.asObservable();
  private currentGameSource = new ReplaySubject<Game[]>(1);
  currentGames$ = this.currentGameSource.asObservable();


  constructor(private http: HttpClient) { }

  getGames() {
    return this.http.get<Game[]>(`${this.baseUrl}Games/`).pipe(
      map((response: Game[]) => {
        this.currentGameSource.next(response);
      })
    )
  }

  getGame(gameId: number) {
    return this.http.get(`${this.baseUrl}Games/${gameId}`);
  }

  getUserGames() {
    return this.http.get(`${this.baseUrl}Games/user-games`).pipe(
      map((response: GameList) => {
        this.userGameSource.next(response);
      })
    )
  }

  getGameTypes() {
    return this.http.get(`${this.baseUrl}GameTypes/`);
  }

  createGame(newGame: Game) {
    return this.http.post<Game>(`${this.baseUrl}Games/add-game`, newGame).pipe(
      map((response: Game) => {
        this.currentGames$.pipe(take(1)).subscribe((games: Game[]) => {
          this.currentGameSource.next([...games, response]);
          //until signalR...
          this.addNewGameToUser(response);
          //or...
          //this.getUserGames().subscribe();
        })
      })
    );
  }

  addNewGameToUser(newGame: Game) {
    this.userGames$.pipe(take(1)).subscribe((gameList: GameList) => {
      const userGames = gameList;
      userGames.newGames.push(newGame);
      this.userGameSource.next(userGames);
    })
  }

  deleteGameFromUser(gameId: number) {
    this.userGames$.pipe(take(1)).subscribe((gameList: GameList) => {
      const updatedGames = gameList.newGames.filter(game => {
        return game.id !== gameId;
      })
      this.userGameSource.next({newGames: updatedGames, playedGames: gameList.playedGames});
    })
  }

  addGameToUser(gameId: number) {
    return this.http.post<Score>(`${this.baseUrl}Games/add-user-game/${gameId}`, {});
  }

  updateScore(score: Score) {
    return this.http.put<String>(`${this.baseUrl}Games/update-score`, score);
  }

  deleteGame(gameId: number) {
    return this.http.delete(`${this.baseUrl}Games/${gameId}`).pipe(
      map(() => {
        this.currentGames$.pipe(take(1)).subscribe((games: Game[]) => {
          const updatedGames = games.filter(game => {
            return game.id !== gameId;
          });
          this.currentGameSource.next(updatedGames);
          //until signalR...
          this.deleteGameFromUser(gameId);
          //or...
          //this.getUserGames().subscribe();
        })
      })
    );
  }
}
