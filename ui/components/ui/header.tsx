"use client";

import { useEffect, useState } from "react";
import { useAppProvider } from "@/app/app-provider";

import SearchModal from "@/components/search-modal";
import Notifications from "@/components/dropdown-notifications";
import DropdownHelp from "@/components/dropdown-help";
import ThemeToggle from "@/components/theme-toggle";
import DropdownProfile from "@/components/dropdown-profile";
import { ConnectWalletButton } from "../connect-wallet-button/connect-wallet-button";
import { useWeb3Modal } from "@web3modal/ethers/react";
import { useWalletContext } from "@/app/(default)/tokens/config/ValidateWalletConnection";
import ConnectedWalletButton from "../ConnectedWalletButton/ConnectedWalletButton";

export default function Header() {
  const { open } = useWeb3Modal();
  const { address, isConnected, balance, networkSymbol } = useWalletContext();
  console.log("Balance: ", balance);

  const { sidebarOpen, setSidebarOpen } = useAppProvider();
  const [searchModalOpen, setSearchModalOpen] = useState<boolean>(false);
  const [walletConnected, setWalletConnected] = useState<boolean>(false);

  useEffect(() => {
    setWalletConnected(isConnected);
  }, [isConnected]);

  const connectWalletHandler = () => {
    try {
      open();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <header className="sticky top-0 bg-white dark:bg-[#182235] border-b border-slate-200 dark:border-slate-700 z-30">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 -mb-px">
          {/* Header: Left side */}
          <div className="flex">
            {/* Hamburger button */}
            <button
              className="text-slate-500 hover:text-slate-600 lg:hidden"
              aria-controls="sidebar"
              aria-expanded={sidebarOpen}
              onClick={() => {
                setSidebarOpen(!sidebarOpen);
              }}
            >
              <span className="sr-only">Open sidebar</span>
              <svg
                className="w-6 h-6 fill-current"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect x="4" y="5" width="16" height="2" />
                <rect x="4" y="11" width="16" height="2" />
                <rect x="4" y="17" width="16" height="2" />
              </svg>
            </button>
          </div>

          {/* Header: Right side */}
          <div className="flex items-center space-x-3">
            <ThemeToggle />

            {/*  Divider */}
            <hr className="w-px h-6 bg-slate-200 dark:bg-slate-700 border-none" />

            {/* Connection */}
            {walletConnected ? (
              <ConnectedWalletButton
                walletChainId={97}
                address={address}
                balance={balance}
                symbol={networkSymbol}
                onClickHandler={connectWalletHandler}
              />
            ) : (
              <ConnectWalletButton
                text="Connect"
                onClickHandler={connectWalletHandler}
              />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
