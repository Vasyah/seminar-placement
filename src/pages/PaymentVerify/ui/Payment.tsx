import React, { useEffect, useRef, useState } from 'react';
import { App, AutoCompleteProps, Button, ConfigProvider, Flex, List, Select, Spin } from 'antd';
import { useListUsers, useUpdateUsersPayment } from '../../../shared/api/googleSheets';
import { IUser } from '../../../features/UserList/types';
import { CloseCircleFilled, SmileOutlined } from '@ant-design/icons';
import { SEMINAR } from '../../../shared/utils/consts/consts';
import { UserPaymentInfo } from './UserPaymentInfo';
import { findUser } from '../lib/findUser';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { PuzzleBotApi } from 'app/config/puzzlebotApi';
import cx from './style.module.scss';

export const Payment = () => {
    const { message } = App.useApp();
    const usersRef = useRef(null);

    const { mutate: sendPayment, isPending: isSending } = useMutation({
        mutationFn: (user_id: string) => {
            return axios.get(PuzzleBotApi.url, {
                params: {
                    token: PuzzleBotApi.token,
                    method: 'sendCommand',
                    command_name: 'Поздравление с успешной оплатой',
                    tg_chat_id: user_id,
                },
            });
        },
    });

    const getAutocompleteOption = (user: IUser) => {
        return {
            label: <UserPaymentInfo user={user} />,
            value: user?.ФИО,
            ...user,
        };
    };
    const { data, isLoading } = useListUsers();
    const [options, setOptions] = useState<AutoCompleteProps['options']>([{}]);
    const [selectedUsers, setSelectedUsers] = useState<IUser[]>([]);
    const [coordinator, setCoordinator] = useState<string | null>(null);
    const { isUpdating, mutateAsync: updatePaymentsApi } = useUpdateUsersPayment();

    useEffect(() => {
        if (isLoading) return;

        if (data) {
            const userOptions = data?.map(getAutocompleteOption);
            setOptions(userOptions);
        }
    }, [data, isLoading]);

    if (isLoading) {
        return <Spin tip="Загрузка..." size="large" fullscreen />;
    }

    const onSelect = (_: string, user: IUser) => {
        const idxUser = findUser(selectedUsers, user);

        if (idxUser >= 0) {
            message.warning(`${user?.ФИО} уже выбран`);
            return;
        }

        setSelectedUsers((prev) => prev.concat(user));
    };
    const customizeRenderEmpty = () => (
        <div style={{ textAlign: 'center' }}>
            <SmileOutlined style={{ fontSize: 20, marginTop: 20 }} />
            <p>Участники для подтверждения оплаты не выбраны</p>
        </div>
    );
    const onSearch = (query: string) => {
        if (!query) return;

        const filteredData = data?.filter((item) => String(item?.ФИО)?.toLowerCase().includes(query?.toLowerCase()));
        const userOptions = filteredData?.map(getAutocompleteOption);
        setOptions(userOptions);
    };

    const onDeselect = (user: IUser) => {
        const idxUser = findUser(selectedUsers, user);

        if (idxUser === -1) {
            console.error('Участник не найден');
        }

        const users = [...selectedUsers];

        users.splice(idxUser, 1);
        setSelectedUsers(users);
    };

    const updatePayments = async (users: IUser[]) => {
        const usersToUpdate: IUser[] = users.map((user) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            const { label, value, ...rest } = user;
            return {
                ...rest,
                Координатор: coordinator,
                'Сумма оплаты': '10500',
                'Дата оплаты': new Date(),
            };
        });
        try {
            await updatePaymentsApi(usersToUpdate);

            const users_id = usersToUpdate.map((user) => user?.user_id);

            users_id.forEach((user_id) =>
                sendPayment(user_id, {
                    onSuccess: () => {
                        message.success('Уведомления отправлены в телеграм');
                        setSelectedUsers([]);
                    },
                    onError: () => message.error('Ошибка при отправке уведомлений'),
                }),
            );
            // await sendPayments(users_id[0]);
        } catch (e) {
            message.error('Ошибка во время подтверждения оплаты, напишите в тех. поддержку @vasyahG (телеграм)');
        }
    };
    return (
        <ConfigProvider renderEmpty={customizeRenderEmpty}>
            <Flex vertical gap={'middle'} className={cx.container}>
                <Select
                    size="small"
                    ref={usersRef}
                    label={'Выберите участников'}
                    options={options}
                    style={{ minWidth: '100%', maxWidth: '600px', minHeight: '32px' }}
                    onSelect={onSelect}
                    onSearch={onSearch}
                    onChange={() => null}
                    placeholder="Введите имя участника"
                    allowClear
                    value={null}
                    showSearch
                    optionFilterProp="ФИО"
                    filterSort={(optionA, optionB) => (optionA?.ФИО ?? '').toLowerCase().localeCompare((optionB?.ФИО ?? '').toLowerCase())}
                />
                <List
                    loading={isLoading || isUpdating || isSending}
                    style={{
                        minHeight: 'calc(100vh - 300px)',
                        maxHeight: 'calc(100vh - 300px)',
                        overflowY: 'auto',
                    }}
                    bordered
                    itemLayout="horizontal"
                    dataSource={selectedUsers}
                    renderItem={(user) => {
                        return (
                            <List.Item
                                key={`${user?.user_id}${user?.ФИО}`}
                                style={{ padding: '0.5rem 0.5rem' }}
                                actions={[
                                    <div key={0} onClick={() => onDeselect(user)}>
                                        <CloseCircleFilled style={{ padding: '0.5rem', fontSize: '18px', color: 'red' }} />
                                    </div>,
                                ]}
                            >
                                <List.Item.Meta title={<UserPaymentInfo user={user} />} />
                            </List.Item>
                        );
                    }}
                />
                <Select placeholder={'Выберите координатора'} style={{ width: '100%' }} onChange={(coordinator) => setCoordinator(coordinator)} options={SEMINAR.COORDINATORS} />

                <Button type={'primary'} onClick={() => updatePayments(selectedUsers)} disabled={!selectedUsers?.length || !coordinator} loading={isLoading || isUpdating || isSending}>
                    Подтвердить оплату{' '}
                </Button>
            </Flex>
        </ConfigProvider>
    );
};
