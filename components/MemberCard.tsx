import type { AgentMapEntry } from "@/lib/notion";
import MermaidDiagram from "./MermaidDiagram";
import TagBadge from "./TagBadge";
import LvBadge from "./LvBadge";
import McpTag from "./McpTag";

type AgentJsonEntry = { role: string; model?: string };

const MAIN_LEVELS = ["シンプル", "マルチエージェント", "ハーネス設計", "フル・ハーネス設計"];

function parseAgentJson(raw: string): Record<string, AgentJsonEntry> | undefined {
  if (!raw) return undefined;
  try {
    return JSON.parse(raw);
  } catch {
    return undefined;
  }
}

function ScrollableTagRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative -mr-5">
      <div
        className="flex flex-wrap gap-x-1.5 gap-y-1.5 overflow-y-hidden pr-10 max-h-[3.5rem]"
      >
        {children}
      </div>
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#FAF9F5] via-[#FAF9F5]/80 to-transparent" />
    </div>
  );
}

export default function MemberCard({ entry, levelOverride }: { entry: AgentMapEntry; levelOverride?: number }) {
  const level = levelOverride ?? MAIN_LEVELS.indexOf(entry.structureType) + 1;
  const abilityTags = entry.tags.filter((t) => !MAIN_LEVELS.includes(t));
  const agentJson = parseAgentJson(entry.agentJson);

  const mcpItems = entry.mcpServers
    ? entry.mcpServers
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .map((s) => {
          const colonIdx = s.indexOf(": ");
          return {
            name: colonIdx >= 0 ? s.slice(0, colonIdx) : s,
            desc: colonIdx >= 0 ? s.slice(colonIdx + 2) : "",
          };
        })
    : [];

  return (
    <div className="h-full bg-[#FAF9F5] border border-[#E8E6DC] rounded-2xl p-5 flex flex-col gap-5 shadow-sm hover:shadow-md transition-shadow">
      {/* ヘッダー：名前 + Lv バッジ右上 */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-xl font-bold text-[#141413] truncate">{entry.member}</h2>
          <p className="text-[#A8A6A0] text-xs mt-0">更新: {entry.updatedAt}</p>
        </div>
        <LvBadge level={level} />
      </div>

      {/* アビリティー (N) */}
      {abilityTags.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <p className="text-[#5E5D59] text-xs">アビリティー ({abilityTags.length})</p>
          <ScrollableTagRow>
            {abilityTags.map((tag) => (
              <TagBadge key={tag} tag={tag} />
            ))}
          </ScrollableTagRow>
        </div>
      )}

      {/* MCP連携 (N) */}
      {mcpItems.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <p className="text-[#5E5D59] text-xs">MCP連携 ({mcpItems.length})</p>
          <ScrollableTagRow>
            {mcpItems.map(({ name, desc }) => (
              <McpTag key={name} name={name} desc={desc} />
            ))}
          </ScrollableTagRow>
        </div>
      )}

      {/* できること (N) */}
      {entry.capabilities.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <p className="text-[#5E5D59] text-xs">できること ({entry.capabilities.length})</p>
          <ScrollableTagRow>
            {entry.capabilities.map((cap) => (
              <span
                key={cap}
                className="inline-block text-[11px] bg-[#F2EFE8] text-[#7A7A7A] px-2.5 py-0.5 rounded-full cursor-default whitespace-nowrap"
              >
                {cap}
              </span>
            ))}
          </ScrollableTagRow>
        </div>
      )}

      {/* トークン使用量（区切り線付き） */}
      {(entry.weekTokens > 0 || entry.monthTokens > 0) && (
        <div className="flex flex-col gap-1.5 pt-3 border-t border-[#E8E6DC]">
          <p className="text-[#5E5D59] text-xs">トークン使用量</p>
          <div className="flex gap-4 text-xs text-[#4D4C48]">
            <span>今週: <span className="font-medium text-[#141413]">{entry.weekTokens.toLocaleString()}</span></span>
            <span>今月: <span className="font-medium text-[#141413]">{entry.monthTokens.toLocaleString()}</span></span>
          </div>
        </div>
      )}

      {/* エージェント可視化：左に大きな数字、背景に薄いMermaid */}
      <div className="flex-1">
        {entry.mermaid ? (
          <div className="h-full bg-[#FAF9F5] border border-[#E8E6DC] rounded-xl p-4 min-h-[140px] group relative overflow-hidden">
            <div className="absolute top-4 left-4 z-10 flex items-baseline gap-0.5 pointer-events-none">
              <span
                className="text-2xl font-bold text-[#141413] leading-none"
                style={{ fontFamily: '"Hiragino Mincho ProN", "Yu Mincho", "YuMincho", "Noto Serif JP", serif' }}
              >
                {entry.agentCount}
              </span>
              <span className="text-[#5E5D59] text-xs">agent</span>
            </div>
            <span className="absolute top-3 right-4 text-[#87867F] text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
              クリックで拡大
            </span>
            <div className="opacity-30 h-full">
              <MermaidDiagram chart={entry.mermaid} id={entry.id} agentJson={agentJson} />
            </div>
          </div>
        ) : (
          <div className="h-full bg-[#FAF9F5] rounded-xl p-4 flex items-center justify-center text-[#5E5D59] text-sm min-h-[120px]">
            マップデータなし
          </div>
        )}
      </div>
    </div>
  );
}
