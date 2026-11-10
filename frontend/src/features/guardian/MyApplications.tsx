import { api } from "../../api";
import { AsyncList } from "../../components/AsyncList";
import { Card, EmptyState, Section } from "../../components/Blocks";
import { useApp } from "../../context/AppContext";
import { useLoad } from "../../hooks/useLoad";
import type { MyHold } from "../../types";
import { ApplicationRow } from "./ApplicationRow";

export function MyApplications() {
  const { studentId, validStudent, version } = useApp();
  const { data, error } = useLoad(
    () =>
      validStudent ? api.getMyHolds(studentId) : Promise.resolve<MyHold[]>([]),
    [studentId, validStudent, version],
  );

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
            <Card padded={false}>
              <ul className="divide-y divide-zinc-100">
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
