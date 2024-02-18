import { BrowserProvider } from "ethers";
import { createContext } from "react";

type WalletContextType = {
  chainId: number | string | undefined,
  provider: BrowserProvider | undefined | null,
  balance: number | string | undefined,
  address: string | undefined,
  isConnected: boolean,
  networkSymbol: string | '',
}

export const WalletContext = createContext<WalletContextType | null>(null);