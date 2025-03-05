import axios from 'axios';
import {PuzzleBotApi} from '../../../app/config/puzzlebotApi';
import {showMessage} from 'shared/components/message';


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
                }
            }).then(result => result)
    } catch (error) {
        console.error(error);
    }
};

export const updatePaymentVariables = ({variable, user_id, value}: {
        variable: string,
        value: string | Date | number,
        user_id: number
    }) => {
        try {
            return axios
                .get(PuzzleBotApi.url, {
                        params: {
                            token: PuzzleBotApi.token,
                            method: 'variableChange',
                            user_id: +user_id,
                            variable: variable,
                            expression: `"${value}"`
                        }
                    }
                ).then(result => result)
        } catch
            (error) {
            console.error(error);
        }
    }
;
