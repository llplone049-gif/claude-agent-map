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
        className={`text-xs border px-2 py-0.5 rounded-full font-medium whitespace-nowrap cursor-pointer hover:opacity-80 transition-opacity ${colorClass}`}
        onClick={() => info && setOpen(true)}
        title={info ? "クリックで詳細表示" : undefined}
      >
        {tag}
      </span>

      {open && info && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-[#FAF6EE] border border-[#E2D0BA] rounded-2xl p-6 max-w-sm w-full shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <span className={`text-xs border px-2.5 py-1 rounded-full font-medium ${colorClass}`}>
                {info.tag}
              </span>
              <button
                onClick={() => setOpen(false)}
                className="text-[#9A7A5A] hover:text-[#2D1F0E] text-xl font-bold leading-none ml-4"
              >
                ×
              </button>
            </div>
            <p className="text-[#7A5C3A] text-xs mb-3">{info.condition}</p>
            <p className="text-[#2D1F0E] text-sm leading-relaxed">{info.desc}</p>
          </div>
        </div>
      )}
    </>
  );
}
