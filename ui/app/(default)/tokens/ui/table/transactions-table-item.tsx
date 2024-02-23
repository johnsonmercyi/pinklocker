import Image from "next/image";
import { Transaction } from "./transactions-table";
import { TransactionsProperties } from "./transactions-properties";
import { useFlyoutContext } from "@/app/flyout-context";
import { useTransactionDetail } from "./transaction-context";
import { useRouter } from "next/navigation";

interface TransactionsTableItemProps {
  transaction: Transaction;
  onCheckboxChange: (id: number, checked: boolean) => void;
  isSelected: boolean;
}

export default function TransactionsTableItem({
  transaction,
  onCheckboxChange,
  isSelected,
}: TransactionsTableItemProps) {
  const router = useRouter();

  const { setFlyoutOpen } = useFlyoutContext();

  const { setTransaction } = useTransactionDetail();

  const { statusColor, amountColor } = TransactionsProperties();

  // const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   onCheckboxChange(transaction.id, e.target.checked)
  // }

  const handleTransactionClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation();

    // e.nativeEvent.stopImmediatePropagation()
    // setFlyoutOpen(true)
    // setTransaction(transaction)
    router.push(`/tokens/${transaction.index}`);
  };

  return (
    <tr>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap md:w-1/2">
        <div className="flex items-center">
          <div className="w-9 h-9 shrink-0 mr-2 sm:mr-3">
            <button onClick={(e) => handleTransactionClick(e)} tabIndex={-1}>
              <Image
                className="rounded-full"
                src={transaction.image}
                width={36}
                height={36}
                alt={transaction.name}
              />
            </button>
          </div>
          <div className="font-medium text-slate-800 dark:text-slate-100">
            <button onClick={(e) => handleTransactionClick(e)}>
              {transaction.name}
            </button>
          </div>
        </div>
      </td>
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
            <button onClick={(e) => handleTransactionClick(e)}>
              View Details
            </button>
          </div>
        </div>
      </td>
    </tr>
  );
}
