import { cn } from '@/lib/utils';

export function PageHeading({
  title,
  description,
  bottomMargin,
}: {
  title: string;
  description?: string;
  bottomMargin?: boolean;
}) {
  return (
    <div className={cn(bottomMargin && 'mb-10')}>
      <h1 className="text-2xl font-semibold">{title}</h1>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
