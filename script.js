
let selectedDetailCategory = null;
let selectedDetailIndex = null;


// ===============================
// 🔷 スマホアドレスバー計算
// ===============================
function setVh() {
  // innerHeightの1%を計算
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

// 初回実行
setVh();

// リサイズや回転時にも更新
window.addEventListener('resize', setVh);
window.addEventListener('orientationchange', setVh);



// ===============================
// 🔷 カテゴリ表示処理
// ===============================
function showCategory(category, skipHistory = false) {
  // top の場合は showTop に移譲
  if (category === 'top') {
    showTop(skipHistory);
    return;
  }

  // 左メニューの選択状態を更新
  document.querySelectorAll('.menu-item').forEach(item => {
    item.classList.remove('active');
    if (item.textContent.trim().toLowerCase() === category) {
      item.classList.add('active');
    }
  });

  const container = document.querySelector('.container');
  const contentList = document.getElementById('content-list');
  const detailsDiv = document.getElementById('details');
  const menu = document.getElementById('menu'); // 左端エリア

  // 🔹 左端メニュー表示制御（スマホ/PC共通）
  if (window.innerWidth <= 768) {
    if (category === 'top') {
      if (menu) menu.classList.add('menu-view');  // topのみ表示
    } else {
      if (menu) menu.classList.remove('menu-view'); // それ以外は非表示
    }
  } else {
    // PC版は常に表示
    if (menu) menu.classList.add('menu-view');
  }

  // コンテンツ初期化
  contentList.innerHTML = '';
  detailsDiv.innerHTML = `
    <div id="preview-item">
      <img id="preview-img" style="width: 100%; height: 100%;" />
    </div>
    <div id="detail-item"></div>
  `;

  selectedDetailIndex = null;
  selectedDetailCategory = null;

  // 🔹 about/contact/link_list の表示処理
  if (['about','contact','link_list'].includes(category)) {
    const item = contents[category][0];
   
  // タイトル表示ルール
  // - モバイル: 全カテゴリで表示
  // - PC: contact のときだけ表示
  const showTitle =
    window.innerWidth <= 768 || category === "contact";

  let titleHTML = showTitle
    ? `<p class="center-title">${item.title}</p>`
    : "";

  let html = `
    ${titleHTML}
    <p>${item.text}</p>
    <p class="text-en">${item.text_en ? item.text_en : ""}</p>
    <p class="exhibition">${item.exhibition ? item.exhibition : ""}</p>
  `;
  
    if (item.link) {
      html += `<p class="form"><a href="${item.link}" target="_blank" rel="noopener noreferrer">お問い合わせフォーム↗︎</a></p>`;
    }

    if (item.links && item.links.length > 0) {
      html += `<div class="links">${item.links.map(link =>
        `<div class="linkp"><p><a href="${link.url}" target="_blank" rel="noopener noreferrer">${link.title}</a></p></div>`
      ).join('')}</div>`;
    }

    contentList.innerHTML = html;

    // about の画像表示
    if (category === 'about' && item.images && item.images.length > 0) {
      const allImagesHTML = item.images.map(src => `<img src="${src}" class="about-image">`).join('');
      const fstImageHTML = `<img src="${item.images[0]}" class="about-image">`;

      if (window.innerWidth <= 768) {
        contentList.innerHTML = fstImageHTML + contentList.innerHTML;
        detailsDiv.innerHTML = '';
      } else {
        detailsDiv.innerHTML = allImagesHTML;
      }
    } else {
      detailsDiv.innerHTML = '';
    }

  } else {
    // 🔹 work / blog 共通のカテゴリ表示処理
    let items = category === "work" ? contents[category] || [] : blogContents || [];

    items.forEach((item, index) => {
      const div = document.createElement('div');
      div.className = 'content-item';

      let previewImgHTML = '';
      if (window.innerWidth <= 768 && item.images && item.images.length > 0) {
        previewImgHTML = `<img src="${item.images[0]}" class="mobile-preview-image" />`;
      }

      div.innerHTML = `
        <strong>${item.title}</strong><br>
        ${item.date ? `<small>${item.date}</small>` : ''}
        ${item.category ? `<small>&nbsp;|&nbsp;${item.category}</small>` : ''}
        ${previewImgHTML}
      `;

      div.onclick = () => {
        if (category === "work") showDetails(category, index);
        else if (category === "blog") showBlogDetails(index);
      };

      if (category === "work") setupHoverPreview(div, item, index, category);

      contentList.appendChild(div);
    });
  }

  // 履歴追加
  if (!skipHistory) addToHistory({ type: 'category', category });

  // モバイル表示用切替（top以外）
  if (window.innerWidth <= 768) {
    container.classList.remove('show-detail','show-menu');
    container.classList.add('show-list');
    window.scrollTo(0, 0);
  } else {
    // PCは show-list を消す
    container.classList.remove('show-list');
  }
}


// ===============================
// 🔷 モバイルTOP表示 & 履歴追加
// ===============================
function showTop(skipHistory = false) {
  const container = document.querySelector('.container');
  const menuItems = document.querySelectorAll('.menu-item');
  const menu = document.getElementById('menu');

  // 既存の active を削除
  menuItems.forEach(item => item.classList.remove('active'));

  // TOP用 active
  const topItem = document.querySelector('.menu-item.top');
  if (topItem) topItem.classList.add('active');

  // 左端メニュー表示（スマホ/PC共通）
  if (window.innerWidth <= 768) {
    if (menu) menu.classList.add('menu-view');
  } else {
    if (menu) menu.classList.add('menu-view');
  }

  // モバイルTOPコンテンツ生成
  if (window.innerWidth <= 768) {
    const contentList = document.getElementById('content-list');
    const detailsDiv = document.getElementById('details');
    contentList.innerHTML = ` <div class="panel left" id="menu">
        <div class="otasora"><a href="index.html">otasora.website</a></div>
        <div class="menu-items">
      <div class="menu-item" onclick="showCategory('work')">work</div>
      <div class="menu-item" onclick="showCategory('about')">about</div>
      <div class="menu-item" onclick="showCategory('link_list')">link_list</div>
      <div class="menu-item" onclick="showCategory('contact')">contact</div>
      <div class="kiritori"><p>--------＊--------</p></div>
      <div class="menu-item" onclick="showCategory('blog')">blog</div>
     </div>
     

     <div class="news"><p>＜news＞</p><p>ここにお知らせを載せます。今は、職や仕事を探しています。</p></div>
<div class="copyright">© 2025 オオタソラ</div>`;
    detailsDiv.innerHTML = '';
  }

  // 画面状態切替
  container.classList.remove('show-list','show-detail','show-menu');
  container.classList.add('show-top');

  // 履歴追加
  if (!skipHistory) addToHistory({ type: 'top' });

  advanceBackground();
}







// ===============================
// 🔷 マウスホバー画像出現
// ===============================

function setupHoverPreview(div, item, index, category) {
  const previewDiv = document.getElementById("preview-item");
  const previewImg = document.getElementById("preview-img");

  div.onmouseenter = () => {
    if (selectedDetailIndex === index && selectedDetailCategory === category) {
      return;
    }

    const previewImage = item.images && item.images[0];
    if (previewImage) {
      previewImg.src = previewImage;
      previewImg.style.display = "block";
      previewDiv.style.display = "block";
    }
  };

  div.onmouseleave = () => {
    previewImg.src = "";
    previewImg.style.display = "none";
    previewDiv.style.display = "none";
  };
}








// ===============================
// 🔷 詳細表示処理
// ===============================

// -------------------------------
// workdetail
// -------------------------------

function showDetails(category, index) {
  const container = document.querySelector('.container');

  // プレビュー非表示
  const previewDiv = document.getElementById('preview-item');
  const previewImg = document.getElementById('preview-img');
  if (previewDiv && previewImg) {
    previewImg.src = '';
    previewImg.style.display = 'none';
    previewDiv.style.display = 'none';
  }

  const detail = contents[category][index];
  const detailDiv = document.getElementById('detail-item');
  detailDiv.scrollTop = 0;

  // 選択状態を更新
  document.querySelectorAll('.content-item').forEach(item => item.classList.remove('active'));
  const selectedItem = document.querySelectorAll('.content-item')[index];
  if (selectedItem) selectedItem.classList.add('active');

  // 画像 & 動画リストHTML生成
let mediaHTML = "";

// 画像
if (detail.images && detail.images.length > 0) {
  mediaHTML += detail.images.map((src, idx) => {
    const className = idx === 0 ? "detail-image-large" : "detail-image-half";
    return `<img src="${src}" class="${className}">`;
  }).join('');
}

// 🎬 動画（画像と同じ並びで追加）
// video が1つでも複数でも対応
if (detail.video) {
  // 配列ではなかったら配列に変換
  const videos = Array.isArray(detail.video) ? detail.video : [detail.video];

  videos.forEach(videoUrl => {
    mediaHTML += `
      <div class="detail-video-wrapper detail-image-large">
        <iframe src="${videoUrl}" frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen></iframe>
      </div>`;
  });
}





// 🔸 詳細内容を描画
detailDiv.innerHTML = `
  <p class="detail-title">${detail.title}</p>
  <p class="detail-meta">
    ${detail.date ? `<span class="detail-date">${detail.date}</span><br>` : ''}
    ${detail.category ? `<span class="detail-category">${detail.category}</span><br><br>` : ''}
    ${detail.link
  ? `<span class="detail-link">
       <a href="${Array.isArray(detail.link) ? detail.link[0] : detail.link}" target="_blank">
         ↗︎${Array.isArray(detail.link) ? detail.link[0] : detail.link}↗︎
       </a>
     </span><br>`
  : ''
}

  </p>
  
  <div class="detail-images">${mediaHTML}</div>
  <p class="detail-description">
    ${detail.text ? detail.text + "<br><br>" : ""}
   ${detail.text_en ? detail.text_en + "<br><br>" : ""}
   ${detail.credit ? "【credit】" + "<br>" + detail.credit + "<br><br>" : ""}
   ${detail.news ? "【news】" + "<br>" + detail.news + "<br><br>" : ""}
    ${detail.link
  ? (Array.isArray(detail.link)
      ? detail.link.map(url =>
          `<span class="detail-link"><a href="${url}" target="_blank">↗︎${url}↗︎</a></span><br>`
        ).join("")
      : `<span class="detail-link"><a href="${detail.link}" target="_blank">↗︎${detail.link}↗︎</a></span><br>`
    )
  : ""
}
 </p>
  ${window.innerWidth <= 768 ? `<button class="back-to-list">back to work list↩︎</button>` : ''}
`;


  // スクロールリセット
  setTimeout(() => {
    detailDiv.scrollTop = 0;
    window.scrollTo(0, 0);
  }, 0);

  selectedDetailCategory = category;
  selectedDetailIndex = index;

  // ハッシュ更新
  const slug = detail.pagetitle || index;
  const newHash = `${category}/${slug}`;
  if (window.location.hash.slice(1) !== newHash) {
    window.location.hash = newHash;
  }

  addToHistory({ type: 'detail', category, index });

  if (window.innerWidth <= 768) {
    container.classList.remove('show-menu');
    container.classList.remove('show-list');
    container.classList.add('show-detail');
    window.scrollTo(0, 0);

    const backButton = document.querySelector('.back-to-list');
    if (backButton) {
      backButton.addEventListener('click', () => {
        container.classList.remove('show-detail');
        container.classList.add('show-list');
        window.scrollTo(0, 0);
        // URLのハッシュをリスト画面用に戻す
    window.location.hash = "work"; // もしくは "" でもOK
      });
    }
  }
}

// -------------------------------
// blogdetail
// -------------------------------

function showBlogDetails(index) {
  const container = document.querySelector('.container');

  const detail = blogContents[index]; // blog用配列
  const detailDiv = document.getElementById('detail-item');
  detailDiv.scrollTop = 0;

  // 選択状態を更新
  document.querySelectorAll('.content-item').forEach(item => item.classList.remove('active'));
  const selectedItem = document.querySelectorAll('.content-item')[index];
  if (selectedItem) selectedItem.classList.add('active');

  // -------------------------------
  // 描画（HTMLを自由に表示可能）
  // -------------------------------
  detailDiv.innerHTML = `
  <div class="blog-wrap">
  <div class="blog-head"><img src="imag/bloghead2.png" /></div>
  <div class="blog">
  <div class="blog-datetime" id="blog-datetime"></div>
        
  <div class="blog-text">
    <p class="blog-title">〰️&thinsp;${detail.title}&thinsp;〰️</p>
    <p class="blog-meta">
      ${detail.date ? `<span class="blog-date">${detail.date}</span><br>` : ''}
      ${detail.category ? `<span class="blog-category">＊${detail.category}＊</span><br><br>` : ''}
    </p>
    <div class="blog-content">${detail.content || ""}</div>
       <div class="blog-form"><a href="https://forms.gle/17ErUsJnvgpZaqVM9" target="_blank">お問い合わせform↗︎</a></div>
    </div>

    </div>

    </div>

    ${window.innerWidth <= 768 ? `<button class="back-to-blog-list">back to blog list↩︎</button>` : ''}

  `;

  // スクロールリセット
  setTimeout(() => {
    detailDiv.scrollTop = 0;
    window.scrollTo(0, 0);
  }, 0);

  // ハッシュ更新
  const slug = detail.pagetitle || index;
  window.location.hash = `blog/${slug}`;

  // モバイル戻るボタン
  if (window.innerWidth <= 768) {
    container.classList.remove('show-menu');
    container.classList.remove('show-list');
    container.classList.add('show-detail');
    const backButton = document.querySelector('.back-to-blog-list');
   if (backButton) {
  backButton.onclick = () => {
    container.classList.remove('show-detail');
    container.classList.add('show-list');
    window.scrollTo(0, 0);

    // URLのハッシュをリスト画面用に戻す
    window.location.hash = "blog"; // もしくは "" でもOK
  };
}
  }
  startBlogDatetime();

  addToHistory({ type: "detail", category: "blog", index });

  idleFlowers.start();
}

// ===============================
// 🔷 ブログ内日時表記
// ===============================

function startBlogDatetime() {
  const datetimeDiv = document.getElementById('blog-datetime');
  if (!datetimeDiv) return;

  // 日時更新関数
  function updateBlogDatetime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hour = String(now.getHours()).padStart(2, '0');
    const min = String(now.getMinutes()).padStart(2, '0');

    datetimeDiv.textContent = `now!{${year}/${month}/${day} ${hour}:${min}}`;
  }

  // 初回更新
  updateBlogDatetime();

  // 次の分の切り替えタイミングまでの残りミリ秒を計算
  const now = new Date();
  const msUntilNextMinute = (60 - now.getSeconds()) * 1000 - now.getMilliseconds();

  // そのタイミングでまず1回更新
  setTimeout(() => {
    updateBlogDatetime();

    // 以降は1分ごとに正確に更新
    setInterval(updateBlogDatetime, 60000);
  }, msUntilNextMinute);
}






