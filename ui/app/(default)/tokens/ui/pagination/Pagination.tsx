'use client';

import { useEffect, useState } from "react";

export default function PaginationClassic({
  pageSize,
  numberOfItems=0,
  totalNumberOfItems=0,
  updateParentComponent,
}: {
  pageSize: number;
  numberOfItems: number;
  totalNumberOfItems: number;
  updateParentComponent: (
    page: number,
    startIndex: number,
    endIndex: number
  ) => void;
}) {
  const [page, setPage] = useState<number>(0);
  const [startIndex, setStartIndex] = useState<number>(0);
  const [endIndex, setEndIndex] = useState<number>(0);
  const [actionType, setActionType] = useState<"previous" | "next">("previous");

  console.log("TOTAL NUMBER OF ITEMS: " + totalNumberOfItems);
  
  useEffect(() => {
    const startIndex = page * numberOfItems;
    const endIndex = (page + 1) * numberOfItems;
    
    setStartIndex(startIndex);
    setEndIndex(endIndex);
    setPage(1);
    
    updateParentComponent(page, startIndex, endIndex);
  }, []);
  
  useEffect(() => {
    console.log("Happened Pagination");
    updateParentComponent(page, startIndex, endIndex);
  }, [page, startIndex, endIndex]);

  const nextPageHandler = () => {
    setActionType("next");
    console.log("PAGE: ", page);
    const startIndex = page * numberOfItems;
    const endIndex = (page + 1) * (numberOfItems - 1);

    setPage((oldPage) => (oldPage += 1));
    setStartIndex(startIndex);
    setEndIndex(endIndex);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <nav
        className="mb-4 sm:mb-0 sm:order-1"
        role="navigation"
        aria-label="Navigation"
      >
        <ul className="flex justify-center">
          <li className="ml-3 first:ml-0">
            <span className="btn bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-300 dark:text-slate-600">
              &lt;- Previous
            </span>
          </li>
          <li className="ml-3 first:ml-0">
            <a
              style={{
                cursor: "pointer",
              }}
              className="btn bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-indigo-500"
              // href="#"
              onClick={nextPageHandler}
            >
              Next -&gt;
            </a>
          </li>
        </ul>
      </nav>
      <div className="text-sm text-slate-500 dark:text-slate-400 text-center sm:text-left">
        Showing{" "}
        <span className="font-medium text-slate-600 dark:text-slate-300">
          {startIndex + 1}
        </span>{" "}
        to{" "}
        <span className="font-medium text-slate-600 dark:text-slate-300">
          {endIndex}
        </span>{" "}
        of{" "}
        <span className="font-medium text-slate-600 dark:text-slate-300">
          {totalNumberOfItems}
        </span>{" "}
        results
      </div>
    </div>
  );
}
