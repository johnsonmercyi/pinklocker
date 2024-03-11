"use client";

import { useEffect, useState } from "react";
import ListCard from "../../../ui/listcard/ListCard";
import ListCardItem from "../../../ui/listcard/ListCardItem";
import styles from "./styles.module.css";
import Banner02 from "@/components/banner-02";
import Datepicker from "@/components/datepicker";
import { Icon, dateToSeconds, formatNumber, secondsToDate } from "../../../utils/utility";
import { useDatePicker } from "../../../context/DateProvider";
import tokenInstance from "@/blockchain/config/ERC20";
import { useParams } from "next/navigation";
import pinkLockInstance from "@/blockchain/config/PinkLock";
import {
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from "@web3modal/ethers/react";
import { ethers } from "ethers";
import { Hook, Options } from "flatpickr/dist/types/options";

type ButtonTexts = "Lock" | "Approve";

const EditLock = () => {
  const param = useParams();
  const { walletProvider } = useWeb3ModalProvider();
  const { address } = useWeb3ModalAccount();

  // Token Information states
  const [token, setToken] = useState<string>("");
  const [tokenName, setTokenName] = useState<string>("");
  const [tokenSymbol, setTokenSymbol] = useState<string>("");
  const [tokenDecimal, setTokenDecimal] = useState<number>(0);
  const [tokenBalance, setTokenBalance] = useState<string>("");
  const [lockId, setLockId] = useState<number>(0);

  const [amount, setAmount] = useState<string>("");
  const [amountError, setAmountError] = useState<string>("");
  const [lockDateError, setLockDateError] = useState<string>("");
  const [shouldSubmit, setShouldSubmit] = useState<boolean>(false);
  const [buttonText, setButtonText] = useState<ButtonTexts>("Lock");

  const [showBanner, setShowBanner] = useState<boolean>(false);
  const [bannerType, setBannerType] = useState<
    "success" | "error" | "warning" | undefined
  >("success");
  const [bannerMessage, setBannerMessage] = useState<string>("");
  const { dateString, selectedDates, setDateString, setSelectedDates } = useDatePicker();
  const [lockUntilDate, setLockUntilDate] = useState<number | string>(0);

  // For when app mounts
  useEffect(() => {
    setLockUntilDate(dateToSeconds(dateString || ""));
  }, []);

  // For when date is updated
  useEffect(() => {
    if (dateString) {
      setLockUntilDate(dateToSeconds(dateString));
    }
  }, [dateString]);

  useEffect(() => {
    const fetchTokenDetails = async () => {
      if (lockId) {
        const pinkLock = await pinkLockInstance(walletProvider || null);
        const lockRecord = await pinkLock.getLockById(Number(lockId));
        const lockToken = lockRecord[1];
        const lockAmount = Number(BigInt(lockRecord[3]) / 10n ** 18n);
        const lockDate = secondsToDate(Number(lockRecord[4]));

        // console.log("Seconds to date: ", lockDate.toString());

        const tokenObj = await tokenInstance(lockToken, walletProvider || null);

        const instance = tokenObj.instance;
        const name = await instance.name();
        const symbol = await instance.symbol();
        const decimal = await instance.decimals();
        const balance = await instance.balanceOf(address);

        // Format the balance for better readability (optional)
        const formattedBalance = ethers.formatUnits(balance, decimal);

        // console.log("Balance: ", formattedBalance);

        setToken(lockToken);
        setTokenName(name);
        setTokenSymbol(symbol);
        setTokenDecimal(Number(decimal));
        setTokenBalance(formatNumber(Number(formattedBalance)));
        setAmount(String(lockAmount));
        setDateString(lockDate.toString());
        // setApplicationReady(true);
      } else {
        setLockId(Number(param.lock_id));
      }
    };

    fetchTokenDetails();
  }, [lockId]);

  const onSubmitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (validateFields()) {
      alert("Submitting...");
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

    if (!lockUntilDate) {
      setLockDateError("Select lock until(UCT time) date");
    } else {
      setLockDateError("");
    }

    return amount && lockUntilDate;
  };

  return (
    <div
      className={`relative bg-white dark:bg-slate-900 h-full ${styles.main}`}
    >
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
                  : "New amount must not be less than current amount"}
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
                    Lock Until (UTC time){" "}
                    <span className="text-rose-500">*</span>
                  </label>
                  <Datepicker defaultDate={dateString} />
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
              <div className="text-xs mt-1 text-rose-500">{lockDateError}</div>
            </div>

            <Banner02 type={bannerType} open={showBanner}>
              {bannerMessage}
            </Banner02>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditLock;
