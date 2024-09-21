// 创建一个浮动按钮
function createFloatingButton() {
  const button = document.createElement('button');
  button.textContent = '创建流光卡片';
  button.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 9999;
    padding: 10px;
    background-color: #4285f4;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    display: none;
  `;
  document.body.appendChild(button);
  return button;
}

// 创建浮动按钮
const floatingButton = createFloatingButton();

// 监听选中文本事件
document.addEventListener('selectionchange', () => {
  const selection = window.getSelection().toString().trim();
  if (selection) {
    floatingButton.style.display = 'block';
  } else {
    floatingButton.style.display = 'none';
  }
});

// 点击浮动按钮时的处理
floatingButton.addEventListener('click', () => {
  const selectedText = window.getSelection().toString().trim();
  if (selectedText) {
    // 发送消息到背景脚本,请求创建流光卡片
    chrome.runtime.sendMessage({
      action: 'createFlowingCard',
      text: selectedText
    }, response => {
      if (response && response.success) {
        alert('流光卡片已创建!');
      } else {
        alert('创建流光卡片失败,请重试。');
      }
    });
  }
});

// 监听来自popup或background的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getSelectedText') {
    const selectedText = window.getSelection().toString().trim();
    sendResponse({ text: selectedText });
  }
});
