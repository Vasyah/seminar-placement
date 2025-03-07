import React, { PropsWithChildren } from 'react';
import { Layout, Menu, MenuProps, theme } from 'antd';

import { routeConfigArray } from 'shared/config/routeConfig/routeConfig';
import { useNavigate } from 'react-router-dom';
import cx from './style.module.scss';

const { Header, Content, Footer } = Layout;

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
                {/* <Header style={{display: 'flex', alignItems: 'center'}}>
                    <div className="demo-logo-vertical"/>
                    <Menu theme="dark" mode="horizontal"
                          defaultSelectedKeys={[window.location.pathname.split('/').join('')]} items={items}
                          style={{flex: 1, minWidth: 0}} onClick={navigateHandler}/> i
                </Header> */}
                <Layout style={{ background: '#fff' }}>
                    <Content>
                        <div
                            className={cx.content}
                            style={{
                                background: colorBgContainer,
                            }}
                        >
                            {children}
                        </div>
                    </Content>

                    <Footer className={cx.footer}>Космическая семья ©2025</Footer>
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
