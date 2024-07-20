import { CoffeeOutlined, HomeOutlined, PieChartOutlined } from '@ant-design/icons';
import { MainPage } from 'pages/Main/ui/MainPage';
import { NutritionPage } from 'pages/Nutrition/NutritionPage';
import { PlacementPage } from 'pages/PlacementPage/ui/PlacementPage';
import React from 'react';

export const BASE_URL = '/seminar-placement/';

export enum AppRoutes {
    DASHBOARD = 'dashboard',
    PLACEMENT = 'placement',
    NUTRITION = 'nutrition',
}

export const RoutePath: Record<AppRoutes, string> = {
    [AppRoutes.DASHBOARD]: BASE_URL,
    [AppRoutes.PLACEMENT]: BASE_URL + AppRoutes.PLACEMENT,
    [AppRoutes.NUTRITION]: BASE_URL + AppRoutes.NUTRITION,
};

export type RouteConfig = { path: string; element: React.ReactNode; label: string; icon: JSX.Element };

export const routeConfig: Record<AppRoutes, RouteConfig> = {
    [AppRoutes.DASHBOARD]: {
        path: RoutePath.dashboard,
        element: <MainPage />,
        label: 'Главная',
        icon: <PieChartOutlined />,
    },
    [AppRoutes.PLACEMENT]: {
        path: RoutePath.placement,
        element: <PlacementPage />,
        label: 'Расселение',
        icon: <HomeOutlined />,
    },
    [AppRoutes.NUTRITION]: {
        path: RoutePath.nutrition,
        element: <NutritionPage />,
        label: 'Питание',
        icon: <CoffeeOutlined />,
    },
};

export const routeConfigArray = Object.values(routeConfig);
