import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { CustomAlertDialog } from '../custom-alert-dialog';
import { Camera } from 'lucide-react';
import { Input } from '../ui/input';

export async function SettingsView() {
  const { userId, orgId } = await auth();

  if (!orgId) {
    if (!userId) {
      return redirect('/');
    }
    return (
      <CustomAlertDialog
        title="Unauthorized"
        description="You must be a member of an organization or set to your organization via the user button to access this page."
        href="/home"
      />
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="border rounded-lg shadow h-fit">
        <div className="border-b px-4 py-2">
          <h4>Venue Settings</h4>
        </div>

        {/* Card Content */}
        <div className="p-4">
          <div className="flex justify-center p-8">
            <div className="flex flex-col items-center gap-2">
              <div className="border border-dashed dark:border-none rounded-full bg-gray-200 dark:bg-gray-400 p-8">
                <Camera />
              </div>
              <p className="text-xs">Upload photo</p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <label htmlFor="name" className="text-xs">
                Name
              </label>
              <Input id="name" placeholder="Name" />
            </div>
            <div>
              <label htmlFor="address" className="text-xs">
                Address
              </label>
              <Input id="address" placeholder="Address" />
            </div>
            <div>
              <label htmlFor="type" className="text-xs">
                Type
              </label>
              <Input id="type" placeholder="Type" />
            </div>
          </div>
        </div>
      </div>

      <div className="border rounded-lg shadow h-fit">
        <div className="border-b px-4 py-2">
          <h4>Counter Settings</h4>
        </div>

        {/* Card Content */}
        <div className="p-4">
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <label htmlFor="name" className="text-xs">
                Group Size
              </label>
              <Input type="number" className="w-1/2" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
