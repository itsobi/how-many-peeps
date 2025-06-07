export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen flex justify-center items-center">
      <div className="max-w-[400px] w-full">{children}</div>
    </div>
  );
}
