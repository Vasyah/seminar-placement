import React from 'react';
import { Flex, Tag, Typography } from 'antd';
import { IUser } from '../../../features/UserList/types';
import { checkForPayed } from '../lib/checkForPayed';
import Paragraph from 'antd/es/typography/Paragraph';
import { CheckCircleOutlined, CloseOutlined } from '@ant-design/icons';

export interface UserPaymentInfoProps {
    user: IUser;
}

export const UserPaymentInfo = ({ user }: UserPaymentInfoProps) => {
    const isPayed = checkForPayed(user);
    return (
        <div style={{ display: 'flex', alignItems: 'center', padding: '0' }}>
            <div>
                <Tag color={isPayed ? 'success' : 'warning'} style={{ fontSize: '12px' }}>
                    {isPayed ? <CheckCircleOutlined /> : <CloseOutlined />}
                </Tag>
            </div>
            <Typography.Text style={{ fontSize: '14px' }}>{user?.ФИО}</Typography.Text>
        </div>
    );
};
