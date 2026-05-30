import { getUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import GamePlayerClient from "./GamePlayerClient";

export default async function GamePage({ params }: { params: { id: string } }) {
  const user = await getUser();
  if (!user) redirect("/login");
  return <GamePlayerClient gameId={params.id} />;
}
