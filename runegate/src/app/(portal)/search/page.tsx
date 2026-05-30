import { getUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import SearchClient from "./SearchClient";

export default async function SearchPage() {
  const user = await getUser();
  if (!user) redirect("/login");
  return <SearchClient />;
}
