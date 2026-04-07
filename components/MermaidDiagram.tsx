"use client";

import { useEffect, useRef, useState } from "react";
import type { Dispatch, SetStateAction } from "react";

interface MermaidDiagramProps {
  chart: string;
  id: string;
}

const LABEL_MAP: Record<string, string> = {
  secretary: "AI秘書",
  planner: "プランナー",
  "ainstein-pm": "AI.NSTEIN PM",
  "allight-pm": "ALLIGHT. PM",
  "ainstein-researcher": "AIリサーチャー",
  "allight-researcher": "健康リサーチャー",
  "ainstein-writer": "AI.NSTEINライター",
  "allight-writer": "ALLIGHT.ライター",
  "ainstein-image-designer": "AI.NSTEIN画像",
  "allight-image-designer": "ALLIGHT.画像",
  researcher: "リサーチャー",
  writer: "ライター",
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

function applyLabelMap(chart: string): string {
  let result = chart;
  for (const [agentName, roleName] of Object.entries(LABEL_MAP)) {
    const escaped = agentName.replace(/-/g, "\\-");
    result = result.replace(
      new RegExp(`\\[${escaped}\\]`, "g"),
      `["${roleName}"]`
    );
  }
  return result;
}

const MERMAID_THEME = {
  startOnLoad: false,
  theme: "base" as const,
  themeVariables: {
    primaryColor: "#F0DEC4",
    primaryTextColor: "#2D1F0E",
    primaryBorderColor: "#D4671B",
    lineColor: "#A07850",
    background: "#FAF6EE",
    mainBkg: "#F0DEC4",
    nodeBorder: "#D4671B",
    clusterBkg: "#F0E4D0",
    titleColor: "#2D1F0E",
    edgeLabelBackground: "#F5EDE0",
    secondaryColor: "#F5E6D3",
    tertiaryColor: "#EDD9BE",
  },
};

interface TooltipState {
  x: number;
  y: number;
  detail: AgentDetail & { roleName: string };
}

// Mermaid SVGのノードIDからエージェント名を抽出
// 例: "mermaid-<uuid>-flowchart-ainstein-pm-5" → "ainstein-pm"
function extractAgentName(elementId: string): string {
  const match = elementId.match(/flowchart-(.+)-\d+$/);
  return match ? match[1] : "";
}

function addTooltipListeners(
  container: HTMLDivElement,
  setTooltip: Dispatch<SetStateAction<TooltipState | null>>
) {
  // Mermaid v11 は "mermaid-<id>-flowchart-<name>-<number>" 形式のIDを使う
  const nodes = container.querySelectorAll('g[id*="flowchart-"]');
  nodes.forEach((node) => {
    const rawId = node.getAttribute("id") ?? "";
    const agentName = extractAgentName(rawId);
    const roleName = LABEL_MAP[agentName];
    const detail = AGENT_DETAILS[agentName];
    if (!roleName || !detail) return;

    (node as HTMLElement).style.cursor = "help";

    node.addEventListener("mouseenter", (e) => {
      const me = e as MouseEvent;
      setTooltip({ x: me.clientX, y: me.clientY, detail: { ...detail, roleName } });
    });
    node.addEventListener("mousemove", (e) => {
      const me = e as MouseEvent;
      setTooltip((prev) => (prev ? { ...prev, x: me.clientX, y: me.clientY } : null));
    });
    node.addEventListener("mouseleave", () => setTooltip(null));
  });
}

export default function MermaidDiagram({ chart, id }: MermaidDiagramProps) {
  const ref = useRef<HTMLDivElement>(null);
  const modalContentRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  useEffect(() => {
    if (!chart) return;
    const processed = applyLabelMap(chart);
    import("mermaid").then((m) => {
      m.default.initialize(MERMAID_THEME);
      m.default
        .render(`mermaid-${id}`, processed)
        .then(({ svg: rendered }) => {
          if (ref.current) {
            ref.current.innerHTML = rendered;
            addTooltipListeners(ref.current, setTooltip);
          }
          setSvg(rendered);
        })
        .catch(() => {});
    });
  }, [chart, id]);

  // モーダルが開いたらSVGを挿入してリスナーを追加
  useEffect(() => {
    if (!isOpen || !svg || !modalContentRef.current) return;
    modalContentRef.current.innerHTML = svg;
    addTooltipListeners(modalContentRef.current, setTooltip);
  }, [isOpen, svg]);

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
            className="bg-[#FAF6EE] rounded-2xl p-8 max-w-5xl w-full max-h-[90vh] overflow-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <span className="text-[#7A5C3A] text-sm font-medium">エージェント構造マップ</span>
              <button
                onClick={handleClose}
                className="text-[#7A5C3A] hover:text-[#2D1F0E] text-xl font-bold leading-none"
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
          <div className="bg-[#2D1F0E] text-[#FAF6EE] rounded-xl px-4 py-3 shadow-xl max-w-xs text-sm">
            <p className="font-bold text-[#F0DEC4] mb-2">{tooltip.detail.roleName}</p>
            <p className="text-[#D4B896] text-xs leading-relaxed mb-2">
              {tooltip.detail.description}
            </p>
            {tooltip.detail.tools.length > 0 && (
              <div className="mt-1">
                <span className="text-[#B8986A] text-xs">ツール: </span>
                <span className="text-xs">{tooltip.detail.tools.join(", ")}</span>
              </div>
            )}
            {tooltip.detail.calls.length > 0 && (
              <div className="mt-0.5">
                <span className="text-[#B8986A] text-xs">呼び出し先: </span>
                <span className="text-xs">{tooltip.detail.calls.join(", ")}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
