/* ============================================================
   WDC採用サイト — 動画マスターデータ
   ------------------------------------------------------------
   ★ 動画を追加・修正するときは、このファイルだけを編集する。
     HTMLを触る必要はありません。

   【必須項目】
     id      : YouTube動画ID
               例) https://youtu.be/jXjD6gkZr04 → "jXjD6gkZr04"
                   https://www.youtube.com/watch?v=XXXX → "XXXX"
     title   : 動画タイトル（サイト上に表示されます）
     tags    : どのページに出すか（複数指定可・下の一覧参照）

   【任意項目】
     description : 動画の下に出る説明文（省略可）
     date        : 公開日 "YYYY-MM-DD"（新しい順に並びます）
     featured    : true にすると、そのページの先頭に大きく表示

   【tags に指定できる値】
     "top"        → index.html（トップページ）
     "dr"         → dr.html（歯科医師）
     "dh"         → dh.html（歯科衛生士）
     "da"         → da.html（サービススタッフ）
     "director"   → director.html（院長紹介）
     "relocation" → relocation.html（上京支援）
     "sns"        → sns.html（SNS）
     "ai-tuber"   → AI-Tuber発コンテンツの目印（他タグと併記して使う）
   ============================================================ */

window.WDC_VIDEOS = [

  {
    id: "jXjD6gkZr04",
    title: "【歯科衛生士の就活】自分に合った歯科医院の見つけ方｜5つの判断基準",
    description:
      "「どの歯科医院が自分に合っているのか？」\n院長が歯科衛生士の就活で大切にしてほしい5つの判断基準をお話しします。",
    tags: ["dh"],
    date: "2026-07-29",
    featured: true
  }

  // ↓ 新しい動画はこの下に、同じ形でカンマ区切りで追加してください
  // ,{
  //   id: "動画ID",
  //   title: "タイトル",
  //   description: "説明文",
  //   tags: ["dh", "ai-tuber"],
  //   date: "2026-08-01",
  //   featured: false
  // }

];
