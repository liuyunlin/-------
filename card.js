document.addEventListener('DOMContentLoaded', function() {
  const params = new URLSearchParams(window.location.search);
  const text = params.get('text');
  const style = params.get('style');

  if (text) {
    document.getElementById('cardContent').textContent = decodeURIComponent(text);
  }

  if (style) {
    updateCardStyle(style);
  }

  document.getElementById('shareButton').addEventListener('click', function() {
    chrome.runtime.sendMessage({action: "captureAndDownload"});
  });
});

function updateCardStyle(style) {
  const flowingBackground = document.querySelector('.flowing-background');
  let gradient;

  switch (style) {
    case 'red':
      gradient = 'linear-gradient(45deg, #ff9a9e, #fad0c4, #ffecd2)';
      break;
    case 'orange':
      gradient = 'linear-gradient(45deg, #ffecd2, #fcb69f, #ffecd2)';
      break;
    case 'yellow':
      gradient = 'linear-gradient(45deg, #f6d365, #fda085, #f6d365)';
      break;
    case 'green':
      gradient = 'linear-gradient(45deg, #84fab0, #8fd3f4, #84fab0)';
      break;
    case 'cyan':
      gradient = 'linear-gradient(45deg, #89f7fe, #66a6ff, #89f7fe)';
      break;
    case 'blue':
      gradient = 'linear-gradient(45deg, #a1c4fd, #c2e9fb, #a1c4fd)';
      break;
    case 'purple':
      gradient = 'linear-gradient(45deg, #a18cd1, #fbc2eb, #a18cd1)';
      break;
    default:
      gradient = 'linear-gradient(45deg, #ff9a9e, #fad0c4, #ffecd2)';
  }

  flowingBackground.style.background = gradient;
}
