"use client";

import Datepicker from "@/components/datepicker";
import { Icon, dateToSeconds } from "@/app/(default)/tokens/utils/utility";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import styles from "./styles.module.css";
import Banner02 from "@/components/banner-02";
import { DatePickerProvider, useDatePicker } from "../context/DateProvider";
import {
  useWeb3Modal,
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from "@web3modal/ethers/react";
import pinkLockInstance from "@/blockchain/config/PinkLock";
import { useRouter } from "next/navigation";
import tokenInstance from "@/blockchain/config/ERC20";
import { ethers } from "ethers";

interface Fields {
  tokenAddress: string;
  anotherOwner: string;
  lockTitle: string;
  amount: string;
  tgePercentage: string;
  cycleMinutes: string;
  cyclePercentage: string;
}

const CreateNewLock = () => {
  const [useAnotherOwner, setUseAnotherOwner] = useState<boolean>(false);
  const [useVesting, setUseVesting] = useState<boolean>(false);
  const [fields, setFields] = useState<Fields>({
    amount: "",
    anotherOwner: "",
    lockTitle: "",
    tokenAddress: "",
    tgePercentage: "",
    cycleMinutes: "",
    cyclePercentage: "",
  });

  const [fieldError, setFieldError] = useState<{
    amount: string;
    anotherOwner: string;
    tokenAddress: string;
    lockDate: string;
    tgeDate: string;
    tgePercentage: string;
    cycleMinutes: string;
    cyclePercentage: string;
  }>({
    amount: "",
    anotherOwner: "",
    tokenAddress: "",
    lockDate: "",
    tgeDate: "",
    tgePercentage: "",
    cycleMinutes: "",
    cyclePercentage: "",
  });

  const { dateString, selectedDates } = useDatePicker();
  const [lockUntilDate, setLockUntilDate] = useState<number>(0);
  const [tgeDate, setTgeDate] = useState<number>(0);
  const [ownerAddress, setOwnerAddress] = useState<string>("");
  const [showBanner, setShowBanner] = useState<boolean>(false);
  const [bannerType, setBannerType] = useState<
    "success" | "error" | "warning" | undefined
  >("success");
  const [bannerMessage, setBannerMessage] = useState<string>("");
  const [shouldSubmit, setShouldSubmit] = useState<boolean>(false);
  const [buttonText, setButtonText] = useState<"Lock" | "Approve">("Lock");
  const [allowance, setAllowance] = useState<number>(0);

  const { address, isConnected } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();
  const { open } = useWeb3Modal();

  const router = useRouter();

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
    if (address) {
      setOwnerAddress(address);
    }
  }, [address]);

  useEffect(() => {
    setBannerType(bannerType);
  }, [bannerType]);

  useEffect(() => {
    if (!isConnected) {
      open();
    }
  }, [isConnected]);

  useEffect(() => {
    const checkContractAllowance = async () => {
      if (fields.tokenAddress && fields.amount) {
        if (walletProvider) {
          const tokenObj = await tokenInstance(
            fields.tokenAddress,
            walletProvider
          );

          const tokenInst = tokenObj.instance;

          const tokenAllowance = await tokenInst.allowance(
            ownerAddress,
            process.env.NEXT_PUBLIC_PINKLOCK_ADDRESS
          );

          setAllowance(Number(BigInt(tokenAllowance) / 10n ** 18n));
        }
      }
    };

    checkContractAllowance();
  }, [fields.tokenAddress, fields.amount, isConnected]);

  useEffect(() => {
    console.log("Allowance changed: ", allowance);
    if (allowance >= Number(fields.amount)) {
      setButtonText("Lock");
    } else {
      setButtonText("Approve");
    }
  }, [fields.amount, allowance, buttonText]);

  const onChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setShowBanner(false);
    setBannerMessage("");
    try {
      const input: string = event.target.name;
      const value: string = event.target.value;

      let amount: number = 0;

      // If amount is not a number this will trigger an error
      if (input === "amount") {
        if (Number.isNaN(Number(value)))
          throw new Error("Amount must be a number!");
      }

      setFields((fields) => ({
        ...fields,
        [input]: value,
      }));
    } catch (error: any) {
      setShowBanner(true);
      setBannerType("error");
      setBannerMessage(error.message);
    }
  };

  const useAnotherOwnerHandler = () => {
    setUseAnotherOwner((oldState) => !oldState);
  };

  const useVestingHandler = () => {
    setUseVesting((oldState) => !oldState);
  };

  const onSubmitHandler = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (validateFields()) {
      if (isConnected && walletProvider) {
        try {
          setShouldSubmit(true);
          setShowBanner(false);
          setBannerMessage("");

          const owner = useAnotherOwner ? fields.anotherOwner : ownerAddress;
          const token = fields.tokenAddress;
          const isLpToken = false;
          let amount = BigInt(fields.amount);
          amount = amount * 10n ** 18n;
          const unlockDate = lockUntilDate;
          const description = fields.lockTitle;

          const pinkLocker = await pinkLockInstance(walletProvider);

          const tokenObj = await tokenInstance(
            fields.tokenAddress,
            walletProvider
          );

          const tokenInst = tokenObj.instance;

          if (buttonText === "Approve") {
            const tokenApproval = await tokenInst.approve(
              process.env.NEXT_PUBLIC_PINKLOCK_ADDRESS,
              amount
            );

            const approvalReceipt = await tokenApproval.wait();

            if (approvalReceipt.status === 1) {
              const tokenAllowance = await tokenInst.allowance(
                ownerAddress,
                process.env.NEXT_PUBLIC_PINKLOCK_ADDRESS
              );

              setAllowance(Number(BigInt(tokenAllowance) / 10n ** 18n));

              setShouldSubmit(false);
              setShowBanner(true);
              setBannerType("success");
              setBannerMessage(
                `Token approval was successfully. Please click the "Lock" button to create new lock!`
              );
            } else {
              setShouldSubmit(false);
              setShowBanner(true);
              setBannerType("error");
              setBannerMessage("Token approval failed!");
            }
          } else {
            const decimal = await tokenInst.decimals();
            let balance = await tokenInst.balanceOf(address);
            const formattedBalance = ethers.formatUnits(balance, decimal);
            balance = Number(formattedBalance);

            if (balance < Number(ethers.formatUnits(amount, decimal))) {
              setShouldSubmit(false);
              setShowBanner(true);
              setBannerType("error");
              setBannerMessage(
                "Sorry! Your balance is too low for this transaction."
              );
            } else {
              const lockTransX = await pinkLocker.lock(
                owner,
                token,
                isLpToken,
                amount,
                unlockDate,
                description
              );

              // Fetch lock transaction hash
              const lockTransXHash = lockTransX.hash;
              console.log("Lock Transaction Hash:", lockTransXHash);

              setShowBanner(true);
              setBannerType("success");
              setBannerMessage(
                `Lock transaction submitted and awaiting confirmation!`
              );

              // Waiting for the transaction to be mined
              const lockReceipt = await lockTransX.wait();

              router.push(`/tokens`);
            }
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
            setBannerMessage("Sorry! User rejected action.");
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

  const validateFields = () => {
    if (!fields.tokenAddress) {
      setFieldError((fields) => ({
        ...fields,
        tokenAddress: "Enter token address",
      }));
    } else {
      if (fields.tokenAddress.length !== 42) {
        setFieldError((fields) => ({
          ...fields,
          tokenAddress: "Invalid token address",
        }));
      } else {
        setFieldError((fields) => ({
          ...fields,
          tokenAddress: "",
        }));
      }
    }

    if (useAnotherOwner) {
      if (!fields.anotherOwner) {
        setFieldError((fields) => ({
          ...fields,
          anotherOwner: "Enter owner address",
        }));
      } else {
        if (fields.anotherOwner.length !== 42) {
          setFieldError((fields) => ({
            ...fields,
            anotherOwner: "Invalid owner address",
          }));
        } else {
          setFieldError((fields) => ({
            ...fields,
            anotherOwner: "",
          }));
        }
      }
    }

    if (useVesting) {
      if (!tgeDate) {
        setFieldError((fields) => ({
          ...fields,
          tgeDate: "Select TGE date",
        }));
      } else {
        setFieldError((fields) => ({
          ...fields,
          tgeDate: "",
        }));
      }

      if (!fields.tgePercentage) {
        setFieldError((fields) => ({
          ...fields,
          tgePercentage: "Enter TGE percentage",
        }));
      } else {
        setFieldError((fields) => ({
          ...fields,
          tgePercentage: "",
        }));
      }

      if (!fields.cycleMinutes) {
        setFieldError((fields) => ({
          ...fields,
          cycleMinutes: "Enter cycle minutes",
        }));
      } else {
        setFieldError((fields) => ({
          ...fields,
          cycleMinutes: "",
        }));
      }

      if (!fields.cyclePercentage) {
        setFieldError((fields) => ({
          ...fields,
          cyclePercentage: "Enter cycle percentage",
        }));
      } else {
        setFieldError((fields) => ({
          ...fields,
          cyclePercentage: "",
        }));
      }
    }

    if (!fields.amount) {
      setFieldError((fields) => ({
        ...fields,
        amount: "Enter token amount",
      }));
    } else {
      setFieldError((fields) => ({
        ...fields,
        amount: "",
      }));
    }

    if (!lockUntilDate) {
      setFieldError((fields) => ({
        ...fields,
        lockDate: "Select lock until(UCT time) date",
      }));
    } else {
      setFieldError((fields) => ({
        ...fields,
        lockDate: "",
      }));
    }

    if (useAnotherOwner) {
      if (useVesting) {
        return (
          fields.tokenAddress &&
          fields.tokenAddress.length === 42 &&
          fields.anotherOwner &&
          fields.anotherOwner.length === 42 &&
          fields.amount &&
          tgeDate &&
          fields.tgePercentage &&
          fields.cycleMinutes &&
          fields.cyclePercentage &&
          lockUntilDate
        );
      } else {
        return (
          fields.tokenAddress &&
          fields.tokenAddress.length === 42 &&
          fields.anotherOwner &&
          fields.anotherOwner.length === 42 &&
          fields.amount &&
          lockUntilDate
        );
      }
    } else {
      if (useVesting) {
        return (
          fields.tokenAddress &&
          fields.tokenAddress.length === 42 &&
          fields.amount &&
          tgeDate &&
          fields.tgePercentage &&
          fields.cycleMinutes &&
          fields.cyclePercentage &&
          lockUntilDate
        );
      } else {
        return (
          fields.tokenAddress &&
          fields.tokenAddress.length === 42 &&
          fields.amount &&
          lockUntilDate
        );
      }
    }
  };

  return (
    <div className="relative bg-white dark:bg-slate-900 h-full">
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-[96rem] mx-auto">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold">
            Lock New Token ✨
          </h1>
        </div>

        <div className="border-t border-slate-200 dark:border-slate-700">
          {/* Form */}
          <form
            className="space-y-8 mt-8"
            onSubmit={(event) => onSubmitHandler(event)}
          >
            {/* Token Address */}
            <div>
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="error"
                >
                  Token Address <span className="text-rose-500">*</span>
                </label>
                <input
                  name={"tokenAddress"}
                  value={fields.tokenAddress}
                  id="error"
                  className="form-input w-full"
                  type="text"
                  placeholder="Enter token address"
                  onChange={onChangeHandler}
                />
              </div>
              <div className="text-xs mt-1 text-rose-500">
                {fieldError.tokenAddress}
              </div>
            </div>

            {/* Another owner Checkbox */}
            <label
              className="flex items-center"
              style={{ width: "fit-content" }}
            >
              <input
                type="checkbox"
                className="form-checkbox"
                defaultChecked={useAnotherOwner}
                onChange={useAnotherOwnerHandler}
              />
              <span className="text-sm ml-2">Use another owner?</span>
            </label>

            {/* Another Owner Field*/}
            {useAnotherOwner ? (
              <div>
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="error"
                  >
                    Owner <span className="text-rose-500">*</span>
                  </label>
                  <input
                    name={"anotherOwner"}
                    value={fields.anotherOwner}
                    id="error"
                    className="form-input w-full"
                    type="text"
                    placeholder="Enter owner address"
                    onChange={onChangeHandler}
                  />
                </div>
                <div className="text-xs mt-1 text-rose-500">
                  {fieldError.anotherOwner}
                </div>
              </div>
            ) : null}

            {/* Title Field*/}
            <div>
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="default"
              >
                Title
              </label>
              <input
                name={"lockTitle"}
                value={fields.lockTitle}
                id="default"
                className="form-input w-full"
                type="text"
                placeholder="Enter lock title"
                onChange={onChangeHandler}
              />
            </div>

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
                  value={fields.amount}
                  id="error"
                  className="form-input w-full"
                  type="text"
                  placeholder="Enter lock token amount"
                  onChange={onChangeHandler}
                />
              </div>
              <div className="text-xs mt-1 text-rose-500">
                {fieldError.amount}
              </div>
            </div>

            {/* Use vesting Checkbox */}
            <label
              className="flex items-center"
              style={{ width: "fit-content" }}
            >
              <input
                type="checkbox"
                className="form-checkbox"
                defaultChecked={useVesting}
                onChange={useVestingHandler}
              />
              <span className="text-sm ml-2">Use vesting?</span>
            </label>

            {useVesting ? (
              <>
                <div className={`flex flex-col space-x-0 space-y-6`}>
                  {/* TGE Date */}
                  <div className={`w-full`}>
                    <label
                      className="block text-sm font-medium mb-1"
                      htmlFor="default"
                    >
                      TGE Date (UTC)
                    </label>
                    <Datepicker />
                    <div className="text-xs mt-1 text-rose-500">
                      {fieldError.tgeDate}
                    </div>
                  </div>

                  {/* TGE Percent */}
                  <div className={`w-full`}>
                    <label
                      className="block text-sm font-medium mb-1"
                      htmlFor="default"
                    >
                      TGE Percentage
                    </label>
                    <input
                      name={"tgePercentage"}
                      value={fields.tgePercentage}
                      id="default"
                      className="form-input w-full"
                      type="text"
                      placeholder="Enter TGE percentage"
                      onChange={onChangeHandler}
                    />
                    <div className="text-xs mt-1 text-rose-500">
                      {fieldError.tgePercentage}
                    </div>
                  </div>
                </div>

                <div className={`flex flex-col space-x-0 space-y-6`}>
                  {/* Cycle Minutes */}
                  <div className={`w-full`}>
                    <label
                      className="block text-sm font-medium mb-1"
                      htmlFor="default"
                    >
                      Cycle Minutes
                    </label>
                    <input
                      name={"cycleMinutes"}
                      value={fields.cycleMinutes}
                      id="default"
                      className="form-input w-full"
                      type="text"
                      placeholder="Enter cycle minutes"
                      onChange={onChangeHandler}
                    />
                    <div className="text-xs mt-1 text-rose-500">
                      {fieldError.cycleMinutes}
                    </div>
                  </div>

                  {/* Cycle Percentage */}
                  <div className={`w-full`}>
                    <label
                      className="block text-sm font-medium mb-1"
                      htmlFor="default"
                    >
                      Cycle Percentage
                    </label>
                    <input
                      name={"cyclePercentage"}
                      value={fields.cyclePercentage}
                      id="default"
                      className="form-input w-full"
                      type="text"
                      placeholder="Enter cycle percentage"
                      onChange={onChangeHandler}
                    />
                    <div className="text-xs mt-1 text-rose-500">
                      {fieldError.cyclePercentage}
                    </div>
                  </div>
                </div>
              </>
            ) : null}

            {/* Datepicker */}
            <div>
              <div>
                <div className="w-full mb-7">
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="mandatory"
                  >
                    Lock Until (UTC time){" "}
                    <span className="text-rose-500">*</span>
                  </label>
                  <Datepicker />
                  <div className="text-xs mt-1 text-rose-500">
                    {fieldError.lockDate}
                  </div>
                </div>

                <div className={`w-full`}>
                  <button
                    className={`btn bg-indigo-500 hover:bg-indigo-600 text-white ${
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

export default CreateNewLock;
