import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type TransactionType = "pemasukan" | "pengeluaran";

export interface Transaction {
  id: string;
  tipe: TransactionType;
  kategori: string;
  jumlah: number;
  tanggal: string;
}

interface TransactionState {
  items: Transaction[];
}

const initialState: TransactionState = {
  items: [],
};

const transactionSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    addTransaction: (state, action: PayloadAction<Transaction>) => {
      state.items.push(action.payload);
    },
    removeTransaction: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((tx) => tx.id !== action.payload);
    },
    updateTransaction: (state, action: PayloadAction<Transaction>) => {
      const index = state.items.findIndex((tx) => tx.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
     resetTransactions: (state) => {
      state.items = []; 
    },
    setTransactions(state, action: PayloadAction<Transaction[]>) {
      state.items = action.payload;
    },
  },
});

export const { addTransaction, removeTransaction, updateTransaction, resetTransactions ,setTransactions} = transactionSlice.actions;
export default transactionSlice.reducer;
