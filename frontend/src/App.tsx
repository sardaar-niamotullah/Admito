import { useState } from "react";
import { Header } from "./components/Header";
import { Tabs } from "./components/Tabs";
import { CreateClassForm } from "./features/admin/CreateClassForm";
import { ClassList } from "./features/classes/ClassList";
import { MyApplications } from "./features/guardian/MyApplications";
import { AppProvider } from "./context/AppContext";

const TABS = [
  { id: "admin", label: "Admin" },
  { id: "guardian", label: "Guardian" },
] as const;

type TabId = (typeof TABS)[number]["id"];

function Shell() {
  const [tab, setTab] = useState<TabId>("admin");

  return (
    <div className="relative min-h-screen bg-zinc-50 text-zinc-900 antialiased">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(60%_100%_at_50%_0%,#e0e7ff,transparent)]" />
      <Header />
      <main className="relative mx-auto max-w-5xl space-y-10 px-5 py-10">
        <div className="flex justify-center">
          <Tabs tabs={TABS} value={tab} onChange={setTab} />
        </div>
        {tab === "admin" ? (
          <>
            <CreateClassForm />
            <ClassList />
          </>
        ) : (
          <>
            <ClassList />
            <MyApplications />
          </>
        )}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  );
}
