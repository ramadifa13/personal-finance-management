import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { TransactionType } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function formatRupiah(jumlah: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(jumlah);
}

export function formatNominal(value: number | string): string {
  if (value === "" || isNaN(Number(value))) return "";
  return Number(value)
    .toLocaleString("id-ID", { maximumFractionDigits: 0 });
}

export function parseNominal(value: string): number | "" {
  const cleaned = value.replace(/\./g, "");
  if (cleaned === "") return "";
  const num = Number(cleaned);
  return isNaN(num) ? "" : num;
}

export const kategoriOptions: Record<TransactionType, string[]> = {
  pemasukan: [
    "Gaji",
    "Bonus",
    "Penjualan",
    "Investasi",
    "Bunga Tabungan",
    "Hadiah",
    "Dividen",
    "Hasil Sewa",
    "Penjualan Aset",
    "Uang Saku",
    "THR",
    "Pengembalian Dana",
    "Lainnya",
  ],
  pengeluaran: [
    "Makan",
    "Ongkos",
    "Minum",
    "Transportasi",
    "Belanja",
    "Hiburan",
    "Tagihan Listrik",
    "Tagihan Air",
    "Tagihan Internet",
    "Pulsa/Kuota",
    "Kesehatan",
    "Pendidikan",
    "Donasi",
    "Cicilan",
    "Asuransi",
    "Perawatan Rumah",
    "Perawatan Kendaraan",
    "Pakaian",
    "Kosmetik",
    "Olahraga",
    "Liburan",
    "Investasi",
    "Pajak",
    "Biaya Anak",
    "Biaya Orang Tua",
    "Lainnya",
  ],
};