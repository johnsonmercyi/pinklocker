"use client";

import tokenInstance from "@/blockchain/config/ERC20";
import pinkLockInstance from "@/blockchain/config/PinkLock";
import { formatDate, secondsToDate } from "@/components/utils/utility";
import { useWeb3ModalProvider } from "@web3modal/ethers/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { LockRecordsInfo } from "../../interfaces/global";
import ListCard from "../../ui/listcard/ListCard";
import styles from "./styles/styles.module.css";
import ListCardItem from "../../ui/listcard/ListCardItem";
import CountdownTimer from "../../ui/countdown-timer/CountdownTimer";

const ViewLocks = () => {
  const param = useParams();
  const { walletProvider } = useWeb3ModalProvider();

  // const [tokenInfoIndex, setTokenInfoIndex] = useState<number>(0);

  // Token Information states
  const [token, setToken] = useState<string>("");
  const [tokenName, setTokenName] = useState<string>("");
  const [tokenSymbol, setTokenSymbol] = useState<string>("");
  const [tokenDecimal, setTokenDecimal] = useState<number>(0);

  // Lock information states
  const [lockId, setLockId] = useState<number>(0);
  const [lockTitle, setLockTitle] = useState<string>("");
  const [lockAmount, setLockAmount] = useState<number>(0);
  const [lockValue, setLockValue] = useState<number>(0);
  const [lockOwner, setLockOwner] = useState<string>("");
  const [lockDate, setLockDate] = useState<string>("");
  const [lockUnlockDate, setLockUnlockDate] = useState<string>("");
  const [lockUnlockDateInSeconds, setLockUnlockDateInSeconds] =
    useState<number>(0);
  const [lockUnlockedAmount, setLockUnlockedAmount] = useState<number>(0);

  useEffect(() => {
    const initTokenAndLockDetails = async () => {
      if (lockId) {
        // if (walletProvider) {
          const pinkLock = await pinkLockInstance(walletProvider || null);
          const lockRecord = await pinkLock.getLockById(Number(param.lock_id));

          const convertedLockInfo: LockRecordsInfo = {
            id: lockRecord[0],
            token: lockRecord[1],
            owner: lockRecord[2],
            amount: Number(BigInt(lockRecord[3]) / 10n ** 18n),
            lockDate: Number(lockRecord[4]),
            tgeDate: Number(lockRecord[5]),
            tgeBps: Number(lockRecord[6]),
            cycle: Number(lockRecord[7]),
            cycleBps: Number(lockRecord[8]),
            unlockedAmount: Number(BigInt(lockRecord[9]) / 10n ** 18n),
            description: lockRecord[10],
          };

          // Initialize states
          setLockId(Number(convertedLockInfo.id));
          setLockTitle(convertedLockInfo.description);
          setLockAmount(convertedLockInfo.amount);
          setLockOwner(convertedLockInfo.owner);
          setLockDate(formatDate(secondsToDate(convertedLockInfo.lockDate)));
          setLockUnlockDate(
            formatDate(secondsToDate(convertedLockInfo.tgeDate))
          );
          setLockUnlockDateInSeconds(convertedLockInfo.tgeDate);
          setLockUnlockedAmount(convertedLockInfo.unlockedAmount);

          const tokenObj = await tokenInstance(
            convertedLockInfo.token,
            walletProvider || null
          );
          const instance = tokenObj.instance;
          const name = await instance.name();
          const symbol = await instance.symbol();
          const decimal = await instance.decimals();

          setToken(convertedLockInfo.token);
          setTokenName(name);
          setTokenSymbol(symbol);
          setTokenDecimal(Number(decimal));
        // }
      } else {
        console.log(param.lock_id);
        setLockId(Number(param.lock_id));
      }
    };

    initTokenAndLockDetails();
  }, [lockId, walletProvider]);

  return (
    <div className="relative bg-white dark:bg-slate-900 h-full">
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-[96rem] mx-auto">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold">
            Lock Record Details ✨
          </h1>
        </div>

        {/* ⚠️ Put a countdown timer here firstly */}
        <CountdownTimer
          targetTimestamp={lockUnlockDateInSeconds}
          title="Unlock in"
        />

        <ListCard
          className={styles.listCard}
          title={"Lock Info"}
          subTitle={tokenName}
        >
          <ListCardItem property="Token Address" value={token} />
          <ListCardItem property="Token Name" value={tokenName} />
          <ListCardItem property="Token Symbol" value={tokenSymbol} />
          <ListCardItem property="Token Decimal" value={tokenDecimal} />
        </ListCard>

        <ListCard
          className={styles.listCard}
          title={"Lock Info"}
          subTitle={lockTitle}
        >
          <ListCardItem property="Title" value={lockTitle} />
          <ListCardItem
            property="Total Amount Locked"
            value={`${lockAmount} ${tokenSymbol}`}
          />
          <ListCardItem property="Total Value Locked" value={`$${lockValue}`} />
          <ListCardItem property="Owner" value={lockOwner} />
          <ListCardItem property="Lock Date" value={lockDate} />
          <ListCardItem property="Unlock Date" value={lockUnlockDate} />
          <ListCardItem
            property="Unlocked Amount"
            value={`${lockUnlockedAmount} ${tokenSymbol}`}
          />
        </ListCard>
      </div>
    </div>
  );
};

export default ViewLocks;
