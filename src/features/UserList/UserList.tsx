import React, {PropsWithChildren} from "react";
import {IUser} from "./types/types";

interface userListProps {
    className?:string
    users: IUser[]
}

export const UserList: React.FC<PropsWithChildren<userListProps>> = ({users}: PropsWithChildren<userListProps>) => {
    return (
        <>{users.map(user => )</>

    )
};
