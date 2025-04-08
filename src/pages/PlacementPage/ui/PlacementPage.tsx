import React, {useCallback, useEffect, useState} from 'react';
import {Alert, Col, Flex, Row, Select, Spin} from 'antd';

import {IUser} from 'features/UserList/types';
import {useListUsers, useUpdateUserAccomodation} from 'shared/api/googleSheets';
import Building from 'features/Map/components/Building/Building';
import {BUILDINGS_INFO} from 'features/UserList/mock';
import ButtonWithTooltip from 'shared/components/MyButton/MyButton';
import {downloadGeneralInfoReport} from 'services/pdf/GenerateList';
import {FilePdfOutlined} from '@ant-design/icons';
import {Encrypter} from 'shared/utils/encryptUserId.ts/encryptUserId';
import {IRoomUserOption} from '../types';

export const PlacementPage = () => {
        const usersData = useListUsers();
        const [users, setUsers] = useState<IUser[]>([]);
        const [isPDFLoading, setPDFLoading] = useState(false);
        const [downloadCity, setDownloadCity] = useState<string>('');
        const {updateUserAccomodation, isUpdating} = useUpdateUserAccomodation();

        const getOptions = useCallback(
            (users: IUser[]): IRoomUserOption[] => users.map(({user_id, ФИО, Город, Комната, Корпус}) => {
                const placement = !!Корпус && !!Комната ? ` (Корпус: ${Корпус}, Комната: ${Комната})` : "";
                return {value: Encrypter.encodeId(user_id, ФИО), label: ФИО, Город, id: user_id, placement: placement}
            }),
            [],
        );
        useEffect(() => {
            if (usersData.isFetched) {
                setUsers(usersData?.data);
            }
        }, [usersData]);

        if (usersData.isLoading) {
            return <Spin tip="Загрузка..." size="large" fullscreen/>;
        }

        if (usersData.isError) {
            return <Alert message="Ошибка загрузки участников. Обратитесь к Космическому администратору" type="error"/>;
        }


        const usersPayedSorted = users.filter(user => !!user['Сумма оплаты']).sort((a, b) =>
            a.ФИО.localeCompare(b.ФИО))

        const getUsersByCity = (cities: string[], users: IUser[]) => {
            return users.filter(user => cities.includes(user['Город']))
        }

        const getUsersByOtherCity = (cities: string[], users: IUser[]) => {
            return users.filter(user => !cities.includes(user['Город']))
        }

        console.log({
            MOSCOW: getUsersByCity(['Москва'], usersPayedSorted),
            SPB: getUsersByCity(['Санкт-Петербург'], usersPayedSorted),
            Tolyatti: getUsersByCity(['Тольятти', 'Самара'], usersPayedSorted),
            Other: getUsersByOtherCity(['Москва', 'Санкт-Петербург', 'Тольятти', 'Самара'], usersPayedSorted)
        })


        const getPdfTitle = (city: string[] | null) => {
            if (!city) return 'Расселение. Общий список'

            if (city?.length > 2) {
                return 'Расселение. Остальные'
            } else if (city?.length === 2) {
                return 'Расселение. Тольятти, Самара'
            } else {

                if (city.includes('Москва')) {
                    return 'Расселение. Москва'
                }

                return 'Расселение. Санкт-Петербург'
            }
        }


        const getValue = (city: string) => {
            if (!city) return null
            else if (city === 'Москва') return ['Москва']
            else if (city === "Санкт-Петербург") return ["Санкт-Петербург"]
            else if (city === 'Тольятти') return ['Тольятти', 'Самара']
            else {
                return ['Москва', 'Санкт-Петербург', 'Тольятти', 'Самара']
            }
        }
        return (
            <>
                <Row justify={'start'}>
                    <Col>
                        <Flex gap={'small'}><Select onChange={setDownloadCity} placeholder={'Выберите город'} style={{minWidth: 150}} value={downloadCity}>
                            <Select.Option value={''}>Все</Select.Option>
                            <Select.Option value={'Москва'}>Москва</Select.Option>
                            <Select.Option value={'Санкт-Петербург'}>Санкт-Петербург</Select.Option>
                            <Select.Option value={'Тольятти'}>Тольятти/Самара</Select.Option>
                            <Select.Option value={'Остальные'}>Все
                                остальные</Select.Option>
                        </Select>
                        <ButtonWithTooltip
                            tooltipProps={{title: 'Скачать список участников'}}
                            buttonProps={{
                                onClick: async () => {
                                    setPDFLoading(true);
                                    const downloadCityValue = getValue(downloadCity);
                                    const pageTitle = getPdfTitle(downloadCityValue)

                                    if (!downloadCityValue) {
                                        await downloadGeneralInfoReport(usersPayedSorted, pageTitle);
                                    } else if (downloadCityValue?.length > 3) {
                                        await downloadGeneralInfoReport(getUsersByOtherCity(downloadCityValue, usersPayedSorted), pageTitle).then(() => setPDFLoading(false));
                                    } else {
                                        await downloadGeneralInfoReport(getUsersByCity(downloadCityValue, usersPayedSorted), pageTitle);
                                    }

                                    setPDFLoading(false);

                                },
                                icon: <FilePdfOutlined/>,
                            }}
                        >
                            Скачать список участников
                        </ButtonWithTooltip></Flex>
                    </Col>
                </Row>
                <Spin spinning={isUpdating || isPDFLoading} tip="Загрузка..." size="large" fullscreen
                      style={{zIndex: '9999!important'}}/>
                <Row wrap={true}>
                    {Object.values(BUILDINGS_INFO).map((building) => (
                        <Col span={12} xs={24} xxl={12} key={building.id}>
                            <Building id={building.id} users={users} updateUser={updateUserAccomodation}
                                      isUpdating={isUpdating} getOptions={getOptions}/>
                        </Col>
                    ))}
                </Row>
            </>
        );
    }
;
