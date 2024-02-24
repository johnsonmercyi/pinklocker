import { StaticImageData } from "next/image";

export interface AcumulativeToken {
  index: number;
  image: StaticImageData;
  name: string;
  token: string;
  symbol: string;
  amount: string;
}