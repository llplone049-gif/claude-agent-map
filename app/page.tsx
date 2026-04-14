import { getAgentMaps } from "@/lib/notion";
import MemberCard from "@/components/MemberCard";
import StructureGuide from "@/components/StructureGuide";

export const revalidate = 60;

export default async function Home() {
  const entries = await getAgentMaps();

  return (
    <div className="min-h-screen bg-[#F5F4ED] text-[#141413]">
      {/* ヘッダー */}
      <header className="border-b border-[#E8E6DC] bg-[#F5F4ED] px-6 py-5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight">
                <span className="text-[#C96442]">ClaudeCode</span>
                <span className="text-[#141413]"> Agent Map</span>
              </h1>
              <StructureGuide />
            </div>
            <p className="text-[#5E5D59] text-sm mt-0.5">
              チームのエージェント構造を可視化・共有する
            </p>
          </div>
          <div>
            <p className="text-[#5E5D59] text-xs">メンバー</p>
            <p className="font-bold text-lg text-[#141413]">{entries.length}</p>
            <p className="text-[#87867F] text-xs">人</p>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-6xl mx-auto px-6 py-8">
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
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {entries.map((entry) => (
              <MemberCard key={entry.id} entry={entry} />
            ))}
          </div>
        )}
      </main>

      {/* フッター */}
      <footer className="border-t border-[#E8E6DC] px-6 py-4 text-center text-[#87867F] text-xs">
        Agent Map v1.0 — CC-Company内部ツール。プロンプトやファイル内容は共有されません。
      </footer>
    </div>
  );
}
