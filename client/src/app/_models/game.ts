import { Score } from "./score";

export interface Game {
    id: number;
    name: string;
    answer: string;
    status: string;
    gameTypeId: number;
    gameTypeName: string;
    scores: Score[];
}