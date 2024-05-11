import { DeleteOutlined, UserAddOutlined } from '@ant-design/icons';
import { Space, Spin, Table, TableProps, Tag } from 'antd';
import { IUser } from 'features/UserList/types';
import * as React from 'react';
import MyButton from 'shared/components/MyButton/MyButton';
import { useListUsers } from 'shared/api/googleSheets';
import { IRoom } from '../types';

interface IUserTableProps {
    rooms: IRoom[]
    users: IUser[];
    onUserAdd?: (id: string, ФИО: string, buildingId: number, stageId: number, roomId: number) => void;
    onUserDelete?: (id: string, ФИО: string) => void;
    buildingId?: number;
    roomAndStage?: { roomId: number; stageId: number } | null;
}

interface DataType {
    Комната: string;
    Участники: IUser[];
}

const Rooms: React.FunctionComponent<IUserTableProps> = ({ users, rooms, onUserAdd, onUserDelete, buildingId, roomAndStage }) => {
    const columns: TableProps<DataType>['columns'] = [
        {
            title: 'Комната',
            dataIndex: 'Комната',
            key: 'Комната',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Участники',
            dataIndex: 'Участники',
            key: 'Участники',
        },

    ];
    const getData = (rooms: IRoom[]) =>
        rooms.map(({ ФИО, Город, Телефон, Корпус, Этаж, Комната, user_id }) => ({
            key: ФИО + user_id,
            ФИО,
            Город,
            Телефон,
            user_id,
        }));
    const data = getData(users);

    return <Table columns={columns} dataSource={data} style={{ width: '100%' }} size={'large'} />;
};

export default UserTable;
