import * as React from "react";
import { IBuildingInfoProps } from "./../components/BuildingInfo/BuildingInfo";
import { IRoom, ISpaceInfo, IStage } from "features/Map/types";
import { IUser } from "features/UserList/types";
import { BUILDINGS_INFO, BuildingEnums } from "features/UserList/mock";

export const createBuilding = (
	// все участники семинара
	users: IUser[],
	building: number,
	title: string,
	description: string,
	places: number
): IBuildingInfoProps => {
	const buildingUsers = findUsersByBuilding(users, building);

	const spaceInfo = createSpaceInfo(building, buildingUsers, places);

	console.log({ buildingUsers, spaceInfo });
	const stages = BUILDINGS_INFO[building].stages.map(
		({ description, places, stage, title }) => {
			const stageUsers = findUsersByStage(buildingUsers, building, stage);

			return createStage(
				stageUsers,
				building,
				stage,
				places,
				title,
				description
			);
		}
	);

	return {
		...spaceInfo,
		stages,
		title,
		description,
	};
};

export const createStage = (
	// пользователи живущие на этаже
	users: IUser[],
	// номер корпуса
	building: number,
	// номер этажа
	stage: number,
	// количество мест на этаже
	places: number,
	title: string,
	description?: string
): IStage => {
	const spaceInfo = createSpaceInfo(stage, users, places);

	return { ...spaceInfo, title, description, rooms: [] };
};

export const createRoom = (
	id: number,
	users: IUser[],
	places: number
): IRoom => {
	return createSpaceInfo(id, users, places);
};

// Фабрика для информации о месте для сущностей Building, Stage, Room
export function createSpaceInfo(
	id: number,
	users: IUser[],
	places: number
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

const findUsersByBuilding = (users: IUser[], building: number) =>
	users.filter((user) => user?.Корпус && +user?.Корпус === building);

const findUsersByStage = (users: IUser[], building: number, stage: number) =>
	users.filter(
		(user) =>
			user?.Корпус &&
			+user?.Корпус === building &&
			user?.Этаж &&
			+user?.Этаж === stage
	);

const findUsersByRoom = (
	users: IUser[],
	building: number,
	stage: number,
	room: number
) =>
	users.filter(
		(user) =>
			user?.Корпус &&
			+user?.Корпус === building &&
			user?.Этаж &&
			+user?.Этаж === stage &&
			user.Комната &&
			+user.Комната === room
	);
