import { BrowserProvider, Contract, Eip1193Provider, JsonRpcProvider } from "ethers";
import PinkLock from '../artifact/PinkLock.json';

const address = process.env.NEXT_PUBLIC_PINKLOCK_ADDRESS;

const pinkLockInstance = async(walletProvider: Eip1193Provider | null): Promise<Contract> => {
  let provider, signer, instance;
  if (walletProvider) {
    provider = new BrowserProvider(walletProvider);
    signer = await provider.getSigner();
    instance = new Contract(address || "", PinkLock.abi, signer);
  } else {
    provider = new JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);
    instance = new Contract(address || "", PinkLock.abi, provider);
  }

  return instance;
}

// export const pinkLockInstanceUsingRPCProvider = async(): Promise<Contract> => {
//   const provider = new JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);
//   const instance = new Contract(address || "", PinkLock.abi, provider);
//   return instance;
// }

export default pinkLockInstance;