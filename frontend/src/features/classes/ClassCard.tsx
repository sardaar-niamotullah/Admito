import { api } from "@/api";
import { ErrorText } from "@/components/Blocks";
import { LoadingButton } from "@/components/LoadingButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAction } from "@/hooks/useAction";
import { useApp } from "@/hooks/useApp";
import type { ClassItem } from "@/types";

export function ClassCard({ item }: { item: ClassItem }) {
  const { studentId, validStudent } = useApp();
  const { run, busy, error } = useAction();

  const full = item.availableSeats <= 0;
  const percent = (n: number) => `${(n / item.totalSeats) * 100}%`;

  const stats = [
    { label: "Total", value: item.totalSeats },
    { label: "Held", value: item.heldSeats, dot: "bg-amber-500" },
    { label: "Confirmed", value: item.confirmedSeats, dot: "bg-emerald-500" },
    {
      label: "Available",
      value: item.availableSeats,
      dot: "bg-muted-foreground/40",
    },
  ];

  return (
    <Card className="gap-5">
      <CardHeader>
        <CardTitle>{item.name}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="flex h-2 overflow-hidden rounded-full bg-muted">
          <div
            className="bg-emerald-500 transition-[width] duration-500"
            style={{ width: percent(item.confirmedSeats) }}
          />
          <div
            className="bg-amber-500 transition-[width] duration-500"
            style={{ width: percent(item.heldSeats) }}
          />
        </div>

        <dl className="grid grid-cols-4 gap-2">
          {stats.map(({ label, value, dot }) => (
            <div key={label}>
              <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
                {dot && <span className={`size-1.5 rounded-full ${dot}`} />}
                {label}
              </dt>
              <dd className="mt-0.5 text-xl font-semibold tabular-nums tracking-tight">
                {value}
              </dd>
            </div>
          ))}
        </dl>

        <div>
          <LoadingButton
            className="w-full"
            disabled={!validStudent || full}
            loading={busy}
            onClick={() => run(() => api.apply(item.id, studentId))}
          >
            {full ? "No seats left" : "Apply for admission"}
          </LoadingButton>
          <ErrorText className="mt-2">{error}</ErrorText>
        </div>
      </CardContent>
    </Card>
  );
}
