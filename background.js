console.log('Background script is running');

// 监听来自content script的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Received message:', request);
  if (request.action === 'createFlowingCard') {
    createFlowingCard(request.text, request.style)
      .then(cardDataUrl => {
        sendResponse({ success: true, cardDataUrl: cardDataUrl });
      })
      .catch(error => {
        console.error('Error creating flowing card:', error);
        sendResponse({ success: false, error: error.message });
      });
    return true; // 保持消息通道开放以进行异步响应
  }
  if (request.action === "captureAndDownload") {
    chrome.tabs.captureVisibleTab(null, {format: "png"}, function(dataUrl) {
        const filename = "流光卡片_" + new Date().getTime() + ".png";
        chrome.downloads.download({
            url: dataUrl,
            filename: filename,
            saveAs: true
        });
    });
  }
});

// 模拟创建流光卡片的函数
async function createFlowingCard(text, style) {
  return new Promise((resolve, reject) => {
    const canvas = new OffscreenCanvas(340, 210); // 90mm x 55mm at 96 DPI
    const ctx = canvas.getContext('2d');

    // 设置渐变背景
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    switch (style) {
      case 'purple':
        gradient.addColorStop(0, '#8A2BE2');
        gradient.addColorStop(0.5, '#9370DB');
        gradient.addColorStop(1, '#8A2BE2');
        break;
      case 'green':
        gradient.addColorStop(0, '#00FA9A');
        gradient.addColorStop(0.5, '#3CB371');
        gradient.addColorStop(1, '#00FA9A');
        break;
      case 'pink':
        gradient.addColorStop(0, '#FF69B4');
        gradient.addColorStop(0.5, '#FFB6C1');
        gradient.addColorStop(1, '#FF69B4');
        break;
      default:
        gradient.addColorStop(0, '#8A2BE2');
        gradient.addColorStop(0.5, '#9370DB');
        gradient.addColorStop(1, '#8A2BE2');
    }
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 添加半透明白色遮罩
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 添加文字
    ctx.font = '20px Arial';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // 文字换行
    const words = text.split(' ');
    let line = '';
    let y = canvas.height / 2;
    const lineHeight = 25;
    const maxWidth = canvas.width - 20;
    
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line, canvas.width / 2, y);
        line = words[n] + ' ';
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, canvas.width / 2, y);

    // 将 canvas 转换为 base64 编码的 PNG 图像
    canvas.convertToBlob().then(blob => {
      const reader = new FileReader();
      reader.onloadend = function() {
        resolve(reader.result);
      }
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    }).catch(reject);
  });
}
