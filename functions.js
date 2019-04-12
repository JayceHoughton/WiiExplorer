const fs = require('fs')
const path = require('path')

const root = fs.readdirSync('/')


async function test() {
    document.getElementById("test").innerHTML = root[0]
    console.log(root)
}

//Object to keep track of File System variables
let FileSystem = {
    currentDirectory: "0"
};

//Takes current director and the name of the directory you want to move to and joins them
//Returns 1 if error/likely the directory doesn't exist or it isn't a directory
function dirUp(currDir, whatDir) {
    newDir = path.join(currDir, whatDir)
    try {
        absolutePath = path.resolve(newDir);
        correctedPath = path.normalize(absolutePath);
        console.log(currDir + " and " + whatDir)
        dir = fs.readdirSync(correctedPath);
        FileSystem.currentDirectory = correctedPath;
        return dir;

    } catch(err) {
        return 1;
    }
}

//Takes the current directory and goes back one directory
//Returns 1 if it can't go back a directory
function dirDown(currDir) {
    newDir = path.join(currDir, "..")
    try {
        absolutePath = path.resolve(newDir);
        correctedPath = path.normalize(absolutePath);
        if(correctedPath === undefined)
        {
            return 1;
        }
        dir = fs.readdirSync(correctedPath);
        FileSystem.currentDirectory = correctedPath;
        console.log(correctedPath)
        return dir;

    } catch(err) {
        return 1;
    }
}

//Creates the base directory
function baseDirectory() {
    try {
        baseDir = path.normalize(path.resolve('/'));
        dir = fs.readdirSync(baseDir);
        FileSystem.currentDirectory = path.normalize(path.resolve('/'))
        return dir;
    } catch (err) {
        return 1;
    }
}

//Temporary function potentially for creating buttons on page.
function makeButtons(dir) {
    //for(i = 0; i < dir.length; i++)
    lessThan = dir.length
    nextBool = dir.length - 12
    if(dir.length > 12)
    {
        lessThan = 12
    }
    butLeft = 50;
    butTop = 5;
    for(i = 0; i < lessThan; i++)
    {
        newDir = dir[i].toString()
        button = document.createElement('button')
        button.value = newDir
        button.innerHTML = newDir
        button.style.position = "absolute"
        if(i !== 0 && i % 4 == 0)
        {
            butTop += 125
            butLeft = 50
        }
        button.style.left = (butLeft) + "px"
        button.style.top = (butTop) + "px"
        button.className = "wiiButton"
        button.onclick = function() {
            replaceButtons(dirUp(FileSystem.currentDirectory, this.value), 0)
        }
        document.getElementById("buttons").appendChild(button)
        butLeft += 225
    }
    butLeft = 53
    butTop = 5
    for(k = 0; k < 12; k++)
    {
        image = document.createElement("IMG")
        image.style.position = "absolute"
        image.src = "static.gif"
        if(k !== 0 && k % 4 == 0)
        {
            butTop += 125
            butLeft = 53
        }
        image.style.left = (butLeft) + "px"
        image.style.top = (butTop) + "px"
        image.className = "staticImage"
        document.getElementById("buttons").appendChild(image)
        butLeft += 225
    }
    if(nextBool > 0)
    {
        temp = i
        button = document.createElement('button')
        button.style.position = "absolute"
        button.className = "nextButton"
        button.onclick = function() {
            console.log(temp)
            replaceButtons(dir, temp)
        }
        document.getElementById("buttons").appendChild(button)
    }
}

//Async function to place the buttons, waits for buttons to be made first
async function replaceButtons(dir, pos) {
    if(dir === 1)
    {
        return 1;
    }
    nextBool = dir.length - pos - 12
    oldNodes = document.getElementById("buttons")
    while(oldNodes.firstChild)
    {
        oldNodes.removeChild(oldNodes.firstChild);
    }
    lessThan = dir.length
    if(dir.length - pos > 12)
    {
        lessThan = pos + 12
    }
    console.log(lessThan)
    butLeft = 50;
    butTop = 5;
    //for(i = 0; i < dir.length; i++)
    j = 0
    for(i = pos; i < lessThan; i++)
    {
        newDir = dir[i].toString()
        button = document.createElement('button')
        button.value = newDir
        button.innerHTML = newDir
        button.style.position = "absolute"
        if(j !== 0 && j % 4 == 0)
        {
            butTop += 125
            butLeft = 50
        }
        button.style.left = (butLeft) + "px"
        button.style.top = (butTop) + "px"
        button.className = "wiiButton"
        button.onclick = function() {
            replaceButtons(dirUp(FileSystem.currentDirectory, this.value), 0)
        }
        document.getElementById("buttons").appendChild(button)
        butLeft += 225
        j++
    }
    butLeft = 53
    butTop = 5
    for(k = 0; k < 12; k++)
    {
        image = document.createElement("IMG")
        image.style.position = "absolute"
        image.src = "static.gif"
        if(k !== 0 && k % 4 == 0)
        {
            butTop += 125
            butLeft = 53
        }
        image.style.left = (butLeft) + "px"
        image.style.top = (butTop) + "px"
        image.className = "staticImage"
        document.getElementById("buttons").appendChild(image)
        butLeft += 225
    }
    if(nextBool > 0)
    {
        temp = i
        button = document.createElement('button')
        button.style.position = "absolute"
        button.className = "nextButton"
        button.onclick = function() {
            console.log(temp)
            replaceButtons(dir, temp)
        }
        document.getElementById("buttons").appendChild(button)
    }
    if(pos >= 12)
    {
        button = document.createElement('button')
        button.style.position = "absolute"
        button.className = "backButton"
        button.onclick = function() {
            replaceButtons(dir, pos-12)
        }
        document.getElementById("buttons").appendChild(button)
    }
    if(FileSystem.currentDirectory !== path.normalize(path.resolve('/')))
    {
        button = document.createElement('button')
        button.style.position = "absolute"
        button.className = "superBack"
        button.onclick = function() {
            replaceButtons(dirDown(FileSystem.currentDirectory), 0)
        }
        document.getElementById("buttons").appendChild(button)
    }
}



//Initializes the app by calling baseDirectory and makeButtons
function init() {
    baseDir = baseDirectory()
    if(baseDir !== 1)
    {
        makeButtons(baseDir)
    }
    else {
        console.log("Failed to initiazlie.")
        return 0;
    }
}

init()