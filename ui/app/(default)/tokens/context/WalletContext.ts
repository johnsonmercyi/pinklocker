import { BrowserProvider, Eip1193Provider } from "ethers";
import { createContext } from "react";

type WalletContextType = {
  chainId: number | string | undefined,
  provider: BrowserProvider | undefined | null,
  balance: number | string | undefined,
  address: string | undefined,
  isConnected: boolean,
  networkSymbol: string | '',
  walletProvider: Eip1193Provider | undefined | null
}

export const WalletContext = createContext<WalletContextType | null>(null);