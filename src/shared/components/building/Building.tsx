import { Badge, Button, Modal } from 'antd';
import { IUser } from 'features/UserList/types';
import * as React from 'react';
import styled from 'styled-components';
import BuildingInfo from 'features/Map/components/BuildingInfo/BuildingInfo';

interface IBuildingProps {
    id: number;
    title?: string;
    users: IUser[];
}

const Building: React.FunctionComponent<IBuildingProps> = ({ id, title, users }) => {
    const [showModal, setShowModal] = React.useState(false);

    const changeShowModal = () => setShowModal((prev) => !prev);
    return (
        <>

            <BuildingInfo id={id} users={users} />

        </>
    );
};

export default Building;

const buildingSize = '100';

const BuildingWrapper = styled(Button)`
    width: ${buildingSize}px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem;
    min-height: ${buildingSize}px;
    cursor: pointer;
    &:hover {
        border-radius: 0.5rem;
        box-shadow:
            rgba(50, 50, 93, 0.25) 0px 50px 100px -20px,
            rgba(0, 0, 0, 0.3) 0px 30px 60px -30px,
            rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset;
    }
`;
