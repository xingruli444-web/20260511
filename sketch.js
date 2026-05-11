let capture;

function setup() {
  // 建立全螢幕畫布
  createCanvas(windowWidth, windowHeight);
  
  // 擷取攝影機影像
  capture = createCapture(VIDEO);
  
  // 隱藏預設產生的 HTML 影片元件，只在畫布上繪製
  capture.hide();
}

function draw() {
  // 設定背景顏色為 e7c6ff
  background('#e7c6ff');

  // 計算影像顯示的寬度與高度（全螢幕寬高的 50%）
  let vWidth = width * 0.5;
  let vHeight = height * 0.5;

  // 使用 push() 與 pop() 來確保座標轉換只影響目前的影像
  push();
  
  // 將座標原點移至畫面中心
  translate(width / 2, height / 2);
  
  // 執行水平翻轉 (左右顛倒)
  // scale(-1, 1) 會沿著 Y 軸翻轉 X 座標
  scale(-1, 1);
  
  // 在中心點繪製影像
  // 由於原點在中心，繪製位置需偏移影像寬高的一半（-vWidth / 2, -vHeight / 2）
  image(capture, -vWidth / 2, -vHeight / 2, vWidth, vHeight);
  
  pop();
}

// 當視窗大小改變時，自動調整畫布大小
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
