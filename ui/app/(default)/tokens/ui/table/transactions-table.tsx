"use client";

import { StaticImageData } from "next/image";
import { useItemSelection } from "@/components/utils/use-item-selection";
import TransactionsTableItem from "./transactions-table-item";

export interface Transaction {
  id: number;
  image: StaticImageData;
  name: string;
  symbol: string;
  amount: string;
}



export default function TransactionsTable({
  headers,
  transactions,
}: {
  headers: string[];
  transactions: Transaction[];
}) {
  const {
    selectedItems,
    isAllSelected,
    handleCheckboxChange,
    handleSelectAllChange,
  } = useItemSelection(transactions);

  return (
    <div className="bg-white dark:bg-slate-900">
      <div>
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="table-auto w-full dark:text-slate-300">
            {/* Table header */}
            <thead className="text-xs font-semibold uppercase text-slate-500 border-t border-b border-slate-200 dark:border-slate-700">
              <tr>
                {headers.map((header, i) => (
                  <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap" key={header + "_" + i}>
                    <div className="font-semibold text-left">{header}</div>
                  </th>
                ))}
              </tr>
            </thead>
            {/* Table body */}
            <tbody className="text-sm divide-y divide-slate-200 dark:divide-slate-700 border-b border-slate-200 dark:border-slate-700">
              {transactions.map((transaction) => (
                <TransactionsTableItem
                  key={transaction.id}
                  transaction={transaction}
                  onCheckboxChange={handleCheckboxChange}
                  isSelected={selectedItems.includes(transaction.id)}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
