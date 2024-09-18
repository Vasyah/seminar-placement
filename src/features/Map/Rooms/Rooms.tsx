import { QuestionCircleOutlined } from '@ant-design/icons';
import { Select, SelectProps, Table, TableProps, Tag, Tooltip, Typography } from 'antd';
import { IUser } from 'features/UserList/types';
import * as React from 'react';
import { IRoom } from '../types';
import { useCallback } from 'react';
import { EncryptedId, Encrypter } from 'shared/utils/encryptUserId.ts/encryptUserId';
import styled from 'styled-components';
import { BuildingIdType } from 'features/UserList/mock';

type TagRender = SelectProps['tagRender'];
interface IUserTableProps {
    rooms: IRoom[];
    users: IUser[];
    onUserAdd?: (id: string, ФИО: string, buildingId: BuildingIdType, roomId: number) => void;
    onUserDelete?: (id: string, ФИО: string) => void;
    buildingId: BuildingIdType;
    roomAndStage?: { roomId: number; stageId: number } | null;
}

type RoomTableType = { key: React.Key } & IRoom;

interface IRoomUserOption {
    value: string;
    label: string;
    Город: string;
    id: string;
}

const Rooms: React.FunctionComponent<IUserTableProps> = ({ users, rooms, onUserAdd, onUserDelete, buildingId }) => {
    const select = React.useRef(null);
    const getOptions = useCallback(
        (users: IUser[]): IRoomUserOption[] => users.map(({ user_id, ФИО, Город }) => ({ value: Encrypter.encodeId(user_id, ФИО), label: ФИО, Город, id: user_id })),
        [users],
    );

    const closeSelect = () => {
        if (select) {
            select?.current?.blur();
        }
    };

    const columns: TableProps<RoomTableType>['columns'] = [
        {
            title: 'Комната',
            dataIndex: 'id',
            key: 'id',
            render: (id) => {
                return (
                    <Typography.Title style={{ margin: '0!important' }} level={5}>
                        {id}
                    </Typography.Title>
                );
            },
        },
        {
            title: 'Участники',
            dataIndex: 'users',
            key: 'users',
            render: (roomUsers: IUser[], data) => {
                const options = getOptions(users);

                // для предотвращения открытия select при взаимодействии с tags
                const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
                    event.preventDefault();
                    event.stopPropagation();
                };

                const getUser = (encryptedId: EncryptedId): IUser => {
                    const id = Encrypter.decodeId(encryptedId);

                    return users.find((user) => +user.user_id === id) as IUser;
                };

                const tagRander: TagRender = ({ value, label: ФИО }: IRoomUserOption) => {
                    const user = getUser(value);

                    const onClose = () => {
                        if (onUserDelete) {
                            const id = Encrypter.decodeId(value);
                            onUserDelete(String(id), ФИО);
                            closeSelect();
                        }
                    };

                    const getAdditionInfo = (user: IUser) => {
                        return (
                            <div>
                                <StyledParagraph>Город: {user.Город}</StyledParagraph>
                                <StyledParagraph>Телефон: {user.Телефон}</StyledParagraph>
                            </div>
                        );
                    };

                    if (user) {
                        return (
                            <Tag color="blue" key={value} closable onClose={onClose} onMouseDown={onPreventMouseDown}>
                                <Tooltip placement={'top'} title={getAdditionInfo(user)}>
                                    {ФИО} {user?.Город}
                                </Tooltip>
                            </Tag>
                        );
                    }
                };

                const onChange = async (users: string[]) => {
                    const encryptedRoomUsers = getOptions(roomUsers).map((user) => user.value);

                    const difference = users.filter((id) => !encryptedRoomUsers.includes(id));

                    if (difference.length === 1) {
                        const id = Encrypter.decodeId(difference[0]);
                        const foundUser = getUser(String(id));

                        closeSelect();

                        onUserAdd?.(String(id), foundUser.ФИО, buildingId, +data.id);
                    }
                };

                const suffix = (
                    <>
                        <Typography.Text style={{ fontSize: '12px' }}>
                            {data.reservedPlaces} / {data.places}
                            <Tooltip
                                title={
                                    <>
                                        <StyledParagraph>Всего мест: {data.places}</StyledParagraph>
                                        <StyledParagraph>Осталось: {data.emptyPlaces}</StyledParagraph>
                                        <StyledParagraph>Размещено: {data.reservedPlaces}</StyledParagraph>
                                    </>
                                }
                            >
                                &nbsp;
                                <QuestionCircleOutlined />
                            </Tooltip>
                        </Typography.Text>
                    </>
                );
                return (
                    <div>
                        <StyledSelect
                            ref={select}
                            showSearch
                            options={options}
                            style={{ minWidth: 300, width: '100%' }}
                            mode="tags"
                            value={getOptions(roomUsers)}
                            tagRender={tagRander}
                            onChange={onChange}
                            maxCount={data.places}
                            suffixIcon={suffix}
                            placeholder={'Выберите участников'}
                        />
                    </div>
                );
            },
        },
    ];

    const getTableUsers = (rooms: IRoom[]): RoomTableType[] =>
        rooms.map((room) => ({
            key: +room.id,
            ...room,
        }));

    const tableUsers = getTableUsers(rooms);

    return <Table columns={columns} dataSource={tableUsers} style={{ width: '100%' }} size={'large'} bordered pagination={false} scroll={{ y: 500 }} />;
};

export default Rooms;

const StyledParagraph = styled(Typography.Paragraph)`
    color: inherit;
    margin: 0 !important;
    padding: 0;
`;

const StyledSelect = styled(Select)`
    .ant-select-selector {
        padding-right: 48px !important;
    }
`;
