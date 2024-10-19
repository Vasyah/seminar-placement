import { IBuildingInfoProps } from 'features/Map/components/Building/Building';
import { IUser } from './types';
import { createBuilding, createRoom } from 'features/Map/utils/factories';

export type IRoomInfo = { id: number; places: number };

type BuildingInfoType = {
    // номер корпуса
    id: BuildingIdType;
    places: number;
    rooms: IRoomInfo[];
    // stages: {
    //     // номер этажа
    //     id: number;
    //     places: IStage['places'];
    //     title: IStage['title'];
    //     description: IStage['description'];
    //     rooms: { id: number; places: number }[];
    // }[];
};

export enum BuildingEnum {
    One = '1',
    Two = '2',
    Three = '3',
    Four = '4',
    Five = '5',
    Six = '6',
    Sevent = '7',
    Eight = '8',
    Nine = '9',
    Ten = '10',
    ForestHouse = 'Домик Лесника',
    MushroomHouse = 'Грибной Дом',
    Hospital = 'Медпункт',
    Flat = 'Квартира',
}

export type BuildingIdType = number | BuildingEnum;
// TODO: Для каждого корпуса и этажа необходимо описать количество мест
/*
	Информация о корпусах
	- номер корпуса
	- количество комнат на этаже
	- количество мест на этаже
	-
*/
export const BUILDINGS_INFO: Record<string, BuildingInfoType> = {
    [BuildingEnum.One]: {
        id: BuildingEnum.One,
        places: 78,
        rooms: [
            { id: 111, places: 9 },
            { id: 112, places: 9 },
            { id: 113, places: 2 },
            { id: 114, places: 9 },
            { id: 115, places: 9 },
            { id: 121, places: 9 },
            { id: 122, places: 9 },
            { id: 123, places: 2 },
            { id: 124, places: 2 },
            { id: 125, places: 9 },
            { id: 126, places: 9 },
        ],
    },
    [BuildingEnum.Two]: {
        id: BuildingEnum.Two,
        places: 128,
        rooms: [
            { id: 2201, places: 4 },
            { id: 2202, places: 4 },
            { id: 2203, places: 4 },
            { id: 2204, places: 4 },
            { id: 2205, places: 4 },
            { id: 2206, places: 2 },
            { id: 2207, places: 2 },
            { id: 2208, places: 2 },
            { id: 2209, places: 4 },
            { id: 2210, places: 1 },
            { id: 2211, places: 4 },
            { id: 2212, places: 4 },
            { id: 2213, places: 4 },
            { id: 2214, places: 4 },

            { id: 3102, places: 5 },
            { id: 3104, places: 4 },
            { id: 3303, places: 4 },
            { id: 3304, places: 4 },
        ],
    },
    [BuildingEnum.Four]: {
        id: BuildingEnum.Four,
        places: 51,
        rooms: [
            { id: 4201, places: 5 },
            { id: 4202, places: 5 },
            { id: 4203, places: 5 },
            { id: 4204, places: 6 },
            { id: 4205, places: 6 },
            { id: 4206, places: 5 },
            { id: 4207, places: 4 },
            { id: 4208, places: 2 },
            { id: 4209, places: 3 },

            { id: 4210, places: 2 },
            { id: 4211, places: 2 },
            { id: 4212, places: 2 },
            { id: 4213, places: 2 },
            { id: 4214, places: 2 },
        ],
    },
    [BuildingEnum.Six]: {
        id: BuildingEnum.Six,
        places: 48,
        rooms: [
            { id: 6101, places: 3 },
            { id: 6102, places: 3 },
            { id: 6103, places: 3 },
            { id: 6104, places: 3 },
            { id: 6105, places: 3 },
            { id: 6106, places: 4 },
            { id: 6107, places: 4 },
            { id: 6108, places: 4 },
            { id: 6109, places: 4 },
            { id: 6110, places: 4 },
            { id: 6111, places: 4 },
            { id: 6112, places: 4 },

            { id: 6201, places: 3 },
            { id: 6202, places: 3 },
            { id: 6203, places: 3 },
            { id: 6204, places: 3 },
            { id: 6205, places: 3 },
            { id: 6206, places: 3 },
            { id: 6207, places: 3 },
            { id: 6208, places: 3 },
            { id: 6209, places: 3 },
            { id: 6210, places: 3 },
            { id: 6211, places: 3 },
            { id: 6212, places: 3 },
        ],
    },
    [BuildingEnum.Ten]: {
        id: BuildingEnum.Ten,
        places: 32,
        rooms: [
            { id: 1001, places: 4 },
            { id: 1003, places: 4 },
            { id: 1002, places: 4 },
            { id: 1004, places: 4 },
            { id: 1005, places: 4 },
            { id: 1007, places: 4 },
            { id: 1008, places: 4 },
            { id: 1009, places: 4 },
        ],
    },
    [BuildingEnum.ForestHouse]: {
        id: BuildingEnum.ForestHouse,
        places: 10,
        rooms: [
            { id: 711, places: 1 },
            { id: 712, places: 2 },
            { id: 721, places: 2 },
            { id: 722, places: 3 },
            { id: 723, places: 3 },
        ],
    },
    [BuildingEnum.MushroomHouse]: {
        id: BuildingEnum.MushroomHouse,
        places: 11,
        rooms: [
            { id: 911, places: 1 },
            { id: 912, places: 3 },
            { id: 913, places: 2 },

            { id: 921, places: 2 },
            { id: 922, places: 3 },
        ],
    },
    [BuildingEnum.Hospital]: {
        id: BuildingEnum.Hospital,
        places: 11,
        rooms: [
            { id: 1, places: 2 },
            { id: 312, places: 3 },
            { id: 316, places: 3 },
            { id: 317, places: 4 },
        ],
    },
    [BuildingEnum.Flat]: {
        id: BuildingEnum.Flat,
        places: 6,
        rooms: [
            { id: 411, places: 2 },
            { id: 412, places: 2 },
            { id: 413, places: 2 },
        ],
    },
};
