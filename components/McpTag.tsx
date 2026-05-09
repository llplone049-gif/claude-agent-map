"use client";

import { useRef, useState } from "react";

export default function McpTag({ name, desc }: { name: string; desc: string }) {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const ref = useRef<HTMLSpanElement | null>(null);

  return (
    <span
      ref={ref}
      onMouseEnter={() => {
        const r = ref.current?.getBoundingClientRect();
        if (r) setPos({ x: r.left, y: r.top });
      }}
      onMouseLeave={() => setPos(null)}
      className="relative inline-flex items-center gap-1 text-[11px] bg-[#F2F0E8] text-[#9D8E5A] border border-[#E0DCCC] px-2 py-0.5 rounded-md cursor-default select-none whitespace-nowrap font-medium"
    >
      {name}
      <span className="opacity-50 text-[10px]">ⓘ</span>
      {desc && pos && (
        <span
          className="fixed z-50 pointer-events-none"
          style={{ left: pos.x, top: pos.y, transform: "translate(0, calc(-100% - 8px))" }}
        >
          <span className="block bg-[#141413] text-[#FAF9F5] text-xs rounded-lg px-3 py-2 shadow-xl leading-relaxed whitespace-nowrap">
            {desc}
          </span>
          <span className="block w-2 h-2 bg-[#141413] rotate-45 ml-3 -mt-1" />
        </span>
      )}
    </span>
  );
}
