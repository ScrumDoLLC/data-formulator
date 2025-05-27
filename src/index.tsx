// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { ThemeProvider } from '@mui/material';
import React from 'react';
import { Provider } from 'react-redux'

import './index.css';

import { PersistGate } from 'redux-persist/integration/react'
import { persistStore } from 'redux-persist'
import { createRoot } from 'react-dom/client';

import { persistedStore } from './app/store'
import { AppTheme } from './exports';
import { AppFC } from './app/App';

let persistor = persistStore(persistedStore);

const domNode = document.getElementById('root') as HTMLElement;
const root = createRoot(domNode);

root.render(<React.StrictMode>
        <Provider store={persistedStore}>
            <PersistGate loading={null} persistor={persistor}>
                <ThemeProvider theme={AppTheme}>
                    <AppFC />
                </ThemeProvider>
            </PersistGate>
        </Provider>
</React.StrictMode>);
