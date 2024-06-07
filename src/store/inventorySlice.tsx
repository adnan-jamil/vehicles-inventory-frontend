// src/slices/inventorySlice.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    inventoryStats: [],
    loading: false,
    error: null,
};

const inventorySlice = createSlice({
    name: 'inventory',
    initialState,
    reducers: {
        setInventoryData(state, action) {
            state.inventoryStats = action.payload;
        },
    },
});

export const { setInventoryData } = inventorySlice.actions;

export default inventorySlice.reducer;
