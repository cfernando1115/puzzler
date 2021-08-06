import { Score } from "./score";

export interface Game {
    id: number;
    name: string;
    answer: string;
    gameTypeId: number;
    scores: Score[];
}