// ===============================
// 🔷 #IdleFlowers for #blog
// ===============================
(function () {
  const cfg = {
    idleTime: 10000,          
    srcList: [                 
      "imag/blog_hana-2.gif",
      "imag/blog_hana2-2.gif",
      "imag/blog_hana3.gif"
    ],
    widthOptions: [20, 30],
    minBlur: 0.3,
    maxBlur: 2,
    z: 2147483647,
    maxAttempts: 10
  };

  let idleTimer = null;
  let running = false;
  let idleActive = false;
  let listening = false;
  const activeGifs = new Set();

 const log = (...a) => {}; // ← これで全ての console.log 出力を無効化


  function isOverlapping(x1, y1, w1, h1, x2, y2, w2, h2) {
    return !(x1 + w1 < x2 || x2 + w2 < x1 || y1 + h1 < y2 || y2 + h2 < y1);
  }

  function showOne() {
    const img = new Image();
    const src = cfg.srcList[Math.floor(Math.random() * cfg.srcList.length)];
    img.src = `${src}?t=${Date.now()}`;

    const size = cfg.widthOptions[Math.floor(Math.random() * cfg.widthOptions.length)];
    img.style.width = size + "px";
    img.style.height = size + "px";

    let attempt = 0;
    let posX, posY, overlapping;

    do {
      posX = Math.random() * (window.innerWidth - size);
      posY = Math.random() * (window.innerHeight - size);

      overlapping = false;
      for (let existing of activeGifs) {
        const rect = existing.getBoundingClientRect();
        if (isOverlapping(posX, posY, size, size, rect.left, rect.top, rect.width, rect.height)) {
          overlapping = true;
          break;
        }
      }
      attempt++;
    } while (overlapping && attempt < cfg.maxAttempts);

    img.style.position = "fixed";
    img.style.left = posX + "px";
    img.style.top  = posY + "px";
    img.style.zIndex = cfg.z;
    img.style.pointerEvents = "none";

    const blur = cfg.minBlur + Math.random() * (cfg.maxBlur - cfg.minBlur);
    img.style.filter = `blur(${blur}px)`;

    document.body.appendChild(img);
    activeGifs.add(img);

    const timeoutId = setTimeout(() => {
      img.remove();
      activeGifs.delete(img);
    }, 1500);
    img._timeoutId = timeoutId;

    img.onload = () => log("GIF appended and loaded:", img.src);
  }

  function loop() {
    if (!running || !idleActive) return;
    showOne();

    let next;
    if (window.innerWidth <= 768) {
      next = 600 + Math.random() * 1100;
    } else {
      next = 30 + Math.random() * 300;
    }

    setTimeout(loop, next);
  }

  function resetIdleTimer() {
    if (!running) return;

    activeGifs.forEach(img => {
      clearTimeout(img._timeoutId);
      img.remove();
    });
    activeGifs.clear();

    idleActive = false;
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      idleActive = true;
      log("idle ON → loop start");
      loop();
    }, cfg.idleTime);

    log("idle reset");
  }

  function addListeners() {
    if (listening) return;
    listening = true;

    const events = ["mousemove", "keydown", "click", "touchstart", "scroll"];
    events.forEach(e => window.addEventListener(e, resetIdleTimer, { passive: true }));
  }

  function removeListeners() {
    if (!listening) return;
    listening = false;

    const events = ["mousemove", "keydown", "click", "touchstart", "scroll"];
    events.forEach(e => window.removeEventListener(e, resetIdleTimer));
  }

  function start() {
    if (running) return;
    running = true;
    log("idleFlowers start");
    addListeners();
    resetIdleTimer();
  }

  function stop() {
    if (!running) return;
    running = false;
    idleActive = false;
    clearTimeout(idleTimer);
    removeListeners();
    activeGifs.forEach(img => img.remove());
    activeGifs.clear();
    log("idleFlowers stop");
  }

  // グローバルで制御できるように公開
  window.idleFlowers = { start, stop, test: showOne, cfg };
})();









