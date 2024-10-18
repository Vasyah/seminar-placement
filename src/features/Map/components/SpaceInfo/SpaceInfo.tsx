import { BadgeProps, Tag } from 'antd';
import * as React from 'react';
import { useMyToken } from 'shared/token/token';

export interface ISpaceInfoProps {
    usersCount: number;
    isFull: boolean;
    buildingName: string;
    total: React.ReactNode;
    reserved: React.ReactNode;
}

export default function SpaceInfo({ buildingName, reserved, isFull, total, usersCount }: ISpaceInfoProps) {
    const { token } = useMyToken();
    const getExtraInfo = (usersCount: number, isFull: boolean, buildingName: string): { status: BadgeProps['status'] | string; text: string } => {
        if (isFull) {
            return {
                status: token.colorSuccess,
                text: `${buildingName} заселён!`,
            };
        }

        if (usersCount > 0) {
            return { status: token.colorPrimary, text: `${buildingName} заселяется` };
        }

        return { status: 'default', text: `${buildingName} пустой` };
    };

    const extraInfo = getExtraInfo(usersCount, isFull, buildingName);
    return (
        <div style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Tag color={extraInfo.status} style={{ fontSize: '16px' }}>
                    Заселено {reserved} из {total}
                </Tag>
            </div>
        </div>
    );
}
