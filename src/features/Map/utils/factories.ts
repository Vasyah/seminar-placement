import * as React from "react";
import { IBuilding, IRoom, ISpaceInfo, IStage } from "features/Map/types";
import { IUser } from "features/UserList/types";
import { BUILDINGS_INFO, BuildingEnums } from "features/UserList/mock";

export const createBuilding = (
	// все участники семинара
	users: IUser[],
	buildingId: number,
	title: string,
	places: number
): IBuilding => {
	const buildingUsers = findUsersByBuilding(users, buildingId);

	const spaceInfo = createSpaceInfo(buildingId, buildingUsers, places);

	const stages =
		BUILDINGS_INFO[buildingId]?.stages.map(
			({ description, places, id, title }) => {
				console.log([{ buildingUsers, buildingId }]);
				const stageUsers = findUsersByStage(buildingUsers, buildingId, id);

				return createStage(
					stageUsers,
					buildingId,
					id,
					places,
					title,
					description
				);
			}
		) ?? [];

	return {
		...spaceInfo,
		stages,
		title,
	};
};

export const createStage = (
	// пользователи живущие на этаже
	users: IUser[],
	// номер корпуса
	buildingId: number,
	// номер этажа
	stageId: number,
	// количество мест на этаже
	places: number,
	title: string,
	description?: string
): IStage => {
	const spaceInfo = createSpaceInfo(stageId, users, places);

	const stageInfo = BUILDINGS_INFO[buildingId].stages.find(
		(stage) => stage.id === stageId
	);

	if (!stageInfo) {
		console.error(`Этаж ${stageId} в корпусе ${buildingId} не найден`);
		throw new Error(`Этаж ${stageId} в корпусе ${buildingId} не найден`);
		//TODO: добавить toaster
	}

	const rooms =
		stageInfo?.rooms.map((room) => {
			const roomUsers = findUsersByRoom(users, buildingId, stageId, room.id);
			const spaceInfo = createSpaceInfo(room.id, roomUsers, room.places);
			return {
				...spaceInfo,
				title: `Комната №${room.id}`,
				users: roomUsers,
			};
		}) ?? [];

	return { ...spaceInfo, title, description, rooms, users };
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
	// номер сущности - Корпус, Этаж, Комната
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
