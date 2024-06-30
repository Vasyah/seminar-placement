import { Modal, Spin } from 'antd';
import { IUser } from 'features/UserList/types';
import * as React from 'react';
import Room from '../Room/Room';
import styled from 'styled-components';
import SpaceInfo from '../SpaceInfo/SpaceInfo';
import { createBuilding } from '../../utils/factories';
import { BUILDINGS_INFO } from 'features/UserList/mock';
import { UserList } from 'features/UserList/UserList';
import { useUpdateUserAccomodation } from 'shared/api/googleSheets';
import Rooms from 'features/Map/Rooms/Rooms';

export interface IBuildingInfoProps {
    id: number;
    users: IUser[];
}

const Building: React.FunctionComponent<IBuildingInfoProps> = ({ id, users }) => {
    const { updateUserAccomodation, isUpdating } = useUpdateUserAccomodation();
    const [userShow, setUserShow] = React.useState(false);

    const changeUserShow = (state: boolean) => setUserShow(state);

    const building = React.useMemo(() => createBuilding(users, id, `${id} корпус`, BUILDINGS_INFO[id].places), [users]);
    console.log('getNew building', building);

    const onUserAdd = async (id: string, ФИО: string, buildingId: number, roomId: number) => {
        changeUserShow(false);
        await updateUserAccomodation({
            user_id: id,
            ФИО: ФИО,
            Комната: roomId,
            Корпус: buildingId,
        }).then((r) => console.log(r));
        console.log(`Пользователь добавлен ${id} ${ФИО}`);
    };

    const onUserDelete = async (id: string, ФИО: string) => {
        changeUserShow(false);
        await updateUserAccomodation({ user_id: id, ФИО: ФИО }).then((r) => console.log(r));
        console.log(`Пользователь удален ${id} ${ФИО}`);
    };

    console.log({ buildingId: building.id, isUpdating });

    return (
        <Spin tip="Загрузка..." spinning={isUpdating}>
            <BuildContainer>
                <h3>{building.title}</h3>
                <SpaceInfo
                    buildingName="Корпус"
                    usersCount={building.users.length}
                    totalText={<div>Всего мест в корпусе: {building.places}</div>}
                    emptyText={<div>Свободных мест в корпусе: {building.emptyPlaces}</div>}
                    isFull={building.isFull}
                />
                <Rooms rooms={building.rooms} users={users} onUserAdd={onUserAdd} onUserDelete={onUserDelete} buildingId={building?.id} />

                <Modal width={1024} open={userShow} keyboard onCancel={() => setUserShow(false)} onOk={() => setUserShow(false)}>
                    <UserList users={users} onUserAdd={onUserAdd} onUserDelete={onUserDelete} buildingId={building.id} />
                </Modal>
            </BuildContainer>
        </Spin>
    );
};

export default Building;

const BuildContainer = styled.div`
    padding: 1rem;
`;
