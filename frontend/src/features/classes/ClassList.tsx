import { api } from "@/api";
import { AsyncList } from "@/components/AsyncList";
import { Section } from "@/components/Blocks";
import { useApp } from "@/hooks/useApp";
import { useLoad } from "@/hooks/useLoad";
import { ClassCard } from "./ClassCard";

export function ClassList() {
  const { validStudent, reloadKey } = useApp();
  const { data, error } = useLoad(api.getClasses, reloadKey);

  return (
    <Section
      title="Classes"
      subtitle={
        validStudent
          ? "Seats update as applications come in."
          : "Enter the birth registration number at the top to apply."
      }
    >
      <AsyncList data={data} error={error} emptyText="No classes yet.">
        {(classes) => (
          <div className="grid gap-4 sm:grid-cols-2">
            {classes.map((c) => (
              <ClassCard key={c.id} item={c} />
            ))}
          </div>
        )}
      </AsyncList>
    </Section>
  );
}
