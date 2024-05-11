import { Button, ButtonProps, Tooltip, TooltipProps } from 'antd';
import * as React from 'react';

export interface IMyButtonProps {
    buttonProps: ButtonProps;
    tooltipProps: TooltipProps;
    children?: React.ReactNode;
}

export default function MyButton({ buttonProps, children, tooltipProps }: IMyButtonProps) {
    return (
        <Tooltip {...tooltipProps}>
            <Button {...buttonProps}>{children}</Button>
        </Tooltip>
    );
}
