import type { ReactNode } from "react";

export function Card({
  children,
  className = "",
  padded = true,
}: {
  children: ReactNode;
  className?: string;
  padded?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border border-zinc-200 bg-white shadow-sm ${padded ? "p-5" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

export function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <section>
      <div className="mb-4">
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
        {subtitle && <p className="mt-0.5 text-sm text-zinc-500">{subtitle}</p>}
      </div>
      {children}
    </section>
  );
}

export function EmptyState({ children }: { children: ReactNode }) {
  return (
    <Card
      padded={false}
      className="px-5 py-12 text-center text-sm text-zinc-500"
    >
      {children}
    </Card>
  );
}

export function ErrorText({
  children,
  className = "",
}: {
  children?: ReactNode;
  className?: string;
}) {
  return children ? (
    <p role="alert" className={`text-sm text-rose-600 ${className}`}>
      {children}
    </p>
  ) : null;
}
