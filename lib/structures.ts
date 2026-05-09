export interface StructureInfo {
  tag: string;
  level: number; // 1-4 for main structure levels, 0 for ability tags
  color: string;
  condition: string;
  desc: string;
  nextStep?: string; // hint for leveling up (undefined = top level)
}

export const STRUCTURE_LIST: StructureInfo[] = [
  {
    tag: "フル・ハーネス設計",
    level: 4,
    color: "bg-orange-100 text-orange-800 border-orange-300",
    condition: "エージェント7体以上 + 複数の指揮層",
    desc: "指揮役→複数PM→専門エージェントという多層構造。各層が自律的に動く、Claude Codeで実現できる最上位の設計。",
  },
  {
    tag: "ハーネス設計",
    level: 3,
    color: "bg-amber-100 text-amber-800 border-amber-300",
    condition: "1つの指揮役が2体以上のサブエージェントを呼び出す",
    desc: "1つの指揮役が複数の専門エージェントを束ねるハーネス構造。Claude Code公式が推奨するエージェント設計パターン。",
    nextStep: "指揮層を多段化し、7体以上のエージェントチームを作ろう",
  },
  {
    tag: "マルチエージェント",
    level: 2,
    color: "bg-lime-100 text-lime-800 border-lime-300",
    condition: "エージェントが3体以上存在する",
    desc: "複数のエージェントが並立しているが、明確な指揮系統はまだ整っていない状態。",
    nextStep: "1体の指揮役PMを作り、複数エージェントを束ねる構造にしよう",
  },
  {
    tag: "シンプル",
    level: 1,
    color: "bg-stone-100 text-stone-600 border-stone-300",
    condition: "エージェントが2体以下",
    desc: "単体または補助エージェント1体の最小構成。スモールスタートやテスト段階に多い。",
    nextStep: "専門エージェントを3体以上追加してみよう",
  },
  {
    tag: "MCP統合型",
    level: 0,
    color: "bg-sky-100 text-sky-800 border-sky-300",
    condition: "MCPサーバーが3つ以上接続されている",
    desc: "Notion・Playwright・ObsidianなどのMCPで外部ツールと深く統合されている構造。",
  },
  {
    tag: "並列分散型",
    level: 0,
    color: "bg-violet-100 text-violet-800 border-violet-300",
    condition: "エージェント間の呼び出し合計が5以上",
    desc: "複数のエージェントが同時・並列で動く構造。処理速度と専門性を両立できる。",
  },
  {
    tag: "自律ループ型",
    level: 0,
    color: "bg-rose-100 text-rose-800 border-rose-300",
    condition: "差し戻し・品質チェック・再試行のロジックがある",
    desc: "エージェント自身がアウトプットを評価し、基準未達なら自動で差し戻し・再実行するフィードバックループを持つ。",
  },
  {
    tag: "ヒューマンインザループ",
    level: 0,
    color: "bg-teal-100 text-teal-800 border-teal-300",
    condition: "人間への確認・承認ステップが組み込まれている",
    desc: "AIが完全自律で動くのではなく、要所で人間の判断を挟む設計。品質・安全性を担保しながらAIを活用する現実的な構造。",
  },
  {
    tag: "常時稼働型",
    level: 0,
    color: "bg-yellow-100 text-yellow-800 border-yellow-300",
    condition: "/loop・cron・Routines で常駐実行中のエージェントが1つ以上ある",
    desc: "ヒトの起動指示を待たず、スケジュールやイベント駆動でエージェントが自走する設計。情報収集・監視・定型業務の完全自動化に向く。",
  },
  {
    tag: "自己評価型",
    level: 0,
    color: "bg-pink-100 text-pink-800 border-pink-300",
    condition: "生成と評価を別エージェントに分離した批評ループが組まれている",
    desc: "Anthropic推奨の3エージェント構成（Plan/Generate/Evaluate）。生成側と評価側を切り離すことで、品質を自動的に押し上げるフィードバック構造。",
  },
  {
    tag: "配布可能型",
    level: 0,
    color: "bg-indigo-100 text-indigo-800 border-indigo-300",
    condition: "Skill / Plugin 形式でパッケージ化し、Git や Marketplace で配布している",
    desc: "自分のエージェントやスキルを他環境でも再利用できる形に外出ししている設計。チーム共有・OSS化・社内資産化の入り口。",
  },
];

export const STRUCTURE_MAP = Object.fromEntries(
  STRUCTURE_LIST.map((s) => [s.tag, s])
);
