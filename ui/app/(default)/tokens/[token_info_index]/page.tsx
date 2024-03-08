"use client";

import { useEffect, useState } from "react";
import ListCard from "../ui/listcard/ListCard";
import ListCardItem from "../ui/listcard/ListCardItem";
import styles from './styles/styles.module.css';

import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useWeb3ModalProvider } from "@web3modal/ethers/react";
import tokenInstance from "@/blockchain/config/ERC20";
import pinkLockInstance from "@/blockchain/config/PinkLock";
import Table from "../ui/table/Table";

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

  useEffect(() => {
    const fetchTokenDetails = async () => {
      if (tokenInfoIndex >= 0) {
        if (walletProvider) {
          const pinkLock = await pinkLockInstance(walletProvider);
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
        }
      } else {
        setTokenInfoIndex(Number(param.token_info_index as string));
      }
    };

    fetchTokenDetails();
  }, [tokenInfoIndex]);

  useEffect(() => {
    const initTokenDetails = async () => {
      if (token && walletProvider) {
        const tokenObj = await tokenInstance(token, walletProvider);
        console.log("TOKEN OBJECT: ", tokenObj);
        const instance = tokenObj.instance;
        const name = await instance.name();
        const symbol = await instance.symbol();
        const decimal = await instance.decimals();

        setTokenName(name);
        setTokenSymbol(symbol);
        setTokenDecimal(Number(decimal));
      }
    };

    const initLockRecords = async() => {
      await initTokenDetails();
      if (token && walletProvider) {
        const pinkLock = await pinkLockInstance(walletProvider);
        const tokenLocks = await pinkLock.getLocksForToken(token, 0, 10);
        console.log("TOKEN LOCKS 0 - 10...", tokenLocks);
      }
    }

    initLockRecords();
    
  }, [token]);

  const viewLockRecordHandler = () => {
    alert("Opening...");
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
          title="Lock Records"
          className={styles.table}
          headers={[
            "Wallet",
            "Amount",
            "Cycle(d)",
            "Cycle Release(%)",
            "TGE(%) Unlock time(UTC)",
            "Action",
          ]}
          clickHandler={viewLockRecordHandler}
          transactions={[]}
        />
      </div>
    </div>
  );
};

export default ViewToken;
