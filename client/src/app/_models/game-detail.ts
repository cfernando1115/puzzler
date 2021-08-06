import { GameType } from "./game-type";
import { Score } from "./score";

export interface GameDetail {
    id: number;
    name: string;
    answer: string;
    gameType: GameType;
    scores: Score[];
}