import { IBuildingInfoProps } from 'features/Map/components/Building/Building';
import { IUser } from './types';
import { createBuilding, createRoom } from 'features/Map/utils/factories';

export type IRoomInfo = { id: number; places: number };

type BuildingInfoType = {
    // номер корпуса
    id: number;
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

export enum BuildingEnums {
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
}

// TODO: Для каждого корпуса и этажа необходимо описать количество мест
/*
	Информация о корпусах
	- номер корпуса
	- количество комнат на этаже
	- количество мест на этаже
	-
*/
export const BUILDINGS_INFO: Record<string, BuildingInfoType> = {
    [BuildingEnums.One]: {
        id: 1,
        places: 128,
        rooms: [
            { id: 6104, places: 4 },
            { id: 6105, places: 5 },
        ],
        // stages: [
        //     {
        //         id: 1,
        //         places: 64,
        //         title: '1 этаж',
        //         description: 'Информация о первом этаже',
        //         rooms: [
        //             { id: 6104, places: 4 },
        //             { id: 6105, places: 5 },
        //         ],
        //     },
        //     {
        //         id: 2,
        //         places: 64,
        //         title: '2 этаж',
        //         description: 'Информация о втором этаже',
        //         rooms: [
        //             { id: 3104, places: 4 },
        //             { id: 3105, places: 4 },
        //         ],
        //     },
        // ],
    },
    [BuildingEnums.Two]: {
        id: 2,
        places: 128,
        rooms: [
            { id: 3104, places: 4 },
            { id: 3102, places: 5 },
            { id: 3303, places: 4 },
            { id: 3304, places: 4 },
        ],
        // stages: [
        //     {
        //         id: 1,
        //         places: 64,
        //         title: '1 этаж',
        //         description: 'Информация о первом этаже',
        //         rooms: [
        //             { id: 3104, places: 4 },
        //             { id: 3102, places: 5 },
        //         ],
        //     },
        //     {
        //         id: 2,
        //         places: 64,
        //         title: '2 этаж',
        //         description: 'Информация о втором этаже',
        //         rooms: [
        //             { id: 3303, places: 4 },
        //             { id: 3304, places: 4 },
        //         ],
        //     },
        // ],
    },
};
