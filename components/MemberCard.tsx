import type { AgentMapEntry } from "@/lib/notion";
import MermaidDiagram from "./MermaidDiagram";
import TagBadge from "./TagBadge";
import { STRUCTURE_LIST } from "@/lib/structures";

type AgentJsonEntry = { role: string; model?: string };

const MAIN_LEVELS = ["シンプル", "マルチエージェント", "ハーネス設計", "フル・ハーネス設計"];
const MAX_CAPS = 5;

function parseAgentJson(raw: string): Record<string, AgentJsonEntry> | undefined {
  if (!raw) return undefined;
  try {
    return JSON.parse(raw);
  } catch {
    return undefined;
  }
}

function LevelBadge({ structureType }: { structureType: string }) {
  const level = MAIN_LEVELS.indexOf(structureType) + 1;
  const info = STRUCTURE_LIST.find((s) => s.tag === structureType);
  const colorClass = info?.color ?? "bg-stone-100 text-stone-600 border-stone-300";

  if (level === 0) return <TagBadge tag={structureType} />;

  return (
    <div className={`inline-flex items-center gap-2 text-xs border px-2.5 py-1 rounded-full font-medium ${colorClass}`}>
      <span className="opacity-60 font-normal">Lv.{level}</span>
      <div className="flex gap-0.5">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`w-1.5 h-1.5 rounded-full ${i <= level ? "bg-current opacity-70" : "bg-current opacity-20"}`}
          />
        ))}
      </div>
      <span>{structureType}</span>
    </div>
  );
}

export default function MemberCard({ entry }: { entry: AgentMapEntry }) {
  const abilityTags = entry.tags.filter((t) => !MAIN_LEVELS.includes(t));
  const agentJson = parseAgentJson(entry.agentJson);
  const visibleCaps = entry.capabilities.slice(0, MAX_CAPS);
  const hiddenCaps = entry.capabilities.length - MAX_CAPS;

  return (
    <div className="h-full bg-[#FAF9F5] border border-[#E8E6DC] rounded-2xl p-6 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow">
      {/* ヘッダー */}
      <div className="flex flex-col gap-2">
        <div>
          <h2 className="text-xl font-bold text-[#141413]">{entry.member}</h2>
          <p className="text-[#5E5D59] text-sm mt-0.5">更新: {entry.updatedAt}</p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <LevelBadge structureType={entry.structureType} />
          {abilityTags.map((tag) => (
            <TagBadge key={tag} tag={tag} />
          ))}
        </div>
      </div>

      {/* できること */}
      {entry.capabilities.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <p className="text-[#5E5D59] text-xs">できること</p>
          <div className="flex flex-wrap gap-1.5">
            {visibleCaps.map((cap) => (
              <span
                key={cap}
                className="text-xs bg-[#EEF5EE] text-[#2D5A2D] border border-[#B8D8B8] px-2.5 py-1 rounded cursor-default"
              >
                {cap}
              </span>
            ))}
            {hiddenCaps > 0 && (
              <span className="text-xs text-[#87867F] self-center">+{hiddenCaps}件</span>
            )}
          </div>
        </div>
      )}

      {/* MCP */}
      {entry.mcpServers && (
        <div className="flex flex-col gap-1.5">
          <p className="text-[#5E5D59] text-xs">MCP連携</p>
          <div className="flex flex-wrap gap-1.5">
            {entry.mcpServers.split(",").map((s) => {
              const trimmed = s.trim();
              const colonIdx = trimmed.indexOf(": ");
              const name = colonIdx >= 0 ? trimmed.slice(0, colonIdx) : trimmed;
              const desc = colonIdx >= 0 ? trimmed.slice(colonIdx + 2) : "";
              return (
                <div key={name} className="relative group">
                  <span className="text-xs bg-[#F5F4ED] text-[#4D4C48] border border-[#E8E6DC] px-2 py-0.5 rounded-full cursor-default select-none">
                    🔌 {name}
                  </span>
                  {desc && (
                    <div className="absolute bottom-full left-0 mb-2 z-20 hidden group-hover:block pointer-events-none">
                      <div className="bg-[#141413] text-[#FAF9F5] text-xs rounded-lg px-3 py-2 shadow-xl leading-relaxed whitespace-nowrap">
                        {desc}
                      </div>
                      <div className="w-2 h-2 bg-[#141413] rotate-45 ml-3 -mt-1" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* トークン使用量 */}
      {(entry.weekTokens > 0 || entry.monthTokens > 0) && (
        <div className="flex flex-col gap-1.5">
          <p className="text-[#5E5D59] text-xs">トークン使用量</p>
          <div className="flex gap-4 text-xs text-[#4D4C48]">
            <span>今週: <span className="font-medium text-[#141413]">{entry.weekTokens.toLocaleString()}</span></span>
            <span>今月: <span className="font-medium text-[#141413]">{entry.monthTokens.toLocaleString()}</span></span>
          </div>
        </div>
      )}

      {/* Mermaid */}
      <div className="flex-1">
        {entry.mermaid ? (
          <div className="h-full bg-[#FAF9F5] border border-[#E8E6DC] rounded-xl p-4 min-h-[200px] group relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[#5E5D59] text-xs">
                agent <span className="font-bold text-[#141413] text-sm">{entry.agentCount}</span>体
              </span>
              <span className="text-[#87867F] text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                クリックで拡大
              </span>
            </div>
            <MermaidDiagram chart={entry.mermaid} id={entry.id} agentJson={agentJson} />
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
