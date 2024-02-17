import { createContext } from "react";

type WalletContextType = {
  address: string | undefined,
  isConnected: boolean,
}

export const WalletContext = createContext<WalletContextType | null>(null);