"use client";
import { useEffect, useState } from "react";
import styles from "./styles.module.css";

interface Props {
  targetTimestamp: number;
  className?: string;
  title: string;
}

const CountdownTimer: React.FC<Props> = ({
  targetTimestamp,
  className,
  title,
}) => {
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isExpired, setIsExpired] = useState<boolean>(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Math.floor(Date.now() / 1000);
      let diff = targetTimestamp - now;

      if (diff <= 0) {
        setIsExpired(true);
        clearInterval(interval);
        return;
      }

      const seconds = diff % 60;
      diff = Math.floor(diff / 60);

      const minutes = diff % 60;
      diff = Math.floor(diff / 60);

      const hours = diff % 24;
      const days = Math.floor(diff / 24);

      if (seconds === 0) {
        if (minutes === 0) {
          if (hours === 0) {
            if (days === 0) {
              setDays(days);
            }
            setHours(hours);
            setDays((prevDays) => prevDays - 1);
          }
          setMinutes(minutes);
          setHours((prevHours) => prevHours - 1);
        }
        setMinutes((prevMin) => prevMin - 1);
        setSeconds(seconds);
      } else {
        setSeconds(seconds);
        setMinutes(minutes);
        setHours(hours);
        setDays(days);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [seconds, targetTimestamp]);

  useEffect(() => {
    console.log("EXPIRED: ", isExpired);
  }, [isExpired]);

  const expiredClasses = isExpired
    ? "bg-lime-300 dark:bg-lime-300 bg-opacity-30 dark:bg-opacity-30"
    : "bg-red-400 dark:bg-red-400 bg-opacity-30 dark:bg-opacity-30";

  return (
    <div>
      <div
        className={`bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700 ${
          styles.main
        } ${className || ""}`}
      >
        <header className="px-5 py-4">
          <h2 className="font-semibold text-slate-800 dark:text-slate-100 text-center">
            {title}
          </h2>
        </header>
        <div className="p-3">
          <div className={styles.timersWrapper}>
            <div className={styles.timeWrapper}>
              <span
                className={`px-2 py-1 ${expiredClasses} text-slate-800 dark:text-slate-100 rounded-sm text-center shadow-lg border border-slate-200 dark:border-slate-700`}
              >
                {days.toString().padStart(2, "0")}
              </span>
            </div>

            <div className={styles.timeWrapper}>
              <span
                className={`px-2 py-1 ${expiredClasses} text-slate-800 dark:text-slate-100 rounded-sm text-center shadow-lg border border-slate-200 dark:border-slate-700`}
              >
                {hours.toString().padStart(2, "0")}
              </span>
            </div>

            <div className={styles.timeWrapper}>
              <span
                className={`px-2 py-1 ${expiredClasses} text-slate-800 dark:text-slate-100 rounded-sm text-center shadow-lg border border-slate-200 dark:border-slate-700`}
              >
                {minutes.toString().padStart(2, "0")}
              </span>
            </div>

            <div className={styles.timeWrapper}>
              <span
                className={`px-2 py-1 ${expiredClasses} text-slate-800 dark:text-slate-100 rounded-sm text-center shadow-lg border border-slate-200 dark:border-slate-700`}
              >
                {seconds.toString().padStart(2, "0")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;
