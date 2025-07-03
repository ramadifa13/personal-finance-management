"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import * as XLSX from "xlsx";
import { useRef } from "react";
import { Transaction } from "@/lib/types";
import {
  resetTransactions,
  setTransactions,
} from "@/lib/slices/transactionSlice";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

export default function SettingPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();

  const handleExport = () => {
    const data = JSON.parse(
      localStorage.getItem("finance_transactions") || "[]"
    );

    if (!data || data.length === 0) {
      alert("Tidak ada data untuk diexport.");
      return;
    }

    const exportData = data.map((item: Transaction) => ({
      id: item.id,
      tipe: item.tipe,
      kategori: item.kategori,
      jumlah: item.jumlah,
      tanggal: new Date(item.tanggal).toISOString(),
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Transaksi");

    XLSX.writeFile(wb, "transaksi.xlsx");
  };

const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (evt) => {
    const bstr = evt.target?.result;
    const wb = XLSX.read(bstr, { type: "binary" });
    const ws = wb.Sheets[wb.SheetNames[0]];
    const rawData = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws);

    const data: Transaction[] = rawData.map((item) => {
      const normalized: Record<string, unknown> = {};

      for (const key in item) {
        if (Object.prototype.hasOwnProperty.call(item, key)) {
          normalized[key.toLowerCase()] = item[key];
        }
      }

      return {
        id: String(normalized["id"]),
        tipe: String(normalized["tipe"]).toLowerCase() as Transaction["tipe"],
        kategori: String(normalized["kategori"]),
        jumlah: Number(normalized["jumlah"]),
        tanggal: new Date(String(normalized["tanggal"])).toISOString(),
      };
    });

    localStorage.setItem("finance_transactions", JSON.stringify(data));
    dispatch(setTransactions(data));
    toast.success("Data berhasil diimpor.");

    // ✅ Reset input file setelah import
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  reader.readAsBinaryString(file);
};

  const handleReset = () => {
    const confirmed = confirm("Yakin ingin mereset semua data?");
    if (confirmed) {
      localStorage.removeItem("finance_transactions");
      dispatch(resetTransactions());
      toast.success("Data berhasil direset.");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Pengaturan</h1>

      <div className="space-y-3">
        <Button className="w-full" onClick={handleExport}>
          Export ke Excel
        </Button>

        <div className="flex flex-col gap-2">
          <Label>Import dari Excel</Label>
          <Input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleImport}
            ref={fileInputRef}
          />
        </div>

        <Button variant="destructive" className="w-full" onClick={handleReset}>
          Reset Semua Data
        </Button>
      </div>
    </div>
  );
}
