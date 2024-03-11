"use client";

import WelcomeBanner from "./welcome-banner";

import { FlyoutProvider } from "@/app/flyout-context";
import { SelectedItemsProvider } from "@/app/selected-items-context";
import SearchForm from "@/components/search-form";
import { TransactionDetailProvider } from "./ui/table/transaction-context";

import tokenInstance from "@/blockchain/config/ERC20";
import pinkLockInstance from "@/blockchain/config/PinkLock";
import PaginationClassic from "@/components/pagination-classic";
import Image01 from "@/public/images/transactions-image-01.svg";
import { useWeb3Modal, useWeb3ModalProvider } from "@web3modal/ethers/react";
import { Contract } from "ethers";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useWallet } from "./config/ValidateWalletConnection";
import Table, { Transaction } from "./ui/table/Table";
import { LockRecordsInfo } from "./interfaces/global";
import PageLoader from "./ui/loader/Loader";

type TokenLock = {
  index: number;
  token: string;
  name: string;
  symbol: string;
  factory: string;
  amount: number;
};

function isTokenLock(object: any): object is TokenLock {
  return (
    "index" in object &&
    "token" in object &&
    "name" in object &&
    "symbol" in object &&
    "factory" in object &&
    "amount" in object
  );
}

export default function Page() {
  const router = useRouter();
  const PAGE_SIZE = 10;

  // const { walletProvider } = useWeb3ModalProvider();
  const { isConnected, address, walletProvider } = useWallet();
  const { open } = useWeb3Modal();

  const [locks, setLocks] = useState<TokenLock[] | LockRecordsInfo[]>([]);
  const [page, setPage] = useState<number>(0);
  const [pinkLock, setPinkLock] = useState<Contract>();
  const [normalLockCount, setNormalLockCount] = useState<number>(0);
  const [fetchLockType, setFetchLockType] = useState<"all" | "user">("all");
  const [applicationReady, setApplicationReady] = useState<boolean>(false);
  const [tableLoading, setTableLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchLocks = async () => {
      const pinkLock = await pinkLockInstance(walletProvider || null);
      const normalLockCount = await pinkLock.allNormalTokenLockedCount();

      setPinkLock(pinkLock);
      setNormalLockCount(normalLockCount);

      // console.log("PINKLOCK: ", pinkLock);
      console.log("COUNT: ", parseInt(normalLockCount));

      if (normalLockCount > 0) {
        getLocks(pinkLock);
      }
    };

    const fetchUserLocks = async () => {
      console.log("Fetching user locks...");
      if (isConnected) {
        const pinkLock = await pinkLockInstance(walletProvider || null);
        const lockCount = await pinkLock.normalLockCountForUser(address);

        setPinkLock(pinkLock);
        setNormalLockCount(lockCount);

        console.log("USER LOCK COUNT: ", parseInt(lockCount));

        if (normalLockCount > 0) {
          getLocks(pinkLock, address);
        }
      }
    };

    if (fetchLockType === "all") {
      fetchLocks();
    } else if (fetchLockType === "user") {
      fetchUserLocks();
    }
  }, [isConnected, fetchLockType, page]);

  const getLocks = async (pinkLock: Contract | undefined, user?: string) => {
    // if (walletProvider) {
    // Get start and end index
    /**
     * ⚠️TODO: The `0 - 10` should be dynamically passed not hardcoded
     */

    if (user) {
      const locks = await pinkLock?.normalLocksForUser(user);

      const convertedLocksInfo: LockRecordsInfo[] = locks
        .map((lock: any) => ({
          id: lock[0],
          token: lock[1],
          owner: lock[2],
          amount: Number(BigInt(lock[3]) / 10n ** 18n),
          lockDate: Number(lock[4]),
          tgeDate: Number(lock[5]),
          tgeBps: Number(lock[6]),
          cycle: Number(lock[7]),
          cycleBps: Number(lock[8]),
          unlockedAmount: Number(lock[9]),
          description: lock[10],
        }))
        .reverse();

      // console.log("Converted Locks: ", convertedLocksInfo);
      setLocks(convertedLocksInfo);
      setApplicationReady(true);
      setTableLoading(false);
    } else {
      const startIndex = page * PAGE_SIZE;
      const endIndex = (page + 1) * PAGE_SIZE - 1;
      const locks = await pinkLock?.getCumulativeNormalTokenLockInfo(
        startIndex,
        endIndex
      );

      const convertedLocks: TokenLock[] = locks
        .map(async (lock: any, index: number) => {
          const tokenObj = await tokenInstance(
            lock.token,
            walletProvider || null
          );
          const symbol = await tokenObj.instance.symbol();
          const name = await tokenObj.instance.name();

          return {
            index: index,
            token: lock.token,
            name: name,
            symbol: symbol,
            factory: lock.factory,
            amount: BigInt(lock.amount) / 10n ** 18n,
          };
        })
        .reverse();

      const resolvedLocks = await Promise.all(convertedLocks);

      setLocks(resolvedLocks);
      setApplicationReady(true);
      setTableLoading(false);
    }
  };

  const locksFetchHandler = async (type: "all" | "user") => {
    setTableLoading(true);
    if (type === "user") {
      if (isConnected) {
        setFetchLockType(type);
      } else {
        try {
          await open();
          if (isConnected) {
            setFetchLockType(type);
          }
        } catch (error) {
          console.log(error);
        }
      }
    } else {
      setFetchLockType(type);
    }
  };

  const paginateHandler = (newPage: number): void => {
    setPage(newPage);
    getLocks(pinkLock);
  };

  const createNewLockHandler = () => {
    router.push(`/tokens/create`);
  };

  const handleColumnActionClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    index: number | string | undefined,
    id?: number | BigInt | undefined
  ) => {
    e.stopPropagation();
    console.log("INDEX: ", index, "ID: ", id);
    if (fetchLockType === "all") {
      router.push(`/tokens/${index}@`);
    } else {
      router.push(`/tokens/${index}/${id}`);
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-[96rem] mx-auto">
      {applicationReady ? (
        locks.length > 0 ? (
          <>
            {/* Cards */}
            <div className="grid  gap-6">
              <SelectedItemsProvider>
                <FlyoutProvider>
                  <TransactionDetailProvider>
                    <Transactions
                      locks={locks}
                      createNewLockHandler={createNewLockHandler}
                      handleColumnActionClick={handleColumnActionClick}
                      locksFetchHandler={locksFetchHandler}
                      fetchLockType={fetchLockType}
                      tableLoading={tableLoading}
                    />
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
        )
      ) : (
        <PageLoader text="Loading..." />
      )}
    </div>
  );
}

