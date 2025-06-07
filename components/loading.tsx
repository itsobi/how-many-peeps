import { Loader } from 'lucide-react';

export function Loading() {
  return (
    <div className="h-screen flex flex-col gap-1 items-center text-xs mt-20">
      <Loader className="animate-spin" />
      <p className="text-muted-foreground">Loading...</p>
    </div>
  );
}
