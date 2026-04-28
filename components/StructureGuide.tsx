"use client";

import { useState } from "react";
import { STRUCTURE_LIST } from "@/lib/structures";

const LEVELS = [...STRUCTURE_LIST.filter((s) => s.level > 0)].sort(
  (a, b) => a.level - b.level
);
const ABILITIES = STRUCTURE_LIST.filter((s) => s.level === 0);

function LevelDots({ level, total = 4 }: { level: number; total?: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`w-2 h-2 rounded-full transition-colors ${
            i < level ? "bg-[#C96442]" : "bg-[#E8E6DC]"
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
        レベルガイド
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center pt-8 px-4 pb-8 bg-black/50 backdrop-blur-sm overflow-y-auto"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-[#FAF9F5] border border-[#E8E6DC] rounded-2xl p-6 max-w-2xl w-full shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* ヘッダー */}
            <div className="flex items-start justify-between mb-1">
              <div>
                <h2 className="font-bold text-[#141413] text-lg">Claude Code 活用レベル</h2>
                <p className="text-[#87867F] text-xs mt-0.5">エージェント設計の成熟度を4段階で表します</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-[#5E5D59] hover:text-[#141413] text-xl font-bold leading-none ml-4 mt-0.5"
              >
                ×
              </button>
            </div>

            {/* レベル進行チャート */}
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {LEVELS.map((info, idx) => (
                <div key={info.tag} className="relative">
                  <div className={`border rounded-xl p-4 ${info.color} border-opacity-60`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold opacity-70">Lv.{info.level}</span>
                      <LevelDots level={info.level} />
                    </div>
                    <p className="font-semibold text-sm mb-1">{info.tag}</p>
                    <p className="text-xs opacity-75 mb-2 leading-relaxed">{info.desc}</p>
                    <p className="text-xs opacity-60 border-t border-current border-opacity-20 pt-2">
                      {info.condition}
                    </p>
                    {info.nextStep && (
                      <div className="mt-2 pt-2 border-t border-current border-opacity-20">
                        <p className="text-xs opacity-70">
                          <span className="font-medium">Next →</span> {info.nextStep}
                        </p>
                      </div>
                    )}
                    {idx < LEVELS.length - 1 && (
                      <div className="hidden sm:block absolute -right-2 top-1/2 -translate-y-1/2 z-10 text-[#C96442] text-lg font-bold">
                        ›
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* アビリティ */}
            <div className="mt-5">
              <p className="text-[#87867F] text-xs mb-3">── アビリティ（構造レベルとは別に複数付与あり）──</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {ABILITIES.map((info) => (
                  <div key={info.tag} className="flex gap-2.5 items-start">
                    <span className={`text-xs border px-2 py-0.5 rounded-full font-medium whitespace-nowrap mt-0.5 ${info.color}`}>
                      {info.tag}
                    </span>
                    <p className="text-xs text-[#5E5D59] leading-relaxed">{info.desc}</p>
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
