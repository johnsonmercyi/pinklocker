'use client';

import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import { useContext, useEffect } from "react";
import { WalletContext } from "../context/WalletContext";

export const ValidateWalletConnect = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { address, isConnected } = useWeb3ModalAccount();

  useEffect(()=> {
    if (!isConnected) {
      // show message about disconnection
    }
  }, [isConnected]);

  return (
    <WalletContext.Provider
      value={{
        address,
        isConnected,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWalletContext = () => {
  const context = useContext(WalletContext);

  if (!context) {
    throw new Error(
      "useWalletContext must be used within a ValidateWalletConnect component"
    );
  }

  return context;
}
