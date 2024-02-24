const ListCard = ({
  title,
  subTitle,
  children,
  className,
}: {
  title: string;
  subTitle?: string;
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={`col-span-full xl:col-span-6 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700 ${className || ""}`}>
      <header className="px-5 py-4 border-b border-slate-100 dark:border-slate-700">
        <h2 className="font-semibold text-slate-800 dark:text-slate-100">
          {title}
        </h2>
      </header>
      <div className="p-3">
        <header className="text-xs uppercase text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-700 dark:bg-opacity-50 rounded-sm font-semibold p-2">
          { subTitle || "-" }
        </header>
        {/* Card content */}
        {/* "Today" group */}
        <div>
          <ul className="my-1">
            {/* Item */}
            {children}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ListCard;
