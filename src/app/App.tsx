import React, { useEffect, useState } from 'react';
import { AppLayout } from './provider/Layout/ui/AppLayout';
import { AppRouter } from './provider/Router/ui/AppRouter';

export const App = () => {
    return (
        <div className="App">
            <AppLayout>
                <AppRouter />
            </AppLayout>
        </div>
    );
};
