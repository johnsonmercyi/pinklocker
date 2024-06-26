"use client";

import tokenInstance from "@/blockchain/config/ERC20";
import pinkLockInstance from "@/blockchain/config/PinkLock";
import {
  Icon,
  dateToSeconds,
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
import ModalBlank from "@/components/modal-blank";
import ModalAction from "@/components/modal-action";

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
  const [renounce, setRenouce] = useState<boolean>(false);
  const [transfer, setTransfer] = useState<boolean>(false);
  const [transferAddress, setTransferAddress] = useState<string | "">("");
  const [transferAddressError, setTransferAddressError] = useState<string | "">(
    ""
  );
  const [showBanner, setShowBanner] = useState<boolean>(false);
  const [bannerType, setBannerType] = useState<BannerTypes>("success");
  const [bannerMessage, setBannerMessage] = useState<string>("");

  const [transferOwnershipDialogOpen, setTransferOwnershipDialogOpen] =
    useState<boolean>(false);
  const [renounceOwnershipDialogOpen, setRenounceOwnershipDialogOpen] =
    useState<boolean>(false);

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
            setBannerMessage(
              "Sorry! Your transaction was rejected. Please try again."
            );
          } else if (
            String(error.message).includes(
              `execution reverted: "It is not time to unlock"`
            )
          ) {
            setBannerMessage("Sorry! It is not yet time to unlock.");
          } else if (
            String(error.message).includes(
              `execution reverted: "Nothing to unlock"`
            )
          ) {
            setBannerMessage("Sorry! You can't unlock now.");
          }
        }
      } else if (action === "transfer") {
        setTransferOwnershipDialogOpen(true);
      } else if (action === "renounce") {
        setRenounceOwnershipDialogOpen(true);
      } else if (action === "extend") {
        localStorage.setItem("lockedDate", lockUnlockDate);
        router.push(`${pathname}/edit`);
      }
    };

    executeAction();
  }, [action]);

  useEffect(() => {
    setAction("");
    setTransferOwnershipDialogOpen(false);
  }, [address]);

  useEffect(() => {
    const doRenounceOwnership = async () => {
      const pinkLock = await pinkLockInstance(walletProvider || null);
      const renounceTrnX = await pinkLock.renounceLockOwnership(lockId);

      setShowBanner(true);
      setBannerType("success");
      setBannerMessage(
        `You have successfully renounced the ownership of this lock!`
      );
      setRenounceOwnershipDialogOpen(false);
      setLockOwner("0x0000000000000000000000000000000000000000");

      // Waiting for the transaction to be mined
      const lockReceipt = await renounceTrnX.wait();

      router.back();
    };

    if (renounce && isConnected && lockId) {
      doRenounceOwnership();
    }
  }, [renounce, isConnected, lockId]);

  useEffect(() => {
    const doTransferOwnership = async () => {
      try {
        const address = transferAddress.trim();
        if (address.length > 0 && address.length === 42) {
          setTransferAddressError("");
          const pinkLock = await pinkLockInstance(walletProvider || null);
          const transferTrnX = await pinkLock.transferLockOwnership(
            lockId,
            address
          );

          setShowBanner(true);
          setBannerType("success");
          setBannerMessage(
            `You have successfully transfered your ownership of this lock to the address: ${address}!`
          );
          setTransferOwnershipDialogOpen(false);
          setLockOwner(address);

          // Waiting for the transaction to be mined
          const lockReceipt = await transferTrnX.wait();

          router.back();
        } else {
          setTransferAddressError("Please enter a valid new owner address");
          setTransfer(false);
        }
      } catch (error: any) {
        setTransfer(false);
        setShowBanner(true);
        setBannerType("error");
        setBannerMessage(error.message);

        if (String(error.message).includes("user rejected action")) {
          setBannerMessage("Sorry! User rejected action.");
        }
      }
    };

    if (transfer && isConnected && lockId) {
      doTransferOwnership();
    }
  }, [transfer, isConnected, lockId]);

  const buttonClickHandler = (
    event: React.MouseEvent<HTMLButtonElement>,
    name: ButtonActions
  ) => {
    if (name === "unlock") {
      setButtonStates({ target: name, loading: true });
    }

    setSelected(name);
    setAction(name);
    setShowBanner(false);
    setBannerType("success");
    setBannerMessage("");
  };

  const transferAddressOnChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setTransferAddress(event.target.value);
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
              borderBottomLeftRadius:
                (isConnected && address === lockOwner) || showBanner
                  ? "0"
                  : "3px",
              borderBottomRightRadius:
                (isConnected && address === lockOwner) || showBanner
                  ? "0"
                  : "3px",
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
                borderBottom: showBanner ? "none" : "",
                borderRadius: "0 0",
                borderBottomLeftRadius: showBanner ? "0" : "3px",
                borderBottomRightRadius: showBanner ? "0" : "3px",
              }}
              className={`${styles.wrapper} pt-4 pb-8 col-span-full xl:col-span-6 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700`}
            >
              <div className={styles.buttonContainer}>
                {/* Transfer Lock Button */}
                <button
                  className={
                    selected === "transfer"
                      ? selectedButtonStyleClasses
                      : buttonStyleClasses
                  }
                  onClick={(event) => buttonClickHandler(event, "transfer")}
                >
                  Transfer Lock Ownership
                </button>

                {/* Renounce Lock Button */}
                <button
                  className={
                    selected === "renounce"
                      ? selectedButtonStyleClasses
                      : buttonStyleClasses
                  }
                  onClick={(event) => buttonClickHandler(event, "renounce")}
                >
                  Renounce Lock Ownership
                </button>

                {/* Extend Lock Button */}
                <button
                  className={
                    selected === "extend"
                      ? selectedButtonStyleClasses
                      : buttonStyleClasses
                  }
                  onClick={(event) => buttonClickHandler(event, "extend")}
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
                  onClick={(event) => buttonClickHandler(event, "unlock")}
                >
                  {buttonStates.target === "unlock" && buttonStates.loading ? (
                    <Icon className={styles.buttonIcon} name="spinner" />
                  ) : null}
                  Unlock
                </button>
              </div>
            </div>
          ) : null}

          {/* Message Banner */}
          <Banner02
            type={bannerType}
            open={showBanner}
            className={`${styles.banner} bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-sm border border-slate-200 dark:border-slate-700`}
          >
            {bannerMessage}
          </Banner02>
        </div>
      ) : (
        <PageLoader text="Loading..." />
      )}
      <>
        {/* Renounce Ownership Modal Dialog */}
        <ModalBlank
          isOpen={renounceOwnershipDialogOpen}
          setIsOpen={setRenounceOwnershipDialogOpen}
        >
          <div className="p-5 flex space-x-4">
            {/* Icon */}
            <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-yellow-100 dark:bg-yellow-500/30">
              <svg
                className="w-4 h-4 shrink-0 fill-current text-yellow-500"
                viewBox="0 0 16 16"
              >
                <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 12c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zm1-3H7V4h2v5z" />
              </svg>
            </div>
            {/* Content */}
            <div>
              {/* Modal header */}
              <div className="mb-2">
                <div className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                  Renouce Lock Ownership
                </div>
              </div>
              {/* Modal content */}
              <div className="text-sm mb-10">
                <div className="space-y-2">
                  <p>
                    Do you really want to renounce the ownership of this lock?
                    This action can't be reverted.
                  </p>
                </div>
              </div>
              {/* Modal footer */}
              <div className="flex flex-wrap justify-end space-x-2">
                <button
                  className="btn-sm border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-600 dark:text-slate-300"
                  onClick={() => {
                    setAction("");
                    setRenounceOwnershipDialogOpen(false);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="btn-sm bg-yellow-500 hover:bg-yellow-600 text-white"
                  onClick={() => {
                    setAction("");
                    setRenouce(true);
                  }}
                >
                  {renounce ? (
                    <Icon className={styles.buttonIcon} name="spinner" />
                  ) : null}
                  Yes, Renounce!
                </button>
              </div>
            </div>
          </div>
        </ModalBlank>

        {/* Transfer Ownership Modal Dialog */}
        <ModalAction
          isOpen={transferOwnershipDialogOpen}
          setIsOpen={setTransferOwnershipDialogOpen}
        >
          {/* Modal header */}
          <div className="mb-2 text-center">
            {/* Icon */}
            <div className="mb-3">
              <svg
                className="inline-flex w-12 h-12 rounded-full shrink-0 fill-current"
                viewBox="0 0 48 48"
              >
                <rect
                  className="text-indigo-100 dark:text-indigo-500/30"
                  width="48"
                  height="48"
                  rx="24"
                />
                <path
                  className="text-indigo-300"
                  d="M19 16h7a8 8 0 110 16h-7V16z"
                />
                <path className="text-indigo-500" d="M26 24l-7-6v5h-8v2h8v5z" />
              </svg>
            </div>
            <div className="text-lg mb-6 font-semibold text-slate-800 dark:text-slate-100">
              Transfer Lock Ownership
            </div>
          </div>
          {/* Modal content */}
          <div className="text-center">
            {/* Submit form */}
            <div className="text-sm mb-1 50-width text-left pl-10 pr-10">
              New Owner Address <span className="text-rose-500">*</span>
            </div>
            <form className="flex flex-col max-w-sm m-auto">
              <div className="grow flex flex-col">
                <input
                  onChange={transferAddressOnChangeHandler}
                  value={transferAddress}
                  id="subscribe-form"
                  className="form-input w-full px-2 py-1"
                  type="text"
                  placeholder="Enter new owner wallet address"
                />
                <div className="text-xs text-left mt-1 text-rose-500">
                  {transferAddressError}
                </div>
              </div>
              <div className="text-xs text-left text-yellow-300 italic mt-1 mb-4">
                ⚠️ You'll no longer be the owner of this lock henceforth.
              </div>

              <div className="flex flex-wrap justify-end space-x-2">
                <button
                  className="btn-sm border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-600 dark:text-slate-300"
                  onClick={(event) => {
                    event.preventDefault();
                    setAction("");
                    setTransferAddressError("");
                    setTransferOwnershipDialogOpen(false);
                  }}
                >
                  Cancel
                </button>
                <button
                  disabled={transfer}
                  className="btn-sm bg-indigo-500 hover:bg-indigo-600 text-white"
                  onClick={(event) => {
                    event.preventDefault();
                    setAction("");
                    setTransfer(true);
                  }}
                >
                  {transfer ? (
                    <Icon className={styles.buttonIcon} name="spinner" />
                  ) : null}
                  Transfer!
                </button>
              </div>
            </form>
          </div>
        </ModalAction>
      </>
    </div>
  );
};

export default ViewLocks;
