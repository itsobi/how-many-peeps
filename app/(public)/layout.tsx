import { PublicHeader } from '@/components/auth/public-header';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PublicHeader />
      <div className="h-screen flex justify-center mt-20">
        <div className="max-w-[400px] w-full">{children}</div>
      </div>
    </>
  );
}
