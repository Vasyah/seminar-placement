import { Modal, Spin } from 'antd';
import { IUser } from 'features/UserList/types';
import * as React from 'react';
import styled from 'styled-components';
import SpaceInfo from '../SpaceInfo/SpaceInfo';
import { createBuilding } from '../../utils/factories';
import { BUILDINGS_INFO } from 'features/UserList/mock';
import { UserList } from 'features/UserList/UserList';
import Rooms from 'features/Map/Rooms/Rooms';
import { UseMutateAsyncFunction } from '@tanstack/react-query';
import { UserAccomodation } from 'shared/api/googleSheets';

export interface IBuildingInfoProps {
    id: number;
    users: IUser[];
    updateUser: UseMutateAsyncFunction<unknown, Error, UserAccomodation>;
    isUpdating: boolean;
}

const Building: React.FunctionComponent<IBuildingInfoProps> = ({ id, users, updateUser, isUpdating }) => {
    const [userShow, setUserShow] = React.useState(false);

    const changeUserShow = (state: boolean) => setUserShow(state);

    const building = React.useMemo(() => createBuilding(users, id, `${id} корпус`, BUILDINGS_INFO[id].places), [users]);
    console.log('getNew building', building);

    const onUserAdd = async (id: string, ФИО: string, buildingId: number, roomId: number) => {
        changeUserShow(false);
        await updateUser({
            user_id: id,
            ФИО: ФИО,
            Комната: roomId,
            Корпус: buildingId,
        }).then((r) => console.log(r));
        console.log(`Пользователь добавлен ${id} ${ФИО}`);
    };

    const onUserDelete = async (id: string, ФИО: string) => {
        changeUserShow(false);
        await updateUser({ user_id: id, ФИО: ФИО }).then((r) => console.log(r));
        console.log(`Пользователь удален ${id} ${ФИО}`);
    };

    console.log({ buildingId: building.id, isUpdating });

    return (
        <BuildContainer>
            <h3>{building.title}</h3>
            <SpaceInfo buildingName="Информация о корпусе" usersCount={building.users.length} total={building?.places} reserved={building?.reservedPlaces} isFull={building.isFull} />
            <Rooms rooms={building.rooms} users={users} onUserAdd={onUserAdd} onUserDelete={onUserDelete} buildingId={building?.id} />

            <Modal width={1024} open={userShow} keyboard onCancel={() => setUserShow(false)} onOk={() => setUserShow(false)}>
                <UserList users={users} onUserAdd={onUserAdd} onUserDelete={onUserDelete} buildingId={building.id} />
            </Modal>
        </BuildContainer>
    );
};

export default Building;

const BuildContainer = styled.div`
    max-width: 100%;
    padding: 1rem;
`;
