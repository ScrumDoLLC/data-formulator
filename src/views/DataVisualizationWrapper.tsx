import Box from "@mui/material/Box";
import React, { useEffect } from "react";
import { createTableFromFromObjectArray } from "../data/utils";
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../app/store';
import { dfActions, fetchFieldSemanticType } from "../app/dfSlice";
import { DataFormulatorFC } from "./DataFormulator";
import { populateTableRows, SavedState } from "../app/utils";

export interface DataVisualizationWrapperProps {
    title: string;
    tableData: any;
    savedState?: SavedState;
}

export const DataVisualizationWrapper = ({ title, tableData = [], savedState = {} }: DataVisualizationWrapperProps) => {
    let dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        const fullTable = createTableFromFromObjectArray(title, tableData, true);
        if (savedState === undefined || Object.keys(savedState).length === 0 || !savedState.tables?.length) {
            // If no saved state or no rows in the saved state, load the full table
            dispatch(dfActions.loadTable(fullTable));
            dispatch(fetchFieldSemanticType(fullTable));
            return;
        }
        const tables = savedState.tables.map(table => ({ ...table }));
        // For the first table, merge with the full table data
        tables[0].rows = fullTable.rows;

        // If there are more tables, ensure they have rows populated
        populateTableRows(tables).then((tablesWithRows) => {
            dispatch(dfActions.loadState({
                ...savedState,
                tables: tablesWithRows
            }));
        });
    }, [tableData, savedState]);

    return (
        <Box sx={{ 
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            width: '100%',
            overflow: 'hidden'
        }}>
            <Box sx={{ width: "100%", height: '100%', overflow: "hidden", display: "flex", flexDirection: "row" }}>
                <DataFormulatorFC showDataThread={false} disableDataUpload />
            </Box>
        </Box>
    );
}
