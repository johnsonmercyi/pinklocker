"use client";

import { useEffect, useState } from "react";
import ListCard from "../ui/listcard/ListCard";
import ListCardItem from "../ui/listcard/ListCardItem";
import styles from "./styles/styles.module.css";

import tokenInstance from "@/blockchain/config/ERC20";
import pinkLockInstance from "@/blockchain/config/PinkLock";
import { useWeb3ModalProvider } from "@web3modal/ethers/react";
import { useParams, useRouter } from "next/navigation";
import { LockRecordsInfo } from "../interfaces/global";
import Table from "../ui/table/Table";
import { formatDate } from "@/app/(default)/tokens/utils/utility";

interface AcumulativeTokenInfo {
  token: string;
  factory: string;
  amount: number;
}

const ViewToken = () => {
  const router = useRouter();
  const param = useParams();
  const { walletProvider } = useWeb3ModalProvider();

  const [token, setToken] = useState<string>("");
  const [tokenInfoIndex, setTokenInfoIndex] = useState<number>(0);
  const [lockAmount, setLockAmount] = useState<number>(0);
  const [lockValue, setLockValue] = useState<number>(0);
  const [tokenName, setTokenName] = useState<string>("");
  const [tokenSymbol, setTokenSymbol] = useState<string>("");
  const [tokenDecimal, setTokenDecimal] = useState<number>(0);

  const [lockRecords, setLockRecords] = useState<LockRecordsInfo[]>([]);

  useEffect(() => {
    const fetchTokenDetails = async () => {
      if (tokenInfoIndex >= 0) {
        // if (walletProvider) {
        const pinkLock = await pinkLockInstance(walletProvider || null);
        const tokenInfo = await pinkLock.getCumulativeNormalTokenLockInfoAt(
          tokenInfoIndex
        );

        const convertedTokenInfo: AcumulativeTokenInfo = {
          token: tokenInfo[0],
          factory: tokenInfo[1],
          amount: Number(BigInt(tokenInfo[2]) / 10n ** 18n),
        };

        setToken(convertedTokenInfo.token);
        setLockAmount(convertedTokenInfo.amount);
        // }
      } else {
        setTokenInfoIndex(Number(param.token_info_index as string));
      }
    };

    fetchTokenDetails();
  }, [tokenInfoIndex, walletProvider]);

  useEffect(() => {
    const initTokenDetails = async () => {
      if (token) {
        const tokenObj = await tokenInstance(token, walletProvider || null);
        // console.log("TOKEN OBJECT: ", tokenObj);
        const instance = tokenObj.instance;
        const name = await instance.name();
        const symbol = await instance.symbol();
        const decimal = await instance.decimals();

        setTokenName(name);
        setTokenSymbol(symbol);
        setTokenDecimal(Number(decimal));
      }
    };

    const initLockRecords = async () => {
      await initTokenDetails();
      if (token) {
        const pinkLock = await pinkLockInstance(walletProvider || null);
        /**
         * ⚠️TODO: The `0 - 10` should be dynamically passed not hardcoded
         */
        const tokenLocks = await pinkLock.getLocksForToken(token, 0, 10);

        const convertedLockInfo: LockRecordsInfo[] = tokenLocks.map(
          (lockInfo: any) => ({
            id: lockInfo[0],
            token: lockInfo[1],
            owner: lockInfo[2],
            amount: Number(lockInfo[3]),
            lockDate: Number(lockInfo[4]),
            tgeDate: Number(lockInfo[5]),
            tgeBps: Number(lockInfo[6]),
            cycle: Number(lockInfo[7]),
            cycleBps: Number(lockInfo[8]),
            unlockedAmount: Number(lockInfo[9]),
            description: lockInfo[10],
          })
        );

        setLockRecords(convertedLockInfo);
      }
    };

    initLockRecords();
  }, [token, walletProvider]);

  const viewLockRecordHandler = (
    event: React.MouseEvent,
    id: number | string | undefined
  ) => {
    console.log("LOCK ID: ", id);
    router.push(`/tokens/${param.token_info_index}/${id}`);
  };

  return (
    <div className="relative bg-white dark:bg-slate-900 h-full">
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-[96rem] mx-auto">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold">
            Token Details ✨
          </h1>
        </div>
        <ListCard
          className={styles.listCard}
          title={"Lock Info"}
          subTitle={tokenName}
        >
          <ListCardItem property="Current Locked Amount" value={lockAmount} />
          <ListCardItem
            property="Current Locked Value"
            value={`$${lockValue}`}
          />
          <ListCardItem property="Token Address" value={token} />
          <ListCardItem property="Token Name" value={tokenName} />
          <ListCardItem property="Token Symbol" value={tokenSymbol} />
          <ListCardItem property="Token Decimal" value={tokenDecimal} />
        </ListCard>
        {/* Wallet Amount Cycle(d) Cycle Release(%) TGE(%) Unlock time(UTC) */}
        <Table
          routeParams={lockRecords.map((lock: LockRecordsInfo) => ({
            index: Number(lock.id),
          }))}
          title="Lock Records"
          className={styles.table}
          headers={[
            "Wallet",
            "Amount",
            "Cycle(d)",
            "Cycle Release(%)",
            "TGE(%)",
            "Unlock time(UTC)",
            "Action",
          ]}
          clickHandler={viewLockRecordHandler}
          transactions={lockRecords.map((lock: LockRecordsInfo) => {
            const timeInMillis = lock.tgeDate * 1000;
            const expDate = new Date(timeInMillis);

            return {
              wallet: lock.owner,
              amount: Number(BigInt(lock.amount) / 10n ** 18n),
              cycle: lock.cycle,
              cycleBps: lock.cycleBps,
              tgeBps: lock.tgeBps,
              tgeDate: formatDate(expDate),
            };
          })}
        />
      </div>
    </div>
  );
};

export default ViewToken;
