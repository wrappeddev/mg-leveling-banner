const { createCanvas, loadImage, registerFont } = require('canvas');
const express = require('express');

const app = express();
app.use(express.json());

registerFont('./fonts/spaceranger.ttf', { family: 'Academy' });
registerFont('./fonts/spaceranger.ttf', { family: 'spaceranger' });
// registerFont('path/to/font.ttf', { family: 'CustomFont' });

app.post('/api/generate', async (req, res) => {
    const { 
        imageUrl, 
        text1, text1X, text1Y, text1Font = '30px Arial', text1Color = '#FFFFFF',
        text2, text2X, text2Y, text2Font = '30px Arial', text2Color = '#FFFFFF',
        progress = 0, progressX, progressY, progressWidth, progressHeight, 
        progressColor = '#00FF00', progressBgColor = '#CCCCCC'
    } = req.body;
    
    if (!imageUrl) {
        return res.status(400).json({ error: 'Missing imageUrl' });
    }
    
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
        
        // Ensure progress is within 0-100
        const safeProgress = Math.max(0, Math.min(progress, 100));
        const filledWidth = (safeProgress / 100) * progressWidth;
        
        // Draw progress bar foreground
        ctx.fillStyle = progressColor;
        ctx.fillRect(progressX, progressY, filledWidth, progressHeight);
        
        res.setHeader('Content-Type', 'image/png');
        canvas.createPNGStream().pipe(res);
    } catch (error) {
        res.status(500).json({ error: 'Failed to process image', details: error.message });
    }
});

module.exports = (req, res) => app(req, res);
