/* ============================================================
   WDC採用サイト — 動画ギャラリー共通コンポーネント
   ------------------------------------------------------------
   HTMLに次の1行を置くだけで、該当タグの動画が自動で並びます。

     <div data-video-gallery="dh"></div>

   オプション属性:
     data-limit="3"      表示件数の上限（省略時は全件）
     data-layout="grid"  "grid"（並べる）/ "single"（1本だけ大きく）
                         省略時は自動判定（1本ならsingle、複数ならgrid）

   ※ 動画の追加・編集は data/videos.js のみで完結します。
   ※ サムネイル方式（クリックで再生）なのでページ表示は重くなりません。
   ============================================================ */

(function () {
  'use strict';

  var YT_THUMB = function (id) {
    return 'https://i.ytimg.com/vi/' + id + '/maxresdefault.jpg';
  };
  var YT_THUMB_FALLBACK = function (id) {
    return 'https://i.ytimg.com/vi/' + id + '/hqdefault.jpg';
  };
  var YT_EMBED = function (id) {
    return 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0&playsinline=1';
  };

  /** 指定タグの動画を、featured優先 → 日付の新しい順で取り出す */
  function pickVideos(tag, limit) {
    var all = window.WDC_VIDEOS || [];
    var list = all.filter(function (v) {
      return v && v.id && Array.isArray(v.tags) && v.tags.indexOf(tag) !== -1;
    });

    list.sort(function (a, b) {
      if (!!b.featured !== !!a.featured) return b.featured ? 1 : -1;
      return String(b.date || '').localeCompare(String(a.date || ''));
    });

    return limit > 0 ? list.slice(0, limit) : list;
  }

  /** 改行を <br> に変換しつつHTMLエスケープ */
  function escapeText(str) {
    var div = document.createElement('div');
    div.textContent = String(str == null ? '' : str);
    return div.innerHTML.replace(/\n/g, '<br>');
  }

  /** 動画カード1枚を組み立てる */
  function buildCard(video, isSingle, isFirst) {
    var card = document.createElement('div');
    card.className = 'video-card' + (isSingle ? ' video-card--single' : '');

    // --- 説明文（single時は動画の上、grid時は動画の下に回る） ---
    if (video.description) {
      var desc = document.createElement('p');
      desc.className = 'video-card__desc';
      desc.innerHTML = escapeText(video.description);
      card.appendChild(desc);
    }

    // --- サムネイル（クリックで再生） ---
    var frame = document.createElement('div');
    frame.className = 'video-card__frame';
    frame.setAttribute('role', 'button');
    frame.setAttribute('tabindex', '0');
    frame.setAttribute('aria-label', video.title + ' を再生');

    var thumb = document.createElement('img');
    thumb.className = 'video-card__thumb';
    thumb.src = YT_THUMB(video.id);
    thumb.alt = video.title;
    // 先頭の1本だけは即読込（メインで見せる動画なので待たせない）
    thumb.loading = isFirst ? 'eager' : 'lazy';
    thumb.onerror = function () {
      thumb.onerror = null;
      thumb.src = YT_THUMB_FALLBACK(video.id);
    };

    var play = document.createElement('span');
    play.className = 'video-card__play';
    play.innerHTML =
      '<svg viewBox="0 0 68 48" width="68" height="48" aria-hidden="true">' +
      '<path class="video-card__play-bg" d="M66.5 7.7a8.6 8.6 0 0 0-6-6C55.2 0 34 0 34 0S12.8 0 7.5 1.7a8.6 8.6 0 0 0-6 6A90 90 0 0 0 0 24a90 90 0 0 0 1.5 16.3 8.6 8.6 0 0 0 6 6C12.8 48 34 48 34 48s21.2 0 26.5-1.7a8.6 8.6 0 0 0 6-6A90 90 0 0 0 68 24a90 90 0 0 0-1.5-16.3z"/>' +
      '<path d="M45 24 27 14v20z" fill="#fff"/></svg>';

    frame.appendChild(thumb);
    frame.appendChild(play);

    function playVideo() {
      var iframe = document.createElement('iframe');
      iframe.src = YT_EMBED(video.id);
      iframe.title = video.title;
      iframe.setAttribute('frameborder', '0');
      iframe.setAttribute(
        'allow',
        'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
      );
      iframe.setAttribute('allowfullscreen', '');
      iframe.className = 'video-card__iframe';
      frame.innerHTML = '';
      frame.appendChild(iframe);
      frame.removeAttribute('role');
      frame.removeAttribute('tabindex');
    }

    frame.addEventListener('click', playVideo);
    frame.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        playVideo();
      }
    });

    card.appendChild(frame);

    // --- タイトル（動画の下に小さく） ---
    var title = document.createElement('p');
    title.className = 'video-card__title';
    title.textContent = video.title;
    card.appendChild(title);

    return card;
  }

  /** ページ内のプレースホルダをすべて描画 */
  function render() {
    var slots = document.querySelectorAll('[data-video-gallery]');

    Array.prototype.forEach.call(slots, function (slot) {
      var tag = slot.getAttribute('data-video-gallery');
      var limit = parseInt(slot.getAttribute('data-limit'), 10) || 0;
      var videos = pickVideos(tag, limit);

      // 該当動画がなければセクションごと非表示（空セクションを出さない）
      if (!videos.length) {
        var emptyHost = slot.closest('[data-video-section]') || slot;
        emptyHost.style.display = 'none';
        return;
      }

      var layout = slot.getAttribute('data-layout');
      if (layout !== 'grid' && layout !== 'single') {
        layout = videos.length === 1 ? 'single' : 'grid';
      }

      var wrap = document.createElement('div');
      wrap.className = 'video-gallery video-gallery--' + layout;

      videos.forEach(function (v, i) {
        wrap.appendChild(buildCard(v, layout === 'single', i === 0));
      });

      slot.innerHTML = '';
      slot.appendChild(wrap);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
})();
