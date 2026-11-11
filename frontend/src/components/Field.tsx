import { useId, type ComponentProps } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props extends ComponentProps<"input"> {
  label: string;
  hint?: string;
}

export function Field({ label, hint, ...props }: Props) {
  const id = useId();

  return (
    <div className="grid gap-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={id} className="text-xs text-muted-foreground">
          {label}
        </Label>
        {hint && (
          <span className="text-xs tabular-nums text-muted-foreground">
            {hint}
          </span>
        )}
      </div>
      <Input id={id} {...props} />
    </div>
  );
}
