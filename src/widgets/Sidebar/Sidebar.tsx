import React, { PropsWithChildren } from 'react';

interface SidebarProps {
    className?: string;
}

export const Sidebar: React.FC<PropsWithChildren<SidebarProps>> = ({ className }: PropsWithChildren<SidebarProps>) => {
    return <Sidebar>Content</Sidebar>;
};
