const express = require('express');
const { createCanvas } = require('canvas');
const app = express();
const port = 3000;

app.use(express.json());

const gradients = {
  purple: ['#8A2BE2', '#9370DB', '#8A2BE2'],
  green: ['#00FA9A', '#3CB371', '#00FA9A'],
  pink: ['#FF69B4', '#FFB6C1', '#FF69B4']
};

app.post('/generate-card', (req, res) => {
  const { text, style } = req.body;
  const canvas = createCanvas(90 * 3.779528, 55 * 3.779528); // 转换mm到像素
  const ctx = canvas.getContext('2d');

  // 选择渐变颜色
  const colors = gradients[style] || gradients.purple;

  // 创建渐变背景
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, colors[0]);
  gradient.addColorStop(0.5, colors[1]);
  gradient.addColorStop(1, colors[2]);
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
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);

  // 将canvas转换为图片并发送
  res.setHeader('Content-Type', 'image/png');
  canvas.createPNGStream().pipe(res);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
