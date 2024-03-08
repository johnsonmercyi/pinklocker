import TableItem from "./TableItem";

const Table = ({
  title,
  headers,
  transactions,
  clickHandler,
  className,
  routeParams,
}: {
  title: string;
  headers: string[];
  transactions: any[];
  clickHandler: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: number | string | undefined
  ) => void;
  className?: string;
  routeParams?: string[] | number[];
}) => {
  return (
    <div
      className={`col-span-full xl:col-span-6 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700 ${
        className || ""
      }`}
    >
      <header className="px-5 py-4 border-b border-slate-100 dark:border-slate-700">
        <h2 className="font-semibold text-slate-800 dark:text-slate-100">
          {title}
        </h2>
      </header>
      <div className="p-3">
        <header className="text-xs uppercase text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-700 dark:bg-opacity-50 rounded-sm font-semibold p-2">
          {"Records"}
        </header>
        <div
          className={`${
            transactions.length ? "bg-white dark:bg-slate-900" : ""
          }`}
        >
          <div>
            {/* Table */}
            {transactions.length ? (
              <div className="overflow-x-auto">
                <table className="table-auto w-full dark:text-slate-300 dark:bg-slate-800">
                  {/* Table header */}
                  <thead className="text-xs font-semibold uppercase text-slate-500 border-t border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      {headers.map((header, i) => (
                        <th
                          className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap"
                          key={header + "_" + i}
                        >
                          <div className="font-semibold text-left">
                            {header}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  {/* Table body */}
                  <tbody className="text-sm divide-y divide-slate-200 dark:divide-slate-700 border-b border-slate-200 dark:border-slate-700">
                    {/* {transactions.map((transaction) => (
                        <TransactionsTableItem
                          key={transaction.index}
                          transaction={transaction}
                          onCheckboxChange={handleCheckboxChange}
                          isSelected={selectedItems.includes(transaction.index)}
                        />
                      ))} */}

                    {transactions.map((transaction, index) => {
                      return (
                        <TableItem
                          key={transaction.index || index}
                          transaction={transaction}
                          actionText="View"
                          clickHandler={(e) =>
                            clickHandler(
                              e,
                              routeParams ? routeParams[index] : ""
                            )
                          }
                          image={transaction.image}
                        />
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center">No records!</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Table;
