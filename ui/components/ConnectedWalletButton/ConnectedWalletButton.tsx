import { useWallet } from "@/app/(default)/tokens/config/ValidateWalletConnection";
import { Icon } from "../../app/(default)/tokens/utils/utility";
import styles from "./styles.module.css";
import { useEffect, useState } from "react";

const ConnectedWalletButton = ({
  walletChainId,
  onClickHandler,
}: {
  walletChainId: number | undefined;
  onClickHandler: () => void;
}) => {
  const { address, isConnected, balance, networkSymbol, chainId } = useWallet();
  const [isValidChain, setIsValidChain] = useState<boolean>(false);

  useEffect(() => {
    if (walletChainId === chainId) {
      setIsValidChain(true);
    }
  }, [walletChainId, chainId]);

  return (
    <div
      className={`flex items-center justify-center bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600/80 ${styles.main}`}
      onClick={onClickHandler}
    >
      {isValidChain ? (
        <>
          <div className={styles.walletDetails}>
            <span
              className={`text-slate-500 dark:text-slate-400 ${styles.address}`}
            >
              {`${address?.substring(0, 6)}...${address?.substring(
                address.length - 4,
                address.length
              )}`}
            </span>
            <span
              className={`text-green-500 dark:text-green-400 ${styles.balance}`}
            >{`${balance} ${networkSymbol?.toUpperCase()}`}</span>
          </div>
          <Icon
            className={styles.icon}
            name="wallet"
          />
        </>
      ) : (
        <div className={styles.invalidNet}>
          <Icon
            className={styles.errorIcon}
            name="invalid-net"
            stroke="rgba(244, 63, 94)"
            strokeWidth="1.2"
            width="25"
            height="25"
          />
          <span className={styles.text}>Invalid Net!</span>
        </div>
      )}
    </div>
  );
};

export default ConnectedWalletButton;
