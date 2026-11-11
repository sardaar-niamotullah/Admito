import { api } from "@/api";
import { ErrorText } from "@/components/Blocks";
import { LoadingButton } from "@/components/LoadingButton";
import { StatusBadge } from "@/components/StatusBadge";
import { useAction } from "@/hooks/useAction";
import { useApp } from "@/hooks/useApp";
import type { MyHold } from "@/types";

export function ApplicationRow({ item }: { item: MyHold }) {
  const { studentId } = useApp();
  const pay = useAction();
  const cancel = useAction();

  const time = new Date(item.expiresAt).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
  const note =
    item.status === "HELD"
      ? `Pay before ${time}`
      : item.status === "EXPIRED"
        ? `Expired at ${time}`
        : null;

  return (
    <li className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex items-center gap-2.5">
          <span className="font-medium">{item.className}</span>
          <StatusBadge status={item.status} />
        </div>
        {note && <p className="mt-1 text-sm text-muted-foreground">{note}</p>}
        <ErrorText className="mt-1">{pay.error || cancel.error}</ErrorText>
      </div>

      {item.status === "HELD" && (
        <div className="flex gap-2">
          <LoadingButton
            loading={pay.busy}
            disabled={cancel.busy}
            onClick={() => pay.run(() => api.confirm(item.holdId, studentId))}
          >
            Pay Admission Fee
          </LoadingButton>
          <LoadingButton
            variant="ghost"
            className="text-destructive hover:text-destructive"
            loading={cancel.busy}
            disabled={pay.busy}
            onClick={() => cancel.run(() => api.cancel(item.holdId, studentId))}
          >
            Cancel
          </LoadingButton>
        </div>
      )}
    </li>
  );
}
