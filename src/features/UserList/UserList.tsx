import React, {PropsWithChildren} from "react";
import {IUser} from "./types";
import {User} from "../User/User";
import {nanoid} from "nanoid";

interface userListProps {
    className?: string
    users: IUser[]
}

const baseStyle: React.CSSProperties = {
    maxWidth: '400px',
};

export const UserList: React.FC<PropsWithChildren<userListProps>> = ({users}: PropsWithChildren<userListProps>) => {
    return (<div style={baseStyle}>{users.map(user => <User key={nanoid()}  user={user}/>)}</div>)
};
