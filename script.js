
let selectedDetailCategory = null;
let selectedDetailIndex = null;



// ===============================
// 🔷 カテゴリ表示処理
// ===============================
function showCategory(category, skipHistory = false) {
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
  contentList.innerHTML = '';
  detailsDiv.innerHTML = `
   <div id="preview-item" >
    <img id="preview-img" style="width: 100%; height: 100%;" />
  </div>
  <div id="detail-item"></div>
`;

  selectedDetailIndex = null;
  selectedDetailCategory = null;

  // 🔹 about/contact/link_list の表示処理
  if (category === 'about' || category === 'contact' || category === 'link_list') {
    const item = contents[category][0];

    let html = `
      <p>${item.title}</p>
      <p>${item.details}</p>
    `;

    // 🔸 contactのリンク表示を追加
    if (item.link) {
      html += `<p class="form"><a href="${item.link}" target="_blank" rel="noopener noreferrer">お問い合わせフォーム↗︎</a></p>`;
    }

    // 🔸 リンク一覧を中央エリアに表示
    if (item.links && item.links.length > 0) {
      const linkListHTML = `
        <div class="links">
          ${item.links.map(link =>
            `<div class="linkp"><p><a href="${link.url}" target="_blank" rel="noopener noreferrer">${link.title}</a></p></div>`
          ).join('')}
        </div>
      `;
      html += linkListHTML;
    }

    contentList.innerHTML = html;

    

     // 🔸 画像があれば PC では右側、モバイルでは中央に表示
if (category === 'about' && item.images && item.images.length > 0) {
  // PC用：全部
  const allImagesHTML = item.images.map(src => `<img src="${src}" class="about-image">`).join('');
  // スマホ用：最初の1枚だけ
  const fstImageHTML = `<img src="${item.images[0]}" class="about-image">`;

  if (window.innerWidth <= 768) {
    // スマホ → 1枚だけ、テキストの上に
    contentList.innerHTML = fstImageHTML + contentList.innerHTML;
    detailsDiv.innerHTML = '';
  } else {
    // PC → 全部右エリアに
    detailsDiv.innerHTML = allImagesHTML;
  }
} else {
  detailsDiv.innerHTML = '';
}

  } else {
    // 🔹 work 等のカテゴリ表示処理
    contentList.innerHTML = `<p>${category}</p>`;

    // 🔸 プレビュー用画像を事前にプリロード
    if (contents[category]) {
      contents[category].forEach(item => {
        if (item.images && item.images.length > 0) {
          const preloadImg = new Image();
          preloadImg.src = item.images[0];
        }
      });
    }

    contents[category].forEach((item, index) => {
      const div = document.createElement('div');
      div.className = 'content-item';

      // スマホ（768px以下）の場合はプレビュー画像を追加
      let previewImgHTML = '';
      if (window.innerWidth <= 768 && item.images && item.images.length > 0) {
        previewImgHTML = `<img src="${item.images[0]}" class="mobile-preview-image" />`;
      }

      div.innerHTML = `
        <strong>${item.title}</strong><br>
        ${item.date ? `<small>${item.category}</small>` : ''}
        ${item.category ? `<small>|&nbsp;${item.date}</small>` : ''}
        ${previewImgHTML}
      `;

      // 🔸 詳細表示クリックイベント
 div.onclick = () => {
  const slug = contents[category][index].pagetitle || index;
  window.location.hash = `${category}/${slug}`;
};
      setupHoverPreview(div, item, index, category);

      contentList.appendChild(div);
    });
  }

  // 🔸 履歴とハッシュは skipHistory=false の場合のみ設定
  if (!skipHistory) {
    addToHistory({ type: 'category', category });
    // window.location.hash = category;
  }

  // 🔸 モバイル表示用のUI切り替え
  if (window.innerWidth <= 768) {
    container.classList.remove('show-detail');
    container.classList.remove('show-menu');
    container.classList.add('show-list');
    window.scrollTo(0, 0);
  }
}

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

// 🎬 動画（画像と同じ並びで追加）
if (detail.video) {
  mediaHTML += `
    <div class="detail-video-wrapper detail-image-large">
      <iframe src="${detail.video}" frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen></iframe>
    </div>`;
}

// 画像
if (detail.images && detail.images.length > 0) {
  mediaHTML += detail.images.map((src, idx) => {
    const className = idx === 0 ? "detail-image-large" : "detail-image-half";
    return `<img src="${src}" class="${className}">`;
  }).join('');
}



// 🔸 詳細内容を描画
detailDiv.innerHTML = `
  <p class="detail-title">${detail.title}</p>
  <p class="detail-meta">
    ${detail.date ? `<span class="detail-date">${detail.date}</span><br>` : ''}
    ${detail.category ? `<span class="detail-category">${detail.category}</span><br><br>` : ''}
    ${detail.link ? `<span class="detail-link"><a href="${detail.link}" target="_blank">↗︎${detail.link}↗︎</a></span><br>` : ''}
  </p>
  
  <div class="detail-images">${mediaHTML}</div>
  <p class="detail-description">
    ${detail.details}<br><br>
    ${detail.link ? `<span class="detail-link"><a href="${detail.link}" target="_blank">↗︎${detail.link}↗︎</a></span><br>` : ''}
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
      });
    }
  }
}





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

function handleHash() {
  const hash = window.location.hash.slice(1); // 例: "work/0" または "work/shining"
  if (!hash) return;

  const [category, slugOrIndex] = hash.split('/');

  let index = null;
  if (!isNaN(parseInt(slugOrIndex, 10))) {
    index = parseInt(slugOrIndex, 10);
  } else if (slugOrIndex) {
    index = contents[category]?.findIndex(item => item.pagetitle === slugOrIndex);
  }


  if (contents[category] && index !== null && index >= 0) {
    showCategory(category, true); // skipHistory=true
    showDetails(category, index);
    advanceBackground(); // 背景切り替えはここだけ
  } else if (contents[category]) {
    showCategory(category, true);
    advanceBackground();
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
      item.textContent = `${h.category}`;
      item.onclick = () => {
        // 履歴から開く場合も履歴に追加する
        showCategory(h.category, false); 
        advanceBackground();
      };

   } else if (h.type === 'detail') {
  const d = contents[h.category][h.index];
  item.textContent = d.title;
  item.onclick = () => {
    // カテゴリ表示（履歴には追加しない）
    showCategory(h.category, true); // ← skipHistory = true に変更
    // 詳細表示（履歴追加する）
    showDetails(h.category, h.index);
    // advanceBackground();
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





