import React, { useLayoutEffect } from 'react';
import { AppLayout } from './provider/Layout/ui/AppLayout';
import { AppRouter } from './provider/Router/ui/AppRouter';
import { App as AntApp } from 'antd';
export const App = () => {
    useLayoutEffect(() => {
        console.log(window.Telegram.WebApp);

        if (window?.Telegram?.WebApp) {
            const tg = window?.Telegram?.WebApp;
            tg.ready();
            // tg.isExpanded = true;
            try {
                tg?.disableVerticalSwipes();
                tg?.requestFullscreen();
            } catch (e) {
                console.error(e);
            }
        }
    }, []);

    return (
        <div className="App">
            <AntApp message={{ top: 125, duration: 1.5 }}>
                <AppLayout>
                    <AppRouter />
                </AppLayout>
            </AntApp>
        </div>
    );
};
