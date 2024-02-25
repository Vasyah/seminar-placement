import { Badge } from "antd";
import * as React from "react";
import styled from "styled-components";

interface IBuildingProps {
	id: number;
	title?: string;

	onClick?(id: number): void;
}

const buildingSize = "100";

const BuildingWrapper = styled.div`
	width: ${buildingSize}px;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 0.5rem;
	cursor: pointer;
	&:hover {
		border-radius: 0.5rem;
		box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px,
			rgba(0, 0, 0, 0.3) 0px 30px 60px -30px,
			rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset;
	}
`;

const Building: React.FunctionComponent<IBuildingProps> = ({
	id,
	onClick,
	title,
}) => {
	return (
		<BuildingWrapper>
			<Badge.Ribbon text={title} color="volcano">
				<img
					src="./house.png"
					alt=""
					width={buildingSize}
					height={buildingSize}
				/>
			</Badge.Ribbon>
		</BuildingWrapper>
	);
};

export default Building;
