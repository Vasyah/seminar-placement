import React, { useEffect, useState } from 'react';
import { IUser } from 'features/UserList/types';
import { useListUsers } from 'shared/api/googleSheets';
import { Alert, Card, Col, Row, Spin, Statistic, Tooltip, theme } from 'antd';
import { GoldOutlined, TeamOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import { SEMINAR } from 'shared/utils/consts/consts';
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip as RechartTooltip, Legend, ResponsiveContainer } from 'recharts';
export const MainPage = () => {
    const usersData = useListUsers();
    const [users, setUsers] = useState<IUser[]>([]);

    const { token } = theme.useToken();

    useEffect(() => {
        if (usersData.isFetched) {
            setUsers(usersData?.data);
        }
    }, [usersData]);

    if (usersData.isLoading) {
        return <Spin tip="Загрузка..." size="large" fullscreen />;
    }

    if (usersData.isError) {
        return <Alert message="Ошибка загрузки участников. Обратитесь к Космическому администратору" type="error" />;
    }

    const getPayedCount = (users: IUser[]) => {
        const usersPayedSum = users.reduce((totalSum, user) => {
            const userPayment = !!user['Сумма оплаты'] ? user['Сумма оплаты'] : 0;

            return (totalSum += +userPayment);
        }, 0);

        return Math.floor(usersPayedSum / SEMINAR.PRICE);
    };

    const usersPayed = getPayedCount(users);
    const teachers = users.filter((user) => user['Статус/Звание'] === 'Учитель');

    const cities = users.reduce((cities, user) => {
        const city: string = user['Город'];

        const count = cities.get(city) ?? 0;
        cities.set(city, count + 1);
        return cities;
    }, new Map<string, number>());

    const citiesArray = Array.from(cities, ([city, count]) => ({ name: city, Количество: count }));

    const graph = {
        height: 512,
    };

    return (
        <>
            <Row gutter={16}>
                <Col span={8} xs={24} lg={8}>
                    <Card bordered={true}>
                        <Statistic title="Всего зарегистрировалось" value={users.length} valueStyle={{ color: token.colorPrimary }} prefix={<UsergroupAddOutlined />} />
                    </Card>
                </Col>
                <Col span={8} xs={24} lg={8}>
                    <Card bordered={true}>
                        <Statistic title="Всего оплатило" value={usersPayed} valueStyle={{ color: token.colorPrimary }} prefix={<GoldOutlined />} />
                    </Card>
                </Col>
                <Col span={8} xs={24} lg={8}>
                    <Tooltip
                        overlayInnerStyle={{ maxHeight: '300px', overflowY: 'auto' }}
                        title={teachers.map((teacher) => (
                            <p key={teacher.user_id + teacher.ФИО} style={{ margin: '0.1rem 0' }}>
                                {teacher.ФИО}
                            </p>
                        ))}
                    >
                        <Card bordered={true}>
                            <Statistic title="Всего учителей" value={teachers.length} valueStyle={{ color: token.colorPrimary }} prefix={<TeamOutlined />} />
                        </Card>
                    </Tooltip>
                </Col>
            </Row>
            <Row style={{ marginTop: '1rem' }}>
                <Col span={24} style={{ minHeight: graph.height }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            width={1024}
                            height={graph.height}
                            data={citiesArray}
                            margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <RechartTooltip />
                            <Legend />
                            <Bar dataKey="Количество" fill={token.colorPrimary} activeBar={<Rectangle fill={token['blue-7']} stroke="blue" />} />
                        </BarChart>
                    </ResponsiveContainer>
                </Col>
            </Row>
        </>
    );
};
