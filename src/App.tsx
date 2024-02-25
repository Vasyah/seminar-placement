import React, { useEffect, useState } from "react";
import "./App.css";
import { getUsers } from "./services/map/map";
import { MAIN_PAGE_URL } from "./constants/constants";
import { UserList } from "./features/UserList/UserList";
import { BUILDING_MOCK, USERS_MOCK } from "features/UserList/mock";
import { IUser } from "features/UserList/types";
import { Breadcrumb, Layout, Menu, MenuProps, theme } from "antd";

import {
	DesktopOutlined,
	FileOutlined,
	PieChartOutlined,
	TeamOutlined,
	UserOutlined,
} from "@ant-design/icons";
import Building from "shared/components/building/Building";
import BuildingInfo from "features/Map/components/BuildingInfo/BuildingInfo";

const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
	label: React.ReactNode,
	key: React.Key,
	icon?: React.ReactNode,
	children?: MenuItem[]
): MenuItem {
	return {
		key,
		icon,
		children,
		label,
	} as MenuItem;
}

const items: MenuItem[] = [
	getItem("Option 1", "1", <PieChartOutlined />),
	getItem("Option 2", "2", <DesktopOutlined />),
	getItem("User", "sub1", <UserOutlined />, [
		getItem("Tom", "3"),
		getItem("Bill", "4"),
		getItem("Alex", "5"),
	]),
	getItem("Team", "sub2", <TeamOutlined />, [
		getItem("Team 1", "6"),
		getItem("Team 2", "8"),
	]),
	getItem("Files", "9", <FileOutlined />),
];

const headerStyle: React.CSSProperties = {
	textAlign: "center",
	color: "#fff",
	height: 64,
	paddingInline: 48,
	lineHeight: "64px",
	backgroundColor: "#4096ff",
};

const contentStyle: React.CSSProperties = {
	textAlign: "center",
	minHeight: 120,
	lineHeight: "120px",
	color: "#fff",
	backgroundColor: "#0958d9",
};

const siderStyle: React.CSSProperties = {
	textAlign: "center",
	lineHeight: "120px",
	color: "#fff",
	backgroundColor: "#1677ff",
};

const footerStyle: React.CSSProperties = {
	textAlign: "center",
	color: "#fff",
	backgroundColor: "#4096ff",
};

const layoutStyle = {
	borderRadius: 8,
	overflow: "hidden",
	width: "100%",
	maxWidth: "100%",
};

function App() {
	const [users, setUsers] = useState<IUser[]>([]);
	const [collapsed, setCollapsed] = useState(false);
	const {
		token: { colorBgContainer, borderRadiusLG },
	} = theme.useToken();
	useEffect(() => {
		// getUsers(MAIN_PAGE_URL).then(users => {
		//     console.log(users)
		//     setUsers(users.data)
		// })
		setUsers(USERS_MOCK);
	}, []);

	return (
		<div className="App">
			<Layout style={{ minHeight: "100vh" }}>
				<Sider
					collapsible
					collapsed={collapsed}
					onCollapse={(value) => setCollapsed(value)}
				>
					<div className="demo-logo-vertical" />
					<Menu
						theme="dark"
						defaultSelectedKeys={["1"]}
						mode="inline"
						items={items}
					/>
				</Sider>
				<Layout>
					<Header style={{ padding: 0, background: colorBgContainer }} />
					<Content style={{ margin: "0 16px" }}>
						<Breadcrumb style={{ margin: "16px 0" }}>
							<Breadcrumb.Item>User</Breadcrumb.Item>
							<Breadcrumb.Item>Bill</Breadcrumb.Item>
						</Breadcrumb>
						<div
							style={{
								padding: 24,
								minHeight: 360,
								background: colorBgContainer,
								borderRadius: borderRadiusLG,
							}}
						>
							{/* <UserList users={users} /> */}
							<Building id={1} title="3 Корпус" />
							<BuildingInfo
								title={BUILDING_MOCK.title}
								stages={BUILDING_MOCK.stages}
								description={BUILDING_MOCK.description}
							/>
						</div>
					</Content>
					<Footer style={{ textAlign: "center" }}>
						Ant Design ©{new Date().getFullYear()} Created by Ant UED
					</Footer>
				</Layout>
			</Layout>
		</div>
	);
}

export default App;
