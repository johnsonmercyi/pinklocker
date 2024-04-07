"use client";

import tokenInstance from "@/blockchain/config/ERC20";
import pinkLockInstance from "@/blockchain/config/PinkLock";
import Banner02 from "@/components/banner-02";
import Datepicker from "@/components/datepicker";
import {
  useWeb3Modal,
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from "@web3modal/ethers/react";
import { ethers } from "ethers";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDatePicker } from "../../../context/DateProvider";
import ListCard from "../../../ui/listcard/ListCard";
import ListCardItem from "../../../ui/listcard/ListCardItem";
import {
  Icon,
  dateToSeconds,
  formatNumber,
  secondsToDate,
} from "../../../utils/utility";
import styles from "./styles.module.css";
import PageLoader from "../../../ui/loader/Loader";

type ButtonTexts = "Update Lock" | "Approve";

const EditLock = () => {
  const param = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const { walletProvider } = useWeb3ModalProvider();
  const { address, isConnected } = useWeb3ModalAccount();
  const { open, close } = useWeb3Modal();

  // Token Information states
  const [token, setToken] = useState<string>("");
  const [tokenName, setTokenName] = useState<string>("");
  const [tokenSymbol, setTokenSymbol] = useState<string>("");
  const [tokenDecimal, setTokenDecimal] = useState<number>(0);
  const [tokenBalance, setTokenBalance] = useState<string>("");
  const [lockId, setLockId] = useState<number>(0);
  const [walletAddress, setWalletAddress] = useState<string | undefined>(
    address
  );
  const [allowance, setAllowance] = useState<number>(0);

  const [lockAmount, setLockAmount] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [amountError, setAmountError] = useState<string>("");
  const [lockDateError, setLockDateError] = useState<string>("");
  const [shouldSubmit, setShouldSubmit] = useState<boolean>(false);
  const [buttonText, setButtonText] = useState<ButtonTexts>("Update Lock");

  const [showBanner, setShowBanner] = useState<boolean>(false);
  const [bannerType, setBannerType] = useState<
    "success" | "error" | "warning" | undefined
  >("success");
  const [bannerMessage, setBannerMessage] = useState<string>("");
  // const { dateString, selectedDates, setDateString, setSelectedDates } =
  //   useDatePicker();
  const [lockUntilDate, setLockUntilDate] = useState<number>(
    dateToSeconds(localStorage.getItem("lockedDate") || "")
  );
  const [newLockUntilDate, setNewLockUntilDate] = useState<number>(0);
  const [applicationReady, setApplicationReady] = useState<boolean>(false);

  // For when date is updated
  // useEffect(() => {
  //   if (dateString) {
  //     seNewLockUntilDate(dateToSeconds(dateString));
  //   }
  // }, [dateString]);

  const setLockUntilDateStr = (dateStr: string) => {
    console.log("DATE: ", dateStr);
    setNewLockUntilDate(dateToSeconds(dateStr));
  };

  useEffect(() => {
    const fetchTokenDetails = async () => {
      if (lockId) {
        const pinkLock = await pinkLockInstance(walletProvider || null);
        const lockRecord = await pinkLock.getLockById(Number(lockId));
        const lockToken = lockRecord[1];
        const lockAmount = Number(BigInt(lockRecord[3]) / 10n ** 18n);
        const unlockDate = Number(lockRecord[5]);

        // console.log("Seconds to date: ", lockDate.toString());

        const tokenObj = await tokenInstance(lockToken, walletProvider || null);

        const instance = tokenObj.instance;
        const name = await instance.name();
        const symbol = await instance.symbol();
        const decimal = await instance.decimals();
        let balance = 0;
        if (walletAddress) {
          balance = await instance.balanceOf(walletAddress);
        }

        // Format the balance for better readability (optional)
        const formattedBalance = ethers.formatUnits(balance, decimal);

        // console.log("Balance: ", formattedBalance);

        setToken(lockToken);
        setTokenName(name);
        setTokenSymbol(symbol);
        setTokenDecimal(Number(decimal));
        setTokenBalance(formatNumber(Number(formattedBalance)));
        setAmount(String(lockAmount));
        setLockAmount(String(lockAmount));
        setLockUntilDate(unlockDate);
        setApplicationReady(true);
      } else {
        setLockId(Number(param.lock_id));
      }
    };

    fetchTokenDetails();
  }, [lockId, walletAddress]);

  useEffect(() => {
    if (address) {
      setWalletAddress(address);
    }
  }, [address]);

  useEffect(() => {
    const fetchTokenAllowance = async () => {
      if (amount && walletAddress) {
        const tokenObj = await tokenInstance(token, walletProvider || null);
        const instance = tokenObj.instance;

        let allowance = await instance.allowance(
          walletAddress,
          process.env.NEXT_PUBLIC_PINKLOCK_ADDRESS
        );

        allowance = Number(BigInt(allowance) / 10n ** 18n);
        setAllowance(allowance);

        console.log("Allowance: ", allowance);

        if (allowance >= Number(amount)) {
          setButtonText("Update Lock");
        } else {
          setButtonText("Approve");
        }
      }
    };

    fetchTokenAllowance();
  }, [amount, walletAddress]);

  useEffect(() => {
    console.log("ALLOWANCE: ", allowance);
    if (allowance >= Number(lockAmount)) {
      setButtonText("Update Lock");
    } else {
      setButtonText("Approve");
    }
  }, [allowance]);

  useEffect(() => {
    if (isConnected) {
      setBannerMessage("");
      setShowBanner(false);
    }
  }, [isConnected]);

  const onSubmitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("AMOUNT: ", amount);
    if (validateFields()) {
      if (isConnected) {
        try {
          setShouldSubmit(true);
          setShowBanner(false);
          setBannerMessage("");

          const pinkLocker = await pinkLockInstance(walletProvider || null);
          const tokenObj = await tokenInstance(token, walletProvider || null);
          const tokenInst = tokenObj.instance;

          if (buttonText === "Approve") {
            const tokenApproval = await tokenInst.approve(
              process.env.NEXT_PUBLIC_PINKLOCK_ADDRESS,
              amount
            );

            const approvalReceipt = await tokenApproval.wait();

            if (approvalReceipt.status === 1) {
              const tokenAllowance = await tokenInst.allowance(
                walletAddress,
                process.env.NEXT_PUBLIC_PINKLOCK_ADDRESS
              );

              setAllowance(Number(tokenAllowance));

              setShouldSubmit(false);
              setShowBanner(true);
              setBannerType("success");
              setBannerMessage(
                `Token approval was successful. Please click the "Lock" button to update your lock!`
              );
            } else {
              setShouldSubmit(false);
              setShowBanner(true);
              setBannerType("error");
              setBannerMessage("Token approval failed!");
            }
          } else if (buttonText === "Update Lock") {
            let amt = BigInt(amount);
            amt = amt * 10n ** 18n;
            const lockTranX = await pinkLocker.editLock(
              BigInt(lockId),
              amt,
              newLockUntilDate
            );

            // Fetch lock transaction hash
            const lockTransXHash = lockTranX.hash;
            console.log("Lock Transaction Hash:", lockTransXHash);

            setShowBanner(true);
            setBannerType("success");
            setBannerMessage(
              `Lock update transaction submitted and awaiting confirmation!`
            );

            // Waiting for the transaction to be mined
            const lockReceipt = await lockTranX.wait();

            router.back();
          }
        } catch (error: any) {
          setShouldSubmit(false);
          setShowBanner(true);
          setBannerType("error");
          setBannerMessage(error.message);

          if (
            String(error.message).includes(
              `execution reverted: "Unlock date should be in the future"`
            )
          ) {
            setBannerMessage("Unlock date should be in the future.");
          } else if (String(error.message).includes(`user rejected action`)) {
            setBannerMessage("Sorry! Your approval request was rejected.");
          } else if (
            String(error.message).includes(
              `New amount should not be less than current amount`
            )
          ) {
            setBannerMessage(
              "Sorry! New amount should not be less than current amount"
            );
          }
        }
      } else {
        setShouldSubmit(false);
        setShowBanner(true);
        setBannerType("error");
        setBannerMessage("Please kindly connect your wallet to BNB Testnet!");
      }
    }
  };

  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShowBanner(false);
    setBannerMessage("");
    try {
      // If amount is not a number this will trigger an error
      if (Number.isNaN(Number(event.target.value)))
        throw new Error("Amount must be a number!");

      setAmount(event.target.value);
    } catch (error: any) {
      setShowBanner(true);
      setBannerType("error");
      setBannerMessage(error.message);
    }
  };

  const validateFields = () => {
    if (!amount) {
      setAmountError("Enter token amount.");
    } else {
      setAmountError("");
    }

    if (Number(amount) === 0 || !Number(amount)) {
      setAmountError("Invalid token amount.");
    } else {
      setAmountError("");
    }

    if (Number(amount) <= Number(lockAmount)) {
      setAmountError("New amount must be greater than the current amount.");
    } else {
      setAmountError("");
    }

    if (!lockUntilDate) {
      setLockDateError("Select Unlock date");
    } else {
      setLockDateError("");
    }

    console.log(
      "New lock date: ",
      newLockUntilDate,
      "Date now: ",
      Date.now(),
      Date.now() / 1000
    );

    if (newLockUntilDate <= Date.now() / 1000) {
      setLockDateError("New date must be in the future.");
    } else {
      setLockDateError("");
    }

    return (
      Number(amount) &&
      Number(amount) > Number(lockAmount) &&
      lockUntilDate &&
      newLockUntilDate > Date.now() / 1000
    );
  };

  return (
    <div
      className={`relative bg-white dark:bg-slate-900 h-full ${styles.main}`}
    >
      {applicationReady ? (
        <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-[96rem] mx-auto">
          {/* Page header */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold">
              Edit Lock ✨
            </h1>
          </div>

          <ListCard
            className={styles.listCard}
            title={"Token Info"}
            subTitle={tokenName}
          >
            <ListCardItem property="Token Address" value={token} />
            <ListCardItem property="Token Name" value={tokenName} />
            <ListCardItem property="Token Symbol" value={tokenSymbol} />
            <ListCardItem property="Token Decimal" value={tokenDecimal} />
            <ListCardItem property="Token Balance" value={tokenBalance} />
          </ListCard>

          <div className="border-t border-slate-200 dark:border-slate-700">
            {/* Form */}
            <form
              className="space-y-8 mt-8"
              onSubmit={(event) => onSubmitHandler(event)}
            >
              {/* Amount Field */}
              <div>
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="error"
                  >
                    Amount <span className="text-rose-500">*</span>
                  </label>
                  <input
                    name={"amount"}
                    value={amount}
                    id="error"
                    className="form-input w-full"
                    type="text"
                    placeholder="Enter lock token amount"
                    onChange={onChangeHandler}
                  />
                </div>
                <div
                  className={`text-xs mt-1 ${
                    amountError.length ? "text-rose-500" : "text-blue-500"
                  }`}
                >
                  {amountError.length
                    ? amountError
                    : ""}
                </div>
              </div>

              {/* Datepicker */}
              <div>
                <div className={styles.dateAndLockBtnWrapper}>
                  <div>
                    <label
                      className="block text-sm font-medium mb-1"
                      htmlFor="mandatory"
                    >
                      Unlock Date {" "}
                      <span className="text-rose-500">*</span>
                    </label>
                    <Datepicker
                      defaultDate={lockUntilDate}
                      setDateString={setLockUntilDateStr}
                    />
                  </div>

                  <div className={styles.buttonWrapper}>
                    <button
                      className={`btn bg-indigo-500 hover:bg-indigo-600 text-white pt-1 pb-2 ${
                        shouldSubmit
                          ? "disabled:border-slate-200 dark:disabled:border-slate-700 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-600 disabled:cursor-not-allowed shadow-none"
                          : ""
                      }`}
                      disabled={shouldSubmit}
                      type="submit"
                    >
                      {shouldSubmit ? (
                        <Icon name="spinner" />
                      ) : (
                        <Icon name="add" stroke="rgba(255, 255, 255, 0.5)" />
                      )}
                      <span className="hidden xs:block ml-2">{buttonText}</span>
                    </button>
                  </div>
                </div>
                <div className="text-xs mt-1 text-rose-500">
                  {lockDateError}
                </div>
              </div>

              <Banner02 type={bannerType} open={showBanner}>
                {bannerMessage}
              </Banner02>
            </form>
          </div>
        </div>
      ) : (
        <PageLoader text="Loading..." />
      )}
    </div>
  );
};

export default EditLock;
