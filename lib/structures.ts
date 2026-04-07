export interface StructureInfo {
  tag: string;
  color: string;
  condition: string;
  desc: string;
}

export const STRUCTURE_LIST: StructureInfo[] = [
  {
    tag: "マルチPM・ハーネス",
    color: "bg-orange-100 text-orange-800 border-orange-300",
    condition: "条件:エージェント7体以上、PM・ライター・リサーチャーなどがそろっている",
    desc: "プロジェクトごとにPMが存在し、リサーチ→執筆→品質チェックの一連フローを自律実行できる最上位構造。",
  },
  {
    tag: "ハーネス構造",
    color: "bg-amber-100 text-amber-800 border-amber-300",
    condition: "条件:PM＋ライターなどがいる、または呼び出し先が2体以上あるなど",
    desc: "指揮役エージェントが複数の専門エージェントを束ねて動かす構造。部分的な自律化が進んでいる状態。",
  },
  {
    tag: "マルチエージェント",
    color: "bg-lime-100 text-lime-800 border-lime-300",
    condition: "条件:エージェントが3体以上存在するなど",
    desc: "複数のエージェントが並立しているが、明確な指揮系統はまだ整っていない状態。",
  },
  {
    tag: "シンプル",
    color: "bg-stone-100 text-stone-600 border-stone-300",
    condition: "条件:エージェントが2体以下など",
    desc: "単体または補助エージェント1体の最小構成。スモールスタートやテスト段階に多い。",
  },
  {
    tag: "MCP統合型",
    color: "bg-sky-100 text-sky-800 border-sky-300",
    condition: "条件:MCPサーバーが3つ以上接続されているなど",
    desc: "Notion・Playwright・ObsidianなどのMCPで外部ツールと深く統合されている構造。2025年にMCPが標準化され重要な指標に。",
  },
  {
    tag: "並列分散型",
    color: "bg-violet-100 text-violet-800 border-violet-300",
    condition: "条件:エージェント間の呼び出し合計が5以上など",
    desc: "複数のエージェントが同時・並列で動く構造。処理速度と専門性を両立できる。",
  },
  {
    tag: "自律ループ型",
    color: "bg-rose-100 text-rose-800 border-rose-300",
    condition: "条件:差し戻し・品質チェック・再試行のロジックがあるなど",
    desc: "エージェント自身がアウトプットを評価し、基準未達なら自動で差し戻し・再実行するフィードバックループを持つ構造。",
  },
  {
    tag: "ヒューマンインザループ",
    color: "bg-teal-100 text-teal-800 border-teal-300",
    condition: "条件:人間への確認・承認ステップが組み込まれているなど",
    desc: "AIが完全自律で動くのではなく、要所で人間の判断を挟む設計。品質・安全性を担保しながらAIを活用する現実的な構造。",
  },
];

export const STRUCTURE_MAP = Object.fromEntries(
  STRUCTURE_LIST.map((s) => [s.tag, s])
);
