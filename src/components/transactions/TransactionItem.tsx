"use client";

import { useSwipeable } from "react-swipeable";
import { ArrowDownCircle, ArrowUpCircle, Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { formatRupiah } from "@/lib/utils";
import { TransactionsItem } from "@/lib/types";


export default function TransactionItem({
  id,
  kategori,
  tipe,
  jumlah,
  tanggal,
  onEdit,
  onDelete,
}: TransactionsItem) {
  const [showActions, setShowActions] = useState(false);

  const handlers = useSwipeable({
    onSwipedLeft: () => setShowActions(true),
    onSwipedRight: () => setShowActions(false),
    delta: 30,
    preventScrollOnSwipe: true,
    trackTouch: true,
  });

  const handleMouseEnter = () => {
    if (window.innerWidth >= 768) {
      setShowActions(true);
    }
  };

  const handleMouseLeave = () => {
    if (window.innerWidth >= 768) {
      setShowActions(false);
    }
  };

  return (
    <div
      className="relative overflow-hidden"
      {...handlers}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="absolute right-0 top-0 h-full flex items-center gap-2 px-4 bg-white rounded-xl z-0">
        <button
          onClick={() => onEdit?.(id)}
          className="p-2 rounded-md bg-blue-100 hover:bg-blue-200 text-blue-600"
        >
          <Pencil size={16} />
        </button>
        <button
          onClick={() => onDelete?.(id)}
          className="p-2 rounded-md bg-red-100 hover:bg-red-200 text-red-600"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div
        className={`relative z-10 transition-transform duration-300 ${
          showActions ? "-translate-x-24" : "translate-x-0"
        }`}
      >
        <Card
          className={`border-2 px-4 py-3 rounded-xl bg-white ${
            tipe === "pemasukan"
              ? "border-green-400/60"
              : "border-red-400/60"
          }`}
        >
          <div className="flex items-start gap-3 sm:items-center sm:justify-between sm:flex-row flex-col">
        
            <div className="flex items-center gap-3 w-full sm:w-auto ">
              <span
                className={`rounded-full p-2 ${
                  tipe === "pemasukan"
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {tipe === "pemasukan" ? (
                  <ArrowDownCircle size={22} />
                ) : (
                  <ArrowUpCircle size={22} />
                )}
              </span>
              <div className="flex flex-col">
                <span className="font-semibold text-base truncate max-w-[200px]">
                  {kategori}
                </span>
                <span className="text-xs capitalize text-gray-500 sm:hidden">
                  {tipe}
                </span>
              </div>
            </div>
            <div className="flex justify-between w-full sm:w-auto sm:gap-6 mt-2 sm:mt-0 text-sm sm:text-base">
              <span
                className={`font-bold ${
                  tipe === "pemasukan" ? "text-green-600" : "text-red-600"
                }`}
              >
                {formatRupiah(jumlah)}
              </span>
              <div className="text-right text-xs text-gray-400 sm:text-sm sm:text-left">
                {format(new Date(tanggal), "d MMM yyyy", {
                  locale: localeId,
                })}
              </div>
              <span className="capitalize text-xs text-gray-500 hidden sm:inline">
                {tipe}
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
