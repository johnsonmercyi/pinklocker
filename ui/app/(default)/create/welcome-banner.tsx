// import BackgroundIllustration from "./utils/BackgroundIllustration";


export default function WelcomeBanner({
  title,
  subtitle,
}: {
  title?: string;
  subtitle?: string;
}) {
  return (
    <div className="relative bg-indigo-200 dark:bg-indigo-500 p-4 sm:p-6 rounded-sm overflow-hidden mb-8">
      {/* <BackgroundIllustration /> */}

      {/* Content */}
      <div className="relative">
        <h1 className="text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold mb-1">
          { title }
        </h1>
        <p className="dark:text-indigo-200">
          { subtitle }
        </p>
      </div>
    </div>
  );
}
