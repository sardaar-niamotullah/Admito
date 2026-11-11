import { Badge } from "@/components/ui/badge";
import type { HoldStatus } from "@/types";

const tones: Record<HoldStatus, string> = {
  HELD: "border-amber-500/30 bg-amber-500/10 text-amber-400",
  CONFIRMED: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  EXPIRED: "border-border bg-muted text-muted-foreground",
  CANCELLED: "border-rose-500/30 bg-rose-500/10 text-rose-400",
};

export function StatusBadge({ status }: { status: HoldStatus }) {
  return (
    <Badge variant="outline" className={`capitalize ${tones[status]}`}>
      {status.toLowerCase()}
    </Badge>
  );
}
