// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { createTheme, ThemeProvider } from '@mui/material';
import blue from '@mui/material/colors/blue';
import React from 'react';
import { Provider } from 'react-redux'

import './index.css';

import { PersistGate } from 'redux-persist/integration/react'
import { persistStore } from 'redux-persist'
import { createRoot } from 'react-dom/client';
import { DataVisualizationWrapper } from './views/DataVisualizationWrapper';

import store from './app/store'
import { assignAppConfig } from './app/utils';
import { tdata } from './tdata';

let persistor = persistStore(store);


// const domNode = document.getElementById('root') as HTMLElement;
// const root = createRoot(domNode);

const AppTheme = createTheme({
    typography: {
        fontFamily: [
            "Arial",
            "Roboto",
            "Helvetica Neue",
            "sans-serif"
        ].join(",")
    },
    palette: {
        primary: {
            main: blue[700]
        },
        derived: {
            main: "rgb(255,215,0)", // gold
        },
        custom: {
            main: "rgb(255, 160, 122)", //lightsalmon
        },
        warning: {
            main: '#bf5600', // New accessible color, original (#ed6c02) has insufficient color contrast of 3.11
        },
    },
});

export const RootComponent = ({title, tableData}: any) => {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <ThemeProvider theme={AppTheme}>
                    <DataVisualizationWrapper title={title} tableData={tableData} />
                </ThemeProvider>
            </PersistGate>
        </Provider>
    )
}

export const ReactUtils = {
    createRoot,
    ...React
};

export const setAppConfig = assignAppConfig;

// root.render(<React.StrictMode>
//         <RootComponent title='Test' tableData={tdata} />
// </React.StrictMode>);
