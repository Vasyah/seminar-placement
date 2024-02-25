import { Avatar, Card, Collapse, List } from "antd";
import { IUser } from "features/UserList/types";
import * as React from "react";
import Room from "../Room/Room";
import { IStage } from "features/Map/types";

export interface IBuildingInfoProps {
	title: string;
	// Здесь можно указать участников, которые обычно здесь размещаются
	description?: string;
	stages: IStage[];
}

const BuildingInfo: React.FunctionComponent<IBuildingInfoProps> = ({
	title,
	description,
	stages,
}) => {
	const stageInfo = stages.map((stage) => {
		const rooms = stage.rooms.map((room) => ({
			key: room.id,
			label: `Комната №${room.id}`,
			children: <Room {...room} />,
		}));

		const info = {
			key: stage.id,
			label: `${stage.title} ${stage.description}`,
			children: (
				<Collapse collapsible="icon" defaultActiveKey={["1"]} items={rooms} />
			),
		};

		return info;
	});

	return (
		<div>
			<h3>{title}</h3>
			<p>Описание корпуса: {description}</p>
			<Collapse collapsible="icon" defaultActiveKey={["1"]} items={stageInfo} />
		</div>
	);
};

export default BuildingInfo;
