import { Loader } from 'lucide-react';

export default function LoadingPage() {
  return (
    <div className="h-screen flex flex-col items-center mt-20">
      <Loader className="animate-spin text-sm" />
      <p className="text-sm text-muted-foreground">Loading...</p>
    </div>
  );
}
