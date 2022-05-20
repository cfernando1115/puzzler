import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { Game } from '../_models/game';
import { GameList } from '../_models/game-list';
import { environment } from 'src/environments/environment';
import { Score } from '../_models/score';
import { ReqRes } from '../_models/reqres';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  baseUrl = environment.baseUrl;
  private userGameSource = new ReplaySubject<GameList>(1);
  userGames$ = this.userGameSource.asObservable();
  private currentGameSource = new ReplaySubject<Game[]>(1);
  currentGames$ = this.currentGameSource.asObservable();
  hubUrl = environment.hubUrl;
  public hubConnection: HubConnection;
  private user: User;
  private admin = environment.adminRole;

  constructor(private http: HttpClient) { }

  getGames() {
    return this.http.get<Game[]>(`${this.baseUrl}Games`).pipe(
      map((response: Game[]) => {
        this.currentGameSource.next(response);
      })
    );
  }

  getGame(gameId: number) {
    return this.http.get(`${this.baseUrl}Games/${gameId}`);
  }

  getUserGames() {
    return this.http.get(`${this.baseUrl}Games/user-games`).pipe(
      map((response: GameList) => {
        this.userGameSource.next(response);
      })
    );
  }

  getGameTypes() {
    return this.http.get(`${this.baseUrl}GameTypes`);
  }

  createGame(newGame: Game, hubConnection = this.hubConnection) {
    if (hubConnection) {
      return hubConnection.invoke('AddGame', newGame).catch(error => { console.log(error) });
    }
  }

  addNewGameToUser(newGame: Game) {
    this.userGames$.pipe(take(1)).subscribe((gameList: GameList) => {
      const userGames = gameList;
      userGames.newGames.push(newGame);
      this.userGameSource.next(userGames);
    });
  }

  deleteGameFromUser(gameId: number) {
    this.userGames$.pipe(take(1)).subscribe((gameList: GameList) => {
      const updatedGames = gameList.newGames.filter(game => {
        return game.id !== gameId;
      })
      this.userGameSource.next({ newGames: updatedGames, playedGames: gameList.playedGames });
    });
  }

  addGameToUser(gameId: number) {
    return this.http.post<Score>(`${this.baseUrl}Games/add-user-game/${gameId}`, {});
  }

  updateScore(score: Score) {
    return this.http.put<ReqRes>(`${this.baseUrl}Games/update-score`, score);
  }

  deleteGame(id: number, hubConnection = this.hubConnection) {
    if (hubConnection) {
      return hubConnection.invoke('DeleteGame', id).catch(error => { });
    }
  }

  updateGameStatus(gameId: number) {
    return this.http.put<ReqRes>(`${this.baseUrl}Games/change-status/${gameId}`, {}).pipe(
      map((response: ReqRes) => {
        this.currentGames$.pipe(take(1)).subscribe((games: Game[]) => {
          const updatedGameIndex = games.findIndex(g => g.id === +gameId);
          const [updatedGame] = games.splice(updatedGameIndex, 1);
          updatedGame.status = updatedGame.status == 'archived' ? 'active' : 'archived';
          this.currentGameSource.next([...games, updatedGame]);
          this.getUserGames().subscribe();
        });
        return response;
      })
    );
  }

  createHubConnection(user: User) {
    this.user = user;

    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + 'game', {
        accessTokenFactory: () => user.token
      })
      .withAutomaticReconnect()
      .build();
    
    this.hubConnection
      .start()
      .catch(error => console.log(error));
    
    this.hubConnection.on('GameDeleted', (gameId: number) => {
      this.deleteGameFromUser(gameId);
      
      if (this.user.roles.some(role => role === this.admin)) {
        this.currentGames$.pipe(take(1)).subscribe((games: Game[]) => {
          const updatedGames = games.filter(game => {
            return game.id !== gameId;
          });
  
          this.currentGameSource.next(updatedGames);
        });
      }     
    });

    this.hubConnection.on('GameAdded', (game: Game) => {
      this.addNewGameToUser(game);

      if (this.user.roles.some(role => role === this.admin)) {
        this.currentGames$.pipe(take(1)).subscribe((games: Game[]) => {
          this.currentGameSource.next([...games, game]);
        });
      }
    });
  }

  stopHubConnection() {
    this.hubConnection.stop()
      .catch(error => console.log(error));
  }
}
