import {
	Avatar,
	Badge,
	BadgeProps,
	Button,
	Card,
	Collapse,
	Flex,
	List,
	Modal,
	Tooltip,
} from "antd";
import { IUser } from "features/UserList/types";
import * as React from "react";
import Room from "../Room/Room";
import { IStage } from "features/Map/types";
import { BUILDINGS_INFO, BuildingEnums } from "features/UserList/mock";
import { createBuilding } from "features/Map/utils/factories";
import styled from "styled-components";
import SpaceInfo from "../SpaceInfo/SpaceInfo";
import { UserAddOutlined } from "@ant-design/icons";
import MyButton from "shared/components/MyButton/MyButton";
import { UserList } from "features/UserList/UserList";

export interface IBuildingInfoProps {
	id: number;
	users: IUser[];
}

const BuildingInfo: React.FunctionComponent<IBuildingInfoProps> = ({
	id,
	users,
}) => {
	const [userShow, setUserShow] = React.useState(false);

	const changeUserShow = (state: boolean) => setUserShow(state);
	const building = createBuilding(
		users,
		id,
		`${id} корпус`,
		BUILDINGS_INFO[BuildingEnums.One].places
	);

	const getExtraInfo = (
		usersCount: number,
		isFull: boolean,
		buildingName: string
	): { status: BadgeProps["status"]; text: string } => {
		if (isFull) {
			return {
				status: "success",
				text: `${buildingName} заселён!`,
			};
		}

		if (usersCount > 0) {
			return { status: "processing", text: `${buildingName} заселяется` };
		}

		return { status: "default", text: `${buildingName} пустой` };
	};

	const stageInfo = building?.stages.map((stage) => {
		const rooms = stage.rooms.map((room) => {
			return {
				key: room.id,
				label: room.title,
				children: <Room {...room} />,
				extra: (
					<Flex gap="middle" align="center">
						<MyButton
							tooltipProps={{ title: "Добавить участника" }}
							buttonProps={{
								onClick: (event) => {
									event.stopPropagation();
									changeUserShow(true);
								},
								icon: <UserAddOutlined />,
							}}
						/>

						<SpaceInfo
							buildingName="Комната"
							usersCount={room.users.length}
							isFull={room.isFull}
							emptyText={<div>Свободных мест: {room.emptyPlaces}</div>}
							totalText={<div>Всего мест в комнате: {room.places}</div>}
						/>
					</Flex>
				),
			};
		});

		const info = {
			key: stage.id,
			label: `${stage.title} ${stage.description}`,

			children: (
				<Collapse collapsible="icon" defaultActiveKey={["1"]} items={rooms} />
			),
			extra: (
				<SpaceInfo
					buildingName="Этаж"
					usersCount={stage.users.length}
					isFull={stage.isFull}
					emptyText={<div>Свободных мест: {stage.emptyPlaces}</div>}
					totalText={<div>Всего мест в комнате: {stage.places}</div>}
				/>
			),
		};

		return info;
	});

	const onUserAdd = (id: string, ФИО: string) => {
		changeUserShow(false);
		console.log(`Пользователь добавлен ${id} ${ФИО}`);
	};

	return (
		<BuildContainer>
			<h3>{building.title}</h3>
			<SpaceInfo
				buildingName="Корпус"
				usersCount={building.users.length}
				totalText={<div>Всего мест в корпусе: {building.places}</div>}
				emptyText={<div>Свободных мест в корпусе: {building.emptyPlaces}</div>}
				isFull={building.isFull}
			/>
			<Collapse collapsible="icon" defaultActiveKey={["1"]} items={stageInfo} />

			<Modal
				width={1024}
				open={userShow}
				keyboard
				onCancel={() => setUserShow(false)}
				onOk={() => setUserShow(false)}
			>
				<UserList users={users} onUserAdd={onUserAdd} />
			</Modal>
		</BuildContainer>
	);
};

export default BuildingInfo;

const BuildContainer = styled.div`
	padding: 1rem;
`;
