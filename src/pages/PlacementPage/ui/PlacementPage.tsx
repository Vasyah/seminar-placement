import React, { useEffect, useState } from 'react';
import { Alert, Col, MenuProps, Row, Spin, theme } from 'antd';

import { DesktopOutlined, FileOutlined, PieChartOutlined } from '@ant-design/icons';
import { IUser } from 'features/UserList/types';
import { useListUsers, useUpdateUserAccomodation } from 'shared/api/googleSheets';
import Building from 'features/Map/components/Building/Building';

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

export const PlacementPage = () => {
    const usersData = useListUsers();
    const [users, setUsers] = useState<IUser[]>([]);

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

        // <FloatButton icon={<UsergroupAddOutlined />} type="primary" style={{ right: 24 }} onClick={() => setUserShow(true)} />

        // {userShow && (
        //     <Modal width={1024} open={userShow} keyboard onCancel={() => setUserShow(false)} onOk={() => setUserShow(false)}>
        //         <UserList users={users} />
        //     </Modal>
        // )}
    );
};
