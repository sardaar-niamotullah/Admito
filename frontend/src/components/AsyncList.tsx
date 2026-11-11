import type { ReactNode } from "react";
import { EmptyState, ErrorText } from "@/components/Blocks";
import { Skeleton } from "@/components/ui/skeleton";

interface Props<T> {
  data: T[] | null;
  error: string;
  emptyText: string;
  children: (items: T[]) => ReactNode;
}

// Shows the loading, error and empty states, then renders the items.
export function AsyncList<T>({ data, error, emptyText, children }: Props<T>) {
  return (
    <>
      <ErrorText className="mb-3">{error}</ErrorText>
      {data === null ? (
        !error && <Skeleton className="h-40 rounded-xl" />
      ) : data.length === 0 ? (
        <EmptyState>{emptyText}</EmptyState>
      ) : (
        children(data)
      )}
    </>
  );
}
