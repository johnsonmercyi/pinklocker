import { BrowserProvider, Contract, Eip1193Provider, JsonRpcProvider, JsonRpcSigner } from "ethers";
import ERC20 from '../artifact/ERC20.json';


const tokenInstance = async(address: string, walletProvider: Eip1193Provider | null): 
Promise<{instance:Contract, signer: JsonRpcSigner}> => {
  let provider, signer, instance;

  if (walletProvider) {
    provider = new BrowserProvider(walletProvider);
    signer = await provider.getSigner();
    instance = new Contract(address, ERC20.abi, signer);
  } else {
    provider = new JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);
    instance = new Contract(address, ERC20.abi, provider);
    signer = new JsonRpcSigner(provider, address);
  }

  
  return {
    instance, signer
  }
}

export default tokenInstance;