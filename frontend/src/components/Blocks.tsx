import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

// Small building blocks shared by every screen.

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
        {subtitle && (
          <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>
      {children}
    </section>
  );
}

export function EmptyState({ children }: { children: ReactNode }) {
  return (
    <Card className="py-12">
      <CardContent className="text-center text-sm text-muted-foreground">
        {children}
      </CardContent>
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
    <p role="alert" className={`text-sm text-destructive ${className}`}>
      {children}
    </p>
  ) : null;
}
