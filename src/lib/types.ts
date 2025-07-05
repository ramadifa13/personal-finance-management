export type TransactionsList = {
  transactions: {
    id: string;
    kategori: string;
    tipe: "pemasukan" | "pengeluaran";
    jumlah: number;
    tanggal: string;
  }[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
};

export type TransactionsItem = {
  id: string;
  kategori: string;
  tipe: "pemasukan" | "pengeluaran";
  jumlah: number;
  tanggal: string;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
};

export type TransactionType = "pemasukan" | "pengeluaran";

export type TransactionForm = {
  open: boolean;
  onClose: () => void;
  onSave: (data: Transaction) => void;
  initialData?: Transaction | null;
};
export interface Transaction {
  id: string; 
  kategori: string;
  tipe: TransactionType;
  tanggal: string;
  jumlah: number;
}

export type BudgetSettings = {
  dateRange?: {
    from?: Date; 
    to?: Date;
  };
  dailyBudget: number;
  kategori: string;
};