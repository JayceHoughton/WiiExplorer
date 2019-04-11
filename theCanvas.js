//All code related to drawing on the Canvas

//Setup
canvas = document.getElementById("wiiCanvas")
ctx = canvas.getContext("2d")
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//Making Gradients
// Create gradient
wiiGrd = ctx.createLinearGradient(150.000, 0.000, 150.000, 300.000);
      
// Add colors
wiiGrd.addColorStop(0.000, 'rgba(239, 241, 242, 1.000)');
wiiGrd.addColorStop(0.500, 'rgba(255, 255, 255, 1.000)');
wiiGrd.addColorStop(1.000, 'rgba(244, 244, 244, 1.000)');

//Drawing Functions
function roundedRectangle(x, y, width, height, radius, ctx) {
    ctx.beginPath()
    ctx.lineWidth = 3
    ctx.moveTo(x + radius, y)
    ctx.lineTo(x + width - radius, y)
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
    ctx.lineTo(x + width, y + height - radius)
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
    ctx.lineTo(x + radius, y + height)
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
    ctx.lineTo(x, y + radius)
    ctx.quadraticCurveTo(x, y, x + radius, y)
    ctx.closePath()
    ctx.strokeStyle = "#808080"
    ctx.stroke()
}

//Drawing Channels
channelX = 50
channelY = 0
for(i = 0; i < 3; i++)
{
    for(j = 0; j < 4; j++)
    {
    roundedRectangle(channelX, channelY, 200, 110, 30, ctx)
    channelX += 225
    }
    channelX = 50
    channelY += 125
}

//Drawing bottom Bar
ctx.beginPath()
ctx.lineWidth = 8
ctx.moveTo(0, channelY)
ctx.lineTo(150, channelY)
ctx.bezierCurveTo(150 + 50, channelY, 300 - 50, channelY + 50, 300, channelY + 50)
ctx.lineTo(canvas.width - 300, channelY + 50)
ctx.bezierCurveTo((canvas.width - 300) + 50, channelY + 50, (canvas.width - 150) - 50, channelY, canvas.width - 150, channelY)
ctx.lineTo(canvas.width, channelY)
ctx.lineTo(canvas.width, canvas.height)
ctx.lineTo(0, canvas.height)
ctx.lineTo(0, channelY)
ctx.closePath()
ctx.fillStyle = wiiGrd;
ctx.strokeStyle = "#00ccfe"
ctx.stroke()
ctx.fill()

