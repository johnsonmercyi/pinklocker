import { StaticImageData } from "next/image";

export default interface TableTransaction {

}

export interface AcumulativeToken extends TableTransaction {
  index: number;
  image: StaticImageData;
  name: string;
  token: string;
  symbol: string;
  amount: string;
}