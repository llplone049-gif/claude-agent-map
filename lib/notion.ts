import { Client } from "@notionhq/client";

const NOTION_TOKEN = process.env.NOTION_API_KEY ?? "";
const DATABASE_ID = "51077408-408c-4063-bcce-305ca1696e14";

const notion = new Client({ auth: NOTION_TOKEN });

export interface AgentMapEntry {
  id: string;
  member: string;
  updatedAt: string;
  agentCount: number;
  structureType: string;
  tags: string[];
  todayTokens: number;
  weekTokens: number;
  mcpServers: string;
  mermaid: string;
  isPublic: boolean;
}

const MOCK_DATA: AgentMapEntry[] = [
  {
    id: "mock-kirari",
    member: "きらり",
    updatedAt: "2026-04-07",
    agentCount: 9,
    structureType: "マルチPM・ハーネス",
    todayTokens: 1344358,
    weekTokens: 6454982,
    mcpServers: "notionApi, playwright, obsidian",
    mermaid: `graph TD
    User((ユーザー))
    User --> secretary[秘書]
    secretary --> planner[プランナー]
    planner --> ainstein-pm[AI.NSTEIN PM]
    planner --> allight-pm[ALLIGHT. PM]
    ainstein-pm --> ainstein-writer[ライター]
    ainstein-pm --> ainstein-image[画像デザイナー]
    ainstein-pm --> researcher[リサーチャー]
    allight-pm --> allight-writer[ライター]
    allight-pm --> allight-image[画像デザイナー]
    allight-pm --> researcher`,
    isPublic: true,
  },
];

function deriveTags(structureType: string, mcpServers: string, agentCount: number): string[] {
  const tags: string[] = [];
  if (structureType) tags.push(structureType);

  const mcpList = mcpServers.split(",").map((s) => s.trim()).filter(Boolean);
  if (mcpList.length >= 3) tags.push("MCP統合型");

  if (agentCount >= 6) tags.push("並列分散型");

  if (structureType === "マルチPM・ハーネス" || structureType === "ハーネス構造") {
    tags.push("自律ループ型");
  }

  if (structureType === "マルチPM・ハーネス") {
    tags.push("ヒューマンインザループ");
  }

  return tags;
}

export async function getAgentMaps(): Promise<AgentMapEntry[]> {
  try {
    const response = await notion.databases.query({
      database_id: DATABASE_ID,
      filter: {
        property: "公開設定",
        select: { equals: "公開" },
      },
      sorts: [{ property: "今週のトークン", direction: "descending" }],
    });

    return response.results
      .filter((page): page is Extract<typeof page, { properties: unknown }> =>
        "properties" in page
      )
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((page: any) => {
        const props = page.properties;

        const title = (k: string) =>
          props[k]?.title?.map((t: { plain_text: string }) => t.plain_text).join("") ?? "";
        const num = (k: string) => props[k]?.number ?? 0;
        const sel = (k: string) => props[k]?.select?.name ?? "";
        const rt = (k: string) =>
          props[k]?.rich_text?.map((t: { plain_text: string }) => t.plain_text).join("") ?? "";
        const date = (k: string) => props[k]?.date?.start ?? "";

        const tags = deriveTags(
          sel("構造タイプ"),
          rt("MCPサーバー"),
          num("エージェント数")
        );

        return {
          id: page.id,
          member: title("メンバー名"),
          updatedAt: date("更新日"),
          agentCount: num("エージェント数"),
          structureType: sel("構造タイプ"),
          tags,
          todayTokens: num("今日のトークン"),
          weekTokens: num("今週のトークン"),
          mcpServers: rt("MCPサーバー"),
          mermaid: rt("Mermaid図"),
          isPublic: sel("公開設定") === "公開",
        };
      });
  } catch (e) {
    console.error("Notion API error:", e);
    return [];
  }
}
