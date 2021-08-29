import { Game } from "./game";
import { Score } from "./score";

export interface Player {
    userName: string;
    id: number;
    scores: Score[];
}