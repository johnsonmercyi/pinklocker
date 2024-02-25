
import Header from "@/components/ui/header";
import { Web3ModalProvider } from "@/app/(default)/tokens/config/Web3ModalConfig";
import { ValidateWalletConnect } from "./tokens/config/ValidateWalletConnection";
import { DateContext } from "./tokens/context/DateContext";
import { DatePickerProvider } from "./tokens/context/DateProvider";
import Sidebar from "@/components/ui/tokens-ui/sidebar";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-[100dvh] overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/*  Site header */}
        <Header />
        <ValidateWalletConnect>
          <DatePickerProvider>
            <main className="grow [&>*:first-child]:scroll-mt-16">
              {children}
            </main>
          </DatePickerProvider>
        </ValidateWalletConnect>
      </div>
    </div>
  );
}
