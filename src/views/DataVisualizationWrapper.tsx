import Box from "@mui/material/Box";
import React, { useEffect, useState } from "react";
import { createTableFromFromObjectArray } from "../data/utils";
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../app/store';
import { dfActions, fetchFieldSemanticType } from "../app/dfSlice";
import { DataFormulatorFC } from "./DataFormulator";
import { Chart, FieldItem } from "../components/ComponentType";

interface DataVisualizationWrapperProps {
    title: string;
    tableData: any;
    conceptShelfItems?: FieldItem[];
    chart?: Chart;
}

export const DataVisualizationWrapper = ({ title, tableData, conceptShelfItems, chart }: DataVisualizationWrapperProps) => {
    let dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        const fullTable = createTableFromFromObjectArray(title, tableData, true);
        dispatch(dfActions.loadTable(fullTable));
        dispatch(fetchFieldSemanticType(fullTable));
    }, [tableData]);

    useEffect(() => {
        if (conceptShelfItems) {
            dispatch(dfActions.setConceptItems(conceptShelfItems));
        }
    }, [conceptShelfItems]);

    useEffect(() => {
        if (chart) {
            dispatch(dfActions.setCharts([chart]));
            dispatch(dfActions.setFocusedChart(chart.id));
        }
    }, [chart]);

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