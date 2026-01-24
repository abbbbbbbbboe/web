window.onload = function(){
    document.getElementById("setButton1").onclick = function(){
    document.getElementById("cssMain").href = "style.css";
    }
    document.getElementById("setButton2").onclick = function(){
    document.getElementById("cssMain").href = "stylev2.css";
    }
    document.getElementById("setButton3").onclick = function(){
        document.getElementById("cssMain").href = "stylev3.css";
        }
        document.getElementById("setButton4").onclick = function(){
        document.getElementById("cssMain").href = "stylev4.css";
        }
    }


const cursor = document.getElementById("custom-cursor");

// モバイルは無効
if (window.matchMedia("(hover: none)").matches) {
  // 何もしない
} else {

  document.addEventListener("mousemove", (e) => {
    cursor.style.left = e.clientX + "px";
    cursor.style.top  = e.clientY + "px";
  });

  document.addEventListener("mouseover", (e) => {
    if (e.target.closest("a.memolink")) {
      document.body.classList.add("cursor-memo");
    }
    if (e.target.closest("a.otasoraWeb")) {
      document.body.classList.add("cursor-otasora");
    }
  });

  document.addEventListener("mouseout", (e) => {
    if (e.target.closest("a.memolink")) {
      document.body.classList.remove("cursor-memo");
    }
    if (e.target.closest("a.otasoraWeb")) {
      document.body.classList.remove("cursor-otasora");
    }
  });

}
