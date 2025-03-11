import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import axios from 'axios';
import {BuildingIdType} from 'features/UserList/mock';
import {SEMINAR} from 'shared/utils/consts/consts';
import {IUser} from '../../../features/UserList/types';

export const createListUsersKey = () => ['users'];

export const useListUsers = () => {
    return useQuery({queryKey: createListUsersKey(), queryFn: listUsers});
};

export function useUpdateUserAccomodation() {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (accomodation: UserAccomodation) => {
            return await updateUserAccomodation(accomodation);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: createListUsersKey()});
        },
    });

    return {
        ...mutation,
        updateUserAccomodation: mutation.mutateAsync,
        isUpdating: mutation.isPending,
    };
}

const listUsers = () => {
    try {
        return axios
            .get(SEMINAR.URL, {
                headers: {
                    'content-type': 'text/plain',
                },
            })
            .then((r) => r.data as IUser[]);
    } catch (error) {
        console.error(error);
    }
};

export interface UserAccomodation {
    user_id: string;
    ФИО: string;
    Корпус?: BuildingIdType;
    Комната?: BuildingIdType;
}

const updateUserAccomodation = (accomodation: UserAccomodation) => {
    try {
        return axios
            .post(SEMINAR.URL, accomodation, {
                headers: {
                    'content-type': 'text/plain',
                    'Access-Control-Allow-Origin': '*',
                },
            })
            .then((r) => r.data);
    } catch (error) {
        console.error(error);
    }
};

export interface UserPayment {
    user_id: string;
    ФИО: string;
    Корпус?: BuildingIdType;
    Комната?: BuildingIdType;
}

export function useUpdateUsersPayment(onSuccess?: () => void) {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (users: IUser[]) => {
            return await updateUsersPayment(users);
        },
        onSuccess: async () => {
            if (onSuccess) {
                onSuccess();
            }
            await queryClient.invalidateQueries({queryKey: createListUsersKey()});
        },
    });

    return {
        ...mutation,
        updateUserAccomodation: mutation.mutateAsync,
        isUpdating: mutation.isPending,
    };
}

const updateUsersPayment = (users: IUser[]) => {
    try {
        return axios
            .post('/googleSheets', JSON.stringify({users, action: 'updatePayment'}), {
                headers: {
                    'content-type': 'text/plain',
                    'Access-Control-Allow-Origin': '*',
                },
            })
            .then((r) => r.data);
    } catch (error) {
        console.error(error);
    }
};

