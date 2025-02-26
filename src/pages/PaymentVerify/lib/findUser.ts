import {IUser} from "../../../features/UserList/types";

export const findUser = (users: IUser[], searchUser: IUser) => users.findIndex(user => user?.user_id === searchUser?.user_id && user?.ФИО === searchUser?.ФИО)
