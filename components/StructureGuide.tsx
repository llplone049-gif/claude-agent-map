"use client";

import { useState, Fragment } from "react";
import { STRUCTURE_LIST } from "@/lib/structures";

const LEVELS = [...STRUCTURE_LIST.filter((s) => s.level > 0)].sort(
  (a, b) => a.level - b.level
);
const ABILITIES = STRUCTURE_LIST.filter((s) => s.level === 0);

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

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-xs text-[#C96442] border border-[#C96442] rounded-full px-2.5 py-1 hover:bg-[#C96442] hover:text-white transition-colors font-medium whitespace-nowrap"
      >
        育成ガイド
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center pt-8 px-4 pb-8 bg-black/50 backdrop-blur-sm overflow-y-auto"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-[#FAF9F5] border border-[#E8E6DC] rounded-2xl overflow-hidden max-w-md w-full shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* ヘッダー */}
            <div className="bg-[#141413] px-6 py-5 relative overflow-hidden">
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[8rem] font-black text-white opacity-[0.03] leading-none select-none pointer-events-none">
                LV
              </div>
              <p className="text-[10px] text-[#C96442] font-bold tracking-[0.2em] mb-1">AGENT LEVEL ROAD</p>
              <h2 className="text-white font-bold text-lg">エージェント育成ロード</h2>
              <p className="text-[#87867F] text-xs mt-1">構造の成熟度に応じてレベルが上がります</p>
              <button
                onClick={() => setOpen(false)}
                className="absolute top-4 right-5 text-[#5E5D59] hover:text-white text-xl font-bold leading-none transition-colors"
              >
                ×
              </button>
            </div>

            {/* ステッパー */}
            <div className="px-6 py-4 border-b border-[#E8E6DC] bg-[#F5F4ED]">
              <div className="flex items-center">
                {LEVELS.map((level, idx) => (
                  <Fragment key={level.level}>
                    <div className="flex flex-col items-center gap-1 flex-shrink-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black border-2 transition-colors ${
                        level.level === 4
                          ? "bg-[#C96442] border-[#C96442] text-white"
                          : "bg-[#FAF9F5] border-[#D4CEC9] text-[#87867F]"
                      }`}>
                        {level.level === 4 ? "★" : level.level}
                      </div>
                      <span className={`text-[9px] font-semibold ${level.level === 4 ? "text-[#C96442]" : "text-[#87867F]"}`}>
                        {level.level === 4 ? "MAX" : `Lv.${level.level}`}
                      </span>
                    </div>
                    {idx < LEVELS.length - 1 && (
                      <div className="flex-1 flex items-center mb-4 mx-1">
                        <div className="flex-1 h-px bg-[#D4CEC9]" />
                        <span className="text-[#D4CEC9] text-xs mx-0.5">›</span>
                        <div className="flex-1 h-px bg-[#D4CEC9]" />
                      </div>
                    )}
                  </Fragment>
                ))}
              </div>
            </div>

            {/* レベルカード：縦一列 */}
            <div className="flex flex-col">
              {LEVELS.map((info) => {
                const isMax = info.level === 4;
                return (
                  <div
                    key={info.tag}
                    className={`relative px-6 py-4 border-b overflow-hidden ${
                      isMax
                        ? "border-b-0 bg-[#FDF8F6] border-l-2 border-l-[#C96442]"
                        : "border-[#E8E6DC] bg-[#FAF9F5]"
                    }`}
                  >
                    {/* 背景大文字 */}
                    <div className={`absolute right-4 top-1/2 -translate-y-1/2 text-[5rem] font-black leading-none select-none pointer-events-none ${
                      isMax ? "text-[#C96442] opacity-[0.06]" : "text-[#141413] opacity-[0.04]"
                    }`}>
                      {info.level}
                    </div>

                    <div className="relative flex items-start gap-3">
                      {/* レベルバッジ */}
                      <div className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center text-sm font-black ${
                        isMax ? "bg-[#C96442] text-white" : "bg-[#EDEAE4] text-[#87867F]"
                      }`}>
                        {isMax ? "★" : info.level}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className={`text-sm font-bold ${isMax ? "text-[#C96442]" : "text-[#141413]"}`}>
                            {info.tag}
                          </span>
                          <LevelDots level={info.level} />
                        </div>
                        <p className="text-xs text-[#5E5D59] leading-relaxed mb-2">{info.desc}</p>
                        <div className="flex flex-col gap-0.5">
                          <p className="text-[11px] text-[#87867F]">
                            <span className="font-medium">条件</span> — {info.condition}
                          </p>
                          <p className={`text-[11px] font-medium ${isMax ? "text-[#C96442]" : "text-[#5E5D59]"}`}>
                            <span className="opacity-60">解放</span> — {UNLOCKS[info.level]}
                          </p>
                          {info.nextStep && (
                            <p className="text-[11px] text-[#C96442] mt-1">
                              → {info.nextStep}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* アビリティ — レベルとは完全に別枠 */}
            <div className="bg-[#F5F4ED] px-6 py-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex-1 h-px bg-[#D4CEC9]" />
                <p className="text-[10px] text-[#87867F] font-bold tracking-[0.15em] whitespace-nowrap">
                  ABILITIES — レベルとは独立して獲得
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
