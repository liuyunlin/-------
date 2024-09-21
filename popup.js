document.addEventListener('DOMContentLoaded', function() {
  const textArea = document.getElementById('cardText');
  const styleSelect = document.getElementById('cardStyle');
  const generateBtn = document.getElementById('generateCard');

  generateBtn.addEventListener('click', function() {
    const text = textArea.value;
    const style = styleSelect.value;
    if (text) {
      const cardUrl = chrome.runtime.getURL(`card.html?text=${encodeURIComponent(text)}&style=${encodeURIComponent(style)}`);
      chrome.tabs.create({ url: cardUrl });
    }
  });
});
