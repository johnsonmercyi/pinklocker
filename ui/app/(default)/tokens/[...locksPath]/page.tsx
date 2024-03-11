"use client";

import { useEffect } from "react";

interface Params {
  locksPath: (string | undefined) [];
}

const LockDetailsPage = ({ params }: { params: Params }) => {
  const { locksPath } = params;

  useEffect(() => {
    console.log("LOCKS PATH: ", locksPath);
  }, []);

  return (
    <div className="relative bg-white dark:bg-slate-900 h-full">
      
    </div>
  );
};

export default LockDetailsPage;
