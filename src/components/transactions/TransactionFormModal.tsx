"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TransactionForm, TransactionType } from "@/lib/types";
import React from "react";
import { formatNominal, kategoriOptions, parseNominal } from "@/lib/utils";

export default function TransactionFormModal({
  open,
  onClose,
  onSave,
  initialData,
}: TransactionForm) {
  const [tipe, setTipe] = useState<TransactionType>("pemasukan");
  const [kategori, setKategori] = useState("");
  const [jumlah, setJumlah] = useState<number | "">("");
  const [tanggal, setTanggal] = useState<Date | undefined>(new Date());
  const [kategoriLainnya, setKategoriLainnya] = useState("");

  useEffect(() => {
    if (initialData) {
      setTipe(initialData.tipe);
      setKategori(initialData.kategori);
      setJumlah(initialData.jumlah);
      setTanggal(new Date(initialData.tanggal));
      setKategoriLainnya("");
    } else {
      setTipe("pemasukan");
      setKategori("");
      setJumlah("");
      setTanggal(new Date());
      setKategoriLainnya("");
    }
  }, [initialData, open]);

  const handleSubmit = () => {
    if (!kategori || !tanggal || jumlah === "") return;

    onSave({
      id: initialData?.id ?? "",
      tipe,
      kategori: kategori === "Lainnya" ? kategoriLainnya : kategori,
      jumlah: Number(jumlah),
      tanggal: tanggal.toISOString(),
      
    });
    onClose();
  };

  const isFormValid =
    kategori &&
    tanggal &&
    jumlah !== "" &&
    (kategori !== "Lainnya" || kategoriLainnya.trim() !== "");

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        aria-describedby={undefined}
        className="sm:max-w-md rounded-xl shadow-xl px-6 py-5 border border-muted bg-background"
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold tracking-tight text-foreground">
            {initialData ? "Edit Transaksi" : "Tambah Transaksi"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 mt-4">
          <div>
            <div className="flex border rounded-lg overflow-hidden w-full">
              <button
                type="button"
                className={`flex-1 py-2 text-sm font-medium transition ${
                  tipe === "pemasukan"
                    ? "bg-primary text-primary-foreground"
                    : "bg-background text-foreground hover:bg-muted"
                }`}
                onClick={() => {
                  setTipe("pemasukan");
                  setKategori("");
                  setKategoriLainnya("");
                }}
              >
                Pemasukan
              </button>
              <button
                type="button"
                className={`flex-1 py-2 text-sm font-medium transition ${
                  tipe === "pengeluaran"
                    ? "bg-primary text-primary-foreground"
                    : "bg-background text-foreground hover:bg-muted"
                }`}
                onClick={() => {
                  setTipe("pengeluaran");
                  setKategori("");
                  setKategoriLainnya("");
                }}
              >
                Pengeluaran
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Kategori</Label>
            <Select
              value={kategori}
              onValueChange={(val) => {
                setKategori(val);
                if (val !== "Lainnya") setKategoriLainnya("");
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih kategori" />
              </SelectTrigger>
              <SelectContent>
                {kategoriOptions[tipe].map((kat) => (
                  <SelectItem key={kat} value={kat}>
                    {kat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {kategori === "Lainnya" && (
              <Input
                className="mt-2"
                placeholder="Tulis kategori manual"
                value={kategoriLainnya}
                onChange={(e) => setKategoriLainnya(e.target.value)}
              />
            )}
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Jumlah</Label>
            <Input
              type="text"
              inputMode="numeric"
              placeholder="Contoh: 500.000"
              value={jumlah === "" ? "" : formatNominal(jumlah)}
              onChange={(e) => {
                setJumlah(parseNominal(e.target.value));
              }}
              className="w-full"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Tanggal</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                  {tanggal ? format(tanggal, "dd/MM/yyyy") : "Pilih tanggal"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-popover border rounded-md">
                <Calendar
                  mode="single"
                  selected={tanggal}
                  onSelect={setTanggal}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="pt-2">
            <Button
              onClick={handleSubmit}
              disabled={!isFormValid}
              className="w-full font-semibold text-sm"
            >
              {initialData ? "Simpan Perubahan" : "Tambah Transaksi"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
