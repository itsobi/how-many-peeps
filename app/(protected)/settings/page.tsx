import { PageHeading } from '@/components/page-heading';
import { SettingsView } from '@/components/views/settings-view';

export default function SettingsPage() {
  return (
    <>
      <PageHeading
        title="Settings"
        description="Manage your venue's settings."
        bottomMargin
      />

      <SettingsView />
    </>
  );
}
