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
  clickHandler: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  image: string;
  actionText: string;
  alt?: string;
}) => {
  const isNotEmpty = Object.keys(transaction).length > 0;
  const { statusColor, amountColor } = TransactionsProperties();
  return (
    <tr>
      {isNotEmpty ? (
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
                {transaction[Object.keys(transaction)[0]]}
              </button>
            </div>
          </td>
        )
      ) : null}

      {isNotEmpty
        ? Object.keys(transaction).map((key, index) => {
            // The first column had been render above
            if (index === 0) {
              return null;
            }

            // So subsequest rendering should start here
            if (key === "amount") {
              return (
                <td
                  key={key + "_" + index}
                  className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap w-px"
                >
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
              <td
                key={key + "_" + index}
                className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap w-px"
              >
                <div className={`text-left font-medium`}>
                  {transaction[key]}
                </div>
              </td>
            );
          })
        : null}

      {/* Action button */}
      {isNotEmpty ? (
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
