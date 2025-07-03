import { Inbox } from "lucide-react";
import TransactionItem from "./TransactionItem";
import { TransactionsList } from "@/lib/types";



export default function TransactionList({ transactions, onEdit, onDelete }: TransactionsList) {
  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white/80 dark:bg-gray-800/50 rounded-xl shadow-inner border border-dashed border-gray-300 dark:border-gray-600 mx-4 mt-6 animate-fade-in">
        <Inbox className="w-12 h-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-500 dark:text-gray-300">
          Belum ada transaksi
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Tambahkan transaksi untuk mulai melacak keuangan Anda.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2 px-4">
      {transactions.map((tx) => (
        <TransactionItem
          key={tx.id}
          {...tx}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
