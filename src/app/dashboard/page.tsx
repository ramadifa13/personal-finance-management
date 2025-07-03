"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import TransactionList from "@/components/transactions/TransactionList";
import { Plus, CalendarIcon, Filter, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { v4 as uuidv4 } from "uuid";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";

import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { formatRupiah } from "@/lib/utils";
import { Transaction } from "@/lib/types";
import TransactionFormModal from "@/components/transactions/TransactionFormModal";
import {
  addTransaction,
  removeTransaction,
  setTransactions,
  updateTransaction,
} from "@/lib/slices/transactionSlice";
import { toast } from "sonner";
import { loadTransactions } from "@/lib/localStorage";

export default function DashboardPage() {
  const [isClient, setIsClient] = useState(false);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    setIsClient(true);

    const stored = loadTransactions();
    if (stored.length > 0) {
      dispatch(setTransactions(stored));
    }

    const today = new Date();
    const currentDay = today.getDate();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    let from: Date;
    let to: Date;

    if (currentDay < 10) {
      from = new Date(currentYear, currentMonth - 1, 10);
      to = new Date(currentYear, currentMonth, 10);
    } else {
      from = new Date(currentYear, currentMonth, 10);
      to = new Date(currentYear, currentMonth + 1, 10);
    }

    setDateRange({ from, to });
  }, []);

  const transactions = useSelector(
    (state: RootState) => state.transactions.items
  );

  if (!isClient) return null;

  const filtered = [...transactions]
    .sort(
      (a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime()
    )
    .filter((tx) => {
      const matchesSearch = tx.kategori
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesType = filterType === "all" ? true : tx.tipe === filterType;
      const matchesDate =
        dateRange?.from && dateRange?.to
          ? new Date(tx.tanggal) >= dateRange.from &&
            new Date(tx.tanggal) <= dateRange.to
          : true;

      return matchesSearch && matchesType && matchesDate;
    });

  const handleSaveTransaction = (data: Transaction) => {
    if (data.id && transactions.some((tx) => tx.id === data.id)) {
      dispatch(updateTransaction(data));
      toast.success("Transaksi berhasil diperbarui.");
    } else {
      const newTransaction: Transaction = {
        ...data,
        id: uuidv4(),
      };
      dispatch(addTransaction(newTransaction));
      toast.success("Transaksi berhasil ditambahkan.");
    }

    setModalOpen(false);
    setEditingTransaction(null);
  };

  const pemasukan = filtered
    .filter((tx) => tx.tipe === "pemasukan")
    .reduce((total, tx) => total + tx.jumlah, 0);

  const pengeluaran = filtered
    .filter((tx) => tx.tipe === "pengeluaran")
    .reduce((total, tx) => total + tx.jumlah, 0);

  const saldo = pemasukan - pengeluaran;

  return (
    <div className="flex flex-col h-full relative">
      <div className="flex-shrink-0 space-y-6">
        <div className="grid gap-4">
          <div className="grid gap-4 grid-cols-2 lg:grid-cols-3">
            <Card className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200">
              <CardHeader>
                <CardTitle className="text-sm font-semibold text-gray-500">
                  Pemasukan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg sm:text-2xl font-bold text-green-600">
                  {formatRupiah(pemasukan)}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200">
              <CardHeader>
                <CardTitle className="text-sm font-semibold text-gray-500">
                  Pengeluaran
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg sm:text-2xl font-semibold text-red-600">
                  {formatRupiah(pengeluaran)}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200 col-span-2 lg:col-span-1">
              <CardHeader>
                <CardTitle className="text-sm font-semibold text-gray-500">
                  Saldo Saat Ini
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg sm:text-2xl font-semibold text-blue-600">
                  {formatRupiah(saldo)}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex w-full gap-2">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari transaksi..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 bg-white"
                />
              </div>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="gap-2 whitespace-nowrap">
                    <Filter className="w-4 h-4" />
                    Filter
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[260px] space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Jenis Transaksi
                    </label>
                    <Select
                      value={filterType}
                      onValueChange={(val) => setFilterType(val)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Pilih jenis" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Semua</SelectItem>
                        <SelectItem value="pemasukan">Pemasukan</SelectItem>
                        <SelectItem value="pengeluaran">Pengeluaran</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Rentang Tanggal
                    </label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="mt-1 w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateRange?.from ? (
                            dateRange.to ? (
                              <>
                                {format(dateRange.from, "dd/MM/yyyy")} -{" "}
                                {format(dateRange.to, "dd/MM/yyyy")}
                              </>
                            ) : (
                              format(dateRange.from, "dd/MM/yyyy")
                            )
                          ) : (
                            <span>Pilih tanggal</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="range"
                          selected={dateRange}
                          onSelect={setDateRange}
                          numberOfMonths={1}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto mt-2 pr-1 pb-36">
        <TransactionList
          transactions={filtered}
          onEdit={(id) => {
            const tx = transactions.find((t) => t.id === id);
            if (tx) {
              setEditingTransaction(tx);
              setModalOpen(true);
            }
          }}
          onDelete={(id) => {
            dispatch(removeTransaction(id));
            toast.success("Transaksi berhasil dihapus.");
          }}
        />
      </div>
      <Button
        size="icon"
        className="fixed bottom-6 right-6 z-50 w-15 h-15 rounded-full bg-green-600 text-white shadow-xl hover:bg-green-700 transition-all duration-300 transform hover:scale-105 animate-bounce"
        onClick={() => setModalOpen(true)}
      >
        <Plus />
      </Button>

      <TransactionFormModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingTransaction(null);
        }}
        initialData={editingTransaction}
        onSave={handleSaveTransaction}
      />
    </div>
  );
}
