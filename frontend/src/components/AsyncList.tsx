import type { ReactNode } from "react";
import { EmptyState, ErrorText } from "./Blocks";

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
        !error && (
          <div className="h-36 animate-pulse rounded-2xl bg-zinc-200/60" />
        )
      ) : data.length === 0 ? (
        <EmptyState>{emptyText}</EmptyState>
      ) : (
        children(data)
      )}
    </>
  );
}
