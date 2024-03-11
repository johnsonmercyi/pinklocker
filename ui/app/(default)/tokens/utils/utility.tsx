import { LockRecordsInfo } from "../interfaces/global";

export const Icon = ({
  name,
  stroke,
  strokeWidth,
  width,
  height,
  className,
}: {
  name: "wallet" | "invalid-net" | "add" | "spinner";
  stroke?: string;
  strokeWidth?: string;
  width?: string;
  height?: string;
  className?: string | undefined;
}) => {
  const icons = {
    wallet: (
      <svg
        className="w-4 h-4 shrink-0 fill-current text-slate-500 dark:text-slate-400"
        viewBox=" 0 0 16 16"
      >
        <path d="M15 4c.6 0 1 .4 1 1v10c0 .6-.4 1-1 1H3c-1.7 0-3-1.3-3-3V3c0-1.7 1.3-3 3-3h7c.6 0 1 .4 1 1v3h4zM2 3v1h7V2H3c-.6 0-1 .4-1 1zm12 11V6H2v7c0 .6.4 1 1 1h11zm-3-5h2v2h-2V9z" />
      </svg>
    ),

    "invalid-net": (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="icon icon-tabler icon-tabler-world-off"
        width={width || "24"}
        height={height || "24"}
        viewBox="0 0 24 24"
        strokeWidth={strokeWidth || "1.5"}
        stroke={stroke || "#2c3e50"}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M5.657 5.615a9 9 0 1 0 12.717 12.739m1.672 -2.322a9 9 0 0 0 -12.066 -12.084" />
        <path d="M3.6 9h5.4m4 0h7.4" />
        <path d="M3.6 15h11.4m4 0h1.4" />
        <path d="M11.5 3a17.001 17.001 0 0 0 -1.493 3.022m-.847 3.145c-.68 4.027 .1 8.244 2.34 11.833" />
        <path d="M12.5 3a16.982 16.982 0 0 1 2.549 8.005m-.207 3.818a16.979 16.979 0 0 1 -2.342 6.177" />
        <path d="M3 3l18 18" />
      </svg>
    ),

    add: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="icon icon-tabler icon-tabler-plus"
        width={width || "24"}
        height={height || "24"}
        viewBox="0 0 24 24"
        strokeWidth={strokeWidth || "1.5"}
        stroke={stroke || "#2c3e50"}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M12 5l0 14" />
        <path d="M5 12l14 0" />
      </svg>
    ),

    spinner: (
      <svg
        className={`animate-spin ${width || 'w-4'} ${height || 'h-4'} fill-current shrink-0`}
        viewBox="0 0 16 16"
      >
        <path d="M8 16a7.928 7.928 0 01-3.428-.77l.857-1.807A6.006 6.006 0 0014 8c0-3.309-2.691-6-6-6a6.006 6.006 0 00-5.422 8.572l-1.806.859A7.929 7.929 0 010 8c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z" />
      </svg>
    ),
  };

  return <div className={className || ""}>{icons[name]}</div>;
};


export const dateToSeconds = (date: string): number => {
  if (date.trim().length > 0) {
    const dateInstance = new Date(date);
    const dateSeconds = dateInstance.getTime() / 1000; 
    return dateSeconds;
  }

  return 0;
}

export const secondsToDate = (dateSeconds: number): Date => {
  const timeMillis = dateSeconds * 1000;
  const date = new Date(timeMillis);
  return date;
};

export const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}.${month}.${day} ${hours}:${minutes}`;
}

export function isLockRecordsInfo(object: any): object is LockRecordsInfo {
  return (
    "id" in object &&
    "token" in object &&
    "owner" in object &&
    "amount" in object &&
    "lockDate" in object &&
    "tgeDate" in object &&
    "tgeBps" in object &&
    "cycle" in object &&
    "cycleBps" in object &&
    "unlockedAmount" in object &&
    "description" in object
  );
}

export function formatNumber(number: number): string {
  return new Intl.NumberFormat().format(number);
}

export const ID_PADDING = 1_000_000n;