import { useCallback } from "react";
import { api } from "@/api";
import { AsyncList } from "@/components/AsyncList";
import { EmptyState, Section } from "@/components/Blocks";
import { Card } from "@/components/ui/card";
import { useApp } from "@/hooks/useApp";
import { useLoad } from "@/hooks/useLoad";
import type { MyHold } from "@/types";
import { ApplicationRow } from "./ApplicationRow";

export function MyApplications() {
  const { studentId, validStudent, reloadKey } = useApp();

  const load = useCallback(
    () =>
      validStudent ? api.getMyHolds(studentId) : Promise.resolve<MyHold[]>([]),
    [studentId, validStudent],
  );
  const { data, error } = useLoad(load, reloadKey);

  return (
    <Section
      title="My applications"
      subtitle="Pay the admission fee before the hold expires to confirm the seat."
    >
      {!validStudent ? (
        <EmptyState>
          Enter your birth registration number to see your applications.
        </EmptyState>
      ) : (
        <AsyncList data={data} error={error} emptyText="No applications yet.">
          {(holds) => (
            <Card className="gap-0 py-0">
              <ul className="divide-y">
                {holds.map((h) => (
                  <ApplicationRow key={h.holdId} item={h} />
                ))}
              </ul>
            </Card>
          )}
        </AsyncList>
      )}
    </Section>
  );
}
