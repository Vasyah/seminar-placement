import React, { PropsWithChildren } from 'react';
import { IUser } from './types';
import { Tabs } from 'antd';
import UserTable from './components/UsersTable/UsersTable';

interface userListProps {
    className?: string;
    users: IUser[];
    onUserAdd?: (id: string, ФИО: string, buildingId: number, roomId: number) => void;
    onUserDelete?: (id: string, ФИО: string) => void;
    buildingId?: number;
    roomAndStage?: { roomId: number; stageId: number } | null;
}

const baseStyle: React.CSSProperties = {
    maxWidth: '400px',
};

export const UserList: React.FC<PropsWithChildren<userListProps>> = ({ users = [], onUserAdd, onUserDelete, buildingId, roomAndStage }: PropsWithChildren<userListProps>) => {
    const getPlacedUsers = (users: IUser[]) => users.filter((user) => !!user.Корпус);

    const getUnPlacedUsers = (users: IUser[]) => users.filter((user) => !user.Корпус);

    const getTabUsers = (tabName = 'Все участники', users: IUser[]) => {
        switch (tabName) {
            case 'Все участники':
                return users;
            case 'Заселённые':
                return getPlacedUsers(users);
            case 'Незаселённые':
                return getUnPlacedUsers(users);
            default:
                return users;
        }
    };

const getTabContent = () =>
        ['Все участники', 'Заселённые', 'Незаселённые'].map((tabName, idx) => ({
            label: tabName,
            key: String(idx),
            children: <UserTable users={getTabUsers(tabName, users)} onUserAdd={onUserAdd} onUserDelete={onUserDelete} buildingId={buildingId} roomAndStage={roomAndStage} />,
        }));

    return (
        <div style={baseStyle}>
            <Tabs tabPosition={'top'} items={getTabContent()} />
        </div>
    );
};
