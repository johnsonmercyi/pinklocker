import { BrowserProvider, Contract, Eip1193Provider, JsonRpcSigner } from "ethers";
import ERC20 from '../artifact/ERC20.json';


const tokenInstance = async(address: string, walletProvider: Eip1193Provider): 
Promise<{instance:Contract, signer: JsonRpcSigner}> => {
  const provider = new BrowserProvider(walletProvider);
  const signer = await provider.getSigner();
  const instance = new Contract(address, ERC20.abi, signer);
  
  return {
    instance, signer
  }
}

export default tokenInstance;