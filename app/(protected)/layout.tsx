import ConvexClientProvider from '@/components/convex-client-provider';
import { VenueSidebar } from '@/components/venue-sidebar/venue-sidebar';
import { HeaderView } from '@/components/views/header-view';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <ConvexClientProvider>
        <HeaderView />

        <div className="flex flex-1 w-full max-w-7xl mx-auto px-2 md:px-0 overflow-hidden">
          <VenueSidebar />
          <main className="flex-1 overflow-y-auto p-4">{children}</main>
        </div>
      </ConvexClientProvider>
    </div>
  );
}
