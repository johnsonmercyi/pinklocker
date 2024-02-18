import { BrowserProvider, Contract, Eip1193Provider } from "ethers";
import PinkLock from '../artifact/PinkLock.json';

const address = process.env.NEXT_PUBLIC_PINKLOCK_ADDRESS;

const pinkLockInstance = async(walletProvider: Eip1193Provider): Promise<Contract> => {
  const provider = new BrowserProvider(walletProvider);
  const signer = await provider.getSigner();
  const instance = new Contract(address || "", PinkLock.abi, signer);

  return instance;
}

export default pinkLockInstance;