---
name: add-video
description: 採用サイト（recruit.dental-well-being.jp）に YouTube 動画を掲載する。「この動画を衛生士ページに追加して」「AI-Tuberの新作をサイトに載せて」「動画を差し替えて」「動画を削除して」などの依頼で使用する。AI-Tuberで制作した動画を採用サイトへ反映するときの標準ワークフロー。
---

# 採用サイトへの動画掲載

WDC採用サイトに YouTube 動画を掲載・更新・削除するためのワークフロー。
**HTMLは一切触らない。`data/videos.js` の編集だけで全ページに反映される。**

## 前提

- リポジトリ: `/Users/masashi/Documents/GitHub/well-being-recruite`
- 公開URL: https://recruit.dental-well-being.jp
- ホスティング: Vercel（`main` へ push すると自動デプロイ・所要約10秒）
- ⚠️ **git 操作は必ず `mcp__Desktop_Commander__start_process` を使う。**
  サンドボックスの bash は `.git/` への書き込み権限がなく失敗する。

## 手順

### 1. 動画情報を確定する

ユーザーから受け取った URL から YouTube 動画IDを抽出する。

| URL の形 | 動画ID |
|---|---|
| `https://youtu.be/jXjD6gkZr04` | `jXjD6gkZr04` |
| `https://www.youtube.com/watch?v=jXjD6gkZr04` | `jXjD6gkZr04` |
| `https://www.youtube.com/live/xxxx` | `xxxx` |

タイトル・説明文が指定されていない場合は、URL を `mcp__workspace__web_fetch` で取得して
実際のタイトルを確認する。**推測でタイトルを書かない。**

掲載先が指定されていない場合のみ、`AskUserQuestion` で1回だけ確認する。

### 2. `data/videos.js` を編集する

配列の末尾に追記する（`Edit` ツールを使用）。

```js
{
  id: "動画ID",
  title: "動画タイトル",
  description: "動画の上に出る説明文。\n改行は \\n で書く。",
  tags: ["dh", "ai-tuber"],
  date: "2026-08-01",
  featured: false
}
```

**tags に指定できる値:**

| タグ | 掲載先ページ |
|---|---|
| `top` | index.html（トップ） |
| `dr` | dr.html（歯科医師） |
| `dh` | dh.html（歯科衛生士） |
| `da` | da.html（サービススタッフ） |
| `director` | director.html（院長紹介） |
| `relocation` | relocation.html（上京支援） |
| `sns` | sns.html |
| `ai-tuber` | AI-Tuber発コンテンツの目印（掲載先タグと**併記**して使う） |

複数ページに出したいときは `tags: ["dh", "da"]` のように並べる。

**並び順のルール:**
- `featured: true` の動画が先頭に来る
- あとは `date` の新しい順
- 各ページ1本だけのときは大きく1本表示、2本以上で2カラムのグリッドに自動で切り替わる

### 3. 掲載セクションが無いページの場合

そのページに動画セクションがまだ無いなら、HTML に以下を1ブロック追加する
（既にあるページに追加する場合はこの手順は不要）。

```html
  <!-- ===== COLUMN / MOVIE ===== -->
  <!-- 動画の追加・変更は data/videos.js のみで完結します（HTMLの編集は不要） -->
  <section class="section fade-in" data-video-section>
    <div class="container">
      <div class="section-heading">
        <span class="section-heading__en">COLUMN</span>
        <h2 class="section-heading__title">セクション見出し</h2>
      </div>
      <div data-video-gallery="タグ名"></div>
    </div>
  </section>
```

背景を交互にしたい場合は `class="section section--alt fade-in"` を使う。
`data-limit="3"` を `data-video-gallery` と同じ div に付けると表示件数を絞れる。

該当タグの動画が0本のときはセクションごと自動で非表示になるので、
「動画がまだ無いページに先にセクションだけ用意しておく」ことも安全にできる。

### 4. コミット & デプロイ

```bash
cd /Users/masashi/Documents/GitHub/well-being-recruite && \
git config user.email "sonobemasashi@gmail.com" && \
git config user.name "Masashi Sonobe" && \
git add -A && \
git commit -m "feat: 動画「タイトル」を◯◯ページに追加" && \
git push origin main
```

必ず `mcp__Desktop_Commander__start_process` 経由で実行する。

### 5. 確認して報告

push 後、Vercel が自動でデプロイする（約10秒）。
必要なら Vercel MCP の `get_deployment` で READY を確認する。

ユーザーには「どのページのどこに載ったか」と該当ページの URL を短く伝える。

## よくある依頼と対応

| 依頼 | 対応 |
|---|---|
| 「この動画を衛生士ページに」 | `tags: ["dh"]` で追記 |
| 「トップにも出して」 | 既存エントリの tags に `"top"` を追加 |
| 「一番上に表示して」 | 該当エントリを `featured: true` に。他の `featured` は false に戻す |
| 「あの動画を下げて」 | 該当エントリを配列から削除、または tags から該当ページのタグを外す |
| 「説明文を直して」 | 該当エントリの `description` を書き換えるだけ |

## やってはいけないこと

- HTML に `<iframe>` を直書きする（データが分散して管理不能になる）
- サンドボックスの bash で git を叩く（権限エラーになる）
- 動画タイトルを推測で書く（必ず実際のページを確認する）