// ===============================
// 🔷 初期化処理と背景操作
// ===============================
window.addEventListener("load", () => {
  preloadImages(bgImages);
  showCurrentBackground();
  handleHash(); // ハッシュ付きURLなら直接表示

document.querySelectorAll('.menu-item').forEach(item => {
  item.addEventListener('click', () => {
    const category = item.textContent.trim().toLowerCase();
    window.location.hash = category;  // ハッシュだけ変える
  });
});


  const parent = document.getElementById("content-list");
  if (parent) {
    parent.addEventListener("click", (e) => {
      if (e.target.classList.contains("content-item") || e.target.closest(".content-item")) {
        // advanceBackground();
      }
    });
  }
});







// ===============================
// 🔷 #作成
// ===============================
window.addEventListener("hashchange", handleHash);
window.addEventListener("load", handleHash); // ページリロード時も対応

function handleHash() {
  const hash = window.location.hash.slice(1); // 例: "work/0" または "blog/my-post"
  if (!hash) return;

  const [category, slugOrIndex] = hash.split('/');
  let index = null;

  if (category === "blog") {
    if (!isNaN(parseInt(slugOrIndex, 10))) {
      index = parseInt(slugOrIndex, 10);
    } else if (slugOrIndex) {
      index = blogContents.findIndex(item => item.pagetitle === slugOrIndex);
    }

    if (index !== null && index >= 0) {
      showCategory(category, true);
      showBlogDetails(index);
      advanceBackground();
    } else {
      showCategory(category, true);
      advanceBackground();
    }

    // ★ blog ページなら GIF 起動
    if (window.idleFlowers) idleFlowers.start();

  } else { // work / about / contact など
    if (!isNaN(parseInt(slugOrIndex, 10))) {
      index = parseInt(slugOrIndex, 10);
    } else if (slugOrIndex) {
      index = contents[category]?.findIndex(item => item.pagetitle === slugOrIndex);
    }

    if (contents[category] && index !== null && index >= 0) {
      showCategory(category, true);
      showDetails(category, index);
      advanceBackground();
    } else if (contents[category]) {
      showCategory(category, true);
      advanceBackground();
    }

    // ★ blog 以外では GIF 停止
    if (window.idleFlowers) idleFlowers.stop();
  }
}









