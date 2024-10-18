import { BuildingIdType, BUILDINGS_INFO } from './../../UserList/mock';
import * as React from 'react';
import { IBuilding, ISpaceInfo } from 'features/Map/types';
import { IUser } from 'features/UserList/types';

export const createBuilding = (
    // все участники семинара
    users: IUser[],
    buildingId: BuildingIdType,
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
    id: BuildingIdType,
    users: IUser[],
    places: number,
): ISpaceInfo & { id: BuildingIdType; users: IUser[] } {
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

const findUsersByBuilding = (users: IUser[], buidingId: BuildingIdType) => users.filter((user) => user?.Корпус && String(user?.Корпус) === String(buidingId));

const findUsersByRoom = (users: IUser[], buildingId: BuildingIdType, roomId: number) =>
    users.filter((user) => user?.Корпус && String(user?.Корпус) === buildingId && user.Комната && +user.Комната === roomId);
