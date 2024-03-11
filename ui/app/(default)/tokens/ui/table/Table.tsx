import PageLoader from "../loader/Loader";
import TableItem from "./TableItem";
import { StaticImageData } from "next/image";

export interface Transaction {
  index: number;
  id?: number;
  image: StaticImageData;
  name: string;
  token: string;
  symbol: string;
  amount: string;
}

const Table = ({
  title,
  headers,
  transactions,
  clickHandler,
  className,
  routeParams,
  loading,
}: {
  title: string;
  headers: string[];
  transactions: any[];
  clickHandler: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    index: number | string | undefined,
    id?: number | BigInt | undefined
  ) => void;
  className?: string;
  routeParams?: { index: number; id?: number | undefined }[];
  loading?: boolean;
}) => {
  return (
    <div
      style={{
        position: "relative",
      }}
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
                              routeParams ? routeParams[index].index : "",
                              routeParams ? routeParams[index].id : 0
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

      {loading ? (
        <PageLoader
          className="dark:bg-slate-700 dark:bg-opacity-50 bg-slate-50 bg-opacity-70"
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            left: 0,
            top: 0,
          }}
        />
      ) : null}
    </div>
  );
};

export default Table;
