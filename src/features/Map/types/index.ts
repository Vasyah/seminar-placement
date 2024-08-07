import { BuildingIdType } from 'features/UserList/mock';
import { IUser } from 'features/UserList/types';
import { ReactNode } from 'react';

export interface ISpaceInfo {
    places: number;
    reservedPlaces: number;
    emptyPlaces: number;
    isFull: boolean;
}

export interface IBuilding extends ISpaceInfo {
    id: BuildingIdType;
    title?: string;
    description?: ReactNode;
    users: IUser[];
    rooms: IRoom[];
}

export interface IRoom extends ISpaceInfo {
    id: BuildingIdType;
    title?: string;
    description?: string;
    users: IUser[];
}
