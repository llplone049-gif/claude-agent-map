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
  capabilities: string[]; // できること（自動化している業務）
  model: string;     // 使用モデル e.g. "Sonnet", "Opus", "Haiku"
  mcpServers: string;
  mermaid: string;
  agentJson: string; // エージェントJSON（役割・モデル情報のJSON文字列）
  isPublic: boolean;
  weekTokens: number;
  monthTokens: number;
}

const MOCK_DATA: AgentMapEntry[] = [
  {
    id: "mock-kirari",
    member: "きらり",
    updatedAt: "2026-05-11",
    agentCount: 23,
    structureType: "フル・ハーネス設計",
    tags: ["フル・ハーネス設計", "MCP統合型", "並列分散型", "自律ループ型", "ヒューマンインザループ", "自己評価型"],
    capabilities: ["note記事作成", "SNSリサーチ", "議事録自動登録", "画像プロンプト生成", "AI導入コンサル支援"],
    model: "Sonnet",
    mcpServers: "notionApi: タスク管理・議事録・エージェントマップ保存, playwright: Webブラウザ操作・スクレイピング, obsidian: インスピレーションメモの自動取り込み",
    weekTokens: 12909703,
    monthTokens: 22926698,
    mermaid: `graph TD
    User((ユーザー))
    User --> secretary[secretary]
    secretary --> planner[planner]
    planner --> aidx-pm[aidx-pm]
    planner --> ainstein-pm[ainstein-pm]
    planner --> hadoiryo-pm[hadoiryo-pm]
    planner --> web-pm[web-pm]
    aidx-pm --> aidx-analyst[aidx-analyst]
    aidx-pm --> aidx-architect[aidx-architect]
    aidx-pm --> aidx-researcher[aidx-researcher]
    aidx-pm --> aidx-writer[aidx-writer]
    ainstein-pm --> ainstein-researcher[ainstein-researcher]
    ainstein-pm --> ainstein-writer[ainstein-writer]
    ainstein-pm --> ainstein-image-designer[ainstein-image-designer]
    hadoiryo-pm --> hadoiryo-analyst[hadoiryo-analyst]
    hadoiryo-pm --> hadoiryo-researcher[hadoiryo-researcher]
    hadoiryo-pm --> hadoiryo-writer[hadoiryo-writer]
    web-pm --> web-frontend[web-frontend]
    web-pm --> web-backend[web-backend]
    web-pm --> web-qa[web-qa]`,
    agentJson: JSON.stringify({
      secretary: { role: "AI秘書・司令塔", model: "Sonnet", tools: [], calls: ["planner"] },
      planner: { role: "全PJ横断プランナー", model: "Sonnet", tools: ["Read","Glob","Grep"], calls: ["aidx-pm","ainstein-pm","hadoiryo-pm","web-pm"] },
    }),
    isPublic: true,
  },
  {
    id: "mock-hide",
    member: "ヒデさん",
    updatedAt: "2026-05-10",
    agentCount: 5,
    structureType: "ハーネス設計",
    tags: ["ハーネス設計", "MCP統合型", "並列分散型"],
    capabilities: ["情報収集自動化", "Obsidian管理", "Chatwork社内共有", "YouTube要約"],
    model: "Sonnet",
    mcpServers: "obsidian: 情報プール管理, chatwork: 社内共有, youtube: 動画情報収集",
    weekTokens: 3240000,
    monthTokens: 8100000,
    mermaid: `graph TD
    User((ユーザー))
    User --> info-collector[info-collector]
    info-collector --> youtube-watcher[youtube-watcher]
    info-collector --> x-monitor[x-monitor]
    info-collector --> obsidian-writer[obsidian-writer]
    obsidian-writer --> chatwork-reporter[chatwork-reporter]`,
    agentJson: JSON.stringify({
      "info-collector": { role: "情報収集コーディネーター", model: "Sonnet", tools: ["Agent"], calls: ["youtube-watcher","x-monitor","obsidian-writer"] },
      "youtube-watcher": { role: "YouTube動画監視・要約", model: "Haiku", tools: ["WebFetch"], calls: [] },
      "x-monitor": { role: "X投稿監視・収集", model: "Haiku", tools: ["WebSearch"], calls: [] },
      "obsidian-writer": { role: "Obsidian情報プール書き込み", model: "Sonnet", tools: ["Write"], calls: ["chatwork-reporter"] },
      "chatwork-reporter": { role: "Chatwork社内レポート配信", model: "Haiku", tools: [], calls: [] },
    }),
    isPublic: true,
  },
  {
    id: "mock-tamotsu",
    member: "保さん",
    updatedAt: "2026-05-09",
    agentCount: 3,
    structureType: "マルチエージェント",
    tags: ["マルチエージェント", "自律ループ型"],
    capabilities: ["感性エンジン分析", "企業診断レポート", "AI戦略提案"],
    model: "Opus",
    mcpServers: "notionApi: 提案書管理",
    weekTokens: 1820000,
    monthTokens: 5400000,
    mermaid: `graph TD
    User((ユーザー))
    User --> beta-core[beta-core]
    beta-core --> persona-analyzer[persona-analyzer]
    beta-core --> strategy-writer[strategy-writer]`,
    agentJson: JSON.stringify({
      "beta-core": { role: "感性エンジン統括・ベータAI中枢", model: "Opus", tools: ["Agent"], calls: ["persona-analyzer","strategy-writer"] },
      "persona-analyzer": { role: "個人・企業・現場の3層感性分析", model: "Sonnet", tools: ["Read","WebFetch"], calls: [] },
      "strategy-writer": { role: "AI戦略提案書ライター", model: "Sonnet", tools: ["Write"], calls: [] },
    }),
    isPublic: true,
  },
  {
    id: "mock-guts",
    member: "ガッツさん",
    updatedAt: "2026-05-08",
    agentCount: 2,
    structureType: "シンプル",
    tags: ["シンプル"],
    capabilities: ["動画企画補佐", "SNS投稿文作成"],
    model: "Sonnet",
    mcpServers: "",
    weekTokens: 480000,
    monthTokens: 1200000,
    mermaid: `graph TD
    User((ユーザー))
    User --> content-planner[content-planner]
    content-planner --> sns-writer[sns-writer]`,
    agentJson: JSON.stringify({
      "content-planner": { role: "動画・SNSコンテンツ企画", model: "Sonnet", tools: ["WebSearch"], calls: ["sns-writer"] },
      "sns-writer": { role: "SNS投稿文ライター", model: "Sonnet", tools: [], calls: [] },
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
          capabilities: rt("できること").split(/[,、・\n]/).map((s: string) => s.replace(/^[•・\s]+/, "").trim()).filter(Boolean),
          model: sel("使用モデル"),
          mcpServers,
          mermaid: rt("Mermaid図"),
          agentJson: rt("エージェントJSON"),
          isPublic: sel("公開設定") === "公開",
          weekTokens: num("今週のトークン"),
          monthTokens: num("今月のトークン"),
        };
      });
  } catch (e) {
    console.error("Notion API error:", e);
    return MOCK_DATA;
  }
}
