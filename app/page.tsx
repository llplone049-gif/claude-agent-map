import { getAgentMaps } from "@/lib/notion";
import MemberCard from "@/components/MemberCard";
import StructureGuide from "@/components/StructureGuide";

export const revalidate = 300;

export default async function Home() {
  const entries = await getAgentMaps();

  const totalWeekTokens = entries.reduce((s, e) => s + e.weekTokens, 0);
  const totalTodayTokens = entries.reduce((s, e) => s + e.todayTokens, 0);

  function fmt(n: number) {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(0)}k`;
    return String(n);
  }

  return (
    <div className="min-h-screen bg-[#F5EDE0] text-[#2D1F0E]">
      {/* ヘッダー */}
      <header className="border-b border-[#E2D0BA] bg-[#F5EDE0] px-6 py-5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight">
                <span className="text-[#D4671B]">ClaudeCode</span>
                <span className="text-[#2D1F0E]"> Agent Map</span>
              </h1>
              <StructureGuide />
            </div>
            <p className="text-[#9A7A5A] text-sm mt-0.5">
              チームのエージェント構造を可視化・共有する
            </p>
          </div>
          <div className="flex gap-6 text-right">
            <div>
              <p className="text-[#9A7A5A] text-xs">チーム 今日</p>
              <p className="font-bold text-lg text-[#2D1F0E]">{fmt(totalTodayTokens)}</p>
              <p className="text-[#B8986A] text-xs">tokens</p>
            </div>
            <div>
              <p className="text-[#9A7A5A] text-xs">チーム 今週</p>
              <p className="font-bold text-lg text-[#2D1F0E]">{fmt(totalWeekTokens)}</p>
              <p className="text-[#B8986A] text-xs">tokens</p>
            </div>
            <div>
              <p className="text-[#9A7A5A] text-xs">メンバー</p>
              <p className="font-bold text-lg text-[#2D1F0E]">{entries.length}</p>
              <p className="text-[#B8986A] text-xs">人</p>
            </div>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {entries.length === 0 ? (
          <div className="text-center text-[#9A7A5A] py-20">
            <p className="text-4xl mb-4">🤖</p>
            <p>まだデータがありません。</p>
            <p className="text-sm mt-2">
              <code className="bg-[#EFE4D2] border border-[#E2D0BA] px-2 py-1 rounded text-[#7A5C3A]">
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
      <footer className="border-t border-[#E2D0BA] px-6 py-4 text-center text-[#B8986A] text-xs">
        Agent Map v1.0 — CC-Company内部ツール。プロンプトやファイル内容は共有されません。
      </footer>
    </div>
  );
}
