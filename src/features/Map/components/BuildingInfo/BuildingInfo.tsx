import { Avatar, Badge, BadgeProps, Button, Card, Collapse, Flex, List, Modal, Spin, Table, Tooltip } from 'antd';
import { IUser } from 'features/UserList/types';
import * as React from 'react';
import Room from '../Room/Room';
import { IStage } from 'features/Map/types';
import styled from 'styled-components';
import SpaceInfo from '../SpaceInfo/SpaceInfo';
import { UserAddOutlined } from '@ant-design/icons';
import { createBuilding } from '../../utils/factories';
import { BuildingEnums, BUILDINGS_INFO } from 'features/UserList/mock';
import MyButton from 'shared/components/MyButton/MyButton';
import { UserList } from 'features/UserList/UserList';
import { useUpdateUserAccomodation } from 'shared/api/googleSheets';
import Rooms from 'features/Map/Rooms/Rooms';

export interface IBuildingInfoProps {
    id: number;
    users: IUser[];
}

const BuildingInfo: React.FunctionComponent<IBuildingInfoProps> = ({ id, users }) => {
    const { updateUserAccomodation, isUpdating } = useUpdateUserAccomodation();
    const [userShow, setUserShow] = React.useState(false);

    const changeUserShow = (state: boolean) => setUserShow(state);

    
    const building = createBuilding(users, id, `${id} корпус`, BUILDINGS_INFO[BuildingEnums.One].places);
    console.log('getNew building',building);

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

    console.log('change room info');
    
    const getRooms = (stages: IStage[]) => {
        const rooms = stages.map(stage => stage.rooms)

        return rooms.flat()
    }

    if (isUpdating) {
        return <Spin tip="Loading..." size="large" fullscreen />;
    }

    return (
        <BuildContainer>
            <h3>{building.title}</h3>
            <SpaceInfo
                buildingName="Корпус"
                usersCount={building.users.length}
                totalText={<div>Всего мест в корпусе: {building.places}</div>}
                emptyText={<div>Свободных мест в корпусе: {building.emptyPlaces}</div>}
                isFull={building.isFull}
            />
            <Rooms rooms={getRooms(building.stages)} users={users} onUserAdd={onUserAdd} buildingId={building?.id} />

            <Modal width={1024} open={userShow} keyboard onCancel={() => setUserShow(false)} onOk={() => setUserShow(false)}>
                <UserList users={users} onUserAdd={onUserAdd} onUserDelete={onUserDelete} buildingId={building.id}/>
            </Modal>
        </BuildContainer>
    );
};

export default BuildingInfo;

const BuildContainer = styled.div`
    padding: 1rem;
`;
