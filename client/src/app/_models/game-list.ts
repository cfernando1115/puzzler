import { Game } from "./game";

export interface GameList {
    newGames: Game[];
    playedGames: Game[];
}