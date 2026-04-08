import type { AgentMapEntry } from "@/lib/notion";
import MermaidDiagram from "./MermaidDiagram";
import TagBadge from "./TagBadge";

function formatTokens(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}k`;
  return String(n);
}

export default function MemberCard({ entry }: { entry: AgentMapEntry }) {
  const displayTags = entry.tags.length > 0 ? entry.tags : [entry.structureType];

  return (
    <div className="bg-[#FFFDF8] border border-[#E2D0BA] rounded-2xl p-6 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow">
      {/* ヘッダー */}
      <div className="flex flex-col gap-2">
        <div>
          <h2 className="text-xl font-bold text-[#2D1F0E]">{entry.member}</h2>
          <p className="text-[#9A7A5A] text-sm mt-0.5">
            更新: {entry.updatedAt}
          </p>
        </div>
        <div className="flex flex-wrap gap-1">
          {displayTags.map((tag) => (
            <TagBadge key={tag} tag={tag} />
          ))}
        </div>
      </div>

      {/* 統計 */}
      <div className="grid grid-cols-3 gap-3">
        <Stat label="agent" value={`${entry.agentCount}`} unit="体" />
        <Stat label="今日" value={formatTokens(entry.todayTokens)} unit="tokens" />
        <Stat label="今月" value={formatTokens(entry.monthTokens)} unit="tokens" />
      </div>

      {/* MCP */}
      {entry.mcpServers && (
        <div className="flex flex-wrap gap-1.5">
          {entry.mcpServers.split(",").map((s) => (
            <span
              key={s.trim()}
              className="text-xs bg-[#F5EDE0] text-[#7A5C3A] border border-[#E2D0BA] px-2 py-0.5 rounded-full"
            >
              🔌 {s.trim()}
            </span>
          ))}
        </div>
      )}

      {/* Mermaid */}
      {entry.mermaid ? (
        <div className="bg-[#FAF6EE] border border-[#E8D8C0] rounded-xl p-4 min-h-[200px] group relative">
          <div className="absolute top-2 right-2 text-[#C8A882] text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            クリックで拡大
          </div>
          <MermaidDiagram chart={entry.mermaid} id={entry.id} />
        </div>
      ) : (
        <div className="bg-[#FAF6EE] rounded-xl p-4 flex items-center justify-center text-[#9A7A5A] text-sm min-h-[120px]">
          マップデータなし
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div className="bg-[#F5EDE0] rounded-xl p-3 text-center">
      <p className="text-[#9A7A5A] text-xs mb-1">{label}</p>
      <p className="text-[#2D1F0E] font-bold text-lg leading-none">{value}</p>
      <p className="text-[#B8986A] text-xs mt-0.5">{unit}</p>
    </div>
  );
}
