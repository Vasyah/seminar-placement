import { message } from 'antd';

export const showMessage = (type: 'success' | 'warning' | 'error', title: string) => {
    message.open({
        type,
        content: title,
        // style: { marginTop: '7.5vh' },
    });
};
