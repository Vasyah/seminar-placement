import React, { PropsWithChildren } from "react";
import { IUser } from "../UserList/types";
import { Flex } from "antd";

interface UserProps {
	className?: string;
	user: IUser;
}

const baseStyle: React.CSSProperties = {
	width: "33%",
	height: 54,
};

export const User: React.FC<PropsWithChildren<UserProps>> = ({
	user,
}: PropsWithChildren<UserProps>) => {
	return (
		<Flex>
			<div style={baseStyle}>{user.ФИО}</div>
			<div style={baseStyle}>{user.Телефон}</div>
			<div style={baseStyle}>{user.Город}</div>
			<div>
				<button>acti2on</button>
			</div>
			<div>Заселен в корпус</div>
		</Flex>
	);
};
