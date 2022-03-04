import { Score } from "./score";

export interface Game {
    id: number;
    name: string;
    answer: string;
    words: string;
    lettersGrid: string;
    status: string;
    gameTypeId: number;
    gameTypeName: string;
    scores: Score[];
}