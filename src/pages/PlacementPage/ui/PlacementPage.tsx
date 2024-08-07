import React, { useEffect, useState } from 'react';
import { Alert, Col, Row, Spin } from 'antd';

import { IUser } from 'features/UserList/types';
import { useListUsers, useUpdateUserAccomodation } from 'shared/api/googleSheets';
import Building from 'features/Map/components/Building/Building';
import { BUILDINGS_INFO } from 'features/UserList/mock';
import MyButton from 'shared/components/MyButton/MyButton';
import { downloadGeneralInfoReport } from 'services/pdf/GenerateList';
import { FilePdfOutlined } from '@ant-design/icons';

export const PlacementPage = () => {
    const usersData = useListUsers();
    const [users, setUsers] = useState<IUser[]>([]);
    const [isPDFLoading, setPDFLoading] = useState(false);

    const { updateUserAccomodation, isUpdating } = useUpdateUserAccomodation();

    useEffect(() => {
        if (usersData.isFetched) {
            setUsers(usersData?.data);
        }
    }, [usersData]);

    if (usersData.isLoading) {
        return <Spin tip="Загрузка..." size="large" fullscreen />;
    }

    if (usersData.isError) {
        return <Alert message="Ошибка загрузки участников. Обратитесь к Космическому администратору" type="error" />;
    }

    console.log(isUpdating);

    return (
        <>
            <Row justify={'end'}>
                <Col>
                    <MyButton
                        tooltipProps={{ title: 'Скачать список участников' }}
                        buttonProps={{
                            onClick: async () => {
                                setPDFLoading(true);
                                await downloadGeneralInfoReport(users).then(() => setPDFLoading(false));
                            },
                            icon: <FilePdfOutlined />,
                        }}
                    />
                </Col>
            </Row>
            <Spin spinning={isUpdating || isPDFLoading} tip="Загрузка..." size="large" fullscreen />
            <Row wrap={true}>
                {Object.values(BUILDINGS_INFO).map((building) => (
                    <Col span={12} key={building.id}>
                        <Building id={building.id} users={users} updateUser={updateUserAccomodation} isUpdating={isUpdating} />
                    </Col>
                ))}
            </Row>
        </>
        // <FloatButton icon={<UsergroupAddOutlined />} type="primary" style={{ right: 24 }} onClick={() => setUserShow(true)} />

        // {userShow && (
        //     <Modal width={1024} open={userShow} keyboard onCancel={() => setUserShow(false)} onOk={() => setUserShow(false)}>
        //         <UserList users={users} />
        //     </Modal>
        // )}
    );
};
