import { DeleteOutlined, UserAddOutlined } from '@ant-design/icons';
import { Select, Space, Spin, Table, TableProps, Tag } from 'antd';
import { IUser } from 'features/UserList/types';
import * as React from 'react';
import MyButton from 'shared/components/MyButton/MyButton';
import { useListUsers } from 'shared/api/googleSheets';
import { IRoom } from '../types';
import { useState } from 'react';

interface IUserTableProps {
    rooms: IRoom[]
    users: IUser[];
    onUserAdd?: (id: string, ФИО: string, buildingId: number, stageId: number, roomId: number) => void;
    onUserDelete?: (id: string, ФИО: string) => void;
    buildingId?: number;
    roomAndStage?: { roomId: number; stageId: number } | null;
}

interface DataType {
    key: React.Key;
    Комната: string;
    Участники: IUser[];
    // places: number;
}

const Rooms: React.FunctionComponent<IUserTableProps> = ({ users, rooms, onUserAdd, onUserDelete, buildingId, roomAndStage }) => {
    const columns: TableProps<DataType>['columns'] = [
        {
            title: 'Комната',
            dataIndex: 'Комната',
            key: 'Комната',
        },
        {
            title: 'Участники',
            dataIndex: 'Участники',
            key: 'Участники',
            render: (roomUsers: IUser[]) => {
                const getOptions = (users: IUser[]) => users.map(({ user_id, ФИО }) => ({ value: user_id + ФИО, label: ФИО }))

                // const [value, setValue] = useState(() => getOptions(roomUsers))
                const options = getOptions(users)


                return (
                    <div>
                        <Select showSearch options={options} style={{ minWidth: 700 }} mode="tags" value={getOptions(roomUsers)} />
                    </div>
                );
            }
        },

    ];
    const getData = (rooms: IRoom[]): DataType[] =>
        rooms.map(({ users, id, places }) => ({
            key: id,
            // places: places,
            'Участники': users,
            'Комната': String(id),
        }));

    const data = getData(rooms);

    return <Table columns={columns} dataSource={data} style={{ width: '100%' }} size={'large'} />;
};

export default Rooms;
