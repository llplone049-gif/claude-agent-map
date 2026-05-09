"use client";

export const STRUCTURE_GUIDE_OPEN_EVENT = "agent-map:open-structure-guide";

export default function LvBadge({ level }: { level: number }) {
  if (level <= 0) return null;
  return (
    <button
      type="button"
      onClick={() => {
        window.dispatchEvent(new CustomEvent(STRUCTURE_GUIDE_OPEN_EVENT, { detail: { level } }));
      }}
      className="inline-flex items-center gap-2 bg-[#D97757] hover:bg-[#C26642] text-white rounded-xl px-4 py-2 text-sm font-medium shadow-sm shrink-0 transition-colors cursor-pointer"
      title="育成ガイドを開く"
    >
      <img src="/icons/level-mascot.svg" alt="" className="h-3.5 w-auto" />
      <span className="flex items-baseline gap-0.5">
        Lv.
        <span style={{ fontFamily: '"Hiragino Mincho ProN", "Yu Mincho", "YuMincho", "Noto Serif JP", serif' }}>
          {level}
        </span>
      </span>
    </button>
  );
}
