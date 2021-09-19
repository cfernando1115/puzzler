import { Photo } from "./photo";
import { Score } from "./score";

export interface Player {
    userName: string;
    id: number;
    scores: Score[];
    photo: Photo;
}