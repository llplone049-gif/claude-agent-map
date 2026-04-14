import type { AgentMapEntry } from "@/lib/notion";
import MermaidDiagram from "./MermaidDiagram";
import TagBadge from "./TagBadge";

// モデル別トークン単価（$/MTok）
const MODEL_PRICE: Record<string, { input: number; output: number }> = {
  Opus:   { input: 15,   output: 75  },
  Sonnet: { input: 3,    output: 15  },
  Haiku:  { input: 0.8,  output: 4   },
};

function calcJpyRange(
  tokens: number,
  model: string,
  exchangeRate: number
): { low: number; high: number } | null {
  if (tokens <= 0) return null;
  const price = MODEL_PRICE[model] ?? MODEL_PRICE.Sonnet;
  // 低: input 80% / output 20%
  const lowRate  = price.input * 0.8 + price.output * 0.2;
  // 高: input 50% / output 50%
  const highRate = price.input * 0.5 + price.output * 0.5;
  return {
    low:  Math.round((tokens / 1_000_000) * lowRate  * exchangeRate),
    high: Math.round((tokens / 1_000_000) * highRate * exchangeRate),
  };
}

function fmtJpy(n: number): string {
  return n.toLocaleString("ja-JP");
}

function formatTokens(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}k`;
  return String(n);
}

type AgentJsonEntry = { role: string; model?: string };

function parseAgentJson(raw: string): Record<string, AgentJsonEntry> | undefined {
  if (!raw) return undefined;
  try {
    return JSON.parse(raw);
  } catch {
    return undefined;
  }
}

export default function MemberCard({
  entry,
  exchangeRate,
}: {
  entry: AgentMapEntry;
  exchangeRate: number;
}) {
  const displayTags = entry.tags.length > 0 ? entry.tags : [entry.structureType];
  const agentJson = parseAgentJson(entry.agentJson);

  const model = entry.model || "Sonnet";
  const jpyToday = calcJpyRange(entry.todayTokens,  model, exchangeRate);
  const jpyMonth = calcJpyRange(entry.monthTokens, model, exchangeRate);

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

      {/* トークン使用量 */}
      <div className="grid grid-cols-2 gap-3">
        <TokenStat
          label="今日"
          value={formatTokens(entry.todayTokens)}
          jpy={jpyToday}
        />
        <TokenStat
          label="今月"
          value={formatTokens(entry.monthTokens)}
          jpy={jpyMonth}
        />
      </div>

      {/* MCP */}
      {entry.mcpServers && (
        <div className="flex flex-col gap-1">
          {entry.mcpServers.split(",").map((s) => {
            const trimmed = s.trim();
            const colonIdx = trimmed.indexOf(": ");
            const name = colonIdx >= 0 ? trimmed.slice(0, colonIdx) : trimmed;
            const desc = colonIdx >= 0 ? trimmed.slice(colonIdx + 2) : "";
            return (
              <div key={name} className="flex items-baseline gap-2">
                <span className="text-xs bg-[#F5EDE0] text-[#7A5C3A] border border-[#E2D0BA] px-2 py-0.5 rounded-full whitespace-nowrap">
                  🔌 {name}
                </span>
                {desc && (
                  <span className="text-xs text-[#9A7A5A] leading-tight">{desc}</span>
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

function TokenStat({
  label,
  value,
  jpy,
}: {
  label: string;
  value: string;
  jpy: { low: number; high: number } | null;
}) {
  return (
    <div className="bg-[#F5EDE0] rounded-xl p-3 text-center">
      <p className="text-[#9A7A5A] text-xs mb-1">{label}</p>
      <p className="text-[#2D1F0E] font-bold text-lg leading-none">{value}</p>
      <p className="text-[#B8986A] text-xs mt-0.5">tokens</p>
      {jpy && (
        <p className="text-[#9A7A5A] text-xs mt-1.5 leading-tight">
          ≈ ¥{fmtJpy(jpy.low)}<br />〜¥{fmtJpy(jpy.high)}
        </p>
      )}
    </div>
  );
}
