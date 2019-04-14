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

// Create gradient
barGrd = ctx.createLinearGradient(150.000, 0.000, 150.000, 300.000);
      
// Add colors
barGrd.addColorStop(0.000, 'rgba(111, 111, 114, 1.000)');
barGrd.addColorStop(0.500, 'rgba(255, 255, 255, 1.000)');
barGrd.addColorStop(1.000, 'rgba(127, 127, 127, 1.000)');

// Create gradient
buttonGrd = ctx.createRadialGradient(66.900, 66.900, 0.000, 150.000, 150.000, 150.000);
      
// Add colors
buttonGrd.addColorStop(0.464, 'rgba(255, 255, 255, 1.000)');
buttonGrd.addColorStop(1.000, 'rgba(229, 229, 229, 1.000)');

//Drawing Functions
function roundedRectangle(x, y, width, height, radius, ctx) {
    ctx.save()

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
channelY = 5
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
ctx.moveTo(0, 380)
ctx.lineTo(150, 380)
ctx.bezierCurveTo(150 + 50, 380, 300 - 50, 380 + 50, 300, 380 + 50)
ctx.lineTo(canvas.width - 300, 380 + 50)
ctx.bezierCurveTo((canvas.width - 300) + 50, 380 + 50, (canvas.width - 150) - 50, 380, canvas.width - 150, 380)
ctx.lineTo(canvas.width, 380)
ctx.lineTo(canvas.width, canvas.height)
ctx.lineTo(0, canvas.height)
ctx.lineTo(0, 380)
ctx.closePath()
ctx.fillStyle = wiiGrd;
ctx.strokeStyle = "#00ccfe"
ctx.stroke()
ctx.fill()

//Drawing left button wrapper
ctx.beginPath()
ctx.lineWidth = 3
ctx.moveTo(canvas.width, 380 + 20)
ctx.lineTo(canvas.width - 100, 380 + 20)
ctx.bezierCurveTo((canvas.width - 100) - 100, 380 + 20, (canvas.width - 100) - 100, 380 + 130, canvas.width - 100, 380 + 130)
ctx.lineTo(canvas.width, 380 + 130)
ctx.closePath()
ctx.strokeStyle = barGrd
ctx.stroke()

//Drawing right button wrapper
ctx.beginPath()
ctx.lineWidth = 3
ctx.moveTo(0, 380 + 20)
ctx.lineTo(0 + 100, 380 + 20)
ctx.bezierCurveTo((0 + 100) + 100, 380 + 20, (0 + 100) + 100, 380 + 130, 0 + 100, 380 + 130)
ctx.lineTo(0, 380 + 130)
ctx.closePath()
ctx.strokeStyle = barGrd
ctx.stroke()

//Drawing bottom button wrappers
ctx.beginPath()
ctx.lineWidth = 3
ctx.moveTo(200, canvas.height)
ctx.lineTo(200, 500)
ctx.bezierCurveTo(200, 420, 320, 420, 320, 500)
ctx.lineTo(320, canvas.height)
ctx.closePath()
ctx.strokeStyle = barGrd
ctx.stroke()

ctx.beginPath()
ctx.lineWidth = 3
ctx.moveTo(680, canvas.height)
ctx.lineTo(680, 500)
ctx.bezierCurveTo(680, 420, 800, 420, 800, 500)
ctx.lineTo(800, canvas.height)
ctx.closePath()
ctx.strokeStyle = barGrd
ctx.stroke()

ctx.beginPath()
ctx.arc(260, 500, 50, 0, 2 * Math.PI)
ctx.strokeStyle = "#00ccfe"
ctx.fillStyle = buttonGrd
ctx.fill()
ctx.stroke()

ctx.beginPath()
ctx.arc(740, 500, 50, 0, 2 * Math.PI)
ctx.strokeStyle = "#00ccfe"
ctx.fillStyle = buttonGrd
ctx.fill()
ctx.stroke()

//Drawing info section
ctx.beginPath()
ctx.lineWidth = 7
ctx.moveTo(340, canvas.height)
ctx.lineTo(340, 470)
ctx.bezierCurveTo(340, 430, 660, 430, 660, 470)
ctx.lineTo(660, canvas.height)
ctx.closePath()
ctx.fillStyle = "white"
ctx.strokeStyle = barGrd
ctx.stroke()
ctx.fill()

//Drawing left button wrapper
ctx.beginPath()
ctx.arc(120, 380 + 75, 45, 0, 2 * Math.PI)
ctx.strokeStyle = "#00ccfe"
ctx.fillStyle = buttonGrd
ctx.fill()
ctx.stroke()

//Drawing right button wrapper
ctx.beginPath()
ctx.arc(canvas.width - 120, 380 + 75, 45, 0, 2 * Math.PI)
ctx.strokeStyle = "#00ccfe"
ctx.fillStyle = buttonGrd
ctx.fill()
ctx.stroke()

//Clearing and restoring the Canvas functions
menuContext = ctx.getImageData(0, 0, canvas.width, canvas.height)
function clearCanvas() {
    canvas = document.getElementById("wiiCanvas")
    context = canvas.getContext("2d")
    context.clearRect(0, 0, canvas.width, canvas.height)
}
function restoreWiiMenu() {
    ctx.putImageData(menuContext, 0, 0)
}

function drawFileChannel() {

    canvas = document.getElementById("wiiCanvas")
    ftx = canvas.getContext("2d")
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    //File UI
    ftx.lineWidth = 10
    ftx.strokeStyle = "rgba(0, 0, 91, 0.2)"
    ftx.strokeRect(0, 0, 505, canvas.height)

    ftx.fillStyle = "rgba(0, 159, 99, 0.5)"
    ftx.fillRect(5, 5, 495, canvas.height-10)

    ftx.fillStyle = "rgb(211, 211, 211, 1)"
    ftx.fillRect(0, 25, 300, 100)

    ftx.arc(300, 75, 50, 0, 2 * Math.PI)
    ftx.fill()


    ftx.fillStyle = "rgba(0, 0, 0, 1)"
    ftx.font = "20px monospace";
    ftx.fillText("Create New Fii-le:", 30, 52);

    //Directory UI

    ftx.fillStyle = "rgb(211, 211, 211, 1)"
    ftx.fillRect(0, 250, 300, 100)

    ftx.arc(300, 300, 50, 0, 2 * Math.PI)
    ftx.fill()


    ftx.fillStyle = "rgba(0, 0, 0, 1)"
    ftx.font = "20px monospace";
    ftx.fillText("Create New Dii-rectory:", 30, 278);
}


//Drawing time on the menu
//Commented out, will make the clock HTML
/*function clock() {
    date = new Date()
    ctx.font = "60px Arial"
    ctx.fillStyle = "#000000"
    month = Number(date.getMonth()) + 1
    year = date.getFullYear().toString().substr(2, 2)
    dayArr = ["Sun", "Mon", "Tue", "Wed", "Thurs", "Fri", "Sat"]
    dateString = dayArr[date.getDay()] + " " + month + "/" + year
    ctx.fillText(dateString, 350, 380 + 100)
    timeString = date.getHours() + ":" + date.getMinutes()
    ctx.fillText(timeString, 450, 380 + 30)
}
clock()
setInterval(clock, 1000)*/
