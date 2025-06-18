import ConvexClientProvider from '@/components/convex-client-provider';
import { OrganizationSidebar } from '@/components/organization-sidebar/organization-sidebar';
import { HeaderView } from '@/components/views/header-view';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen flex flex-col">
      <ConvexClientProvider>
        <HeaderView />

        <div className="flex flex-1 w-full max-w-7xl mx-auto px-2 md-px-0 overflow-hidden">
          <OrganizationSidebar />
          <main className="w-full overflow-y-auto p-4">{children}</main>
        </div>
      </ConvexClientProvider>
    </div>
  );
}
