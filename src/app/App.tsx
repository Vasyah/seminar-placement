import React from 'react';
import { AppLayout } from './provider/Layout/ui/AppLayout';
import { AppRouter } from './provider/Router/ui/AppRouter';
import { App as AntApp } from 'antd';
export const App = () => {
    return (
        <div className="App">
            <AntApp message={{ top: 50, duration: 1.5 }}>
                <AppLayout>
                    <AppRouter />
                </AppLayout>
            </AntApp>
        </div>
    );
};
