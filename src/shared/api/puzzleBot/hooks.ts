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
        const urlParams = new URLSearchParams({
            token: PuzzleBotApi.token,
            method: 'sendCommand',
            command_name: 'Поздравление с успешной оплатой',
            tg_chat_id: user_id,
        });

        return fetch(`${PuzzleBotApi.url}?${urlParams}`, {
            method: 'GET',
            mode: 'no-cors',
        }).then(result => result)
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
    } catch (error: never) {
        console.error(error);
        return error;
    }
};

export const updatePaymentVariables = ({variable, user_id, value}: {
    variable: string,
    value: string | Date | number,
    user_id: number
}) => {
    try {

        const urlParams = new URLSearchParams({
            token: PuzzleBotApi.token,
            method: 'variableChange',
            user_id: String(user_id),
            variable: variable,
            expression: `"${value}"`
        });

        return fetch(`${PuzzleBotApi.url}?${urlParams}`, {
                method: 'GET',
                mode: 'no-cors',
            }
        ).then(result => result)
    } catch
        (error) {
        console.error(error);
    }
};
