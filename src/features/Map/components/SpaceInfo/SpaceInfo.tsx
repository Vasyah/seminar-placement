import { Badge, BadgeProps, Tag, Typography } from 'antd';
import * as React from 'react';

export interface ISpaceInfoProps {
    usersCount: number;
    isFull: boolean;
    buildingName: string;
    total: React.ReactNode;
    reserved: React.ReactNode;
}

export default function SpaceInfo({ buildingName, reserved, isFull, total, usersCount }: ISpaceInfoProps) {
    const getExtraInfo = (usersCount: number, isFull: boolean, buildingName: string): { status: BadgeProps['status']; text: string } => {
        if (isFull) {
            return {
                status: 'success',
                text: `${buildingName} заселён!`,
            };
        }

        if (usersCount > 0) {
            return { status: 'processing', text: `${buildingName} заселяется` };
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
