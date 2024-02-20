'use client';

import { ReactNode, useContext, useState } from "react";
import { DateContext } from "./DateContext";

export const DatePickerProvider = ({ children }: { children: ReactNode }) => {
  const [selectedDates, setSelectedDates] = useState<Date[] | undefined>();
  const [dateString, setDateString] = useState<string | undefined | ''>('');

  return (
    <DateContext.Provider value={{
      selectedDates, setSelectedDates,
      dateString, setDateString
    }}>
      { children}
    </DateContext.Provider>
  );
};

export function useDatePicker() {
  const context = useContext(DateContext);
  if (!context) {
    throw new Error("useDatePicker must be used within DatePickerProvider component.");
  }

  return context;
}
