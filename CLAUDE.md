# WDC採用サイト — リポジトリガイド

Well-Being Dental Clinic の採用サイト。医療法人社団SDC（理事長・院長：園延昌志）が運営。

- 公開URL: https://recruit.dental-well-being.jp
- ホスティング: Vercel（`main` へ push すると自動デプロイ／約10秒）
- 技術: 静的HTML + CSS + バニラJS（フレームワーク・ビルド工程なし）

## ディレクトリ構成

```
├── index.html          トップ（理念・Vision・数字で見るWB・募集職種）
├── director.html       院長紹介（経歴・出版書籍）
├── dr.html             歯科医師
├── dh.html             歯科衛生士
├── da.html             サービススタッフ（歯科助手）
├── sns.html            SNS（Instagram / YouTube）
├── relocation.html     上京支援
├── apply.html          見学・応募（Google Form埋め込み）
├── css/style.css       全ページ共通スタイル（デザイントークンは :root に定義）
├── js/
│   ├── common.js        ヘッダー・モバイルメニュー・fade-in・カウントアップ
│   └── video-gallery.js 動画ギャラリー描画エンジン（触る必要はほぼ無い）
├── data/
│   └── videos.js       ★ 動画マスターデータ（動画の追加はここだけ）
└── img/                画像
```

## デザイントークン

CSS変数を必ず使う。色をハードコードしない。

| 変数 | 用途 |
|---|---|
| `var(--color-primary)` | メイン `#00CEC9` |
| `var(--color-accent)` | アクセント／CTA `#FF7675` |
| `var(--color-text)` | 本文 |
| `var(--color-text-secondary)` | 補助テキスト |
| `var(--radius-card)` / `var(--shadow-sm)` | カードの角丸・影 |

フォント: Noto Sans JP（和文）／ Inter（英字）
トーン: モダン＆ミニマル寄り。ターゲットは20〜30代。

## 動画の掲載（AI-Tuber連携）

**動画を追加・変更するときは `data/videos.js` だけを編集する。HTMLは触らない。**

各ページには `<div data-video-gallery="タグ名"></div>` が置いてあり、
`data/videos.js` の `tags` に一致した動画が自動で描画される。

```js
{
  id: "YouTube動画ID",
  title: "タイトル",
  description: "説明文（\n で改行）",
  tags: ["dh", "ai-tuber"],   // 掲載先ページ + 出所の目印
  date: "2026-08-01",
  featured: false             // true にするとそのページの先頭に来る
}
```

タグ一覧: `top` / `dr` / `dh` / `da` / `director` / `relocation` / `sns` / `ai-tuber`

- 1本なら大きく1本表示、2本以上なら自動で2カラムグリッド
- 該当動画0本のセクションは自動的に非表示になる
- サムネイル方式（クリックで再生）なのでページ表示速度は落ちない
- 詳しい手順は `.claude/skills/add-video/SKILL.md`

## Git運用

⚠️ **git 操作は `mcp__Desktop_Commander__start_process`（ホストMac側）で実行する。**
サンドボックスの bash は `.git/` への書き込み権限がなく `index.lock` エラーになる。

```bash
cd /Users/masashi/Documents/GitHub/well-being-recruite && \
git config user.email "sonobemasashi@gmail.com" && \
git config user.name "Masashi Sonobe" && \
git add -A && git commit -m "..." && git push origin main
```

ブランチは `main` 一本。push = 本番公開。

## 編集時の約束ごと

- ページ間で共通の要素（ヘッダー・フッター・BENEFITS等）を直すときは、**全ページで揃っているか確認する**
- 新しい繰り返し要素を作るときは、直書きせずデータ + 描画の形にできないか一度検討する
- 画像は `img/` に置き、ファイル名はケバブケース（例: `book-hito-soshiki.jpg`）
- Google Analytics は全ページ `G-XXDCESHDDV` で計測中。新規ページ追加時は head にタグを入れる
- 新規ページを追加したら `sitemap.xml` にも追記する
