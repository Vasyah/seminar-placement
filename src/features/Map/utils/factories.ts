import { IRoomInfo } from './../../UserList/mock';
import { IRoom } from './../types/index';
import * as React from 'react';
import { IBuilding, ISpaceInfo } from 'features/Map/types';
import { IUser } from 'features/UserList/types';
import { BUILDINGS_INFO, BuildingEnums } from '../../UserList/mock';

export const createBuilding = (
    // все участники семинара
    users: IUser[],
    buildingId: number,
    title: string,
    places: number,
): IBuilding => {
    const buildingUsers = findUsersByBuilding(users, buildingId);

    const spaceInfo = createSpaceInfo(buildingId, buildingUsers, places);

    const rooms =
        BUILDINGS_INFO[buildingId]?.rooms.map(({ places, id: roomId }) => {
            const roomUsers = findUsersByRoom(buildingUsers, buildingId, roomId);
            const spaceInfo = createSpaceInfo(roomId, roomUsers, places);
            return { ...spaceInfo };
        }) ?? [];

    return {
        ...spaceInfo,
        rooms,
        title,
    };
};

// Фабрика для создания информации о месте для сущностей Building, Stage, Room
export function createSpaceInfo(
    // номер сущности - Корпус, Этаж, Комната
    id: number,
    users: IUser[],
    places: number,
): ISpaceInfo & { id: number; users: IUser[] } {
    const reservedPlaces = users.length;
    const emptyPlaces = places - reservedPlaces;

    return {
        id,
        users,
        emptyPlaces: emptyPlaces,
        isFull: !emptyPlaces,
        places,
        reservedPlaces,
    };
}

const findUsersByBuilding = (users: IUser[], buidingId: number) => users.filter((user) => user?.Корпус && +user?.Корпус === buidingId);

const findUsersByRoom = (users: IUser[], buildingId: number, roomId: number) => users.filter((user) => user?.Корпус && +user?.Корпус === buildingId && user.Комната && +user.Комната === roomId);
