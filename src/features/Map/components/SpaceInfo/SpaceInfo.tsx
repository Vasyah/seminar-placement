import { Badge, BadgeProps, Typography } from "antd";
import * as React from "react";

export interface ISpaceInfoProps {
	usersCount: number;
	isFull: boolean;
	buildingName: string;
	totalText: React.ReactNode;
	emptyText: React.ReactNode;
}

export default function SpaceInfo({
	buildingName,
	emptyText,
	isFull,
	totalText,
	usersCount,
}: ISpaceInfoProps) {
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

	const extraInfo = getExtraInfo(usersCount, isFull, buildingName);
	return (
		<div
			style={{
				backgroundColor: "white",
				padding: "0.5rem 1rem",
				borderRadius: "0.5rem",
			}}
		>
			<div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
				<Badge status={extraInfo.status} />
				<Typography.Title level={5} style={{ margin: 0 }}>
					{extraInfo.text}
				</Typography.Title>
			</div>

			{totalText}
			{emptyText}
		</div>
	);
}
