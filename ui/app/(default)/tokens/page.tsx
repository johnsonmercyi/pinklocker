export const metadata = {
  title: "Dashboard - Mosaic",
  description: "Page description",
};

import WelcomeBanner from "./welcome-banner";
import FilterButton from "@/components/dropdown-filter";
import Datepicker from "@/components/datepicker";

import { SelectedItemsProvider } from "@/app/selected-items-context";
import { FlyoutProvider } from "@/app/flyout-context";
import { TransactionDetailProvider } from "./ui/table/transaction-context";
import DeleteButton from "@/components/delete-button";
import SearchForm from "@/components/search-form";
import TransactionDropdown from "./ui/table/transaction-dropdown";
import OrdersTable from "./ui/table/transactions-table";
import PaginationClassic from "@/components/pagination-classic";
import TransactionPanel from "./ui/table/transaction-panel";

import Image01 from "@/public/images/transactions-image-01.svg";
import Image02 from "@/public/images/transactions-image-02.svg";
import Image03 from "@/public/images/user-36-05.jpg";
import Image04 from "@/public/images/transactions-image-03.svg";
import Image05 from "@/public/images/transactions-image-04.svg";
import Image06 from "@/public/images/transactions-image-05.svg";
import Image07 from "@/public/images/transactions-image-06.svg";
import Image08 from "@/public/images/transactions-image-07.svg";
import Image09 from "@/public/images/transactions-image-08.svg";

export default function Dashboard() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-[96rem] mx-auto">
      <WelcomeBanner
        title="Hey there!👋."
        subtitle="Lock some tokens today!"
      />

      {/* Cards */}
      <div className="grid  gap-6">
        <SelectedItemsProvider>
          <FlyoutProvider>
            <TransactionDetailProvider>
              <Transactions />
            </TransactionDetailProvider>
          </FlyoutProvider>
        </SelectedItemsProvider>
      </div>
    </div>
  );
}


function Transactions() {
  // Some dummy transactions data
  const transactions = [
    {
      id: 0,
      image: Image01,
      name: "BNB",
      date: "22/01/2022",
      status: "Locked",
      amount: "1 BNB",
    },
    {
      id: 1,
      image: Image02,
      name: "USDT",
      date: "22/01/2023",
      status: "Released",
      amount: "2,000 USDT",
    },
    {
      id: 2,
      image: Image03,
      name: "SOFTT",
      date: "22/01/2021",
      status: "Locked",
      amount: "0.1 SFT",
    },
    {
      id: 3,
      image: Image04,
      name: "USBT",
      date: "22/01/2024",
      status: "Locked",
      amount: "500 USBT",
    },
  ];

  return (
    <div className="relative bg-white dark:bg-slate-900 h-full">
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-[96rem] mx-auto">
        {/* Page header */}
        <div className="sm:flex sm:justify-between sm:items-center mb-4 md:mb-2">
          {/* Left: Title */}
          <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold">
              Tokens ✨
            </h1>
          </div>

          {/* Right: Actions */}
          <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">

            {/* Search form */}
            <div className="hidden sm:block">
              <SearchForm placeholder="Search by token address"/>
            </div>

            {/* Add account button */}
            <button className="btn bg-indigo-500 hover:bg-indigo-600 text-white">
              <svg
                className="w-4 h-4 fill-current opacity-50 shrink-0"
                viewBox="0 0 16 16"
              >
                <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
              </svg>
              <span className="hidden xs:block ml-2">Add Account</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-5">
          <ul className="flex flex-wrap -m-1">
            <li className="m-1">
              <button className="inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-transparent shadow-sm bg-indigo-500 text-white duration-150 ease-in-out">
                View All
              </button>
            </li>
            <li className="m-1">
              <button className="inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 shadow-sm bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 duration-150 ease-in-out">
                My Lock
              </button>
            </li>
          </ul>
        </div>

        {/* Table */}
        <OrdersTable transactions={transactions} />

        {/* Pagination */}
        <div className="mt-8">
          <PaginationClassic />
        </div>
      </div>

      <TransactionPanel />
    </div>
  );
}
