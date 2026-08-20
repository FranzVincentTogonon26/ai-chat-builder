import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { metadata as workspaceMetadata } from "@/db/schema";
import { isAuthorized } from "@/lib/isAuthorized";
import Sidebar from "@/components/dashboard/sidebar";

export const metadata = {
  title: "AI Chatbot Support - Dashboard",
  description:
    "instantly resolve customer question with an assistant that reads your docs and speaks with empathy.",
};

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await isAuthorized();

  if (!user) {
    redirect("/");
  }

  const [metadataRecord] = await db
    .select({ id: workspaceMetadata.id })
    .from(workspaceMetadata)
    .where(eq(workspaceMetadata.user_email, user.email))
    .limit(1);

  return (
    <section className="bg-[#050509] min-h-screen font-sans antialiased text-zinc-100 selection:bg-zinc-800 flex">
      {metadataRecord ? (
        <>
          <Sidebar />
          <div className="flex-1 flex flex-col md:ml-64 relative min-h-screen transition-all duration-300">
            {/* <Header /> */}
            <main className="flex-1">{children}</main>
          </div>
        </>
      ) : (
        children
      )}
    </section>
  );
}