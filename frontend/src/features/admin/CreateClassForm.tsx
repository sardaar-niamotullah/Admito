import { useState, type FormEvent } from "react";
import { api } from "@/api";
import { ErrorText, Section } from "@/components/Blocks";
import { Field } from "@/components/Field";
import { LoadingButton } from "@/components/LoadingButton";
import { Card, CardContent } from "@/components/ui/card";
import { useAction } from "@/hooks/useAction";

export function CreateClassForm() {
  const [name, setName] = useState("");
  const [totalSeats, setTotalSeats] = useState("");
  const { run, busy, error } = useAction();

  const seats = Number(totalSeats);
  const valid = name.trim() !== "" && Number.isInteger(seats) && seats >= 1;

  async function submit(e: FormEvent) {
    e.preventDefault();
    const ok = await run(() =>
      api.createClass({ name: name.trim(), totalSeats: seats }),
    );
    if (ok) {
      setName("");
      setTotalSeats("");
    }
  }

  return (
    <Section
      title="Create class"
      subtitle="Add a class and its total number of seats."
    >
      <Card>
        <CardContent>
          <form
            onSubmit={submit}
            className="grid gap-4 sm:grid-cols-[1fr_10rem_auto] sm:items-end"
          >
            <Field
              label="Class name"
              placeholder="Class 6 - Morning Shift"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Field
              label="Total seats"
              type="number"
              min={1}
              placeholder="120"
              value={totalSeats}
              onChange={(e) => setTotalSeats(e.target.value)}
            />
            <LoadingButton type="submit" disabled={!valid} loading={busy}>
              Create class
            </LoadingButton>
          </form>
          <ErrorText className="mt-3">{error}</ErrorText>
        </CardContent>
      </Card>
    </Section>
  );
}
