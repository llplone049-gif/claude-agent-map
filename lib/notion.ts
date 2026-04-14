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
  monthTokens: number;
  // プラン使用量・追加使用量（Notionに追加が必要なフィールド）
  planTodayTokens: number;
  planMonthTokens: number;
  addTodayTokens: number;
  addMonthTokens: number;
  plan: string;      // 契約プラン e.g. "Pro", "Max 5x"
  model: string;     // 使用モデル e.g. "Sonnet", "Opus", "Haiku"（追加使用料のJPY計算に使用）
  mcpServers: string;
  mermaid: string;
  agentJson: string; // エージェントJSON（役割・モデル情報のJSON文字列）
  isPublic: boolean;
}

const MOCK_DATA: AgentMapEntry[] = [
  {
    id: "mock-kirari",
    member: "きらり",
    updatedAt: "2026-04-07",
    agentCount: 9,
    structureType: "フル・ハーネス設計",
    tags: ["フル・ハーネス設計", "MCP統合型", "並列分散型", "自律ループ型", "ヒューマンインザループ"],
    todayTokens: 1344358,
    monthTokens: 6454982,
    planTodayTokens: 1200000,
    planMonthTokens: 5000000,
    addTodayTokens: 144358,
    addMonthTokens: 1454982,
    plan: "Max 5x",
    model: "Sonnet",
    mcpServers: "notionApi, playwright, obsidian",
    mermaid: `graph TD
    User((ユーザー))
    User --> secretary[secretary]
    secretary --> planner[planner]
    planner --> ainstein-pm[ainstein-pm]
    planner --> allight-pm[allight-pm]
    ainstein-pm --> ainstein-researcher[ainstein-researcher]
    ainstein-pm --> ainstein-writer[ainstein-writer]
    ainstein-pm --> ainstein-image-designer[ainstein-image-designer]
    allight-pm --> allight-researcher[allight-researcher]
    allight-pm --> allight-writer[allight-writer]
    allight-pm --> allight-image-designer[allight-image-designer]`,
    agentJson: JSON.stringify({
      secretary: { role: "AI秘書・司令塔", model: "Sonnet" },
      planner: { role: "全PJ横断プランナー", model: "Sonnet" },
      "ainstein-pm": { role: "AI.NSTEIN PM", model: "Opus" },
      "allight-pm": { role: "ALLIGHT. PM", model: "Opus" },
      "ainstein-researcher": { role: "AI.NSTEIN専用リサーチャー", model: "Haiku" },
      "allight-researcher": { role: "ALLIGHT.専用リサーチャー", model: "Haiku" },
      "ainstein-writer": { role: "AI.NSTEINライター", model: "Sonnet" },
      "allight-writer": { role: "ALLIGHT.ライター", model: "Sonnet" },
      "ainstein-image-designer": { role: "AI.NSTEIN画像プロンプト設計", model: "Sonnet" },
      "allight-image-designer": { role: "ALLIGHT.画像プロンプト設計", model: "Sonnet" },
    }),
    isPublic: true,
  },
];

function deriveTags(structureType: string, mcpServers: string, agentCount: number): string[] {
  const tags: string[] = [];
  if (structureType) tags.push(structureType);

  const mcpList = mcpServers.split(",").map((s) => s.trim()).filter(Boolean);
  if (mcpList.length >= 3) tags.push("MCP統合型");

  if (agentCount >= 6) tags.push("並列分散型");

  if (structureType === "フル・ハーネス設計" || structureType === "ハーネス設計") {
    tags.push("自律ループ型");
  }

  if (structureType === "フル・ハーネス設計") {
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
      sorts: [{ property: "今月のトークン", direction: "descending" }],
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

        const mcpServers = rt("MCPサーバー");
        const agentCount = num("エージェント数");
        const structureType = sel("構造タイプ");

        const tags = deriveTags(structureType, mcpServers, agentCount);

        return {
          id: page.id,
          member: title("メンバー名"),
          updatedAt: date("更新日"),
          agentCount,
          structureType,
          tags,
          todayTokens: num("今日のトークン"),
          monthTokens: num("今月のトークン"),
          // 新フィールド（Notionに追加が必要）
          // ※フィールド名が異なる場合はここを修正してください
          planTodayTokens: num("プラン使用量（今日）"),
          planMonthTokens: num("プラン使用量（今月）"),
          addTodayTokens: num("追加使用量（今日）"),
          addMonthTokens: num("追加使用量（今月）"),
          plan: sel("契約プラン") || rt("契約プラン"),
          model: sel("使用モデル"),
          mcpServers,
          mermaid: rt("Mermaid図"),
          agentJson: rt("エージェントJSON"),
          isPublic: sel("公開設定") === "公開",
        };
      });
  } catch (e) {
    console.error("Notion API error:", e);
    return MOCK_DATA;
  }
}
