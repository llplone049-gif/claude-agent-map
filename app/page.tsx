import { getAgentMaps } from "@/lib/notion";
import MemberCard from "@/components/MemberCard";
import StructureGuide from "@/components/StructureGuide";

export const revalidate = 60;

export default async function Home() {
  const entries = await getAgentMaps();

  return (
    <div className="min-h-screen bg-[#F5F4ED] text-[#141413]">
      {/* ヘッダー */}
      <header className="px-6 pt-8 pb-6 border-b border-[#E8E6DC]">
        <div className="max-w-6xl mx-auto flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
              <span className="text-[#D97757] whitespace-nowrap">ClaudeCode</span>
              <span className="hidden sm:inline text-[#141413]"> Agent Map</span>
              <span className="sm:hidden text-[#141413] block whitespace-nowrap">Agent Map</span>
            </h1>
            <p className="text-[#5E5D59] text-[11px] sm:text-sm mt-0.5 whitespace-nowrap">
              チームのエージェント構造を可視化・共有する
            </p>
          </div>
          <StructureGuide />
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-6xl mx-auto px-6 pt-6 pb-8">
        {entries.length === 0 ? (
          <div className="text-center text-[#5E5D59] py-20">
            <p className="text-4xl mb-4">🤖</p>
            <p>まだデータがありません。</p>
            <p className="text-sm mt-2">
              <code className="bg-[#F0EEE6] border border-[#E8E6DC] px-2 py-1 rounded text-[#4D4C48]">
                /agent-map
              </code>{" "}
              を実行して投稿しましょう。
            </p>
          </div>
        ) : (
          <>
            <div className="flex justify-end mb-4">
              <p className="text-[#5E5D59] text-sm">
                メンバー{" "}
                <span
                  className="font-bold text-[#141413] text-lg"
                  style={{ fontFamily: '"Hiragino Mincho ProN", "Yu Mincho", "YuMincho", "Noto Serif JP", serif' }}
                >
                  {entries.length}
                </span>{" "}
                人
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {entries.map((entry) => (
                <MemberCard key={entry.id} entry={entry} />
              ))}
            </div>
          </>
        )}
      </main>

    </div>
  );
}
