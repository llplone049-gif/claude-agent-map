"use client";

import { useState } from "react";
import { STRUCTURE_LIST } from "@/lib/structures";

const SECTIONS = [
  {
    label: "── 主構造タイプ（1つ自動判定）──",
    tags: ["フル・ハーネス設計", "ハーネス設計", "マルチエージェント", "シンプル"],
  },
  {
    label: "── 追加タグ（複数付与あり）──",
    tags: ["MCP統合型", "並列分散型", "自律ループ型", "ヒューマンインザループ"],
  },
];

export default function StructureGuide() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-xs text-[#C96442] border border-[#C96442] rounded-full px-2.5 py-1 hover:bg-[#C96442] hover:text-white transition-colors font-medium whitespace-nowrap"
      >
        構造タイプとは？
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center pt-12 px-6 pb-6 bg-black/50 backdrop-blur-sm overflow-y-auto"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-[#FAF9F5] border border-[#E8E6DC] rounded-2xl p-6 max-w-lg w-full shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-[#141413] text-lg">構造タイプ一覧</h2>
              <button
                onClick={() => setOpen(false)}
                className="text-[#5E5D59] hover:text-[#141413] text-xl font-bold leading-none"
              >
                ×
              </button>
            </div>

            <div className="flex flex-col gap-6">
              {SECTIONS.map((section) => (
                <div key={section.label}>
                  <p className="text-[#87867F] text-xs mb-3">{section.label}</p>
                  <div className="flex flex-col gap-4">
                    {section.tags.map((tag) => {
                      const info = STRUCTURE_LIST.find((s) => s.tag === tag);
                      if (!info) return null;
                      return (
                        <div key={tag} className="flex flex-col gap-1">
                          <span className={`self-start text-xs border px-2.5 py-1 rounded-full font-medium ${info.color}`}>
                            {info.tag}
                          </span>
                          <p className="text-[#4D4C48] text-xs">{info.condition}</p>
                          <p className="text-[#141413] text-sm leading-relaxed">{info.desc}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-5 text-[#87867F] text-xs border-t border-[#E8E6DC] pt-4">
              構造タイプは <code className="bg-[#F0EEE6] px-1 rounded">scanner.py</code> が自動判定します。
            </p>
          </div>
        </div>
      )}
    </>
  );
}
