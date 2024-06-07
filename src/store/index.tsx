import { combineReducers, configureStore } from '@reduxjs/toolkit';
import themeConfigSlice from './themeConfigSlice';
import inventoryReducer from './inventorySlice';

const rootReducer = combineReducers({
    themeConfig: themeConfigSlice,
    inventory: inventoryReducer,
});

export default configureStore({
    reducer: rootReducer,
});

export type IRootState = ReturnType<typeof rootReducer>;
