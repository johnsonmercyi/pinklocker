import Datepicker from "@/components/datepicker";
import styles from "./styles.module.css";

const CreateNewLock = () => {
  return (
    <div className="relative bg-white dark:bg-slate-900 h-full">
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-[96rem] mx-auto">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold">
            Lock New Token ✨
          </h1>
        </div>

        <div className="border-t border-slate-200 dark:border-slate-700">
          {/* Form */}
          <form className="space-y-8 mt-8">
            {/* Token Address */}
            <div>
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="mandatory"
              >
                Token Address <span className="text-rose-500">*</span>
              </label>
              <input
                id="tokenAddress"
                className="form-input w-full"
                type="text"
                required
                placeholder="Enter token address"
              />
            </div>

            {/* Another owner Checkbox */}
            <label className="flex items-center">
              <input type="checkbox" className="form-checkbox" defaultChecked />
              <span className="text-sm ml-2">Use another owner?</span>
            </label>

            {/* Another Owner Field*/}
            <div>
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="default"
              >
                Owner
              </label>
              <input
                id="default"
                className="form-input w-full"
                type="text"
                placeholder="Enter owner address"
              />
            </div>

            {/* Title Field*/}
            <div>
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="default"
              >
                Title
              </label>
              <input
                id="default"
                className="form-input w-full"
                type="text"
                placeholder="Enter lock title"
              />
            </div>

            {/* Amount Field */}
            <div>
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="mandatory"
              >
                Amount <span className="text-rose-500">*</span>
              </label>
              <input
                id="tokenAddress"
                className="form-input w-full"
                type="text"
                required
                placeholder="Enter lock token amount"
              />
            </div>

            {/* Datepicker */}

            <div>
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="mandatory"
              >
                Lock Until (UTC time) <span className="text-rose-500">*</span>
              </label>
              <Datepicker />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateNewLock;
