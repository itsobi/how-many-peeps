import { PageHeading } from '@/components/page-heading';
import { Suspense } from 'react';
import { SettingsView } from '@/components/views/settings-view';
import { LoadingView } from '@/components/loading-view';

export default function SettingsPage() {
  return (
    <>
      <PageHeading
        title="Settings"
        description="Manage your venue settings"
        bottomMargin
      />
      <Suspense fallback={<LoadingView />}>
        <SettingsView />
      </Suspense>
    </>
  );
}
