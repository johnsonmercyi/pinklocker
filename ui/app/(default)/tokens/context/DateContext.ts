import { BrowserProvider } from "ethers";
import { createContext } from "react";

type DateContextType = {
  selectedDates: Date[] | undefined;
  setSelectedDates: (d: Date[]) => void;
  dateString: string | undefined;
  setDateString: (d: string) => void;
}

export const DateContext = createContext<DateContextType | null>(null);