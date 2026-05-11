let capture;
let bodyPose;
let poses = [];
let handPose;
let hands = [];
let earringImgs = [];

function preload() {
  // 載入 bodyPose 模型
  bodyPose = ml5.bodyPose();
  // 載入手勢模型
  handPose = ml5.handPose();
  
  // 載入所有耳環圖片
  earringImgs[1] = loadImage('pic/acc1_ring.png');
  earringImgs[2] = loadImage('pic/acc2_pearl.png');
  earringImgs[3] = loadImage('pic/acc3_tassel.png');
  earringImgs[4] = loadImage('pic/acc4_jade.png');
  earringImgs[5] = loadImage('pic/acc5_phoenix.png');
}

function setup() {
  // 建立全螢幕畫布
  createCanvas(windowWidth, windowHeight);
  // 擷取攝影機影像
  capture = createCapture(VIDEO);
  capture.size(640, 480); // 設定固定擷取解析度以利辨識穩定
  capture.hide(); // 隱藏預設產生的 HTML5 video 元件

  // 開始偵測姿勢
  bodyPose.detectStart(capture, (results) => {
    poses = results;
  });
  
  // 開始偵測手勢
  handPose.detectStart(capture, (results) => {
    hands = results;
  });
}

function draw() {
  background('#e7c6ff');

  let vWidth = width * 0.5;
  let vHeight = height * 0.5;
  let x = (width - vWidth) / 2;
  let y = (height - vHeight) / 2;

  push();
  // 實作左右顛倒（鏡像）
  translate(x + vWidth, y);
  scale(-1, 1);
  image(capture, 0, 0, vWidth, vHeight);

  // 計算伸出的手指數量
  let fingersUp = 0;
  if (hands.length > 0) {
    fingersUp = countFingersUp(hands[0]);
  }

  // 繪製耳垂位置和耳環
  if (poses.length > 0) {
    let pose = poses[0];
    
    // 定義要抓取的特徵點（左耳與右耳）
    let points = [pose.left_ear, pose.right_ear];

    points.forEach(pt => {
      if (pt && pt.confidence > 0.1) {
        // 將原始影像座標映射到畫布上的縮放尺寸
        let px = map(pt.x, 0, capture.width, 0, vWidth);
        let py = map(pt.y, 0, capture.height, 0, vHeight);
        
        // 根據手指數量顯示對應的耳環
        if (fingersUp > 0 && fingersUp <= 5 && earringImgs[fingersUp]) {
          // 繪製耳環圖片，中心對齐耳垂位置
          let imgSize = 40;
          imageMode(CENTER);
          image(earringImgs[fingersUp], px, py + 5, imgSize, imgSize);
          imageMode(CORNER);
        } else {
          // 沒有檢測到手勢或手勢不符時，顯示黃色圓圈
          fill('yellow');
          noStroke();
          circle(px, py + 5, 12);
        }
      }
    });
  }
  
  // 顯示手指數量信息
  fill(0);
  textSize(18);
  text('手指數量: ' + fingersUp, -vWidth/2 + 10, -vHeight/2 + 30);

  pop();
}

// 計算伸出的手指數量
function countFingersUp(hand) {
  let fingers = 0;
  
  // 手指尖端的索引
  let fingerTips = [4, 8, 12, 16, 20];
  // 手指PIP（中間關節）的索引
  let fingerPIPs = [3, 7, 11, 15, 19];
  
  for (let i = 0; i < 5; i++) {
    let tip = hand.keypoints[fingerTips[i]];
    let pip = hand.keypoints[fingerPIPs[i]];
    
    // 如果尖端的y座標小於PIP的y座標，表示手指伸出
    if (tip && pip && tip.y < pip.y) {
      fingers++;
    }
  }
  
  return fingers;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}