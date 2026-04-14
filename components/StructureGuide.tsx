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
        className="text-xs text-[#D4671B] border border-[#D4671B] rounded-full px-2.5 py-1 hover:bg-[#D4671B] hover:text-white transition-colors font-medium whitespace-nowrap"
      >
        構造タイプとは？
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center pt-12 px-6 pb-6 bg-black/50 backdrop-blur-sm overflow-y-auto"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-[#FAF6EE] border border-[#E2D0BA] rounded-2xl p-6 max-w-lg w-full shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-[#2D1F0E] text-lg">構造タイプ一覧</h2>
              <button
                onClick={() => setOpen(false)}
                className="text-[#9A7A5A] hover:text-[#2D1F0E] text-xl font-bold leading-none"
              >
                ×
              </button>
            </div>

            <div className="flex flex-col gap-6">
              {SECTIONS.map((section) => (
                <div key={section.label}>
                  <p className="text-[#B8986A] text-xs mb-3">{section.label}</p>
                  <div className="flex flex-col gap-4">
                    {section.tags.map((tag) => {
                      const info = STRUCTURE_LIST.find((s) => s.tag === tag);
                      if (!info) return null;
                      return (
                        <div key={tag} className="flex flex-col gap-1">
                          <span className={`self-start text-xs border px-2.5 py-1 rounded-full font-medium ${info.color}`}>
                            {info.tag}
                          </span>
                          <p className="text-[#7A5C3A] text-xs">{info.condition}</p>
                          <p className="text-[#2D1F0E] text-sm leading-relaxed">{info.desc}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-5 text-[#B8986A] text-xs border-t border-[#E2D0BA] pt-4">
              構造タイプは <code className="bg-[#F0E4D0] px-1 rounded">scanner.py</code> が自動判定します。
            </p>
          </div>
        </div>
      )}
    </>
  );
}
