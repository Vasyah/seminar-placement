import { DeleteOutlined, UserAddOutlined } from '@ant-design/icons';
import { Select, SelectProps, Space, Spin, Table, TableProps, Tag, Tooltip } from 'antd';
import { IUser } from 'features/UserList/types';
import * as React from 'react';
import MyButton from 'shared/components/MyButton/MyButton';
import { useListUsers } from 'shared/api/googleSheets';
import { IRoom } from '../types';
import { useState } from 'react';
import { EncryptedId, Encrypter } from 'shared/utils/encryptUserId.ts/encryptUserId';

type TagRender = SelectProps['tagRender'];
interface IUserTableProps {
    rooms: IRoom[];
    users: IUser[];
    onUserAdd?: (id: string, ФИО: string, buildingId: number, roomId: number) => void;
    onUserDelete?: (id: string, ФИО: string) => void;
    buildingId: number;
    roomAndStage?: { roomId: number; stageId: number } | null;
}

interface DataType {
    key: React.Key;
    Комната: string;
    Участники: IUser[];
    // places: number;
}

interface IRoomUserOption {
    value: string;
    label: string;
    Город: string;
    id: string;
}

const Rooms: React.FunctionComponent<IUserTableProps> = ({ users, rooms, onUserAdd, onUserDelete, buildingId }) => {
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
            render: (roomUsers: IUser[], data) => {
                const getOptions = (users: IUser[]): IRoomUserOption[] => users.map(({ user_id, ФИО, Город }) => ({ value: Encrypter.encodeId(user_id, ФИО), label: ФИО, Город, id: user_id }));

             
                
                // const [value, setValue] = useState(() => getOptions(roomUsers))
                const options = getOptions(users);
   console.log('new options',options);
                // для предотвращения открытия select при взаимодействии с tags
                const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
                    event.preventDefault();
                    event.stopPropagation();
                };

                const getUser = (encryptedId: EncryptedId): IUser => {
                    const id = Encrypter.decodeId(encryptedId);

                    return users.find((user) => +user.user_id === id) as IUser;
                };

                const tagRander: TagRender = ({ label, value, id }: IRoomUserOption) => {
                    const user = getUser(value);

                    const onClose = () => {
                        if (onUserDelete) {
                            onUserDelete(id, label);
                        }
                    };

                    const getAdditionInfo = (user: IUser) => {
                        return (
                            <div>
                                <p>Город: {user.Город}</p>
                                <p>Телефон: {user.Телефон}</p>
                            </div>
                        );
                    };

                    if (user)
                        return (
                            <Tag color="blue" key={value} closable onClose={onClose}>
                                <Tooltip placement={'top'} title={getAdditionInfo(user)}>
                                    {label} {user?.Город}
                                </Tooltip>
                            </Tag>
                        );
                };

                const onChange = async (users: string[]) => {
                    console.log(users);

                    const encryptedRoomUsers = getOptions(roomUsers).map(user => user.value)

                    const difference = users.filter(id => !encryptedRoomUsers.includes(id))

                    if(difference.length === 1){

                        const id = Encrypter.decodeId(difference[0]);
                        const foundUser = getUser(String(id))

                        onUserAdd?.(String(id),foundUser.ФИО, buildingId, +data.Комната );
                    }
                        
              
                };

                return (
                    <div>
                        <Select
                            showSearch
                            options={options}
                            style={{ minWidth: 700, maxWidth: 700 }}
                            mode="tags"
                            value={getOptions(roomUsers)}
                            tagRender={tagRander}
                            onMouseDown={onPreventMouseDown}
                            onChange={onChange}
                        />
                    </div>
                );
            },
        },
    ];

    const getData = (rooms: IRoom[]): DataType[] =>
        rooms.map(({ users, id, places }) => ({
            key: id,
            // places: places,
            Участники: users,
            Комната: String(id),
        }));

        console.log('change data');
        
    const data = getData(rooms);

    return <Table columns={columns} dataSource={data} style={{ width: '100%' }} size={'large'} bordered />;
};

export default Rooms;
