// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { configureStore } from '@reduxjs/toolkit'
import { dataFormulatorReducer } from './dfSlice';

import { persistReducer } from 'redux-persist'
import localforage from 'localforage';

export type AppDispatch = typeof store.dispatch

const persistConfig = {
    key: 'root',
    //storage,
    storage: localforage
}

const persistedReducer = persistReducer(persistConfig, dataFormulatorReducer)

export const persistedStore = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
    }),
})

let store = configureStore({
    reducer: dataFormulatorReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
    }),
})

export default store;
