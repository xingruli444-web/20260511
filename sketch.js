let capture;
let faceMesh;
let faces = [];
let options = { maxFaces: 1, refineLandmarks: false, flipHorizontal: false };

function setup() {
  // 建立全螢幕畫布
  createCanvas(windowWidth, windowHeight);
  
  // 擷取攝影機影像
  capture = createCapture(VIDEO);
  capture.size(640, 480); // 設定擷取解析度以利辨識穩定
  
  // 隱藏預設產生的 HTML 影片元件，只在畫布上繪製
  capture.hide();

  // 初始化 faceMesh 模型 (v1.0 語法)
  faceMesh = ml5.faceMesh(options);
  
  // 開始偵測影片串流，並在偵測到臉部時更新 faces 變數
  faceMesh.detectStart(capture, (results) => {
    faces = results;
  });
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
  
  // 如果有偵測到臉部
  if (faces.length > 0) {
    let face = faces[0];
    
    // 132 是左耳垂區域的索引，361 是右耳垂區域的索引 (MediaPipe 標標點碼)
    let leftEarlobe = face.keypoints[132];
    let rightEarlobe = face.keypoints[361];

    console.log('檢測到臉部，左耳垂:', leftEarlobe, '右耳垂:', rightEarlobe);

    fill(255, 255, 0); // 黃色
    noStroke();

    // 將辨識座標映射到當前顯示的影像區域內 (-vWidth/2 到 vWidth/2)
    // 注意：因為在 scale(-1, 1) 的狀態下繪製，左右座標會自動正確對應
    let lx = map(leftEarlobe.x, 0, capture.width, -vWidth / 2, vWidth / 2);
    let ly = map(leftEarlobe.y, 0, capture.height, -vHeight / 2, vHeight / 2);
    circle(lx, ly, 15); // 左耳垂圓圈

    let rx = map(rightEarlobe.x, 0, capture.width, -vWidth / 2, vWidth / 2);
    let ry = map(rightEarlobe.y, 0, capture.height, -vHeight / 2, vHeight / 2);
    circle(rx, ry, 15); // 右耳垂圓圈

    // 顯示狀態
    fill(0);
    textSize(16);
    text('檢測到臉部', -width/2 + 10, -height/2 + 30);
  } else {
    console.log('沒有檢測到臉部');
    // 顯示狀態
    fill(0);
    textSize(16);
    text('沒有檢測到臉部，請面對攝影機', -width/2 + 10, -height/2 + 30);
  }

  pop();
}

// 當視窗大小改變時，自動調整畫布大小
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
