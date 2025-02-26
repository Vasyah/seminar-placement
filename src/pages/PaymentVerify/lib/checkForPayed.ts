import {IUser} from "../../../features/UserList/types";

export const checkForPayed = (user: IUser) => {
    return !!user?.Координатор && !!user?.["Сумма оплаты"] && !!user?.["Дата оплаты"]
}
