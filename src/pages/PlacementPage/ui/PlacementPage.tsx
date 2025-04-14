import React, { useCallback, useEffect, useState } from 'react';
import { Alert, Col, Flex, Row, Select, Spin } from 'antd';

import { IUser } from 'features/UserList/types';
import { useListUsers, useUpdateUserAccomodation } from 'shared/api/googleSheets';
import Building from 'features/Map/components/Building/Building';
import { BUILDINGS_INFO } from 'features/UserList/mock';
import ButtonWithTooltip from 'shared/components/MyButton/MyButton';
import { downloadGeneralInfoReport } from 'services/pdf/GenerateList';
import { FilePdfOutlined } from '@ant-design/icons';
import { Encrypter } from 'shared/utils/encryptUserId.ts/encryptUserId';
import { IRoomUserOption } from '../types';

export const PlacementPage = () => {
    const usersData = useListUsers();
    const [users, setUsers] = useState<IUser[]>([]);
    const [isPDFLoading, setPDFLoading] = useState(false);
    const [downloadCity, setDownloadCity] = useState<string>('');
    const { updateUserAccomodation, isUpdating } = useUpdateUserAccomodation();

    const getOptions = useCallback(
        (users: IUser[]): IRoomUserOption[] =>
            users.map(({ user_id, ФИО, Город, Комната, Корпус }) => {
                const placement = !!Корпус && !!Комната ? ` (Корпус: ${Корпус}, Комната: ${Комната})` : '';
                return { value: Encrypter.encodeId(user_id, ФИО), label: ФИО, Город, id: user_id, placement: placement };
            }),
        [],
    );
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

    const sortedUsers = users.sort((a, b) => a.ФИО.localeCompare(b.ФИО));

    const getPayedusers = (users: IUser[], withKids?: boolean) => {
        return users.filter((user) => {
            console.log(user?.ФИО, user?.['Сумма оплаты']);
            if (withKids) {
                return !!user['Сумма оплаты'] || user?.['Статус/Звание'] === 'Ребёнок';
            }

            return !!user['Сумма оплаты'];
        });
    };
    const usersPayedSorted = getPayedusers(sortedUsers, true);

    const getIsExluded = (user: IUser) => {
        const isTeacher = user?.['Статус/Звание'] === 'Учитель';
        const isKid = user?.['Статус/Звание'] === 'Ребёнок';
        const IsOrganizator = user?.['Статус/Звание'] === 'Космическая команда';

        return isTeacher || isKid || IsOrganizator;
    };
    const getUsersByCity = (cities: string[], users: IUser[]) => {
        return users.filter((user) => {
            if (getIsExluded(user)) return false;
            return cities.includes(user['Город']);
        });
    };

    const getUsersByOtherCity = (cities: string[], users: IUser[]) => {
        return users.filter((user) => {
            if (getIsExluded(user)) return false;
            return !cities.includes(user['Город']);
        });
    };

    const getTeam = (users: IUser[]) => {
        return users.filter((user) => user?.['Статус/Звание'] === 'Космическая команда');
    };

    const getTeachers = (users: IUser[]) => {
        return users.filter((user) => user?.['Статус/Звание'] === 'Учитель' || user?.ФИО === 'Козловская Дарья Васильевна' || user?.ФИО === 'Ким Сэн Хи');
    };

    const getKids = (users: IUser[]) => {
        return users.filter((user) => user?.['Статус/Звание'] === 'Ребёнок');
    };

    console.log({
        MOSCOW: getUsersByCity(['Москва'], usersPayedSorted),
        SPB: getUsersByCity(['Санкт-Петербург'], usersPayedSorted),
        Tolyatti: getUsersByCity(['Тольятти', 'Самара'], usersPayedSorted),
        Other: getUsersByOtherCity(['Москва', 'Санкт-Петербург', 'Тольятти', 'Самара'], usersPayedSorted),
    });

    const getPdfTitle = (value: string | string[] | null) => {
        if (!value) return 'Общий список';

        if (Array.isArray(value)) {
            if (value?.length > 2) {
                return 'Остальные';
            } else if (value?.length === 2) {
                return 'Тольятти, Самара';
            } else {
                if (value.includes('Москва')) {
                    return 'Москва';
                }

                return 'Санкт-Петербург';
            }
        } else {
            if (value === 'Космические') {
                return 'Космическая команда';
            } else if (value === 'Учителя') {
                return 'Учителя';
            } else if (value === 'Дети') {
                return 'Дети';
            }
        }
    };

    const getValue = (city: string) => {
        if (!city) return null;
        else if (city === 'Москва') return ['Москва'];
        else if (city === 'Санкт-Петербург') return ['Санкт-Петербург'];
        else if (city === 'Тольятти') return ['Тольятти', 'Самара'];
        else if (city === 'Остальные') {
            return ['Москва', 'Санкт-Петербург', 'Тольятти', 'Самара'];
        } else {
            return city;
        }
    };

    return (
        <>
            <Row justify={'start'}>
                <Col>
                    <Flex gap={'small'}>
                        <Select onChange={setDownloadCity} placeholder={'Выберите город'} style={{ minWidth: 150 }} value={downloadCity}>
                            <Select.Option value={''}>Все</Select.Option>
                            <Select.Option value={'Москва'}>Москва</Select.Option>
                            <Select.Option value={'Санкт-Петербург'}>Санкт-Петербург</Select.Option>
                            <Select.Option value={'Тольятти'}>Тольятти/Самара</Select.Option>
                            <Select.Option value={'Остальные'}>Все остальные</Select.Option>
                            <Select.Option value={'Космические'}>Космическая команда</Select.Option>
                            <Select.Option value={'Дети'}>Дети</Select.Option>
                            <Select.Option value={'Учителя'}>Учителя</Select.Option>
                        </Select>
                        <ButtonWithTooltip
                            tooltipProps={{ title: 'Скачать список участников' }}
                            buttonProps={{
                                onClick: async () => {
                                    setPDFLoading(true);
                                    const downloadValue = getValue(downloadCity);
                                    const pageTitle = getPdfTitle(downloadValue);

                                    if (!downloadValue) {
                                        await downloadGeneralInfoReport(usersPayedSorted, pageTitle, 'common');
                                    } else if (Array.isArray(downloadValue) && downloadValue?.length > 3) {
                                        await downloadGeneralInfoReport(
                                            getUsersByOtherCity(downloadValue, usersPayedSorted).sort((a, b) => a.Город.localeCompare(b.Город)),
                                            pageTitle,
                                            'otherCity',
                                        ).then(() => setPDFLoading(false));
                                    } else if (Array.isArray(downloadValue)) {
                                        await downloadGeneralInfoReport(getUsersByCity(downloadValue, usersPayedSorted), pageTitle);
                                    } else if (downloadValue === 'Космические') {
                                        await downloadGeneralInfoReport(getTeam(sortedUsers), pageTitle);
                                    } else if (downloadCity === 'Дети') {
                                        await downloadGeneralInfoReport(getKids(sortedUsers), pageTitle);
                                    } else {
                                        await downloadGeneralInfoReport(
                                            getTeachers(sortedUsers).sort((a, b) => a.Город.localeCompare(b.Город)),
                                            pageTitle,
                                            'teachers',
                                        );
                                    }

                                    setPDFLoading(false);
                                },
                                icon: <FilePdfOutlined />,
                            }}
                        >
                            Скачать список участников
                        </ButtonWithTooltip>
                    </Flex>
                </Col>
            </Row>
            <Spin spinning={isUpdating || isPDFLoading} tip="Загрузка..." size="large" fullscreen style={{ zIndex: '9999!important' }} />
            <Row wrap={true}>
                {Object.values(BUILDINGS_INFO).map((building) => (
                    <Col span={12} xs={24} xxl={12} key={building.id}>
                        <Building id={building.id} users={users} updateUser={updateUserAccomodation} isUpdating={isUpdating} getOptions={getOptions} />
                    </Col>
                ))}
            </Row>
        </>
    );
};
