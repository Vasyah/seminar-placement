import { DeleteOutlined, UserAddOutlined } from '@ant-design/icons';
import { Space, Spin, Table, TableProps, Tag } from 'antd';
import { IUser } from 'features/UserList/types';
import * as React from 'react';
import ButtonWithTooltip from 'shared/components/MyButton/MyButton';
import { useListUsers } from 'shared/api/googleSheets';

interface IUserTableProps {
    users: IUser[];
    onUserAdd?: (id: string, ФИО: string, buildingId: number, roomId: number) => void;
    onUserDelete?: (id: string, ФИО: string) => void;
    buildingId?: number;
    roomAndStage?: { roomId: number; stageId: number } | null;
}

interface DataType {
    ФИО: string;
    Телефон: string;
    Город: string;
    status: string[];
    Корпус?: string;
    Этаж?: string;
    Комната?: string;
    user_id: string;
}

const UserTable: React.FunctionComponent<IUserTableProps> = ({ users, onUserAdd, onUserDelete, buildingId, roomAndStage }) => {
    const columns: TableProps<DataType>['columns'] = [
        {
            title: 'ФИО',
            dataIndex: 'ФИО',
            key: 'ФИО',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Телефон',
            dataIndex: 'Телефон',
            key: 'Телефон',
        },
        {
            title: 'Город',
            dataIndex: 'Город',
            key: 'Город',
        },
        {
            title: 'Статус',
            key: 'status',
            dataIndex: 'status',
            render: (_, { status }) => (
                <>
                    {status.map((status) => {
                        let color = status.length > 5 ? 'geekblue' : 'green';
                        if (status === 'loser') {
                            color = 'volcano';
                        }
                        return (
                            <Tag color={color} key={status}>
                                {status.toUpperCase()}
                            </Tag>
                        );
                    })}
                </>
            ),
        },
        {
            title: 'Корпус',
            key: 'Корпус',
            dataIndex: 'Корпус',
        },
        {
            title: 'Этаж',
            key: 'Этаж',
            dataIndex: 'Этаж',
        },
        {
            title: 'Комната',
            key: 'Комната',
            dataIndex: 'Комната',
        },
        {
            title: 'Действия',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <ButtonWithTooltip
                        tooltipProps={{ title: 'Добавить участника' }}
                        buttonProps={{
                            onClick: (event) => {
                                event.stopPropagation();

                                onUserAdd(record.user_id, record.ФИО, buildingId!, roomAndStage!.roomId);
                            },
                            icon: <UserAddOutlined />,
                        }}
                    />

                    {onUserDelete && !record.status.includes('Заселён') && (
                        <ButtonWithTooltip
                            tooltipProps={{ title: 'Выселить участника' }}
                            buttonProps={{
                                onClick: (event) => {
                                    event.stopPropagation();
                                    onUserDelete(record.user_id, record.ФИО);
                                },
                                icon: <DeleteOutlined />,
                            }}
                        />
                    )}
                </Space>
            ),
        },
    ];
    const getData = (users: IUser[]) =>
        users.map(({ ФИО, Город, Телефон, Корпус, Этаж, Комната, user_id }) => ({
            key: ФИО + user_id,
            ФИО,
            Город,
            Телефон,
            Корпус,
            Этаж,
            Комната,
            status: Корпус ? ['Заселен'] : [],
            user_id,
        }));
    const data = getData(users);

    return <Table columns={columns} dataSource={data} style={{ width: '100%' }} size={'large'} />;
};

export default UserTable;
