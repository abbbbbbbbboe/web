// カスタムカーソル要素を取得
const customCursor = document.querySelector('.custom-cursor');

// 特定の要素 (.contents) を取得
const contentsElement = document.querySelector('.contents');

// マウスの動きに合わせてカスタムカーソルを移動
document.addEventListener('mousemove', (e) => {
  customCursor.style.left = `${e.pageX}px`;
  customCursor.style.top = `${e.pageY}px`;
});

// contents要素にマウスが入ったときにカスタムカーソルを非表示
contentsElement.addEventListener('mouseenter', () => {
  customCursor.style.display = 'none';
});

// contents要素からマウスが離れたときにカスタムカーソルを再表示
contentsElement.addEventListener('mouseleave', () => {
  customCursor.style.display = 'block';
});



function getRandomBlurValue() {
  return Math.random() * 13; // 0から10のランダムなブラー値
}

function applyRandomBlur() {
  const blurValue = getRandomBlurValue();
  const backgroundElement = document.getElementById('background-blur');
  backgroundElement.style.filter = `blur(${blurValue}px)`;
}

// 初期のブラーを適用
applyRandomBlur();

// 3秒ごとにランダムなブラーを適用
setInterval(applyRandomBlur, 1500);



// 
// 全てのポップアップを開くボタンを取得
const openPopupBtns = document.querySelectorAll(".openPopup");
// 全ての閉じるボタンを取得
const closePopupBtns = document.querySelectorAll(".close");
// 次のポップアップを開くボタンを取得
const nextPopupBtns = document.querySelectorAll(".nextPopup");

// ポップアップを開く
openPopupBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    const popupId = btn.getAttribute("data-popup"); // データ属性からポップアップIDを取得
    const popup = document.getElementById(popupId); // 対応するポップアップを取得
    popup.style.display = "flex"; // ポップアップを表示
  });
});

// ポップアップを閉じる
closePopupBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    const popup = btn.closest(".popup"); // 親のポップアップ要素を取得
    popup.style.display = "none"; // ポップアップを非表示
  });
});

// 次のポップアップを開く
nextPopupBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    const nextPopupId = btn.getAttribute("data-next-popup"); // 次のポップアップIDを取得
    const currentPopup = btn.closest(".popup"); // 現在のポップアップを取得
    const nextPopup = document.getElementById(nextPopupId); // 次のポップアップを取得
    
    currentPopup.style.display = "none"; // 現在のポップアップを非表示
    nextPopup.style.display = "flex"; // 次のポップアップを表示
  });
});

// モーダルの外側をクリックしてもポップアップを閉じる
window.addEventListener("click", (event) => {
  if (event.target.classList.contains("popup")) {
    event.target.style.display = "none"; // ポップアップを非表示
  }
});



// 
// box-shadow
let isRequestPending = false;

document.addEventListener("mousemove", (e) => {
    if (!isRequestPending) {
        isRequestPending = true;
        requestAnimationFrame(() => {
            updateShadow(e);
            isRequestPending = false;
        });
    }
});

function updateShadow(e) {
    const box = document.querySelector(".contents");
    const rect = box.getBoundingClientRect();

    // boxの中心の座標を取得
    const boxCenterX = rect.left + rect.width / 2;
    const boxCenterY = rect.top + rect.height / 2;

    // カーソルとboxの中心の距離を計算
    const offsetX = e.clientX - boxCenterX;
    const offsetY = e.clientY - boxCenterY;

    // 距離を基にシャドウのオフセットを計算
    const shadowOffsetX = -offsetX * 0.1;
    const shadowOffsetY = -offsetY * 0.1;

    // カーソルが要素から離れるほどボカシ半径を大きくする
    const distance = Math.sqrt(offsetX ** 2 + offsetY ** 2);
    const maxDistance = Math.max(window.innerWidth, window.innerHeight); // 最大距離（画面サイズ）
    const maxBlur = 40; // 最大のぼかし半径
    const minBlur = 2; // 最小のぼかし半径
    const maxOpacity = 0.6; // 最大透明度
    const minOpacity = 0.4; // 最小透明度

    // ボカシ半径の計算
    const blur = Math.min(maxBlur, minBlur + (maxBlur - minBlur) * (distance / maxDistance));

    // 透明度の計算（カーソルが近づくと濃くなる）
    const opacity = Math.max(minOpacity, maxOpacity - (maxOpacity - minOpacity) * (distance / maxDistance));

    box.style.boxShadow = `${shadowOffsetX}px ${shadowOffsetY}px ${blur}px rgba(224, 226, 255, ${opacity})`;
}



window.addEventListener('load', function() {
  const contents = document.querySelector('.contents');
  contents.scrollTop = 0; // ページ読み込み時にスクロール位置をトップに設定
});

