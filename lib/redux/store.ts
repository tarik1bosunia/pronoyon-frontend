import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { authApi } from './services/authApi';
import { usersApi } from './services/usersApi';
import { rolesApi } from './services/rolesApi';
import { paymentsApi } from './services/paymentsApi';
import authReducer from './slices/authSlice';

const rootReducer = combineReducers({
  [authApi.reducerPath]: authApi.reducer,
  [usersApi.reducerPath]: usersApi.reducer,
  [rolesApi.reducerPath]: rolesApi.reducer,
  [paymentsApi.reducerPath]: paymentsApi.reducer,
  auth: authReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(usersApi.middleware)
      .concat(rolesApi.middleware)
      .concat(paymentsApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
