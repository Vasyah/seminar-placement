import { IUser } from 'features/UserList/types';
import { ReactNode } from 'react';

export interface ISpaceInfo {
    places: number;
    reservedPlaces: number;
    emptyPlaces: number;
    isFull: boolean;
}

// ПЕРЕЕХАЛО В Room.tsx
export interface IBuilding extends ISpaceInfo {
    id: number;
    title?: string;
    description?: ReactNode;
    users: IUser[];
    stages: IStage[];
}
// ПЕРЕЕХАЛО В Room.tsx
export interface IRoom extends ISpaceInfo {
    id: number;
    title?: string;
    description?: string;
    users: IUser[];
}

export interface IStage extends ISpaceInfo {
    id: number;
    title: string;
    description?: string;
    rooms: IRoom[];
    users: IUser[];
}
