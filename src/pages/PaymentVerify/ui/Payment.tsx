import React, {useEffect, useState} from 'react';
import {AutoComplete, AutoCompleteProps, Flex, List, Spin, Tag} from "antd";
import {useListUsers} from "../../../shared/api/googleSheets";
import {IUser} from "../../../features/UserList/types";
import {CheckCircleOutlined} from "@ant-design/icons";


const checkForPayed = (user: IUser) => {
    return !!user?.Координатор && !!user?.["Сумма оплаты"] && !!user?.["Дата оплаты"]
}

export const Payment = () => {
    const {data, isLoading} = useListUsers();
    const [options, setOptions] = useState<AutoCompleteProps['options']>([{}]);
    const [selectedUsers, setSelectedUsers] = useState<IUser[]>([]);


    useEffect(() => {
        if (isLoading) return;

        if (data) {

            const userOptions = data?.map((user) => ({
                label: user?.ФИО, value: user?.ФИО,
                ...
                    user
            }))
            setOptions(userOptions);

            console.log(userOptions);
        }

    }, [data, isLoading]);


    if (isLoading) {
        return <Spin tip="Загрузка..." size="large" fullscreen/>;
    }


    const onSelect = (value: string, option: IUser) => {
        console.log(option);

        setSelectedUsers(prev => prev.concat(option));
    }

    const onSearch = (query: string) => {
        if (!query) return;

        const filteredData = data?.filter((item) => String(item?.ФИО)?.toLowerCase().includes(query?.toLowerCase()))
        const userOptions = filteredData?.map((user) => ({label: user?.ФИО, value: user?.ФИО, ...user}))
        console.log(userOptions, query)
        setOptions(userOptions);
    }

    return <>
        <AutoComplete
            options={options}
            style={{minWidth: '100%', maxWidth: '600px', minHeight: '2.5rem', fontSize: '16px'}}
            onSelect={onSelect}
            onSearch={onSearch}
            placeholder="Введите имя участника"
        />
        <List
            bordered
            itemLayout="horizontal"
            dataSource={selectedUsers}
            renderItem={(user) => {
                console.log(user);
                const isPayed = checkForPayed(user)
                return <List.Item key={`${user?.user_id}${user?.ФИО}`} actions={[<div key={0}><CheckCircleOutlined style={{fontSize:'20px', color: '#52c41a'}}/></div>]}>
                    <List.Item.Meta
                        title={<Flex gap={"middle"}>
                            <div style={{minWidth: '95px'}}>
                                <Tag
                                    color={isPayed ? 'success' : 'warning'}>{isPayed ? 'Оплачено' : 'Не плачено'}
                                </Tag>
                            </div>
                            <div>{user?.ФИО}</div>
                        </Flex>
                        }
                    />
                </List.Item>
            }}
        />
    </>
};
