import Sidebar from '@/components/ui/sidebar'
import Header from '@/components/ui/header'
import { Web3ModalProvider } from '@/app/(default)/tokens/config/Web3ModalConfig';

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode
}) {  
  return (
    <Web3ModalProvider>
      <div className="flex h-[100dvh] overflow-hidden">

        {/* Sidebar */}
        <Sidebar />

        {/* Content area */}
        <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">

          {/*  Site header */}
          <Header />

          <main className="grow [&>*:first-child]:scroll-mt-16">
            {children}
          </main>        

        </div>

      </div>
    </Web3ModalProvider>
  )
}
