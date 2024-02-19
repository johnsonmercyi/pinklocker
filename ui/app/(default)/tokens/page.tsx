"use client";

import WelcomeBanner from "./welcome-banner";

import { FlyoutProvider } from "@/app/flyout-context";
import { SelectedItemsProvider } from "@/app/selected-items-context";
import SearchForm from "@/components/search-form";
import { TransactionDetailProvider } from "./ui/table/transaction-context";
import TransactionPanel from "./ui/table/transaction-panel";
import OrdersTable, { Transaction } from "./ui/table/transactions-table";

import Image01 from "@/public/images/transactions-image-01.svg";
import Image02 from "@/public/images/transactions-image-02.svg";
import Image04 from "@/public/images/transactions-image-03.svg";
import Image03 from "@/public/images/user-36-05.jpg";
import PaginationNumeric from "@/components/pagination-numeric";
import { useEffect, useState } from "react";
import pinkLockInstance from "@/blockchain/config/PinkLock";
import { useWeb3ModalProvider } from "@web3modal/ethers/react";
import { useWallet } from "./config/ValidateWalletConnection";
import { Contract, Eip1193Provider } from "ethers";
import PaginationNumeric02 from "@/components/pagination-numeric-2";
import PaginationClassic from "@/components/pagination-classic";
import tokenInstance from "@/blockchain/config/ERC20";
import parse from "html-react-parser";
import { useRouter } from "next/navigation";

type Lock = {
  token: string;
  name: string;
  symbol: string;
  factory: string;
  amount: number;
};

export default function Page() {
  const router = useRouter();
  const PAGE_SIZE = 10;

  const { walletProvider } = useWeb3ModalProvider();
  const { isConnected } = useWallet();

  const [locks, setLocks] = useState<Lock[]>([]);
  const [page, setPage] = useState<number>(0);
  const [pinkLock, setPinkLock] = useState<Contract>();
  const [normalLockCount, setNormalLockCount] = useState<number>(0);

  useEffect(() => {
    const fetchLocks = async () => {
      if (walletProvider) {
        const pinkLock = await pinkLockInstance(walletProvider);
        const normalLockCount = await pinkLock.allNormalTokenLockedCount();

        setPinkLock(pinkLock);
        setNormalLockCount(normalLockCount);

        // console.log("PINKLOCK: ", pinkLock);
        console.log("COUNT: ", parseInt(normalLockCount));

        if (normalLockCount > 0) {
          getLocks(pinkLock);
        }
      }
    };

    if (isConnected) {
      fetchLocks();
    }
  }, [isConnected, page]);

  const getLocks = async (pinkLock: Contract | undefined) => {
    if (walletProvider) {
      // Get start and end index
      const startIndex = page * PAGE_SIZE;
      const endIndex = (page + 1) * PAGE_SIZE - 1;
      const locks = await pinkLock?.getCumulativeNormalTokenLockInfo(
        startIndex,
        endIndex
      );
  
      const convertedLocks: Lock[] = locks.map(async(lock: any) => {
  
        const tokenObj = await tokenInstance(lock.token, walletProvider);
        const symbol = await tokenObj.instance.symbol();
        const name = await tokenObj.instance.name();
        
        return {
          token: lock.token,
          name: name,
          symbol: symbol,
          factory: lock.factory,
          amount: parseInt(lock.amount),
        };
      });
  
      console.log("LOCKS: ", convertedLocks);
      setLocks(convertedLocks);
    }
  };

  const paginateHandler = (newPage: number): void => {
    setPage(newPage);
    getLocks(pinkLock);
  };

  const createNewLockHandler = () => {
    router.push(`/tokens/create`);
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-[96rem] mx-auto">
      {normalLockCount > 0 ? (
        <>
          {/* Cards */}
          <div className="grid  gap-6">
            <SelectedItemsProvider>
              <FlyoutProvider>
                <TransactionDetailProvider>
                  <Transactions locks={locks} />
                </TransactionDetailProvider>
              </FlyoutProvider>
            </SelectedItemsProvider>
          </div>
        </>
      ) : (
        <>
          <WelcomeBanner
            title="Hey Welcome!👋."
            subtitle={`The space is empty. Be the first to Lock New Tokens today!`}
          />

          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <button
              className="btn dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-600 dark:text-indigo-500"
              onClick={createNewLockHandler}
            >
              <svg
                className="w-4 h-4 fill-current opacity-50 shrink-0"
                viewBox="0 0 16 16"
              >
                <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
              </svg>
              <span className="hidden xs:block ml-2">Lock New Token</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function Transactions({
  locks,
}: {
  locks: Lock[];
}) {
  // Some dummy transactions data
  // const transactions = [
  //   {
  //     id: 0,
  //     image: Image01,
  //     name: "BNB",
  //     amount: "1 BNB",
  //   },
  //   {
  //     id: 1,
  //     image: Image02,
  //     name: "USDT",
  //     amount: "2,000 USDT",
  //   },
  //   {
  //     id: 2,
  //     image: Image03,
  //     name: "SOFTT",
  //     amount: "0.1 SFT",
  //   },
  //   {
  //     id: 3,
  //     image: Image04,
  //     name: "USBT",
  //     amount: "500 USBT",
  //   },
  // ];

  const transactions: Transaction[] = locks.map((lock: any, index: number) => ({
    id: index,
    name: lock.name,
    symbol: lock.symbol,
    amount: lock.amount,
    image: Image01
  }));

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
              <SearchForm placeholder="Search by token address" />
            </div>

            {/* Add account button */}
            <button className="btn bg-indigo-500 hover:bg-indigo-600 text-white">
              <svg
                className="w-4 h-4 fill-current opacity-50 shrink-0"
                viewBox="0 0 16 16">
                <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
              </svg>
              <span className="hidden xs:block ml-2">Lock New Lock</span>
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
        <OrdersTable
          headers={["Token", "Amount", "Action"]}
          transactions={transactions}
        />

        {/* Pagination */}
        <div className="mt-8">
          <PaginationClassic />
        </div>
      </div>

      {/* <TransactionPanel /> */}
    </div>
  );
}
