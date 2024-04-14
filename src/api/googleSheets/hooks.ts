import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const URL = 'https://script.google.com/macros/s/AKfycby030zqjlqMfn0BoMGr-IItt6jpsWxkuaFkUuxY4ZWi1U-gFzU5o0D-PCL6uUaTnXV6/exec';
export const createListUsersKey = () => ['users'];

export const useListUsers = () => {
    return useQuery({ queryKey: createListUsersKey(), queryFn: listUsers });
};

export function useUpdateUserAccomodation() {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (accomodation: UserAccomodation) => {
            return await updateUserAccomodation(accomodation);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: createListUsersKey() });
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
            .get(URL, {
                headers: {
                    'content-type': 'text/plain',
                },
            })
            .then((r) => r.data);
    } catch (error) {
        console.error(error);
    }
};

interface UserAccomodation {
    user_id: string;
    ФИО: string;
    Корпус?: string;
    Этаж?: string;
    Комната?: string;
}

const updateUserAccomodation = (accomodation: UserAccomodation) => {
    try {
        return axios
            .post(URL, accomodation, {
                headers: {
                    'content-type': 'text/plain',
                },
            })
            .then((r) => r.data);
    } catch (error) {
        console.error(error);
    }
};
