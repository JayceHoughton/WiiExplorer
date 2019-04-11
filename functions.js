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
        dir = fs.readdirSync(correctedPath);
        FileSystem.currentDirectory = correctedPath;
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
    for(i = 0; i < dir.length; i++)
    {
        newDir = dir[i].toString()
        button = document.createElement('button')
        button.value = newDir
        button.innerHTML = newDir
        button.onclick = function() {
            replaceButtons(dirUp(FileSystem.currentDirectory, this.value))
        }
        document.getElementById("buttons").appendChild(button)
    }
    if(FileSystem.currentDirectory !== path.normalize(path.resolve('/')))
    {
        button = document.createElement('button')
        button.innerHTML = "Back"
        button.onclick = function() {
            replaceButtons(dirDown(FileSystem.currentDirectory))
        }
        document.getElementById("buttons").appendChild(button)
    }
}

//Async function to place the buttons, waits for buttons to be made first
async function replaceButtons(dir) {
    oldNodes = document.getElementById("buttons")
    while(oldNodes.firstChild)
    {
        oldNodes.removeChild(oldNodes.firstChild);
    }
    for(i = 0; i < dir.length; i++)
    {
        newDir = dir[i].toString()
        button = document.createElement('button')
        button.value = newDir
        button.innerHTML = newDir
        button.onclick = function() {
            replaceButtons(dirUp(FileSystem.currentDirectory, this.value))
        }
        document.getElementById("buttons").appendChild(button)
    }
    if(FileSystem.currentDirectory !== path.normalize(path.resolve('/')))
    {
        button = document.createElement('button')
        button.innerHTML = "Back"
        button.onclick = function() {
            replaceButtons(dirDown(FileSystem.currentDirectory))
        }
        document.getElementById("buttons").appendChild(button)
    }
}



//Initializes the app by calling baseDirectory and makeButtons
function init() {
    baseDir = baseDirectory()
    if(baseDir !== 1)
    {
        //makeButtons(baseDir)
    }
    else {
        console.log("Failed to initiazlie.")
        return 0;
    }
}

init()