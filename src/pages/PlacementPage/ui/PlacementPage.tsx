import React, { useCallback, useEffect, useState } from 'react';
import { Alert, Col, Row, Spin } from 'antd';

import { IUser } from 'features/UserList/types';
import { useListUsers, useUpdateUserAccomodation } from 'shared/api/googleSheets';
import Building from 'features/Map/components/Building/Building';
import { BUILDINGS_INFO } from 'features/UserList/mock';
import ButtonWithTooltip from 'shared/components/MyButton/MyButton';
import { downloadGeneralInfoReport } from 'services/pdf/GenerateList';
import { FilePdfOutlined } from '@ant-design/icons';
import { Encrypter } from 'shared/utils/encryptUserId.ts/encryptUserId';
import { IRoomUserOption } from '../types';

export const PlacementPage = () => {
    const usersData = useListUsers();
    const [users, setUsers] = useState<IUser[]>([]);
    const [isPDFLoading, setPDFLoading] = useState(false);

    const { updateUserAccomodation, isUpdating } = useUpdateUserAccomodation();

    const getOptions = useCallback(
        (users: IUser[]): IRoomUserOption[] => users.map(({ user_id, ФИО, Город }) => ({ value: Encrypter.encodeId(user_id, ФИО), label: ФИО, Город, id: user_id })),
        [],
    );
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


    
    return (
        <>
            <Row justify={'start'}>
                <Col>
                    <ButtonWithTooltip
                        tooltipProps={{ title: 'Скачать список участников' }}
                        buttonProps={{
                            onClick: async () => {
                                setPDFLoading(true);
                                await downloadGeneralInfoReport(users.sort((a, b) =>
                                    a.ФИО.localeCompare(b.ФИО))).then(() => setPDFLoading(false));
                            },
                            icon: <FilePdfOutlined />,
                        }}
                    >
                        Скачать список участников
                    </ButtonWithTooltip>
                </Col>
            </Row>
            <Spin spinning={isUpdating || isPDFLoading} tip="Загрузка..." size="large" fullscreen style={{zIndex:'9999!important'}} />
            <Row wrap={true}>
                {Object.values(BUILDINGS_INFO).map((building) => (
                    <Col span={12} xs={24} xxl={12} key={building.id}>
                        <Building id={building.id} users={users} updateUser={updateUserAccomodation} isUpdating={isUpdating} getOptions={getOptions} />
                    </Col>
                ))}
            </Row>
        </>
    );
};