// ===============================
// 🔷 背景画像関連関数
// ===============================
const bgImages = [
  "bg1.png", "bg2.png", "bg3.png", "bg4.png", "bg5.png",
  "bg6.png", "bg7.png", "bg8.png", "bg9.png", "bg10.png",
  "bg11.png", "bg12.png", "bg13.png", "bg14.png", "bg15.png",
  "bg16.png", "bg17.png", "bg18.png", "bg19.png", "bg20.png",
  "bg21.png", "bg22.png", "bg23.png", "bg24.png", "bg25.png",
  "bg26.png", "bg27.png", "bg28.png", "bg29.png", "bg30.png",
  "bg31.png", "bg32.png", "bg33.png", "bg34.png", "bg35.png",
  "bg36.png", "bg37.png", "bg38.png", "bg39.png", "bg40.png",
  "bg41.png", "bg42.png"
];

// 🔸 画像プリロード（読み込み完了を保証）
const preloadedImages = {};

function preloadImages(images) {
  images.forEach(src => {
    const fullPath = `backgroundimag/${src}`;
    const img = new Image();
    img.src = fullPath;
    img.onload = () => {
      preloadedImages[src] = img; // 完全に読み込んだ画像をキャッシュ
    };
  });
}

// 🔸 現在の背景画像を表示（キャッシュ利用）
function showCurrentBackground() {
  const detailsDiv = document.getElementById("details");
  let currentIndex = localStorage.getItem("bgIndex");
  if (currentIndex === null) currentIndex = 0;
  else currentIndex = parseInt(currentIndex, 10);

  const src = bgImages[currentIndex];
  if (preloadedImages[src]) {
    // すでに読み込み済みなら即適用
    detailsDiv.style.backgroundImage = `url(${preloadedImages[src].src})`;
  } else {
    // 読み込み中なら通常の方法
    detailsDiv.style.backgroundImage = `url(backgroundimag/${src})`;
  }

  detailsDiv.style.backgroundSize = "50px";
  detailsDiv.style.backgroundRepeat = "repeat";
}

