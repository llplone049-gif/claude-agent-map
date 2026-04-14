import type { AgentMapEntry } from "@/lib/notion";
import MermaidDiagram from "./MermaidDiagram";
import TagBadge from "./TagBadge";

type AgentJsonEntry = { role: string; model?: string };

function parseAgentJson(raw: string): Record<string, AgentJsonEntry> | undefined {
  if (!raw) return undefined;
  try {
    return JSON.parse(raw);
  } catch {
    return undefined;
  }
}

export default function MemberCard({ entry }: { entry: AgentMapEntry }) {
  const displayTags = entry.tags.length > 0 ? entry.tags : [entry.structureType];
  const agentJson = parseAgentJson(entry.agentJson);

  return (
    <div className="bg-[#FFFDF8] border border-[#E2D0BA] rounded-2xl p-6 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow">
      {/* ヘッダー */}
      <div className="flex flex-col gap-2">
        <div>
          <h2 className="text-xl font-bold text-[#2D1F0E]">{entry.member}</h2>
          <p className="text-[#9A7A5A] text-sm mt-0.5">更新: {entry.updatedAt}</p>
        </div>
        <div className="flex flex-wrap gap-1">
          {displayTags.map((tag) => (
            <TagBadge key={tag} tag={tag} />
          ))}
        </div>
      </div>

      {/* できること */}
      {entry.capabilities.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <p className="text-[#9A7A5A] text-xs">できること</p>
          <div className="flex flex-wrap gap-1.5">
            {entry.capabilities.map((cap) => (
              <span
                key={cap}
                className="text-xs bg-[#EEF5EE] text-[#2D5A2D] border border-[#B8D8B8] px-2.5 py-1 rounded-full"
              >
                {cap}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* MCP */}
      {entry.mcpServers && (
        <div className="flex flex-wrap gap-1.5">
          {entry.mcpServers.split(",").map((s) => {
            const trimmed = s.trim();
            const colonIdx = trimmed.indexOf(": ");
            const name = colonIdx >= 0 ? trimmed.slice(0, colonIdx) : trimmed;
            const desc = colonIdx >= 0 ? trimmed.slice(colonIdx + 2) : "";
            return (
              <div key={name} className="relative group">
                <span className="text-xs bg-[#F5EDE0] text-[#7A5C3A] border border-[#E2D0BA] px-2 py-0.5 rounded-full cursor-default select-none">
                  🔌 {name}
                </span>
                {desc && (
                  <div className="absolute bottom-full left-0 mb-2 z-20 hidden group-hover:block pointer-events-none">
                    <div className="bg-[#2D1F0E] text-[#FAF6EE] text-xs rounded-lg px-3 py-2 shadow-xl leading-relaxed whitespace-nowrap">
                      {desc}
                    </div>
                    <div className="w-2 h-2 bg-[#2D1F0E] rotate-45 ml-3 -mt-1" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Mermaid */}
      {entry.mermaid ? (
        <div className="bg-[#FAF6EE] border border-[#E8D8C0] rounded-xl p-4 min-h-[200px] group relative">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#9A7A5A] text-xs">
              agent <span className="font-bold text-[#2D1F0E] text-sm">{entry.agentCount}</span>体
            </span>
            <span className="text-[#C8A882] text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              クリックで拡大
            </span>
          </div>
          <MermaidDiagram chart={entry.mermaid} id={entry.id} agentJson={agentJson} />
        </div>
      ) : (
        <div className="bg-[#FAF6EE] rounded-xl p-4 flex items-center justify-center text-[#9A7A5A] text-sm min-h-[120px]">
          マップデータなし
        </div>
      )}
    </div>
  );
}
