import { Photo } from "./photo";

export interface User {
    id: number;
    token: string;
    userName: string;
    photo: Photo;
    roles: string[];
}