// 🔸 背景画像を進める
function advanceBackground() {
  console.log("advanceBackground called");
  let currentIndex = localStorage.getItem("bgIndex");
  if (currentIndex === null) currentIndex = 0;
  else currentIndex = parseInt(currentIndex, 10);

  currentIndex = (currentIndex + 1) % bgImages.length;
  localStorage.setItem("bgIndex", currentIndex);

  showCurrentBackground();
}


// ===============================
// 🔷 履歴保持・履歴バー更新
// ===============================
const history = [];

function addToHistory(entry) {
  if (history[0] && JSON.stringify(history[0]) === JSON.stringify(entry)) return;

  history.unshift(entry);
  if (history.length > 40) history.pop();

  const historyBar = document.getElementById('history-bar');
  historyBar.innerHTML = '';

  history.forEach(h => {
    const item = document.createElement('div');
    item.className = 'history-item';

    if (h.type === 'category') {
      // カテゴリ履歴
      item.textContent = `${h.category}`;
      item.onclick = () => {
        showCategory(h.category, false); 
        advanceBackground();
      };

    } else if (h.type === 'detail') {
      let d;

      // 🔹 blogの場合は blogContents を参照
      if (h.category === 'blog') {
        d = blogContents[h.index];
        item.textContent = d.title;
        item.onclick = () => {
          showCategory('blog', true); // カテゴリ表示（履歴には追加しない）
          showBlogDetails(h.index);   // 詳細表示
        };

      // 🔹 workなど従来のcontents
      } else {
        d = contents[h.category][h.index];
        item.textContent = d.title;
        item.onclick = () => {
          showCategory(h.category, true); // カテゴリ表示（履歴には追加しない）
          showDetails(h.category, h.index); // 詳細表示
        };
      }

    } else if (h.type === 'top') {
      // 🔹 TOP履歴
      item.textContent = 'top';
      item.onclick = () => {
        showTop(false); // TOP画面を表示
      };
    }

    historyBar.appendChild(item);
  });
}












// ===============================
// 🔷 ハンバーガーメニュー開閉処理
// ===============================
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

hamburger.onclick = () => {
  const isOpen = mobileMenu.style.display === 'flex';

  if (isOpen) {
    mobileMenu.style.display = 'none';
    hamburger.classList.remove('open');
  } else {
    mobileMenu.style.display = 'flex';
    hamburger.classList.add('open');
  }
};

// 🔸 メニュー項目クリックで閉じる
document.querySelectorAll('#mobile-menu .menu-item').forEach(item => {
  item.addEventListener('click', () => {
    mobileMenu.style.display = 'none';
    hamburger.classList.remove('open');
  });
});

// 🔸 メニュー外クリックで閉じる
document.addEventListener('click', (event) => {
  const isClickInsideMenu = mobileMenu.contains(event.target);
  const isClickOnHamburger = hamburger.contains(event.target);

  if (!isClickInsideMenu && !isClickOnHamburger) {
    mobileMenu.style.display = 'none';
    hamburger.classList.remove('open');
  }
});





