import { useEffect, useState } from "react";
import { errorMessage } from "@/api";

// Calls `load` on mount, whenever `load` changes, and whenever `reloadKey` changes.
// Old data stays visible while reloading.
export function useLoad<T>(load: () => Promise<T>, reloadKey: number) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let current = true;
    load()
      .then((result) => {
        if (!current) return;
        setData(result);
        setError("");
      })
      .catch((e) => {
        if (current) setError(errorMessage(e));
      });
    return () => {
      current = false;
    };
  }, [load, reloadKey]);

  return { data, error };
}
