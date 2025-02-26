import {CoffeeOutlined} from '@ant-design/icons';
import React from 'react';
import {Payment} from "pages/PaymentVerify";

export const BASE_URL = '';

export enum AppRoutes {
    DASHBOARD = 'dashboard',
    PLACEMENT = 'placement',
    NUTRITION = 'nutrition',
    PAYMENT = 'payment',

}

export const RoutePath: Record<AppRoutes, string> = {
    [AppRoutes.DASHBOARD]: BASE_URL,
    [AppRoutes.PLACEMENT]: BASE_URL + AppRoutes.PLACEMENT,
    [AppRoutes.NUTRITION]: BASE_URL + AppRoutes.NUTRITION,
    [AppRoutes.PAYMENT]: BASE_URL,
};

export type RouteConfig = { path: string; element: React.ReactNode; label: string; icon: JSX.Element };

export const routeConfig: {
    [AppRoutes.PAYMENT]: { path: string; icon: React.JSX.Element; label: string; element: React.JSX.Element }
} = {
    // [AppRoutes.DASHBOARD]: {
    //     path: RoutePath.dashboard,
    //     element: <MainPage/>,
    //     label: 'Главная',
    //     icon: <PieChartOutlined/>,
    // },
    // [AppRoutes.PLACEMENT]: {
    //     path: RoutePath.placement,
    //     element: <PlacementPage/>,
    //     label: 'Расселение',
    //     icon: <HomeOutlined/>,
    // },
    // [AppRoutes.NUTRITION]: {
    //     path: RoutePath.nutrition,
    //     element: <NutritionPage/>,
    //     label: 'Питание',
    //     icon: <CoffeeOutlined/>,
    // },
    // [AppRoutes.NUTRITION]: {
    //     path: RoutePath.nutrition,
    //     element: <NutritionPage/>,
    //     label: 'Питание',
    //     icon: <CoffeeOutlined/>,
    // },
    [AppRoutes.PAYMENT]: {
        path: RoutePath.payment,
        element: <Payment/>,
        label: 'Оплата',
        icon: <CoffeeOutlined/>,
    },
};

export const routeConfigArray = Object.values(routeConfig);
