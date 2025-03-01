import React, {useEffect, useState} from 'react';
import {
    AutoComplete,
    AutoCompleteProps,
    Button,
    ConfigProvider,
    Flex,
    List,
    message,
    Select,
    Spin,
    Tag
} from "antd";
import {useListUsers, useUpdateUsersPayment} from "../../../shared/api/googleSheets";
import {IUser} from "../../../features/UserList/types";
import {CloseCircleFilled, SmileOutlined} from "@ant-design/icons";
import {SEMINAR} from "../../../shared/utils/consts/consts";
import {UserPaymentInfo} from "./UserPaymentInfo";
import {findUser} from "../lib/findUser";
import {useSendPayments} from "../../../shared/api/puzzleBot/hooks";

export const Payment = () => {
        const {mutate: sendPayments, isUpdating: isSending} = useSendPayments()

        const getAutocompleteOption = (user: IUser) => {
            return {
                label: <UserPaymentInfo user={user}/>,
                value: user?.ФИО,
                ...user
            }
        }
        const {data, isLoading} = useListUsers();
        const [options, setOptions] = useState<AutoCompleteProps['options']>([{}]);
        const [selectedUsers, setSelectedUsers] = useState<IUser[]>([]);
        const [coordinator, setCoordinator] = useState<string | null>(null);
        const {isUpdating, mutate} = useUpdateUsersPayment()


        useEffect(() => {
            console.log('updateTheUsers', isLoading)
            if (isLoading) return;

            if (data) {

                const userOptions = data?.map(getAutocompleteOption)
                setOptions(userOptions);

                console.log(userOptions);
            }

        }, [data, isLoading]);


        if (isLoading) {
            return <Spin tip="Загрузка..." size="large" fullscreen/>;
        }


        const onSelect = (_: string, user: IUser) => {
            const idxUser = findUser(selectedUsers, user);

            if (idxUser >= 0) {
                message.warning(`Участник ${user?.ФИО} уже выбран`)
                return
            }

            setSelectedUsers(prev => prev.concat(user));
        }
        const customizeRenderEmpty = () => (
            <div style={{textAlign: 'center'}}>
                <SmileOutlined style={{fontSize: 20, marginTop: 20}}/>
                <p>Участники для подтверждения оплаты не выбраны</p>
            </div>
        );
        const onSearch = (query: string) => {
            if (!query) return;

            const filteredData = data?.filter((item) => String(item?.ФИО)?.toLowerCase().includes(query?.toLowerCase()))
            const userOptions = filteredData?.map(getAutocompleteOption)
            console.log(userOptions, query)
            setOptions(userOptions);
        }


        const onDeselect = (user: IUser) => {
            const idxUser = findUser(selectedUsers, user);


            console.log({idxUser})
            if (idxUser === -1) {
                console.error('Участник не найден')
            }

            const users = [...selectedUsers]

            users.splice(idxUser, 1);
            console.log({users})
            setSelectedUsers(users);
        }

        const updatePayments = async (users: IUser[]) => {
            const usersToUpdate: IUser[] = users.map((user) => {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                const {label, value, ...rest} = user
                return {
                    ...rest,
                    Координатор: coordinator,
                    'Сумма оплаты': "10500",
                    'Дата оплаты': new Date(),
                }
            })
            try {
                await mutate(usersToUpdate)

                const users_id = usersToUpdate.map(user => user?.user_id)

                await sendPayments(users_id)
            } catch (e) {
                console.error('ошибка во время обновления данных')
            }

            console.log(usersToUpdate)
        }
        return <ConfigProvider
            renderEmpty={customizeRenderEmpty}>
            <Flex vertical gap={'middle'}>
                <AutoComplete
                    label={'Выберите участников'}
                    options={options}
                    style={{minWidth: '100%', maxWidth: '600px', minHeight: '2.5rem', fontSize: '16px'}}
                    onSelect={onSelect}
                    onSearch={onSearch}
                    placeholder="Введите имя участника"
                    allowClear
                />
                <List
                    loading={isLoading || isUpdating}
                    style={{
                        minHeight: '500px', maxHeight: '500px', overflowY: 'auto',
                    }}
                    bordered
                    itemLayout="horizontal"
                    dataSource={selectedUsers}
                    renderItem={(user) => {
                        return <List.Item key={`${user?.user_id}${user?.ФИО}`} style={{padding: '0.5rem 0.5rem'}}
                                          actions={[<div key={0} onClick={() => onDeselect(user)}><CloseCircleFilled
                                              style={{padding: '0.5rem', fontSize: '18px', color: 'red'}}/></div>]}>
                            <List.Item.Meta
                                title={<UserPaymentInfo user={user}/>}
                            />
                        </List.Item>
                    }}
                />
                <Flex gap="middle" align="center">
                    <Select
                        placeholder={'Выберите координатора'}
                        style={{width: 250}}
                        onChange={(coordinator) => setCoordinator(coordinator)}
                        options={SEMINAR.COORDINATORS}
                    />

                    <Button type={'primary'} onClick={() => updatePayments(selectedUsers)}
                            disabled={!selectedUsers?.length || !coordinator} loading={isLoading || isUpdating}>Подтвердить
                        оплату </Button>
                </Flex>
            </Flex>
        </ConfigProvider>
    }
;

