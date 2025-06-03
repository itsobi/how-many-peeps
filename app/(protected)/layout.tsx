import { Header } from '@/components/header/header';

import { VenueSidebar } from '@/components/venue-sidebar/venue-sidebar';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen flex flex-col">
      <Header />

      <div className="flex flex-1 w-full max-w-7xl mx-auto px-2 md-px-0 overflow-hidden">
        <div className={`hidden lg:block border-r w-1/4`}>
          <VenueSidebar />
        </div>
        <main className="w-full overflow-y-auto p-4">{children}</main>
      </div>
    </div>
  );
}
