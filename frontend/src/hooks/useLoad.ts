import { useEffect, useState } from "react";
import { errorMessage } from "../api";

// Loads data whenever deps change. Old data stays visible while reloading.
export function useLoad<T>(load: () => Promise<T>, deps: unknown[]) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, error };
}
