import React, { useEffect, useState } from 'react';
import { Alert, Breadcrumb, Col, FloatButton, Layout, Menu, MenuProps, Modal, Row, Spin, theme } from 'antd';

import { DesktopOutlined, FileOutlined, PieChartOutlined, TeamOutlined, UserOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import { IUser } from 'features/UserList/types';
import { UserList } from 'features/UserList/UserList';
import { useListUsers, useUpdateUserAccomodation } from '../shared/api/googleSheets';
import Building from 'features/Map/components/Building/Building';

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

const items: MenuItem[] = [getItem('Главная', '1', <PieChartOutlined />), getItem('Заселение', '2', <DesktopOutlined />)];

export const App = () => {
    const usersData = useListUsers();
    const [users, setUsers] = useState<IUser[]>([]);
    const [userShow, setUserShow] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const { updateUserAccomodation, isUpdating } = useUpdateUserAccomodation();
    useEffect(() => {
        if (usersData.isFetched) {
            setUsers(usersData.data);
        }
    }, [usersData]);

    if (usersData.isLoading) {
        return <Spin tip="Загрузка..." size="large" fullscreen />;
    }

    if (usersData.isError) {
        return <Alert message="Ошибка загрузки участников. Обратитесь к Космическому администратору" type="error" />;
    }

    return (
        <div className="App">
            <Layout style={{ minHeight: '100vh' }}>
                <Header style={{ display: 'flex', alignItems: 'center' }}>
                    <div className="demo-logo-vertical" />
                    <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']} items={items} style={{ flex: 1, minWidth: 0 }} />
                </Header>
                <Layout>
                    <Header style={{ padding: 0, background: colorBgContainer }} />
                    <Content style={{ margin: '0 16px' }}>
                        <div
                            style={{
                                padding: 24,
                                minHeight: 360,
                                background: colorBgContainer,
                                borderRadius: borderRadiusLG,
                            }}
                        >
                            <Spin spinning={isUpdating} tip="Загрузка...">
                                <Row wrap={false}>
                                    <Col span={12}>
                                        <Building id={1} users={users} updateUser={updateUserAccomodation} isUpdating={isUpdating} />
                                    </Col>
                                    <Col span={12}>
                                        <Building id={2} users={users} updateUser={updateUserAccomodation} isUpdating={isUpdating} />
                                    </Col>
                                </Row>
                            </Spin>
                        </div>
                    </Content>

                    <Footer style={{ textAlign: 'center' }}>Космическая семья ©2024</Footer>
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
