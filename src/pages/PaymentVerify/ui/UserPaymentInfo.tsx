import React from 'react';
import {Flex, Tag} from "antd";
import {IUser} from "../../../features/UserList/types";
import {checkForPayed} from "../lib/checkForPayed";


export interface UserPaymentInfoProps {
    user: IUser;
}

export const UserPaymentInfo = ({user}: UserPaymentInfoProps) => {
        const isPayed = checkForPayed(user)
        return <Flex gap={"small"} align={'center'}>
            <div>
                <Tag
                    color={isPayed ? 'success' : 'warning'}>{isPayed ? 'Оплачено' : 'Не оплачено'}
                </Tag>
            </div>
            <div>{user?.ФИО}</div>
        </Flex>
    }
;
