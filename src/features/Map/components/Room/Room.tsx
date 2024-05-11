import { Avatar, List } from 'antd';
import { IRoom } from 'features/Map/types';
import { IUser } from 'features/UserList/types';
import * as React from 'react';

interface IRoomProps extends IRoom {}

const Room: React.FunctionComponent<IRoomProps> = ({ emptyPlaces, id, isFull, places, reservedPlaces, users }) => {
    return (
        <List
            dataSource={users}
            renderItem={(resident, index) => (
                <List.Item>
                    <List.Item.Meta
                        avatar={<Avatar src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`} />}
                        title={<a href="https://ant.design">{resident.ФИО}</a>}
                        description={`${resident.Город} 
                                Дата рождения: ${resident['Дата рождения']}
                                Дата регистрации: ${resident['Дата регистрации']}
                                Дата оплаты: ${resident['Дата оплаты']}`}
                    />
                </List.Item>
            )}
        />
    );
};

export default Room;
