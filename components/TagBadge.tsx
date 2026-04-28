"use client";

import { useState } from "react";
import { STRUCTURE_MAP } from "@/lib/structures";

export default function TagBadge({ tag }: { tag: string }) {
  const [open, setOpen] = useState(false);
  const info = STRUCTURE_MAP[tag];

  const colorClass = info?.color ?? "bg-stone-100 text-stone-600 border-stone-300";

  return (
    <>
      <span
        className={`inline-flex items-center gap-1 text-xs border px-2 py-0.5 rounded-full font-medium whitespace-nowrap cursor-pointer hover:opacity-80 transition-opacity ${colorClass}`}
        onClick={() => info && setOpen(true)}
        title={info ? "クリックで詳細表示" : undefined}
      >
        {tag}
        {info && <span className="opacity-50 text-[10px]">ⓘ</span>}
      </span>

      {open && info && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-[#FAF9F5] border border-[#E8E6DC] rounded-2xl p-6 max-w-sm w-full shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <span className={`text-xs border px-2.5 py-1 rounded-full font-medium ${colorClass}`}>
                {info.tag}
              </span>
              <button
                onClick={() => setOpen(false)}
                className="text-[#5E5D59] hover:text-[#141413] text-xl font-bold leading-none ml-4"
              >
                ×
              </button>
            </div>
            <p className="text-[#4D4C48] text-xs mb-3">{info.condition}</p>
            <p className="text-[#141413] text-sm leading-relaxed">{info.desc}</p>
          </div>
        </div>
      )}
    </>
  );
}
