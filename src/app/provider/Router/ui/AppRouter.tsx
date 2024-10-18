import LoaderPage from 'pages/Loader/ui/LoaderPage';
import React, { FC, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { routeConfigArray } from 'shared/config/routeConfig/routeConfig';

export type IAppRouter = Record<string, unknown>;

export const AppRouter: FC<IAppRouter> = (props: IAppRouter) => (   
    <Routes>
        {routeConfigArray.map(({ path, element }) => (
            <Route
                key={path}
                path={path}
                element={
                    <Suspense fallback={<LoaderPage />}>
                        <div className="page-layout">{element}</div>
                    </Suspense>
                }
            />
        ))}
    </Routes>
);
