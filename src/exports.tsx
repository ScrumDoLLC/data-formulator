import { createTheme, ThemeProvider } from '@mui/material';
import blue from '@mui/material/colors/blue';
import React from 'react';
import { Provider } from 'react-redux'

import { createRoot } from 'react-dom/client';
import { DataVisualizationWrapper } from './views/DataVisualizationWrapper';

import store from './app/store'
import { assignAppConfig, generateVegaChart } from './app/utils';
import { getVegaFormattedTableData } from './views/ViewUtils';
import { chartAvailabilityCheck, getDataTable } from './views/VisualizationView';
import { Chart, FieldItem } from './components/ComponentType';
import { createTableFromFromObjectArray } from './data/utils';
import { dfActions } from './app/dfSlice';

export const AppTheme = createTheme({
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

export const formulatorStore = store;

export const getCurrentChartData = () => {
    const { charts, tables, conceptShelfItems, focusedChartId } = store.getState();
    const chart = charts.find(c => c.id == focusedChartId) as Chart;
    const table = chart && getDataTable(chart, tables, charts, conceptShelfItems);
    const extTable = table && getVegaFormattedTableData(table, conceptShelfItems);

    return {
        chart,
        conceptShelfItems,
        extTable
    }
}

export const isChartAvailable = () => {
    const { chart, conceptShelfItems, extTable } = getCurrentChartData();
    return !!(chart && chartAvailabilityCheck(chart.encodingMap, conceptShelfItems, extTable)[0]);
}

export const formatTableData = (title: string, tableData: any[], conceptShelfItems: FieldItem[]) => {
    const table = createTableFromFromObjectArray(title, tableData, true);
    return getVegaFormattedTableData(table, conceptShelfItems);
}

export const ChartRenderer = generateVegaChart;

export const resetState = () => {
    store.dispatch(dfActions.resetState()); 
}

export interface IRootComponentProps {
    title: string;
    tableData: any[];
    conceptShelfItems?: FieldItem[];
    chart?: Chart;
}

export const RootComponent = (props: IRootComponentProps) => {
    return (
        <Provider store={store}>
            <ThemeProvider theme={AppTheme}>
                <DataVisualizationWrapper {...props} />
            </ThemeProvider>
        </Provider>
    )
}

export const ReactUtils = {
    createRoot,
    ...React
};

export const setAppConfig = assignAppConfig;
