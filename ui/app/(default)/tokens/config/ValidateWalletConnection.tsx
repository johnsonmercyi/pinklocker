'use client';

import { useWeb3ModalAccount, useWeb3ModalProvider, useWeb3Modal } from "@web3modal/ethers/react";
import { defaultConfig } from "@web3modal/ethers";
import { useContext, useEffect, useState } from "react";
import { WalletContext } from "../context/WalletContext";
import { BrowserProvider, ethers } from "ethers";

export const ValidateWalletConnect = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { address, isConnected, chainId } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();

  const [balance, setBalance] = useState<number | string>(0);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [networkSymbol, setNetworkSymbol] = useState<string | ''>('');

  useEffect(() => {
    const initialize = async () => {
      if (isConnected && walletProvider) {
        let wProvider = new BrowserProvider(walletProvider);
        setProvider(wProvider);

        let walletBalance = await wProvider.getBalance(address ? address : "");
        setBalance(Number(ethers.formatEther(walletBalance)).toFixed(6));

        let netSymbol = await wProvider.getNetwork();
        setNetworkSymbol(netSymbol.name);
      } else {
        // show message about disconnection
      }
    };
    initialize();
  }, [isConnected, networkSymbol]);

  return (
    <WalletContext.Provider
      value={{
        chainId,
        provider,
        balance,
        address,
        isConnected,
        networkSymbol,
        walletProvider,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);

  if (!context) {
    throw new Error(
      "useWallet must be used within a ValidateWalletConnect component"
    );
  }

  return context;
}
