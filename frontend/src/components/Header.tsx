import { Field } from "@/components/Field";
import { STUDENT_ID_LENGTH } from "@/config";
import { useApp } from "@/hooks/useApp";

export function Header() {
  const { studentId, setStudentId, validStudent } = useApp();

  return (
    <header className="sticky top-0 z-10 border-b bg-background/70 backdrop-blur">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-5 py-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-center gap-2.5">
          <div className="grid size-9 place-items-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
            A
          </div>
          <span className="text-lg font-semibold tracking-tight">Admito</span>
        </div>

        <div className="sm:w-72">
          <Field
            label="Birth registration number"
            hint={
              validStudent
                ? "Ready"
                : `${studentId.length}/${STUDENT_ID_LENGTH}`
            }
            inputMode="numeric"
            maxLength={STUDENT_ID_LENGTH}
            placeholder={`e.g. ${"123456789012345678".slice(0, STUDENT_ID_LENGTH)}`}
            value={studentId}
            onChange={(e) => setStudentId(e.target.value.replace(/\D/g, ""))}
          />
        </div>
      </div>
    </header>
  );
}
