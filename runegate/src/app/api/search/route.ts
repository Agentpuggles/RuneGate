import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { searchWeb } from "@/lib/search-proxy";

export async function POST(req: Request) {
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { query, mode } = await req.json();

    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "Query required" }, { status: 400 });
    }

    const result = await searchWeb(query, user.id);

    if (result.error) {
      return NextResponse.json({ error: result.error, results: [] });
    }

    if (mode === "terminal") {
      const terminalOutput = result.results
        .map((r, i) => `[${i + 1}] ${r.title}\n    URL: ${r.url}\n    ${r.snippet}`)
        .join("\n\n");

      return NextResponse.json({
        results: result.results,
        terminalOutput: `> SEARCH: "${query}"\n> Found ${result.results.length} results\n\n${terminalOutput}`,
      });
    }

    return NextResponse.json({ results: result.results });
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
