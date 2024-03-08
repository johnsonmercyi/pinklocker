import { StaticImageData } from "next/image";

export interface AcumulativeToken {
  index: number;
  image: StaticImageData;
  name: string;
  token: string;
  symbol: string;
  amount: string;
}

export interface LockRecordsInfo {
  id: BigInt;
  token: string;
  owner: string;
  amount: number;
  lockDate: number;
  tgeDate: number;
  tgeBps: number;
  cycle: number;
  cycleBps: number;
  unlockedAmount: number;
  description: string;
}