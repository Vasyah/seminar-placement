import { Avatar, Badge, BadgeProps, Button, Card, Collapse, Flex, List, Modal, Table, Tooltip } from 'antd';
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

export interface IBuildingInfoProps {
    id: number;
    users: IUser[];
}

const BuildingInfo: React.FunctionComponent<IBuildingInfoProps> = ({ id, users }) => {
    const { updateUserAccomodation, isUpdating } = useUpdateUserAccomodation();
    const [roomAndStage, setRoomAndStage] = React.useState<{ roomId: number; stageId: number } | null>(null);
    const [userShow, setUserShow] = React.useState(false);

    const changeUserShow = (state: boolean) => setUserShow(state);
    const building = createBuilding(users, id, `${id} корпус`, BUILDINGS_INFO[BuildingEnums.One].places);

    const getExtraInfo = (usersCount: number, isFull: boolean, buildingName: string): { status: BadgeProps['status']; text: string } => {
        if (isFull) {
            return {
                status: 'success',
                text: `${buildingName} заселён!`,
            };
        }

        if (usersCount > 0) {
            return { status: 'processing', text: `${buildingName} заселяется` };
        }

        return { status: 'default', text: `${buildingName} пустой` };
    };

    const stageInfo = building?.stages.map((stage) => {
        const rooms = stage.rooms.map((room) => {
            return {
                key: room.id,
                label: room.title,
                children: <Room {...room} />,
                extra: (
                    <Flex gap="middle" align="center">
                        <MyButton
                            tooltipProps={{ title: 'Добавить участника' }}
                            buttonProps={{
                                onClick: (event) => {
                                    event.stopPropagation();
                                    setRoomAndStage({ roomId: room.id, stageId: stage.id });
                                    changeUserShow(true);
                                },
                                icon: <UserAddOutlined />,
                            }}
                        />

                        <SpaceInfo
                            buildingName="Комната"
                            usersCount={room.users.length}
                            isFull={room.isFull}
                            emptyText={<div>Свободных мест: {room.emptyPlaces}</div>}
                            totalText={<div>Всего мест в комнате: {room.places}</div>}
                        />
                    </Flex>
                ),
            };
        });

        const info = {
            key: stage.id,
            label: `${stage.title} ${stage.description}`,

            children: <Collapse collapsible="icon" defaultActiveKey={['1']} items={rooms} />,
            extra: (
                <SpaceInfo
                    buildingName="Этаж"
                    usersCount={stage.users.length}
                    isFull={stage.isFull}
                    emptyText={<div>Свободных мест: {stage.emptyPlaces}</div>}
                    totalText={<div>Всего мест в комнате: {stage.places}</div>}
                />
            ),
        };

        return info;
    });

    const onUserAdd = async (id: string, ФИО: string, buildingId: number, stageId: number, roomId: number) => {
        changeUserShow(false);
        await updateUserAccomodation({
            user_id: id,
            ФИО: ФИО,
            Комната: roomId,
            Этаж: stageId,
            Корпус: buildingId,
        }).then((r) => console.log(r));
        console.log(`Пользователь добавлен ${id} ${ФИО}`);
    };

    const onUserDelete = async (id: string, ФИО: string) => {
        changeUserShow(false);
        await updateUserAccomodation({ user_id: id, ФИО: ФИО }).then((r) => console.log(r));
        console.log(`Пользователь удален ${id} ${ФИО}`);
    };

    const getRooms = (stages: IStage[]) => {
        const rooms = stages.map(stage => stage.rooms)

        return rooms.flat()
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
            <Collapse collapsible="icon" defaultActiveKey={['1']} items={stageInfo} />
            <Rooms
                <Modal width={1024} open={userShow} keyboard onCancel={() => setUserShow(false)} onOk={() => setUserShow(false)}>
                <UserList users={users} onUserAdd={onUserAdd} onUserDelete={onUserDelete} buildingId={building.id} roomAndStage={roomAndStage} />
            </Modal>
        </BuildContainer>
    );
};

export default BuildingInfo;

const BuildContainer = styled.div`
    padding: 1rem;
`;
