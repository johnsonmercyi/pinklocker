'use client';

import { createWeb3Modal, defaultConfig } from '@web3modal/ethers/react';

// Web3Modal developer project id
const projectId = 'a8b05f96035d83f51b664ade0542d49e';

const mainnet = {
  chainId: 1,
  name: 'Ethereum',
  currency: 'ETH',
  explorerUrl: 'https://etherscan.io',
  rpcUrl: 'https://cloudflare-eth.com',
};

const bscTestnet = {
  chainId: 97,
  name: 'Binance Smart Chain Testnet',
  currency: 'BNB',
  explorerUrl: 'https://testnet.bscscan.com',
  rpcUrl: 'https://data-seed-prebsc-1-s1.binance.org:8545',
};


const testnet = {
  chainId: 1337, // Ganache chain ID
  name: 'Ganache',
  currency: 'ETH',
  explorerUrl: '',
  rpcUrl: 'http://localhost:8545',
};

const metadata = {
  name: 'The Pink Locker',
  description: 'Dummy description!',
  url: 'https://pinklocker.vercel.app/',
  icons: [''],
};

createWeb3Modal({
  ethersConfig: defaultConfig({ metadata }),
  chains: [bscTestnet],
  projectId,
});

export function Web3ModalProvider({ children }) {
  return children;
}
