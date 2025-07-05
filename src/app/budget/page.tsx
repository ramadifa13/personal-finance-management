"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { format, differenceInCalendarDays } from "date-fns";
import {
  formatRupiah,
  kategoriOptions,
  parseNominal,
  formatNominal,
} from "@/lib/utils";
import { loadBudget, loadTransactions, saveBudget } from "@/lib/localStorage";
import { setTransactions } from "@/lib/slices/transactionSlice";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import ProgressBar from "@/components/ui/progress-bar";
import { toast } from "sonner";

const Budget = () => {
  const dispatch = useDispatch();
  const transactions = useSelector(
    (state: RootState) => state.transactions.items
  );

  const [dateRange, setDateRange] = useState<DateRange>();
  const [dailyBudget, setDailyBudget] = useState<number>(100000);
  const [kategori, setKategori] = useState("semua");

  const kategoriList = kategoriOptions["pengeluaran"];
  const [totalDays, setTotalDays] = useState(0);
  const [totalBudget, setTotalBudget] = useState(0);
  const [totalSpending, setTotalSpending] = useState(0);
  const remaining = totalBudget - totalSpending;
  const isOver = remaining < 0;
  const spendingPercent =
    totalBudget > 0 ? Math.min((totalSpending / totalBudget) * 100, 100) : 0;

  useEffect(() => {
    const stored = loadTransactions();
    if (stored.length > 0) dispatch(setTransactions(stored));

    const saved = loadBudget();
    if (saved?.dateRange?.from) {
      const from = new Date(saved.dateRange.from);
      const to = saved.dateRange.to ? new Date(saved.dateRange.to) : undefined;
      setDateRange({ from, to });
    }

    if (saved?.dailyBudget) setDailyBudget(saved.dailyBudget);
    if (saved?.kategori) setKategori(saved.kategori);
  }, []);

  const simpanBudget = () => {
    saveBudget({
      dateRange,
      dailyBudget,
      kategori,
    });
    toast.success("🎉 Budget berhasil disimpan!");
  };
  const hitungRingkasan = () => {
    if (!dateRange?.from || !dateRange?.to) return;

    const start = new Date(dateRange.from);
    const end = new Date(dateRange.to);
    if (start > end) return;

    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    const hari = differenceInCalendarDays(end, start) + 1;

    const filtered = transactions.filter((tx) => {
      const tgl = new Date(tx.tanggal);
      tgl.setHours(0, 0, 0, 0);
      const isInRange = tgl >= start && tgl <= end;
      const isMatchKategori =
        kategori === "semua" ||
        tx.kategori?.toLowerCase().trim() === kategori.toLowerCase().trim();
      return tx.tipe === "pengeluaran" && isInRange && isMatchKategori;
    });

    const total = filtered.reduce((sum, tx) => sum + tx.jumlah, 0);

    setTotalDays(hari);
    setTotalBudget(hari * dailyBudget);
    setTotalSpending(total);
  };

  useEffect(() => {
    hitungRingkasan();
  }, [dateRange, dailyBudget, kategori, transactions]);

  const formValid =
    dateRange?.from &&
    dateRange?.to &&
    dailyBudget > 0 &&
    kategori.trim() !== "";

  const resetForm = () => {
    setDateRange(undefined);
    setDailyBudget(100000);
    setKategori("semua");
    toast.info("Form budget telah direset.");
    localStorage.removeItem("budget-settings");
  };
  return (
    <div className="min-h-screen w-full overflow-y-auto px-4 pb-20">
      <div className="max-w-4xl mx-auto py-6 space-y-8">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-500 to-emerald-500 text-transparent bg-clip-text">
            🎯 Budget Pengeluaran
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Atur pengeluaranmu dengan cerdas dan visual yang intuitif.
          </p>
        </div>

        <Card className="rounded-2xl shadow-md border border-gray-200 hover:shadow-lg transition duration-300">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-slate-700 flex items-center gap-2">
              📋 Atur Budget
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-sm text-gray-600">Periode</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left bg-white hover:bg-slate-50 border border-slate-300"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
                      {dateRange?.from
                        ? `${format(dateRange.from, "dd/MM/yyyy")} - ${format(
                            dateRange.to!,
                            "dd/MM/yyyy"
                          )}`
                        : "Pilih tanggal"}
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

              <div>
                <Label className="text-sm text-gray-600">Budget Harian</Label>
                <Input
                  type="text"
                  value={formatNominal(dailyBudget)}
                  inputMode="numeric"
                  onChange={(e) =>
                    setDailyBudget(parseNominal(e.target.value) || 0)
                  }
                  placeholder="Contoh: 100.000"
                  className="bg-white border border-slate-300 focus:ring-indigo-500"
                />
              </div>

              <div className="md:col-span-2">
                <Label className="text-sm text-gray-600">Kategori</Label>
                <Select value={kategori} onValueChange={setKategori}>
                  <SelectTrigger className="w-full bg-white border border-slate-300">
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="semua">Semua</SelectItem>
                    {kategoriList.map((k) => (
                      <SelectItem key={k} value={k}>
                        {k}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={resetForm}
                className="text-sm border-gray-300 hover:bg-slate-100"
              >
                Reset
              </Button>
              <Button
                onClick={simpanBudget}
                disabled={!formValid}
                className={`transition-all px-6 py-2 text-white font-semibold rounded-md ${
                  formValid
                    ? "bg-indigo-600 hover:bg-indigo-700"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
              >
                Simpan Budget
              </Button>
            </div>
          </CardContent>
        </Card>

        {totalDays > 0 && (
          <Card className="shadow-lg border rounded-2xl bg-gradient-to-b from-white to-slate-50">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex justify-between items-center">
                📊 Ringkasan Budget
                {isOver && (
                  <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-md animate-pulse">
                    ⚠️ Over Budget
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-slate-700">
              <div className="flex justify-between border-b pb-2">
                <span>Total Hari</span>
                <strong>{totalDays}</strong>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span>Total Budget</span>
                <strong>{formatRupiah(totalBudget)}</strong>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span>Pengeluaran ({kategori})</span>
                <strong>{formatRupiah(totalSpending)}</strong>
              </div>
              <div className="flex justify-between">
                <span>Sisa Budget</span>
                <strong className={isOver ? "text-red-600" : "text-green-600"}>
                  {formatRupiah(Math.abs(remaining))}
                </strong>
              </div>
              <div className="pt-2">
                <ProgressBar value={spendingPercent} />
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Budget;
