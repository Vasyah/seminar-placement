import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { PuzzleBotApi } from '../../../app/config/puzzlebotApi';
import { showMessage } from 'shared/components/message';

export function useSendPayments() {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (users_id: string[]) => {
            return await sendPaymentsSuccess(users_id);
        },
        onSuccess: () => {
            showMessage('success', 'Сообщения в телеграм отправлены');
        },
    });

    return {
        ...mutation,
        isUpdating: mutation.isPending,
    };
}

/*name
    :*/
// "Поздравление с успешной оплатой"
export const sendPaymentsSuccess = async (users_id: string[]) => {
    try {
        return users_id?.map(async (id) => sendPaymentSuccess(id));
    } catch (e) {
        showMessage('error', ' Ошибка при отправке увеомления в телеграм');
    }
};
export const sendPaymentSuccess = (user_id: string) => {
    try {
        return axios
            .get(PuzzleBotApi.url, {
                params: {
                    token: PuzzleBotApi.token,
                    method: 'sendCommand',
                    command_name: 'Поздравление с успешной оплатой',
                    tg_chat_id: user_id,
                },
                // headers: {
                //     // "Content-Type": "text/plain",
                //     'Access-Control-Allow-Origin': '*'
                // }
            })
            .then((r) => r.data as string);
    } catch (error) {
        console.error(error);
    }
};
