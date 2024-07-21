import { IUser } from 'features/UserList/types';
import * as React from 'react';
import styled from 'styled-components';
import SpaceInfo from '../SpaceInfo/SpaceInfo';
import { createBuilding } from '../../utils/factories';
import { BuildingIdType, BUILDINGS_INFO } from 'features/UserList/mock';
import Rooms from 'features/Map/Rooms/Rooms';
import { UseMutateAsyncFunction } from '@tanstack/react-query';
import { UserAccomodation } from 'shared/api/googleSheets';

export interface IBuildingInfoProps {
    id: BuildingIdType;
    users: IUser[];
    updateUser: UseMutateAsyncFunction<unknown, Error, UserAccomodation>;
    isUpdating: boolean;
}

const Building: React.FunctionComponent<IBuildingInfoProps> = ({ id, users, updateUser }) => {
    const building = React.useMemo(() => createBuilding(users, id, `${id} корпус`, BUILDINGS_INFO[id]?.places), [users]);

    const onUserAdd = React.useCallback(async (id: string, ФИО: string, buildingId: BuildingIdType, roomId: number) => {
        await updateUser({
            user_id: id,
            ФИО: ФИО,
            Комната: roomId,
            Корпус: buildingId,
        }).then((r) => console.log(r));
        console.log(`Пользователь добавлен ${id} ${ФИО}`);
    }, []);

    const onUserDelete = async (id: string, ФИО: string) => {
        await updateUser({ user_id: id, ФИО: ФИО }).then((r) => console.log(r));
        console.log(`Пользователь удален ${id} ${ФИО}`);
    };

    return (
        <BuildContainer>
            <h3>{building.title}</h3>
            <SpaceInfo buildingName="Информация о корпусе" usersCount={building.users.length} total={building?.places} reserved={building?.reservedPlaces} isFull={building.isFull} />
            <Rooms rooms={building.rooms} users={users} onUserAdd={onUserAdd} onUserDelete={onUserDelete} buildingId={building?.id} />
        </BuildContainer>
    );
};

export default Building;

const BuildContainer = styled.div`
    max-width: 100%;
    padding: 1rem;
`;
