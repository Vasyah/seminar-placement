import React, { PropsWithChildren } from "react";
import { IUser } from "./types";
import { User } from "./components/User/User";
import { nanoid } from "nanoid";
import { Tabs } from "antd";
import UserTable from "./components/UsersTable/UsersTable";

interface userListProps {
	className?: string;
	users: IUser[];
	onUserAdd?: (id: string, ФИО: string) => void;
	onUserDelete?: (id: string, ФИО: string) => void;
}

const baseStyle: React.CSSProperties = {
	maxWidth: "400px",
};

export const UserList: React.FC<PropsWithChildren<userListProps>> = ({
	users = [],
	onUserAdd,
	onUserDelete,
}: PropsWithChildren<userListProps>) => {
	const getPlacedUsers = (users: IUser[]) =>
		users.filter((user) => !!user.Корпус);

	const getUnPlacedUsers = (users: IUser[]) =>
		users.filter((user) => !user.Корпус);

	const getTabUsers = (tabName = "Все участники", users: IUser[]) => {
		switch (tabName) {
			case "Все участники":
				return users;
			case "Заселённые":
				return getPlacedUsers(users);
			case "Незаселённые":
				return getUnPlacedUsers(users);
			default:
				return users;
		}
	};

	const getTabContent = () =>
		["Все участники", "Заселённые", "Незаселённые"].map((tabName, idx) => ({
			label: tabName,
			key: String(idx),
			children: (
				<UserTable
					users={getTabUsers(tabName, users)}
					onUserAdd={onUserAdd}
					onUserDelete={onUserDelete}
				/>
			),
		}));

	return (
		<div style={baseStyle}>
			<Tabs tabPosition={"top"} items={getTabContent()} />
		</div>
	);
};
