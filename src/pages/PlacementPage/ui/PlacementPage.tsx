import React, { useEffect, useState } from 'react';
import { Alert, Col, Row, Spin } from 'antd';

import { IUser } from 'features/UserList/types';
import { useListUsers, useUpdateUserAccomodation } from 'shared/api/googleSheets';
import Building from 'features/Map/components/Building/Building';
import { BUILDINGS_INFO } from 'features/UserList/mock';

export const PlacementPage = () => {
    const usersData = useListUsers();
    const [users, setUsers] = useState<IUser[]>([]);

    const { updateUserAccomodation, isUpdating } = useUpdateUserAccomodation();

    useEffect(() => {
        if (usersData.isFetched) {
            // const usersAdapted = usersData.data.map((data) => ({ ...data, Корпус: String(data.Корпус) }));
            setUsers(usersAdapted);
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
            <Row wrap={true}>
                {Object.values(BUILDINGS_INFO).map((building) => (
                    <Col span={12} key={building.id}>
                        <Building id={building.id} users={users} updateUser={updateUserAccomodation} isUpdating={isUpdating} />
                    </Col>
                ))}
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
