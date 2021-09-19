import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ReplaySubject } from "rxjs";
import { map, take } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { Player } from "../_models/player";
import { ReqRes } from "../_models/reqres";

@Injectable({
    providedIn: 'root'
})
export class PlayerService {
    baseUrl = environment.baseUrl;
    currentPlayerSource = new ReplaySubject<Player[]>(1);
    currentPlayers$ = this.currentPlayerSource.asObservable();

    constructor(private http: HttpClient) { }

    getPlayers() {
        return this.http.get<Player[]>(`${this.baseUrl}Players`).pipe(
            map((players: Player[]) => {
                this.currentPlayerSource.next(players);
            })
        );
    }

    deletePlayer(playerId: number) {
        return this.http.delete<ReqRes>(`${this.baseUrl}Users/${playerId}`).pipe(
            map((response: ReqRes) => {
                this.currentPlayers$.pipe(take(1)).subscribe((players: Player[]) => {
                    this.currentPlayerSource.next(players.filter(p => p.id !== playerId));
                })
                return response;
            })
        );
    }

    deletePhoto(photoId: number) {
        return this.http.delete(`${this.baseUrl}Users/delete-photo/${photoId}`);
    }
}