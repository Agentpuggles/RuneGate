import { getUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import PortalShell from "@/components/PortalShell";

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser();
  if (!user) redirect("/login");

  return <PortalShell user={user}>{children}</PortalShell>;
}
