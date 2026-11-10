import type { HoldStatus } from "../types";

const tones: Record<HoldStatus, string> = {
  HELD: "bg-amber-50 text-amber-700 ring-amber-600/20",
  CONFIRMED: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  EXPIRED: "bg-zinc-100 text-zinc-600 ring-zinc-500/20",
  CANCELLED: "bg-rose-50 text-rose-700 ring-rose-600/20",
};

export function Badge({ status }: { status: HoldStatus }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ring-1 ring-inset ${tones[status]}`}
    >
      {status.toLowerCase()}
    </span>
  );
}
