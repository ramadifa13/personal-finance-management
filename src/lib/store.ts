import { configureStore } from "@reduxjs/toolkit";
import transactionReducer from "./slices/transactionSlice";
import { saveTransactions } from "./localStorage";

export const store = configureStore({
  reducer: {
    transactions: transactionReducer,
  },
});

store.subscribe(() => {
  const state = store.getState();
  saveTransactions(state.transactions.items);
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
