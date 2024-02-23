import Image from "next/image";
import TableTransaction from "../../interfaces/global";

const TableItem = ({
  transaction,
  clickHandler,
  image,
  actionText,
}: {
  transaction: any;
  clickHandler: (e: React.MouseEvent) => void;
  image: string;
  actionText: string;
}) => {
  const isEmpty = Object.keys(transaction).length > 0
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
                    alt={transaction.name}
                  />
                </button>
              </div>
              <div className="font-medium text-slate-800 dark:text-slate-100">
                <button onClick={(e) => clickHandler(e)}>
                  {transaction.name}
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
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap w-px">
        <div
          className={`text-left font-medium ${amountColor(transaction.amount)}`}
        >
          {Number(transaction.amount)}
        </div>
      </td>

      {/* Action button */}
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap w-px">
        <div className="flex items-center">
          <div className="font-normal text-indigo-400 dark:text-indigo-400 dark:hover:text-indigo-300">
            <button onClick={(e) => clickHandler(e)}>{actionText}</button>
          </div>
        </div>
      </td>
    </tr>
  );
};

export default TableItem;
