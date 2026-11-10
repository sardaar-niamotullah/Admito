import { api } from "../../api";
import { Badge } from "../../components/Badge";
import { Button } from "../../components/Button";
import { ErrorText } from "../../components/Blocks";
import { useApp } from "../../context/AppContext";
import { useAction } from "../../hooks/useAction";
import type { MyHold } from "../../types";

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
          <Badge status={item.status} />
        </div>
        {note && <p className="mt-1 text-sm text-zinc-500">{note}</p>}
        <ErrorText className="mt-1">{pay.error || cancel.error}</ErrorText>
      </div>

      {item.status === "HELD" && (
        <div className="flex gap-2">
          <Button
            loading={pay.busy}
            disabled={cancel.busy}
            onClick={() => pay.run(() => api.confirm(item.holdId, studentId))}
          >
            Pay Admission Fee
          </Button>
          <Button
            variant="danger"
            loading={cancel.busy}
            disabled={pay.busy}
            onClick={() => cancel.run(() => api.cancel(item.holdId, studentId))}
          >
            Cancel
          </Button>
        </div>
      )}
    </li>
  );
}
