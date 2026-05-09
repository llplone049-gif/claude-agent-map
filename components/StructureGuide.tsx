"use client";

import { useState, useEffect, Fragment } from "react";
import { STRUCTURE_LIST } from "@/lib/structures";
import { STRUCTURE_GUIDE_OPEN_EVENT } from "./LvBadge";

const LEVELS = [...STRUCTURE_LIST.filter((s) => s.level > 0)].sort(
  (a, b) => a.level - b.level
);
const ABILITIES = STRUCTURE_LIST.filter((s) => s.level === 0);

function LevelStructureIcon({ level }: { level: number }) {
  const src = `/icons/ag-${Math.min(level, 4)}.svg`;
  const widthClass = level === 1 ? "w-20" : "w-40";
  const rightClass = level === 1 ? "right-16" : "right-6";
  return (
    <img
      src={src}
      alt=""
      className={`absolute ${rightClass} top-1/2 -translate-y-1/2 ${widthClass} h-auto opacity-50 pointer-events-none select-none`}
    />
  );
}

const ABILITY_ICONS: Record<string, string> = {
  "MCP統合型": "🔌",
  "並列分散型": "⚡",
  "自律ループ型": "🔄",
  "ヒューマンインザループ": "👤",
};

const UNLOCKS: Record<number, string> = {
  1: "AI補佐の基本動作",
  2: "専門分業 + 並列処理",
  3: "指揮系統 + 自律実行",
  4: "多層自律組織 + 完全ハーネス",
};

function LevelDots({ level, total = 4 }: { level: number; total?: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`w-2 h-2 rounded-full transition-colors ${
            i < level ? "bg-[#C96442]" : "bg-[#D4CEC9]"
          }`}
        />
      ))}
    </div>
  );
}

export default function StructureGuide() {
  const [open, setOpen] = useState(false);
  const [highlightLevel, setHighlightLevel] = useState<number | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ level?: number }>).detail;
      setHighlightLevel(detail?.level ?? null);
      setOpen(true);
    };
    window.addEventListener(STRUCTURE_GUIDE_OPEN_EVENT, handler);
    return () => window.removeEventListener(STRUCTURE_GUIDE_OPEN_EVENT, handler);
  }, []);

  return (
    <>
      <button
        onClick={() => { setHighlightLevel(null); setOpen(true); }}
        className="inline-flex items-center gap-2 text-sm text-white bg-[#D97757] hover:bg-[#C26642] rounded-full px-5 py-2.5 transition-colors font-medium whitespace-nowrap shadow-sm cursor-pointer"
      >
        <img src="/icons/level-mascot.svg" alt="" className="h-3.5 w-auto" />
        育成ガイド
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center pt-8 px-4 pb-8 bg-black/50 backdrop-blur-sm overflow-y-auto"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-[#FAF9F5] border border-[#E8E6DC] rounded-2xl overflow-hidden max-w-3xl w-full shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* ヘッダー */}
            <div className="bg-[#141413] px-6 py-5 relative overflow-hidden">
              <div className="absolute right-12 top-1/2 -translate-y-1/2 flex items-end gap-3 opacity-20 pointer-events-none select-none">
                <img src="/icons/level-mascot-2.svg" alt="" className="h-12 w-auto" style={{ filter: "brightness(0) invert(0.4)" }} />
                <img src="/icons/level-mascot-2.svg" alt="" className="h-20 w-auto" style={{ filter: "brightness(0) invert(0.4)" }} />
              </div>
              <p className="text-[10px] text-[#C96442] font-bold tracking-[0.2em] mb-1">Agent Level Guide</p>
              <h2 className="text-white font-bold text-lg">エージェント育成ガイド</h2>
              <p className="text-[#87867F] text-xs mt-1">エージェント構造の成熟度に応じてレベルアップしていきます</p>
              <button
                onClick={() => setOpen(false)}
                className="absolute top-4 right-5 text-[#5E5D59] hover:text-white text-xl font-bold leading-none transition-colors"
              >
                ×
              </button>
            </div>

            {/* レベルカード：縦一列 */}
            <div className="flex flex-col">
              {LEVELS.map((info, idx) => {
                const isMax = info.level === highlightLevel;
                return (
                  <Fragment key={info.tag}>
                  <div
                    className={`relative px-6 py-6 border-b overflow-hidden ${
                      isMax
                        ? "border-b-0 bg-[#FDF8F6] border-l-2 border-l-[#C96442]"
                        : "border-[#E8E6DC] bg-[#FAF9F5]"
                    }`}
                  >
                    <LevelStructureIcon level={info.level} />
                    <div className="relative flex items-start gap-5">
                      {/* レベルバッジ */}
                      <div className={`relative z-10 flex-shrink-0 w-12 h-12 rounded-xl flex items-end justify-center gap-0.5 font-bold pb-[11px] ${
                        isMax ? "bg-[#C96442] text-white" : "bg-[#EDEAE4] text-[#87867F]"
                      }`}>
                        <span className="text-xs leading-none">Lv.</span>
                        <span
                          className="text-2xl leading-none"
                          style={{ fontFamily: '"Hiragino Mincho ProN", "Yu Mincho", "YuMincho", "Noto Serif JP", serif' }}
                        >
                          {info.level}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0 pr-44">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className={`text-sm font-bold ${isMax ? "text-[#C96442]" : "text-[#141413]"}`}>
                            {info.tag}
                          </span>
                        </div>
                        <p className="text-xs text-[#5E5D59] leading-relaxed mb-2">{info.desc}</p>
                        <div className="flex flex-col gap-0.5">
                          <p className="text-[11px] font-medium text-[#5E5D59]">
                            <span className="opacity-60">達成の基準</span> — {info.condition}
                          </p>
                          <p className="text-[11px] font-medium text-[#5E5D59]">
                            <span className="opacity-60">獲得した能力</span> — {UNLOCKS[info.level]}
                          </p>
                          {info.nextStep && (
                            <p className="text-[11px] text-[#C96442] mt-1 font-bold">
                              → レベルアップのヒント：{info.nextStep}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  </Fragment>
                );
              })}
            </div>

            {/* アビリティ — レベルとは完全に別枠 */}
            <div className="bg-[#F5F4ED] px-6 py-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex-1 h-px bg-[#D4CEC9]" />
                <p className="text-[10px] text-[#87867F] font-bold tracking-[0.15em] whitespace-nowrap">
                  ABILITIES ／ エージェントを上手に活用する能力
                </p>
                <div className="flex-1 h-px bg-[#D4CEC9]" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                {ABILITIES.map((info) => (
                  <div
                    key={info.tag}
                    className="bg-[#FAF9F5] border border-[#E8E6DC] rounded-xl px-3 py-2.5"
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-base leading-none">{ABILITY_ICONS[info.tag]}</span>
                      <span className="text-xs font-bold text-[#141413] leading-tight">{info.tag}</span>
                    </div>
                    <p className="text-[11px] text-[#87867F] leading-relaxed">{info.condition}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
