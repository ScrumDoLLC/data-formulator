import { createTheme, ThemeProvider } from '@mui/material/styles';
import blue from '@mui/material/colors/blue';
import React, { useEffect, useState, createElement } from 'react';
import { Provider } from 'react-redux'

import { createRoot } from 'react-dom/client';
import { DataVisualizationWrapper, DataVisualizationWrapperProps } from './views/DataVisualizationWrapper';

import store from './app/store'
import { assignAppConfig, generateVegaChart, pendingRequests, populateTableRows } from './app/utils';
import { getVegaFormattedTableData } from './views/ViewUtils';
import { chartAvailabilityCheck, getDataTable } from './views/VisualizationView';
import { Chart, DictTable, FieldItem } from './components/ComponentType';
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
    const { charts, tables, conceptShelfItems, focusedChartId, focusedTableId, activeThreadChartId } = store.getState();
    return {
        charts,
        conceptShelfItems,
        tables: tables.map(table => ({...table, rows: []})),
        focusedChartId,
        focusedTableId,
        activeThreadChartId
    }
}

export const getPendingRequestsCount = () => {
    return pendingRequests.size;
}

export const isChartAvailable = () => {
    const { charts, conceptShelfItems, tables, focusedChartId } = store.getState();
    const chart = charts.find(c => c.id == focusedChartId) as Chart;
    const table = chart && getDataTable(chart, tables, charts, conceptShelfItems);
    const extTable = table && getVegaFormattedTableData(table, conceptShelfItems);
    return !!(chart && chartAvailabilityCheck(chart.encodingMap, conceptShelfItems, extTable)[0]);
}

export const formatTableData = (title: string, tableData: any[], conceptShelfItems: FieldItem[]) => {
    const table = createTableFromFromObjectArray(title, tableData, true);
    return getVegaFormattedTableData(table, conceptShelfItems);
}

const loadTableData = async (tableData: any, savedState: any, title: any) => {
    let table = createTableFromFromObjectArray(title, tableData, true);
    if (savedState?.tables?.length) {
        const tables = savedState.tables.map((table: DictTable) => ({ ...table }));
        // For the first table, merge with the full table data
        tables[0].rows = table.rows;
        // If there are more tables, ensure they have rows populated
        const tablesWithRows = await populateTableRows(tables)
        table = tablesWithRows?.find((t: DictTable) => t.id == savedState.focusedTableId) || table;
    }
    return getVegaFormattedTableData(table, savedState?.conceptShelfItems!);
};

export const ChartRenderer = ({ tableData, savedState, title, ...props}: any) => {
    try {
        const [extTable, setExtTable] = useState<any>([]);
        useEffect(() => {
            loadTableData(tableData, savedState, title).then((formattedTable) => {
                setExtTable(formattedTable);
            });
        }, [tableData, savedState, title]);

        return generateVegaChart({...props, extTable, savedState });
    } catch (e) {
        console.error("Error generating chart:", e);
        return <div>Error generating chart</div>;
    }
}

export const resetState = () => {
    store.dispatch(dfActions.resetState()); 
}

export const RootComponent = (props: DataVisualizationWrapperProps) => {
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
    createElement
};

export const setAppConfig = assignAppConfig;
