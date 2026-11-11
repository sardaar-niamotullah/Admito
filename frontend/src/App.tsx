import { Header } from "@/components/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppProvider } from "@/context/AppProvider";
import { CreateClassForm } from "@/features/admin/CreateClassForm";
import { ClassList } from "@/features/classes/ClassList";
import { MyApplications } from "@/features/guardian/MyApplications";

export default function App() {
  return (
    <AppProvider>
      <div className="relative min-h-screen">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-[radial-gradient(60%_100%_at_50%_0%,rgba(99,102,241,0.18),transparent)]" />
        <Header />
        <main className="relative mx-auto max-w-5xl px-5 py-10">
          <Tabs defaultValue="admin" className="gap-10">
            <div className="flex justify-center">
              <TabsList>
                <TabsTrigger value="admin">Admin</TabsTrigger>
                <TabsTrigger value="guardian">Guardian</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="admin" className="space-y-10">
              <CreateClassForm />
              <ClassList />
            </TabsContent>

            <TabsContent value="guardian" className="space-y-10">
              <ClassList />
              <MyApplications />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </AppProvider>
  );
}
