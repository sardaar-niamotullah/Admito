import { api } from "../../api";
import { Button } from "../../components/Button";
import { Card, ErrorText } from "../../components/Blocks";
import { useApp } from "../../context/AppContext";
import { useAction } from "../../hooks/useAction";
import type { ClassItem } from "../../types";

export function ClassCard({ item }: { item: ClassItem }) {
  const { studentId, validStudent } = useApp();
  const { run, busy, error } = useAction();

  const full = item.availableSeats <= 0;
  const percent = (n: number) => `${(n / item.totalSeats) * 100}%`;

  const stats = [
    { label: "Total", value: item.totalSeats },
    { label: "Held", value: item.heldSeats, dot: "bg-amber-400" },
    { label: "Confirmed", value: item.confirmedSeats, dot: "bg-indigo-500" },
    { label: "Available", value: item.availableSeats, dot: "bg-zinc-200" },
  ];

  return (
    <Card className="flex flex-col gap-5">
      <h3 className="font-semibold tracking-tight">{item.name}</h3>

      <div className="flex h-2 overflow-hidden rounded-full bg-zinc-100">
        <div
          className="bg-indigo-500 transition-[width] duration-500"
          style={{ width: percent(item.confirmedSeats) }}
        />
        <div
          className="bg-amber-400 transition-[width] duration-500"
          style={{ width: percent(item.heldSeats) }}
        />
      </div>

      <dl className="grid grid-cols-4 gap-2">
        {stats.map(({ label, value, dot }) => (
          <div key={label}>
            <dt className="flex items-center gap-1.5 text-xs text-zinc-500">
              {dot && <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />}
              {label}
            </dt>
            <dd className="mt-0.5 text-xl font-semibold tabular-nums tracking-tight">
              {value}
            </dd>
          </div>
        ))}
      </dl>

      <div>
        <Button
          className="w-full"
          disabled={!validStudent || full}
          loading={busy}
          onClick={() => run(() => api.apply(item.id, studentId))}
        >
          {full ? "No seats left" : "Apply for admission"}
        </Button>
        <ErrorText className="mt-2">{error}</ErrorText>
      </div>
    </Card>
  );
}
