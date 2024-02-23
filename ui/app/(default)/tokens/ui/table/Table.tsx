import TableTransaction from "../../interfaces/global";

const Table = ({
  children,
  headers,
  transactions,
}: {
  children: React.ReactNode;
  headers: string[];
  transactions: any[];
}) => {
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
                  <th
                    className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap"
                    key={header + "_" + i}
                  >
                    <div className="font-semibold text-left">{header}</div>
                  </th>
                ))}
              </tr>
            </thead>
            {/* Table body */}
            <tbody className="text-sm divide-y divide-slate-200 dark:divide-slate-700 border-b border-slate-200 dark:border-slate-700">
              {transactions.map((transaction) => (
                <TransactionsTableItem
                  key={transaction.index}
                  transaction={transaction}
                  onCheckboxChange={handleCheckboxChange}
                  isSelected={selectedItems.includes(transaction.index)}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Table;