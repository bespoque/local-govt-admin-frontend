import {
  combineReducers,
  configureStore,
  getDefaultMiddleware,
  ThunkAction,
} from "@reduxjs/toolkit";
import {TypedUseSelectorHook, useSelector, useDispatch} from "react-redux";
import colors from "slices/colors";
import config from "slices/config";
import leftSidebar from "slices/left-sidebar";
import auth from "slices/auth";
import users from "slices/users";
import roles from "slices/roles";
import procurements from "slices/procurement";
import stockOut from "slices/stockOut";
import stockIn from "slices/stockIn";
import inventory from "slices/inventory";
import stock from "slices/stock";
import vendor from "slices/vendor";
import taxOffice from "slices/tax-offices";
import storage from "redux-persist/lib/storage";
import thunkMiddleware from "redux-thunk";
import {persistReducer, persistStore} from "redux-persist";
import {Action} from "redux";
import {createLogger} from "redux-logger";

// Combine reducers
const rootReducer = combineReducers({
  colors,
  config,
  leftSidebar,
  auth,
  users,
  roles,
  taxOffice,
  inventory,
  vendor,
  procurements,
  stockOut,
  stockIn,
  stock,
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

// Create a Redux Persist config
const persistConfig = {
  key: "root", // root key for the persisted state
  storage, // storage engine
  // You can also specify which reducers to persist using the whitelist/blacklist options
  whitelist: ["auth", "stock"], // Reducers to persist
};

const persistedReducer = persistReducer(persistConfig, rootReducer);
const middleware: any[] = [...getDefaultMiddleware(), thunkMiddleware];

// Apply Redux Logger middleware only in development environment
if (process.env.NODE_ENV === "development") {
  const loggerMiddleware = createLogger(); // Create logger instance
  middleware.push(loggerMiddleware);
}

// Create the store with Thunk middleware and persisted reducer.
const store = configureStore({
  reducer: persistedReducer,
  middleware,
});

export const persistor = persistStore(store);

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;

export const useAppDispatch = (): AppDispatch => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;
