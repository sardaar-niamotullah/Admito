import { useEffect, useState } from "react";

export default function App() {
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/hello`)
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch(() => setMessage("Failed to reach backend"));
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <h1 className="text-3xl font-bold text-blue-600">{message}</h1>
    </div>
  );
}
