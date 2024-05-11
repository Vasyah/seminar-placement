import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { App } from 'app/App';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: false,
        },
    },
});

root.render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <App />
        </QueryClientProvider>
    </React.StrictMode>,
);
