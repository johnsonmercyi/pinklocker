"use client";

import tokenInstance from "@/blockchain/config/ERC20";
import pinkLockInstance from "@/blockchain/config/PinkLock";
import {
  Icon,
  formatDate,
  secondsToDate,
} from "@/app/(default)/tokens/utils/utility";
import {
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from "@web3modal/ethers/react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LockRecordsInfo } from "../../interfaces/global";
import ListCard from "../../ui/listcard/ListCard";
import styles from "./styles/styles.module.css";
import ListCardItem from "../../ui/listcard/ListCardItem";
import CountdownTimer from "../../ui/countdown-timer/CountdownTimer";
import PageLoader from "../../ui/loader/Loader";
import Banner02 from "@/components/banner-02";

type ButtonActions = "unlock" | "transfer" | "extend" | "renounce";
type BannerTypes = "success" | "error" | "warning" | undefined;

type ButtonState = {
  target: ButtonActions;
  loading: boolean;
};

const ViewLocks = () => {
  const router = useRouter();
  const pathname = usePathname();
  const param = useParams();
  const { walletProvider } = useWeb3ModalProvider();
  const { isConnected, address } = useWeb3ModalAccount();

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

  const [applicationReady, setApplicationReady] = useState<boolean>(false);
  const [selected, setSelected] = useState<ButtonActions>("unlock");
  const [action, setAction] = useState<ButtonActions | "">("");
  const [buttonStates, setButtonStates] = useState<ButtonState>({
    target: "unlock",
    loading: false,
  });
  const [showBanner, setShowBanner] = useState<boolean>(false);
  const [bannerType, setBannerType] = useState<BannerTypes>("success");
  const [bannerMessage, setBannerMessage] = useState<string>("");

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
        setLockUnlockDate(formatDate(secondsToDate(convertedLockInfo.tgeDate)));
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
        setApplicationReady(true);
        // }
      } else {
        console.log(param.lock_id);
        setLockId(Number(param.lock_id));
      }
    };

    initTokenAndLockDetails();
  }, [lockId, walletProvider]);

  useEffect(() => {
    const executeAction = async () => {
      if (action === "unlock") {
        try {
          const pinkLock = await pinkLockInstance(walletProvider || null);
          const unlockTranX = await pinkLock.unlock(BigInt(lockId));

          const unlockTranXHash = unlockTranX.hash;
          console.log("Unlock Transaction Hash:", unlockTranXHash);

          setShowBanner(true);
          setBannerType("success");
          setBannerMessage(
            `Unlock transaction submitted and awaiting confirmation!`
          );

          // Waiting for the transaction to be mined
          const unlockReceipt = await unlockTranX.wait();

          router.push(`/tokens`);
        } catch (error: any) {
          setAction("");
          setButtonStates({ target: "unlock", loading: false });
          setShowBanner(true);
          setBannerType("error");
          setBannerMessage(error.message);

          if (String(error.message).includes("user rejected action")) {
            setBannerMessage("Sorry! Your transaction was rejected. Please try again.");
          }
        }
      } else if (action === "transfer") {
      } else if (action === "renounce") {
      } else if (action === "extend") {
        router.push(`${pathname}/edit`);
      }
    };

    executeAction();
  }, [action]);

  const buttonClickHandler = (name: ButtonActions) => {
    setButtonStates({ target: name, loading: true });
    setSelected(name);
    setAction(name);
  };

  const buttonStyleClasses = `shadow-lg m-1 inline-flex items-center justify-center text-sm font-medium leading-5 rounded px-3 py-1 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 duration-150 ease-in-out`;

  const selectedButtonStyleClasses = `shadow-lg inline-flex items-center justify-center text-sm font-medium leading-5 rounded m-1 px-3 py-1 border border-transparent bg-indigo-500 text-white duration-150 ease-in-out`;

  return (
    <div className="relative bg-white dark:bg-slate-900 h-full">
      {applicationReady ? (
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
            title={"Token Info"}
            subTitle={tokenName}
          >
            <ListCardItem property="Token Address" value={token} />
            <ListCardItem property="Token Name" value={tokenName} />
            <ListCardItem property="Token Symbol" value={tokenSymbol} />
            <ListCardItem property="Token Decimal" value={tokenDecimal} />
          </ListCard>

          <ListCard
            style={{
              borderBottom: "none",
              marginBottom: "0",
              borderEndEndRadius: "0",
            }}
            className={`${styles.listCard}`}
            title={"Lock Info"}
            subTitle={lockTitle}
          >
            <ListCardItem property="Title" value={lockTitle} />
            <ListCardItem
              property="Total Amount Locked"
              value={`${lockAmount} ${tokenSymbol}`}
            />
            <ListCardItem
              property="Total Value Locked"
              value={`$${lockValue}`}
            />
            <ListCardItem property="Owner" value={lockOwner} />
            <ListCardItem property="Lock Date" value={lockDate} />
            <ListCardItem property="Unlock Date" value={lockUnlockDate} />
            <ListCardItem
              property="Unlocked Amount"
              value={`${lockUnlockedAmount} ${tokenSymbol}`}
            />
          </ListCard>

          {isConnected && address === lockOwner ? (
            <div
              style={{
                borderTop: "none",
                borderStartStartRadius: "0",
              }}
              className={`${styles.wrapper} pt-4 pb-8 col-span-full xl:col-span-6 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700`}
            >
              <div className={styles.buttonContainer}>
                {/* Transfer Lock Button */}
                <button
                  disabled={
                    buttonStates.target === "transfer" && buttonStates.loading
                  }
                  className={
                    selected === "transfer"
                      ? selectedButtonStyleClasses
                      : buttonStyleClasses
                  }
                  onClick={() => buttonClickHandler("transfer")}
                >
                  Transfer Lock Ownership
                </button>

                {/* Renounce Lock Button */}
                <button
                  disabled={
                    buttonStates.target === "renounce" && buttonStates.loading
                  }
                  className={
                    selected === "renounce"
                      ? selectedButtonStyleClasses
                      : buttonStyleClasses
                  }
                  onClick={() => buttonClickHandler("renounce")}
                >
                  Renounce Lock Ownership
                </button>

                {/* Extend Lock Button */}
                <button
                  disabled={
                    buttonStates.target === "extend" && buttonStates.loading
                  }
                  className={
                    selected === "extend"
                      ? selectedButtonStyleClasses
                      : buttonStyleClasses
                  }
                  onClick={() => buttonClickHandler("extend")}
                >
                  Extend Lock
                </button>

                {/* Unlock button */}
                <button
                  disabled={
                    buttonStates.target === "unlock" && buttonStates.loading
                  }
                  className={
                    selected === "unlock"
                      ? selectedButtonStyleClasses
                      : buttonStyleClasses
                  }
                  onClick={() => buttonClickHandler("unlock")}
                >
                  {buttonStates.target === "unlock" && buttonStates.loading ? (
                    <Icon className={styles.buttonIcon} name="spinner" />
                  ) : null}
                  Unlock
                </button>
              </div>

              {/* Message Banner */}
              <Banner02
                type={bannerType}
                open={showBanner}
                className={styles.banner}
              >
                {bannerMessage}
              </Banner02>
            </div>
          ) : null}
        </div>
      ) : (
        <PageLoader text="Loading..." />
      )}
    </div>
  );
};

export default ViewLocks;
