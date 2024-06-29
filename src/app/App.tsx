import React, { useEffect, useState } from 'react';
import { Breadcrumb, FloatButton, Layout, Menu, MenuProps, Modal, Spin, theme } from 'antd';

import { DesktopOutlined, FileOutlined, PieChartOutlined, TeamOutlined, UserOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import { USERS_MOCK } from 'features/UserList/mock';
import { IUser } from 'features/UserList/types';
import Building from 'shared/components/building/Building';
import { UserList } from 'features/UserList/UserList';
import { QueryClient } from '@tanstack/react-query';
import { useListUsers } from '../shared/api/googleSheets';

const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(label: React.ReactNode, key: React.Key, icon?: React.ReactNode, children?: MenuItem[]): MenuItem {
    return {
        key,
        icon,
        children,
        label,
    } as MenuItem;
}

const items: MenuItem[] = [
    getItem('Option 1', '1', <PieChartOutlined />),
    getItem('Option 2', '2', <DesktopOutlined />),
    getItem('User', 'sub1', <UserOutlined />, [getItem('Tom', '3'), getItem('Bill', '4'), getItem('Alex', '5')]),
    getItem('Team', 'sub2', <TeamOutlined />, [getItem('Team 1', '6'), getItem('Team 2', '8')]),
    getItem('Files', '9', <FileOutlined />),
];

const headerStyle: React.CSSProperties = {
    textAlign: 'center',
    color: '#fff',
    height: 64,
    paddingInline: 48,
    lineHeight: '64px',
    backgroundColor: '#4096ff',
};

const contentStyle: React.CSSProperties = {
    textAlign: 'center',
    minHeight: 120,
    lineHeight: '120px',
    color: '#fff',
    backgroundColor: '#0958d9',
};

const siderStyle: React.CSSProperties = {
    textAlign: 'center',
    lineHeight: '120px',
    color: '#fff',
    backgroundColor: '#1677ff',
};

const footerStyle: React.CSSProperties = {
    textAlign: 'center',
    color: '#fff',
    backgroundColor: '#4096ff',
};

const layoutStyle = {
    borderRadius: 8,
    overflow: 'hidden',
    width: '100%',
    maxWidth: '100%',
};

export const App = () => {
    const usersData = useListUsers();
    const [users, setUsers] = useState<IUser[]>([]);
    const [userShow, setUserShow] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    useEffect(() => {
        if (usersData.isFetched) {
            setUsers(usersData.data);
        }
    }, [usersData]);

    if (usersData.isLoading || usersData.isError) {
        return <Spin tip="Loading..." size="large" fullscreen />;
    }
    return (
        <div className="App">
            <Layout style={{ minHeight: '100vh' }}>
                <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                    <div className="demo-logo-vertical" />
                    <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />
                </Sider>
                <Layout>
                    <Header style={{ padding: 0, background: colorBgContainer }} />
                    <Content style={{ margin: '0 16px' }}>
                        <Breadcrumb items={[{ title: 'User' }, { title: 'Bill' }]} style={{ margin: '16px 0' }} />
                        <div
                            style={{
                                padding: 24,
                                minHeight: 360,
                                background: colorBgContainer,
                                borderRadius: borderRadiusLG,
                            }}
                        >
                            <Building id={1} title="1 Корпус" users={users} />
                            <Building id={2} title="2 Корпус" users={users} />
                        </div>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>Ant Design ©{new Date().getFullYear()} Created by Ant UED</Footer>
                    <FloatButton icon={<UsergroupAddOutlined />} type="primary" style={{ right: 24 }} onClick={() => setUserShow(true)} />

                    {userShow && (
                        <Modal width={1024} open={userShow} keyboard onCancel={() => setUserShow(false)} onOk={() => setUserShow(false)}>
                            <UserList users={users} />
                        </Modal>
                    )}
                </Layout>
            </Layout>
        </div>
    );
};
