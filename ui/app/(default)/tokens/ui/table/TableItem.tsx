import Image from "next/image";
import { TransactionsProperties } from "./transactions-properties";

const TableItem = ({
  transaction,
  clickHandler,
  image,
  alt,
  actionText,
}: {
  transaction: any;
  clickHandler: (e: React.MouseEvent) => void;
  image: string;
  actionText: string;
  alt?: string;
}) => {
  const isEmpty = Object.keys(transaction).length > 0;
  const { statusColor, amountColor } = TransactionsProperties();
  return (
    <tr>
      {!isEmpty ? (
        image ? (
          <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap md:w-1/2">
            <div className="flex items-center">
              <div className="w-9 h-9 shrink-0 mr-2 sm:mr-3">
                <button onClick={(e) => clickHandler(e)} tabIndex={-1}>
                  <Image
                    className="rounded-full"
                    src={image}
                    width={36}
                    height={36}
                    alt={alt || "Image"}
                  />
                </button>
              </div>
              <div className="font-medium text-slate-800 dark:text-slate-100">
                <button onClick={(e) => clickHandler(e)}>
                  {transaction[Object.keys(transaction)[0]]}
                </button>
              </div>
            </div>
          </td>
        ) : (
          <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap md:w-1/2">
            <div className="font-medium text-slate-800 dark:text-slate-100">
              <button onClick={(e) => clickHandler(e)}>
                {transaction.name}
              </button>
            </div>
          </td>
        )
      ) : null}

      {!isEmpty
        ? Object.keys(transaction).map((key) => {
            if (key === "amount") {
              return (
                <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap w-px">
                  <div
                    className={`text-left font-medium ${amountColor(
                      transaction.amount
                    )}`}
                  >
                    {Number(transaction[key])}
                  </div>
                </td>
              );
            }
            return (
              <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap w-px">
                <div className={`text-left font-medium`}>
                  {Number(transaction[key])}
                </div>
              </td>
            );
          })
        : null}

      {/* Action button */}
      {!isEmpty ? (
        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap w-px">
          <div className="flex items-center">
            <div className="font-normal text-indigo-400 dark:text-indigo-400 dark:hover:text-indigo-300">
              <button onClick={(e) => clickHandler(e)}>{actionText}</button>
            </div>
          </div>
        </td>
      ) : null}
    </tr>
  );
};

export default TableItem;
