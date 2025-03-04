import React, {useEffect, useMemo, useRef, useState} from 'react';
import {App, AutoCompleteProps, Button, ConfigProvider, Flex, List, Select, Spin} from 'antd';
import {useListUsers, useUpdateUsersPayment} from '../../../shared/api/googleSheets';
import {IUser} from '../../../features/UserList/types';
import {CloseCircleFilled, SmileOutlined} from '@ant-design/icons';
import {SEMINAR} from '../../../shared/utils/consts/consts';
import {UserPaymentInfo} from './UserPaymentInfo';
import {findUser} from '../lib/findUser';
import {useMutation} from '@tanstack/react-query';
import axios from 'axios';
import {PuzzleBotApi} from 'app/config/puzzlebotApi';
import cx from './style.module.scss';
import {updatePaymentVariables} from "../../../shared/api/puzzleBot/hooks";

export const Payment = () => {
    const {message} = App.useApp();
    const usersRef = useRef(null);

    const {mutate: sendPayment, isPending: isSending} = useMutation({
        mutationFn: (user_id: number) => {
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
            label: <UserPaymentInfo user={user}/>,
            value: user?.ФИО,
            ...user,
        };
    };
    const {data, isPending} = useListUsers();
    // const [options, setOptions] = useState<AutoCompleteProps['options']>([{}]);
    const [selectedUsers, setSelectedUsers] = useState<IUser[]>([]);
    const [coordinator, setCoordinator] = useState<string | null>(null);
    const {isUpdating, mutateAsync: updatePaymentsApi} = useUpdateUsersPayment(() => {
        message.success('Оплата подтверждена');
    });
    const [query, setQuery] = useState('');
    const [open, setOpen] = useState(false);

    const userOptions: AutoCompleteProps['options'] = useMemo(() => {
        if (!!query) {
            const filteredData = data?.filter((item) => String(item?.ФИО)?.toLowerCase().includes(query?.toLowerCase()));
            return filteredData?.map(getAutocompleteOption);
        }
        return data?.map(getAutocompleteOption) ?? [];
    }, [data, query])

    useEffect(() => {
        if (open) {
            const preventScroll = (e) => e.preventDefault();
            document.body.style.overflow = 'hidden';
            document.addEventListener('touchmove', preventScroll, {passive: false});

            return () => {
                document.body.style.overflow = '';
                document.removeEventListener('touchmove', preventScroll);
            };
        }
    }, [open]);


    if (isPending) {
        return <Spin tip="Загрузка..." size="large" fullscreen/>;
    }

    const onSelect = (_: string, user: IUser) => {
        const idxUser = findUser(selectedUsers, user);

        if (idxUser >= 0) {
            message.warning(`${user?.ФИО} уже выбран`);
            setQuery('')
            return;
        }

        setSelectedUsers((prev) => prev.concat(user));
        setQuery('')
    };
    const customizeRenderEmpty = () => (
        <div style={{textAlign: 'center'}}>
            <SmileOutlined style={{fontSize: 20, marginTop: 20}}/>
            <p>Участники для подтверждения оплаты не выбраны</p>
        </div>
    );
    const onSearch = (query: string) => {
        setQuery(query);
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
            const {label, value, ...rest} = user;
            return {
                ...rest,
                Координатор: coordinator,
                'Сумма оплаты': `${SEMINAR.PRICE}`,
                'Дата оплаты': new Date().toLocaleDateString()
            };
        });
        try {
            await updatePaymentsApi(usersToUpdate);


            const variables = new Map<number, { variable: string, value: string }[]>()

            const users_id = usersToUpdate.map((user) => {

                variables.set(+user?.user_id, [{
                    variable: 'app_payment_coordinator_public',
                    value: user?.Координатор
                }, {
                    variable: 'app_payment_sum_public',
                    value: user?.["Сумма оплаты"]
                }, {variable: 'app_payment_date_public', value: user?.["Дата оплаты"]}])

                return user?.user_id
            });


            users_id.forEach((user_id) => {
                variables?.get(+user_id)?.forEach(async ({variable, value}) => {
                    await updatePaymentVariables({
                        variable,
                        value,
                        user_id: +users_id
                    })
                })
            })

            users_id.forEach((user_id) => {
                    sendPayment(user_id, {
                        onSuccess: () => {
                            message.success('Уведомления отправлены в телеграм');

                            setSelectedUsers([]);
                        },

                    })
                }
            );


        } catch (e) {
            console.error(e);
            message.error('Ошибка во время подтверждения оплаты, напишите в тех. поддержку @vasyahG (телеграм)');
        }


    };

    const isTg = window?.Telegram?.WebApp?.initData
    const loading = isPending || isUpdating || isSending
    return (
        <ConfigProvider renderEmpty={customizeRenderEmpty}>
            <Flex vertical gap={'middle'} className={isTg ? `${cx.container}` : ''}>
                <Select
                    size={'large'}
                    className={cx.select}
                    open={open}
                    ref={usersRef}
                    label={'Выберите участников'}
                    options={userOptions}
                    style={{minWidth: '100%', maxWidth: '600px', minHeight: '40px', fontSize: '16px'}}
                    onSelect={onSelect}
                    dropdownRender={(menu) => (
                        <div onScroll={(e) => e.stopPropagation()} style={{maxHeight: '300px', overflowY: 'auto'}}>
                            {menu}
                        </div>
                    )}
                    dropdownStyle={{
                        touchAction: 'none',
                    }}
                    onSearch={onSearch}
                    onChange={() => null}
                    placeholder="Введите имя участника"
                    allowClear
                    value={null}
                    showSearch
                    optionFilterProp="ФИО"
                    loading={loading}
                    filterSort={(optionA, optionB) => (optionA?.ФИО ?? '').toLowerCase().localeCompare((optionB?.ФИО ?? '').toLowerCase())}
                    onDropdownVisibleChange={(isOpen) => setOpen(isOpen)}
                    onClear={() => setQuery('')}
                />
                <List
                    loading={loading}
                    style={{
                        minHeight: 'calc(100vh - 350px)',
                        maxHeight: 'calc(100vh - 350px)',
                        overflowY: 'auto',
                    }}
                    bordered
                    itemLayout="horizontal"
                    dataSource={selectedUsers}
                    renderItem={(user) => {
                        return (
                            <List.Item
                                key={`${user?.user_id}${user?.ФИО}`}
                                style={{padding: '0.5rem 0.5rem'}}
                                actions={[
                                    <div key={0} onClick={() => onDeselect(user)}>
                                        <CloseCircleFilled style={{
                                            padding: '0.5rem',
                                            fontSize: '18px',
                                            color: 'red',
                                            cursor: 'pointer'
                                        }}/>
                                    </div>,
                                ]}
                            >
                                <List.Item.Meta title={<UserPaymentInfo user={user}/>}/>
                            </List.Item>
                        );
                    }}
                />
                <Select
                    size={'large'}
                    placeholder={'Выберите координатора'}
                    style={{width: '100%', fontSize: '16px!important'}}
                    onChange={(coordinator) => setCoordinator(coordinator)}
                    dropdownStyle={{
                        fontSize: '16px',
                    }}
                >
                    {SEMINAR.COORDINATORS.map((coordinator) => (
                        <Select.Option className={cx.option} key={coordinator.value} value={coordinator.value}>
                            {coordinator.label}
                        </Select.Option>
                    ))}
                </Select>

                <Button type={'primary'} onClick={() => updatePayments(selectedUsers)}
                        loading={loading} disabled={!selectedUsers?.length || !coordinator}>
                    Подтвердить оплату
                </Button>
            </Flex>
        </ConfigProvider>
    )
        ;
};
