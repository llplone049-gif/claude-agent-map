"use client";

import { useEffect, useRef, useState } from "react";
import type { Dispatch, SetStateAction } from "react";

export type AgentJsonEntry = { role: string; model?: string };

interface MermaidDiagramProps {
  chart: string;
  id: string;
  agentJson?: Record<string, AgentJsonEntry>;
}

// agentJsonが未指定のときのフォールバック用ラベルマップ
const LABEL_MAP: Record<string, string> = {
  secretary: "AI秘書・司令塔",
  planner: "全PJ横断プランナー",
  "ainstein-pm": "AI.NSTEIN PM",
  "allight-pm": "ALLIGHT. PM",
  "ainstein-researcher": "AI.NSTEIN専用リサーチャー",
  "allight-researcher": "ALLIGHT.専用リサーチャー",
  "ainstein-writer": "AI.NSTEINライター",
  "allight-writer": "ALLIGHT.ライター",
  "ainstein-image-designer": "AI.NSTEIN画像プロンプト設計",
  "allight-image-designer": "ALLIGHT.画像プロンプト設計",
};

interface AgentDetail {
  description: string;
  tools: string[];
  calls: string[];
}

const AGENT_DETAILS: Record<string, AgentDetail> = {
  secretary: {
    description: "AI秘書・司令塔。タスク管理と優先順位提案、PM・各担当への橋渡し役",
    tools: [],
    calls: ["planner"],
  },
  planner: {
    description: "全PJ横断プランナー。何を・どのPJに・どの順番で作るかを決定してPMに振り分ける",
    tools: ["Read", "Glob", "Grep"],
    calls: ["ainstein-pm", "allight-pm"],
  },
  "ainstein-pm": {
    description: "AI.NSTEIN PM。リサーチ依頼→テーマ決定→ライターブリーフ→品質チェックの全フローを管理",
    tools: ["Read", "Glob", "Grep", "WebSearch", "WebFetch", "Agent"],
    calls: ["ainstein-researcher", "ainstein-writer", "ainstein-image-designer"],
  },
  "allight-pm": {
    description: "ALLIGHT. PM。健康トレンドリサーチ→記事テーマ決定→ライターブリーフ→品質チェック",
    tools: ["Read", "Glob", "Grep", "WebSearch", "WebFetch", "Agent"],
    calls: ["allight-researcher", "allight-writer", "allight-image-designer"],
  },
  "ainstein-researcher": {
    description: "AI.NSTEIN専用リサーチャー。YouTube・X・note・ZennからAI最新トレンドを収集してPMに渡す",
    tools: ["WebSearch", "WebFetch"],
    calls: [],
  },
  "allight-researcher": {
    description: "ALLIGHT.専用リサーチャー。X・YouTube・noteから健康・光・自律神経トレンドを収集",
    tools: ["WebSearch", "WebFetch"],
    calls: [],
  },
  "ainstein-writer": {
    description: "AI.NSTEINライター。「難しいを簡単に」「意志あるAI活用」をテーマにnote記事を執筆",
    tools: [],
    calls: [],
  },
  "allight-writer": {
    description: "ALLIGHT.ライター。自責感払拭→ロジック→整える→光の4ステップ構造で執筆",
    tools: [],
    calls: [],
  },
  "ainstein-image-designer": {
    description: "AI.NSTEIN画像プロンプト設計。知的・フレンドリー・テクノロジーな世界観に合った画像を設計",
    tools: [],
    calls: [],
  },
  "allight-image-designer": {
    description: "ALLIGHT.画像プロンプト設計。自然・癒し・光・回復の世界観に合った画像を設計",
    tools: [],
    calls: [],
  },
};

// Mermaidのノードラベルを役割+モデルに置換する
// 対応フォーマット:
//   scanner旧: agentname[agentname]
//   scanner新: agentname["agentname\nshortdesc"]
function applyLabelMap(
  chart: string,
  agentJson?: Record<string, AgentJsonEntry>
): string {
  let result = chart;

  const allAgents = new Set([
    ...Object.keys(LABEL_MAP),
    ...(agentJson ? Object.keys(agentJson) : []),
  ]);

  for (const agentName of allAgents) {
    const escaped = agentName.replace(/-/g, "\\-").replace(/\./g, "\\.");
    const role  = agentJson?.[agentName]?.role ?? LABEL_MAP[agentName];
    const model = agentJson?.[agentName]?.model;

    if (!role) continue;

    // ノードには役割名のみ表示（モデルはツールチップに表示）
    const label = role;

    // [name] 形式と ["name\n..."] 形式の両方にマッチ
    result = result.replace(
      new RegExp(`\\b${escaped}\\[(?:[^\\]"]*|"[^"]*")*\\]`, "g"),
      `${agentName}["${label}"]`
    );
  }

  return result;
}

const MERMAID_THEME = {
  startOnLoad: false,
  theme: "base" as const,
  themeVariables: {
    primaryColor: "#F0EEE6",
    primaryTextColor: "#141413",
    primaryBorderColor: "#C96442",
    lineColor: "#5E5D59",
    background: "#FAF9F5",
    mainBkg: "#F0EEE6",
    nodeBorder: "#C96442",
    clusterBkg: "#F0EEE6",
    titleColor: "#141413",
    edgeLabelBackground: "#F5F4ED",
    secondaryColor: "#F5F4ED",
    tertiaryColor: "#F0EEE6",
  },
};

