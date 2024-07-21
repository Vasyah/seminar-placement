import React, { FC, PropsWithChildren } from 'react';
import { Layout, Menu, MenuProps, theme } from 'antd';

import { DesktopOutlined, PieChartOutlined, TeamOutlined, UserOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import { routeConfig, routeConfigArray, RoutePath } from 'shared/config/routeConfig/routeConfig';
import { useNavigate } from 'react-router-dom';

const { Header, Content, Footer, Sider } = Layout;
export interface AppLayoutProps {
    content: React.ReactNode;
}
type MenuItem = Required<MenuProps>['items'][number];

function getItem(label: React.ReactNode, key: string, icon?: React.ReactNode, children?: MenuItem[]): MenuItem {
    return {
        key,
        icon,
        children,
        label,
    } as MenuItem;
}

const items: MenuItem[] = routeConfigArray.map(({ label, path, icon }) => getItem(label, path, icon));
// ([getItem('Главная', RoutePath.dashboard, <PieChartOutlined />), getItem('Заселение', RoutePath.placement, <DesktopOutlined />)];

export const AppLayout: React.FC<PropsWithChildren> = ({ children }) => {
    const navigate = useNavigate();

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const navigateHandler: MenuProps['onClick'] = (e) => {
        navigate(e.key);
    };
    return (
        <div className="App">
            <Layout style={{ minHeight: '100vh' }}>
                <Header style={{ display: 'flex', alignItems: 'center' }}>
                    <div className="demo-logo-vertical" />
                    <Menu theme="dark" mode="horizontal" defaultSelectedKeys={[window.location.pathname]} items={items} style={{ flex: 1, minWidth: 0 }} onClick={navigateHandler} />
                </Header>
                <Layout>
                    <Content>
                        <div
                            style={{
                                padding: 24,
                                minHeight: 'calc(100vh - 96px)',
                                background: colorBgContainer,
                                borderRadius: borderRadiusLG,
                            }}
                        >
                            {children}
                        </div>
                    </Content>

                    <Footer style={{ textAlign: 'center', height: '32px', padding: '0.5rem' }}>Космическая семья ©2024</Footer>
                    {/* <FloatButton icon={<UsergroupAddOutlined />} type="primary" style={{ right: 24 }} onClick={() => setUserShow(true)} /> */}

                    {/* {userShow && (
                        <Modal width={1024} open={userShow} keyboard onCancel={() => setUserShow(false)} onOk={() => setUserShow(false)}>
                            <UserList users={users} />
                        </Modal>
                    )} */}
                </Layout>
            </Layout>
        </div>
    );
};