function Transactions({
  locks,
  createNewLockHandler,
  handleColumnActionClick,
  locksFetchHandler,
  fetchLockType,
  tableLoading,
}: {
  locks: TokenLock[] | LockRecordsInfo[];
  createNewLockHandler: () => void;
  handleColumnActionClick: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    index: number | string | undefined,
    id?: number | BigInt | undefined
  ) => void;
  locksFetchHandler: (type: "all" | "user") => void;
  fetchLockType: "all" | "user";
  tableLoading: boolean;
}) {
  console.log(locks);
  const transactions: Transaction[] = locks.map((lock: any) => {
    if (isTokenLock(lock)) {
      return {
        index: lock.index,
        id: undefined,
        name: lock.name,
        token: lock.token,
        symbol: lock.symbol,
        amount: lock.amount,
        image: Image01,
      };
    } else {
      return {
        index: 0,
        id: lock.id,
        name: "",
        token: lock.token,
        symbol: "",
        amount: lock.amount,
        image: Image01,
      };
    }
  });

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
            <button
              onClick={createNewLockHandler}
              className="btn bg-indigo-500 hover:bg-indigo-600 text-white"
            >
              <svg
                className="w-4 h-4 fill-current opacity-50 shrink-0"
                viewBox="0 0 16 16"
              >
                <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
              </svg>
              <span className="hidden xs:block ml-2">Create New Lock</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-5">
          <ul className="flex flex-wrap -m-1">
            <li className="m-1">
              {/* Fetch all locks */}
              <button
                onClick={(e) => locksFetchHandler("all")}
                className={
                  fetchLockType === "all"
                    ? `inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-transparent shadow-sm bg-indigo-500 text-white duration-150 ease-in-out`
                    : `inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 shadow-sm bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 duration-150 ease-in-out`
                }
              >
                View All
              </button>
            </li>
            <li className="m-1">
              {/* Fetch all user locks */}
              <button
                onClick={(e) => locksFetchHandler("user")}
                className={
                  fetchLockType === "user"
                    ? `inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-transparent shadow-sm bg-indigo-500 text-white duration-150 ease-in-out`
                    : `inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 shadow-sm bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 duration-150 ease-in-out`
                }
              >
                My Lock
              </button>
            </li>
          </ul>
        </div>

        {/* Table */}
        <Table
          loading={tableLoading}
          headers={["Token", "Amount", "Action"]}
          title="Acumulative Locks"
          transactions={transactions.map((tranX: Transaction) => {
            return {
              token: tranX.token,
              amount: tranX.amount,
            };
          })}
          routeParams={transactions.map((tranX: Transaction) => ({
            index: tranX.index,
            id: tranX.id,
          }))}
          clickHandler={handleColumnActionClick}
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