interface TooltipState {
  x: number;
  y: number;
  detail: AgentDetail & { roleName: string; model?: string };
}

// Mermaid SVGのノードIDからエージェント名を抽出
// 例: "mermaid-<uuid>-flowchart-ainstein-pm-5" → "ainstein-pm"
function extractAgentName(elementId: string): string {
  const match = elementId.match(/flowchart-(.+)-\d+$/);
  return match ? match[1] : "";
}

function addTooltipListeners(
  container: HTMLDivElement,
  setTooltip: Dispatch<SetStateAction<TooltipState | null>>,
  agentJson?: Record<string, AgentJsonEntry>
) {
  const nodes = container.querySelectorAll('g[id*="flowchart-"]');
  nodes.forEach((node) => {
    const rawId = node.getAttribute("id") ?? "";
    const agentName = extractAgentName(rawId);
    // agentJsonがあればそちらの役割名を優先
    const roleName = agentJson?.[agentName]?.role ?? LABEL_MAP[agentName];
    const model    = agentJson?.[agentName]?.model;
    const detail   = AGENT_DETAILS[agentName];
    if (!roleName || !detail) return;

    (node as HTMLElement).style.cursor = "help";

    node.addEventListener("mouseenter", (e) => {
      const me = e as MouseEvent;
      setTooltip({ x: me.clientX, y: me.clientY, detail: { ...detail, roleName, model } });
    });
    node.addEventListener("mousemove", (e) => {
      const me = e as MouseEvent;
      setTooltip((prev) => (prev ? { ...prev, x: me.clientX, y: me.clientY } : null));
    });
    node.addEventListener("mouseleave", () => setTooltip(null));
  });
}

export default function MermaidDiagram({ chart, id, agentJson }: MermaidDiagramProps) {
  const ref = useRef<HTMLDivElement>(null);
  const modalContentRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  useEffect(() => {
    if (!chart) return;
    const processed = applyLabelMap(chart, agentJson);
    import("mermaid").then((m) => {
      m.default.initialize(MERMAID_THEME);
      m.default
        .render(`mermaid-${id}`, processed)
        .then(({ svg: rendered }) => {
          if (ref.current) {
            ref.current.innerHTML = rendered;
            addTooltipListeners(ref.current, setTooltip, agentJson);
          }
          setSvg(rendered);
        })
        .catch(() => {});
    });
  }, [chart, id, agentJson]);

  // モーダルが開いたらSVGを挿入してリスナーを追加
  useEffect(() => {
    if (!isOpen || !svg || !modalContentRef.current) return;
    modalContentRef.current.innerHTML = svg;
    addTooltipListeners(modalContentRef.current, setTooltip, agentJson);
  }, [isOpen, svg, agentJson]);

  const handleClose = () => {
    setIsOpen(false);
    setTooltip(null);
  };

  return (
    <>
      {/* カード内の小さい図（クリックで拡大） */}
      <div
        ref={ref}
        className="w-full overflow-x-auto cursor-zoom-in"
        title="クリックで拡大"
        onClick={() => svg && setIsOpen(true)}
      />

      {/* 拡大モーダル */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
          onClick={handleClose}
        >
          <div
            className="bg-[#FAF9F5] rounded-2xl p-8 max-w-5xl w-full max-h-[90vh] overflow-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <span className="text-[#4D4C48] text-sm font-medium">エージェント構造マップ</span>
              <button
                onClick={handleClose}
                className="text-[#4D4C48] hover:text-[#141413] text-xl font-bold leading-none"
              >
                ×
              </button>
            </div>
            <div ref={modalContentRef} className="w-full overflow-auto" />
          </div>
        </div>
      )}

      {/* ホバーツールチップ */}
      {tooltip && (
        <div
          className="fixed z-[9999] pointer-events-none"
          style={{ left: tooltip.x + 16, top: tooltip.y - 8 }}
        >
          <div className="bg-[#141413] text-[#FAF9F5] rounded-xl px-4 py-3 shadow-xl max-w-xs text-sm">
            <div className="flex items-center gap-2 mb-2">
              <p className="font-bold text-[#F0EEE6]">{tooltip.detail.roleName}</p>
              {tooltip.detail.model && (
                <span className="text-xs bg-[#30302E] text-[#87867F] border border-[#30302E] px-1.5 py-0.5 rounded">
                  {tooltip.detail.model}
                </span>
              )}
            </div>
            <p className="text-[#B0AEA5] text-xs leading-relaxed mb-2">
              {tooltip.detail.description}
            </p>
            {tooltip.detail.tools.length > 0 && (
              <div className="mt-1">
                <span className="text-[#87867F] text-xs">ツール: </span>
                <span className="text-xs">{tooltip.detail.tools.join(", ")}</span>
              </div>
            )}
            {tooltip.detail.calls.length > 0 && (
              <div className="mt-0.5">
                <span className="text-[#87867F] text-xs">呼び出し先: </span>
                <span className="text-xs">{tooltip.detail.calls.join(", ")}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
