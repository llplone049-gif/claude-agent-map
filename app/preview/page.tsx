import MemberCard from "@/components/MemberCard";
import StructureGuide from "@/components/StructureGuide";
import type { AgentMapEntry } from "@/lib/notion";

const DUMMY_MERMAID = `graph TD
    User((ユーザー))
    User --> secretary[secretary]
    secretary --> planner[planner]
    planner --> ainstein-pm[ainstein-pm]
    planner --> allight-pm[allight-pm]
    ainstein-pm --> ainstein-researcher[ainstein-researcher]
    ainstein-pm --> ainstein-writer[ainstein-writer]
    allight-pm --> allight-researcher[allight-researcher]
    allight-pm --> allight-writer[allight-writer]`;

const DUMMY_AGENT_JSON = JSON.stringify({
  secretary: { role: "AI秘書・司令塔", model: "Sonnet" },
  planner: { role: "全PJ横断プランナー", model: "Sonnet" },
  "ainstein-pm": { role: "AI.NSTEIN PM", model: "Opus" },
  "allight-pm": { role: "ALLIGHT. PM", model: "Opus" },
  "ainstein-researcher": { role: "AI.NSTEIN専用リサーチャー", model: "Haiku" },
  "allight-researcher": { role: "ALLIGHT.専用リサーチャー", model: "Haiku" },
  "ainstein-writer": { role: "AI.NSTEINライター", model: "Sonnet" },
  "allight-writer": { role: "ALLIGHT.ライター", model: "Sonnet" },
});

const yamada: AgentMapEntry = {
  id: "preview-yamada",
  member: "山田太郎",
  updatedAt: "2026-04-28",
  agentCount: 6,
  structureType: "シンプル",
  tags: ["シンプル", "MCP統合型", "並列分散型", "自律ループ型"],
  capabilities: ["note記事作成", "SNSリサーチ", "議事録自動登録"],
  model: "Sonnet",
  mcpServers: "notionAPI: タスク管理, playwright: ブラウザ操作, obsidian: メモ取り込み",
  weekTokens: 3489060,
  monthTokens: 21232196,
  mermaid: DUMMY_MERMAID,
  agentJson: DUMMY_AGENT_JSON,
  isPublic: true,
};

const mizuki: AgentMapEntry = {
  id: "preview-mizuki",
  member: "みずきしげる",
  updatedAt: "2026-04-28",
  agentCount: 34,
  structureType: "フル・ハーネス設計",
  tags: [
    "フル・ハーネス設計",
    "MCP統合型",
    "並列分散型",
    "自律ループ型",
    "ヒューマンインザループ",
    "MCP統合型",
    "並列分散型",
    "自律ループ型",
    "ヒューマンインザループ",
    "MCP統合型",
    "並列分散型",
  ],
  capabilities: [
    "note記事作成",
    "SNSリサーチ",
    "議事録自動登録",
    "画像プロンプト生成",
    "AI導入コンサル支援",
    "samples1",
    "samples2",
    "samples3",
    "samples4",
    "samples5",
    "samples6",
    "samples7",
    "samples8",
    "samples9",
    "samples10",
  ],
  model: "Opus",
  mcpServers:
    "notionAPI: タスク管理, playwright: ブラウザ操作, obsidian: メモ取り込み, sample1: ダミー, sample2: ダミー, sample3: ダミー, sample4: ダミー, sample5: ダミー, sample6: ダミー, sample7: ダミー",
  weekTokens: 3489060,
  monthTokens: 21232196,
  mermaid: DUMMY_MERMAID,
  agentJson: DUMMY_AGENT_JSON,
  isPublic: true,
};

const cards: { entry: AgentMapEntry; levelOverride?: number }[] = [
  { entry: yamada, levelOverride: 1 },
  { entry: mizuki, levelOverride: 6 },
  { entry: { ...yamada, id: "preview-yamada-2" }, levelOverride: 1 },
  { entry: { ...mizuki, id: "preview-mizuki-2" }, levelOverride: 6 },
  { entry: { ...yamada, id: "preview-yamada-3" }, levelOverride: 1 },
  { entry: { ...mizuki, id: "preview-mizuki-3" }, levelOverride: 6 },
];

export default function PreviewPage() {
  return (
    <div className="min-h-screen bg-[#F5F4ED] text-[#141413]">
      <header className="px-6 pt-8 pb-6 border-b border-[#E8E6DC]">
        <div className="max-w-6xl mx-auto flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
              <span className="text-[#D97757] whitespace-nowrap">ClaudeCode</span>
              <span className="hidden sm:inline text-[#141413]"> Agent Map</span>
              <span className="sm:hidden text-[#141413] block whitespace-nowrap">Agent Map</span>
              <span className="text-[#A8A6A0] text-xs sm:text-sm font-normal ml-2">
                ／ Preview
              </span>
            </h1>
            <p className="text-[#5E5D59] text-[11px] sm:text-sm mt-0.5 whitespace-nowrap">
              デザイン確認用のダミー表示
            </p>
          </div>
          <StructureGuide />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 pt-6 pb-8">
        <div className="flex justify-end mb-4">
          <p className="text-[#5E5D59] text-sm">
            メンバー{" "}
            <span
              className="font-bold text-[#141413] text-lg"
              style={{
                fontFamily:
                  '"Hiragino Mincho ProN", "Yu Mincho", "YuMincho", "Noto Serif JP", serif',
              }}
            >
              {cards.length}
            </span>{" "}
            人
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {cards.map(({ entry, levelOverride }) => (
            <MemberCard key={entry.id} entry={entry} levelOverride={levelOverride} />
          ))}
        </div>
      </main>
    </div>
  );
}
