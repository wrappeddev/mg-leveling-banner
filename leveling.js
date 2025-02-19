const { createCanvas, loadImage, registerFont } = require('canvas');
const express = require('express');

const app = express();
app.use(express.json());

app.post('/api/generate', async (req, res) => {
    const { 
        imageUrl, 
        text1, text1X, text1Y, text1Font, text1Color,
        text2, text2X, text2Y, text2Font, text2Color,
        progress, progressX, progressY, progressWidth, progressHeight, progressColor, progressBgColor
    } = req.body;
    
    try {
        const image = await loadImage(imageUrl);
        const canvas = createCanvas(image.width, image.height);
        const ctx = canvas.getContext('2d');
        
        ctx.drawImage(image, 0, 0, image.width, image.height);
        
        // Draw first text
        ctx.font = text1Font;
        ctx.fillStyle = text1Color;
        ctx.fillText(text1, text1X, text1Y);
        
        // Draw second text
        ctx.font = text2Font;
        ctx.fillStyle = text2Color;
        ctx.fillText(text2, text2X, text2Y);
        
        // Draw progress bar background
        ctx.fillStyle = progressBgColor;
        ctx.fillRect(progressX, progressY, progressWidth, progressHeight);
        
        // Draw progress bar foreground
        const filledWidth = (progress / 100) * progressWidth;
        ctx.fillStyle = progressColor;
        ctx.fillRect(progressX, progressY, filledWidth, progressHeight);
        
        res.setHeader('Content-Type', 'image/png');
        canvas.createPNGStream().pipe(res);
    } catch (error) {
        res.status(500).json({ error: 'Failed to process image', details: error.message });
    }
});

module.exports = app;
