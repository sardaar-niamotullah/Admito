import { STUDENT_ID_LENGTH } from "../config";
import { useApp } from "../context/AppContext";
import { Input } from "./Input";

export function Header() {
  const { studentId, setStudentId, validStudent } = useApp();

  return (
    <header className="sticky top-0 z-10 border-b border-zinc-200/70 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-5 py-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-center gap-2.5">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-600 text-sm font-bold text-white shadow-sm shadow-indigo-600/30">
            A
          </div>
          <span className="text-lg font-semibold tracking-tight">Admito</span>
        </div>

        <div className="sm:w-72">
          <Input
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
