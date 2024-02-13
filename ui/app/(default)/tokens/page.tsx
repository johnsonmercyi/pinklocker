export const metadata = {
  title: "Dashboard - Mosaic",
  description: "Page description",
};

import WelcomeBanner from "./welcome-banner";
import FilterButton from "@/components/dropdown-filter";
import Datepicker from "@/components/datepicker";

export default function Dashboard() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-[96rem] mx-auto">
      <WelcomeBanner
        title="Hey Locker!👋."
        subtitle="You can securely lock tokens here!"
      />

      {/* Page header */}
      <div className="sm:flex sm:justify-between sm:items-center mb-5">
        {/* Left: Title */}
        <div className="mb-4 sm:mb-0">
          <h1 className="text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold">
            Tokens ✨
          </h1>
        </div>

        {/* Right: Actions */}
        <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
          {/* Datepicker built with flatpickr */}
          <Datepicker align="right" />

          {/* Add account button */}
          <button className="btn bg-indigo-500 hover:bg-indigo-600 text-white">
            <svg
              className="w-4 h-4 fill-current opacity-50 shrink-0"
              viewBox="0 0 16 16"
            >
              <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
            </svg>
            <span className="hidden xs:block ml-2">Add Account</span>
          </button>
        </div>
      </div>

      {/* Cards */}
      <div className="grid  gap-6">List of locked tokens</div>
    </div>
  );
}
