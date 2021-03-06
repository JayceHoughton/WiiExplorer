const fs = require('fs')
const path = require('path')
const { clipboard } = require('electron')
const dialog = require('electron').remote.dialog
const root = fs.readdirSync('/')
const rimraf = require("rimraf")


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

//Function for creating the first Buttons on the app on statup
function makeButtons(dir) {

    //Creates the File Channel and the Music Channel before everything else
    createImportantChannels()

    //Creates the Element for the info text section for displaying info about files
    fileInfo = document.createElement("P")
    fileInfo.style.position = "absolute"
    fileInfo.className = "infoText"
    fileInfo.id = "info"
    fileInfo.innerHTML = "Right Click a Channel to Copy it/display information.<br/> File Path: <br/><br/> File Size: <br/><br/> Creation Time: <br/><br/> Last Modified: <br/>"
    document.getElementById("buttons").appendChild(fileInfo)
    
    lessThan = dir.length
    nextBool = dir.length - 10
    if(dir.length > 10)
    {
        lessThan = 10
    }
    butLeft = 500;
    butTop = 5;
    //Loop for creating buttons for the channels
    for(i = 0; i < lessThan; i++)
    {
        newDir = dir[i].toString()
        button = document.createElement('button')
        button.value = newDir
        button.rClick = newDir
        this.rClick = newDir
        button.nClick = newDir
        button.check = newDir
        this.check = path.join(FileSystem.currentDirectory, this.rClick)
        this.check = path.resolve(this.check);
        this.check = path.normalize(this.check);

        //Checks if dir entry is a file or directory and then uses that as a naming convention 
        try {
            if(fs.lstatSync(this.check).isDirectory())
            {
                button.className = "folderButton"
                if(newDir.length < 14)
                {
                    button.innerHTML = newDir + "<br/> Folder Channel"
                }
                else
                {
                    button.innerHTML = newDir.substring(0, 14) + " . . .<br/> Folder Channel" 
                }
            }
            else
            {
                button.className = "fileButton"
                if(newDir.length < 14)
                {
                    button.innerHTML = newDir + "<br/> File Channel"
                }
                else
                {
                    button.innerHTML = newDir.substring(0, 14) + " . . .<br/> File Channel" 
                }
            }
        } catch {
            button.className = "fileButton"
            if(newDir.length < 14)
            {
                button.innerHTML = newDir + "<br/> File Channel"
            }
            else
            {
                button.innerHTML = newDir.substring(0, 14) + " . . .<br/> File Channel" 
            }
        }
        button.stats = []
        button.style.position = "absolute"
        if(i === 2 || i === 6 || i === 10)
        {
            butTop += 125
            butLeft = 50
        }
        button.style.left = (butLeft) + "px"
        button.style.top = (butTop) + "px"

        //Copies file path to clipboar when you click on a channel button
        button.onmousedown = function(event) {
            if(event.which === 3)
            {
                if(this.nClick !== clipboard.readText())
                {
                    this.nClick = path.join(FileSystem.currentDirectory, this.rClick)
                    this.nClick = path.resolve(this.nClick);
                    this.nClick = path.normalize(this.nClick);
                    clipboard.writeText(this.nClick)
                    this.stats = fs.statSync(this.nClick)
                    document.getElementById("info").innerHTML = "Right Click a Channel to Copy it/display information.<br/> File Path: " + this.nClick + "<br/><br/> File Size: " + this.stats.size + " KB<br/><br/> Creation Time: " + this.stats.birthtime + "<br/><br/> Last Modified: " + this.stats.mtime + "<br/>"
                }
            }
        }
        button.onclick = function() {
            replaceButtons(dirUp(FileSystem.currentDirectory, this.value), 0)
        }
        document.getElementById("buttons").appendChild(button)
        butLeft += 225
    }
    butLeft = 53
    butTop = 5

    //Puts background images static in all channels
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

    //Below section creates all important buttons like paste and trash and cut.
    pasteButton = document.createElement('button')
    pasteButton.style.position = "absolute"
    pasteButton.className = "pasteButton"
    document.getElementById("buttons").appendChild(pasteButton)

    //Prompts the user if they clikc the delete button, and deletes if they confirm they want to delete
    trashButton = document.createElement('button')
    trashButton.style.position = "absolute"
    trashButton.className = "trashButton"
    trashButton.onclick = function() {
        absolutePath = path.resolve(FileSystem.currentDirectory);
        correctedPath = path.normalize(absolutePath);
        copyFile = clipboard.readText()
        options = {
            type: 'question',
            buttons: ['No', 'Yes'],
            title: 'Are you sure?',
            message: 'Are you sure you want to delete ' + copyFile,
        }
        options2 = {
            type: 'question',
            buttons: ['No', 'Yes'],
            title: 'Are you SURE?',
            message: 'Are you SURE you want to delete ' + copyFile,
        }
        dialog.showMessageBox(null, options, (response) => {
            if(response == 1)
            {
                dialog.showMessageBox(null, options2, (response) => {
                    if(response == 1)
                    {
                        deleteFile = clipboard.readText()
                        if(!fs.existsSync(deleteFile))
                        {
                            error = dialog.showMessageBox({message: "File or Directory does not exist", title: "Oops!"})
                            console.log(error)
                        }
                        else
                        {
                            try {
                                if(fs.lstatSync(deleteFile).isDirectory())
                                {
                                    rimraf(deleteFile, function() {
                                        correctedDir = fs.readdirSync(correctedPath);
                                        if(pos >= 12)
                                            replaceButtons(correctedDir, pos-12)
                                        else if(pos >= 10)
                                            replaceButtons(correctedDir, pos-10)
                                        else
                                            replaceButtons(correctedDir, 0)
                                            console.log(correctedDir)
                                    })
                                }
                                else {
                                    fs.unlinkSync(deleteFile)
                                }
                                correctedDir = fs.readdirSync(correctedPath);
                                success = dialog.showMessageBox({message: "File Successfully Deleted", title: "Success"})
                                console.log(success)
                                if(pos >= 12)
                                    replaceButtons(correctedDir, pos-12)
                                else if(pos >= 10)
                                    replaceButtons(correctedDir, pos-10)
                                else
                                    replaceButtons(correctedDir, 0)
                                    console.log(correctedDir)
                            } catch(err) {
                                dialog.showMessageBox({message: err, title: "!"})
                            }
                        }
                    }
                })
            }
        })
    }
    document.getElementById("buttons").appendChild(trashButton)

    //Nearly identical to deletion, but will instead of full deleting the file, it will delete it from its original
    //location and then move it to a new location which is where the cut button is clicked
    cutButton = document.createElement('button')
    cutButton.style.position = "absolute"
    cutButton.className = "cutButton"
    cutButton.onclick = function() {
        absolutePath = path.resolve(FileSystem.currentDirectory);
        correctedPath = path.normalize(absolutePath);
        copyFile = clipboard.readText()
        copyFileCorrected = copyFile.replace(/^.*[\\\/]/, '')
        newDir = path.join(FileSystem.currentDirectory, copyFileCorrected)
        absolutePathcopy = path.resolve(newDir);
        correctedPathcopy = path.normalize(absolutePathcopy);
        options = {
            type: 'question',
            buttons: ['No', 'Yes'],
            title: 'Are you sure?',
            message: 'Are you sure you want to cut ' + copyFile + ' to ' + correctedPathcopy + ' ?',
        }
        options2 = {
            type: 'question',
            buttons: ['No', 'Yes'],
            title: 'Are you SURE?',
            message: 'Are you SURE you want to cut ' + copyFile + ' to ' + correctedPathcopy + ' ?',
        }
        dialog.showMessageBox(null, options, (response) => {
            if(response == 1)
            {
                dialog.showMessageBox(null, options2, (response) => {
                    if(response == 1)
                    {
                        deleteFile = clipboard.readText()
                        if(!fs.existsSync(deleteFile))
                        {
                            error = dialog.showMessageBox({message: "File does not exist", title: "Oops!"})
                            console.log(error)
                        }
                        else if(fs.existsSync(correctedPathcopy))
                        {
                            error = dialog.showMessageBox({message: "File already exists in this directory!", title: "Oops!"})
                            console.log(error)
                        }
                        else
                        {
                            try {
                                if(fs.lstatSync(deleteFile).isDirectory())
                                {
                                    error = dialog.showMessageBox({message: "Cannot Cut Directories!", title: "Oops!"})
                                }
                                else
                                {
                                    fs.unlinkSync(deleteFile)
                                    fs.closeSync(fs.openSync(correctedPathcopy, 'a'))
                                    correctedDir = fs.readdirSync(correctedPath);
                                    success = dialog.showMessageBox({message: "File Successfully Moved", title: "Success"})
                                    console.log(success)
                                    if(pos >= 12)
                                        replaceButtons(correctedDir, pos-12)
                                    else if(pos >= 10)
                                        replaceButtons(correctedDir, pos-10)
                                    else
                                        replaceButtons(correctedDir, 0)
                                        console.log(correctedDir)
                                }
                            } catch(err) {
                                dialog.showMessageBox({message: err, title: "!"})
                            }
                        }
                    }
                })
            }
        })
    }
    document.getElementById("buttons").appendChild(cutButton)


}

//Async function to place the buttons, waits for buttons to be made first
//All relevant functions are functionally the same as the make Buttons function
//Main difference is that it deletes the dom elements first before redrawing
//It also takes position so that we know where to start looping through the directory
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

    fileInfo = document.createElement("P")
    fileInfo.style.position = "absolute"
    fileInfo.className = "infoText"
    fileInfo.id = "info"
    fileInfo.innerHTML = "Right Click a Channel to Copy it/display information.<br/> File Path: <br/><br/> File Size: <br/><br/> Creation Time: <br/><br/> Last Modified: <br/>"
    document.getElementById("buttons").appendChild(fileInfo)

    lessThan = dir.length
    if(dir.length - pos > 12)
    {
        lessThan = pos + 12
    }
    console.log(lessThan)
    if(pos !== 0)
    {
        butLeft = 50;
        butTop = 5;
        //for(i = 0; i < dir.length; i++)
        j = 0
        for(i = pos; i < lessThan; i++)
        {
            newDir = dir[i].toString()
            button = document.createElement('button')
            button.value = newDir
            //button.innerHTML = newDir
            button.rClick = newDir
            this.rClick = newDir
            button.nClick = newDir
            button.check = newDir
            this.check = path.join(FileSystem.currentDirectory, this.rClick)
            this.check = path.resolve(this.check);
            this.check = path.normalize(this.check);
            button.style.position = "absolute"
            try {
                if(fs.lstatSync(this.check).isDirectory())
                {
                    button.className = "folderButton"
                    if(newDir.length < 14)
                    {
                        button.innerHTML = newDir + "<br/> Folder Channel"
                    }
                    else
                    {
                        button.innerHTML = newDir.substring(0, 14) + " . . .<br/> Folder Channel" 
                    }
                }
                else
                {
                    button.className = "fileButton"
                    if(newDir.length < 14)
                    {
                        button.innerHTML = newDir + "<br/> File Channel"
                    }
                    else
                    {
                        button.innerHTML = newDir.substring(0, 14) + " . . .<br/> File Channel" 
                    }
                }
            } catch {
                button.className = "fileButton"
                if(newDir.length < 14)
                {
                    button.innerHTML = newDir + "<br/> File Channel"
                }
                else
                {
                    button.innerHTML = newDir.substring(0, 14) + " . . .<br/> File Channel" 
                }
            }
            if(j !== 0 && j % 4 == 0)
            {
                butTop += 125
                butLeft = 50
            }
            button.style.left = (butLeft) + "px"
            button.style.top = (butTop) + "px"
            //button.className = "wiiButton"
            button.onmousedown = function(event) {
                if(event.which === 3)
                {
                    if(this.nClick !== clipboard.readText())
                    {
                        this.nClick = path.join(FileSystem.currentDirectory, this.rClick)
                        this.nClick = path.resolve(this.nClick);
                        this.nClick = path.normalize(this.nClick);
                        console.log(this.nClick + " and " + clipboard.readText())
                        clipboard.writeText(this.nClick)
                        this.stats = fs.statSync(this.nClick)
                        document.getElementById("info").innerHTML = "Right Click a Channel to Copy it/display information.<br/> File Path: " + this.nClick + "<br/><br/> File Size: " + this.stats.size*0.001 + " KB<br/><br/> Creation Time: " + this.stats.birthtime + "<br/><br/> Last Modified: " + this.stats.mtime + "<br/>"
                    }
                }
            }
            button.onclick = function() {
                replaceButtons(dirUp(FileSystem.currentDirectory, this.value), 0)
            }
            document.getElementById("buttons").appendChild(button)
            butLeft += 225
            j++
        }
    }
    else
    {
        lessThan = dir.length
        if(dir.length > 10)
        {
            lessThan = 10
        }
        butLeft = 500;
        butTop = 5;
        for(i = 0; i < lessThan; i++)
        {
            newDir = dir[i].toString()
            button = document.createElement('button')
            button.value = newDir
            //button.innerHTML = newDir
            button.rClick = newDir
            this.rClick = newDir
            button.nClick = newDir
            button.check = newDir
            this.check = path.join(FileSystem.currentDirectory, this.rClick)
            this.check = path.resolve(this.check);
            this.check = path.normalize(this.check);
            button.style.position = "absolute"
            try {
                if(fs.lstatSync(this.check).isDirectory())
                {
                    button.className = "folderButton"
                    if(newDir.length < 14)
                    {
                        button.innerHTML = newDir + "<br/> Folder Channel"
                    }
                    else
                    {
                        button.innerHTML = newDir.substring(0, 14) + " . . .<br/> Folder Channel" 
                    }
                }
                else
                {
                    button.className = "fileButton"
                    if(newDir.length < 14)
                    {
                        button.innerHTML = newDir + "<br/> File Channel"
                    }
                    else
                    {
                        button.innerHTML = newDir.substring(0, 14) + " . . .<br/> File Channel" 
                    }
                }
            } catch {
                button.className = "fileButton"
                if(newDir.length < 14)
                {
                    button.innerHTML = newDir + "<br/> File Channel"
                }
                else
                {
                    button.innerHTML = newDir.substring(0, 14) + " . . .<br/> File Channel" 
                }
            }
            if(i === 2 || i === 6 || i === 10)
            {
                butTop += 125
                butLeft = 50
            }
            button.style.left = (butLeft) + "px"
            button.style.top = (butTop) + "px"
            //button.className = "wiiButton"
            button.onmousedown = function(event) {
                if(event.which === 3)
                {
                    if(this.nClick !== clipboard.readText())
                    {
                        this.nClick = path.join(FileSystem.currentDirectory, this.rClick)
                        this.nClick = path.resolve(this.nClick);
                        this.nClick = path.normalize(this.nClick);
                        console.log(this.nClick + " and " + clipboard.readText())
                        clipboard.writeText(this.nClick)
                        this.stats = fs.statSync(this.nClick)
                        document.getElementById("info").innerHTML = "Right Click a Channel to Copy it/display information.<br/> File Path: " + this.nClick + "<br/><br/> File Size: " + this.stats.size*0.001 + " KB<br/><br/> Creation Time: " + this.stats.birthtime + "<br/><br/> Last Modified: " + this.stats.mtime + "<br/>"
                    }
                }
            }
            button.onclick = function() {
                replaceButtons(dirUp(FileSystem.currentDirectory, this.value), 0)
            }
            document.getElementById("buttons").appendChild(button)
            butLeft += 225
        } 
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
    if(pos === 0)
    {
        createImportantChannels()
    }
    if(nextBool > 0)
    {
        temp = i
        button = document.createElement('button')
        button.style.position = "absolute"
        button.className = "nextButton"
        button.onclick = function() {
            replaceButtons(dir, temp)
        }
        document.getElementById("buttons").appendChild(button)
    }
    if(pos >= 10)
    {
        
        button = document.createElement('button')
        button.style.position = "absolute"
        button.className = "backButton"
        button.onclick = function() {
            if(pos >= 12)
                replaceButtons(dir, pos-12)
            else
                replaceButtons(dir, pos-10)
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
    pasteButton = document.createElement('button')
    pasteButton.style.position = "absolute"
    pasteButton.className = "pasteButton"
    pasteButton.onclick = function() {
        copyFile = clipboard.readText()
        //Regex that returns only filename
        copyFileCorrected = copyFile.replace(/^.*[\\\/]/, '')
        newDir = path.join(FileSystem.currentDirectory, copyFileCorrected)
        absolutePath = path.resolve(newDir);
        correctedPath = path.normalize(absolutePath);
        if(fs.existsSync(correctedPath))
        {
            error = dialog.showMessageBox({message: "File Already Exists", title: "Oops!"})
            console.log(error)
        }
        else
        {
            try {
                //fs.closeSync(fs.openSync(correctedPath, 'a'))
                fs.copyFile(copyFile, correctedPath, (err) => {
                    if (err)
                    { 
                        throw err
                    }
                    correctedDir = fs.readdirSync(FileSystem.currentDirectory);
                    success = dialog.showMessageBox({message: "File Successfully Pasted", title: "Success"})
                    console.log(success)
                    if(pos >= 12)
                        replaceButtons(correctedDir, pos-12)
                    else if(pos >= 10)
                        replaceButtons(correctedDir, pos-10)
                    else {
                        replaceButtons(correctedDir, 0)
                    }
                })
            } catch(err) {
                console.log(err)
                console.log(copyFile)
                console.log(correctedPath)
            }
        }
    }
    document.getElementById("buttons").appendChild(pasteButton)
    trashButton = document.createElement('button')
    trashButton.style.position = "absolute"
    trashButton.className = "trashButton"
    trashButton.onclick = function() {
        absolutePath = path.resolve(FileSystem.currentDirectory);
        correctedPath = path.normalize(absolutePath);
        copyFile = clipboard.readText()
        options = {
            type: 'question',
            buttons: ['No', 'Yes'],
            title: 'Are you sure?',
            message: 'Are you sure you want to delete ' + copyFile,
        }
        options2 = {
            type: 'question',
            buttons: ['No', 'Yes'],
            title: 'Are you SURE?',
            message: 'Are you SURE you want to delete ' + copyFile,
        }
        dialog.showMessageBox(null, options, (response) => {
            if(response == 1)
            {
                dialog.showMessageBox(null, options2, (response) => {
                    if(response == 1)
                    {
                        deleteFile = clipboard.readText()
                        if(!fs.existsSync(deleteFile))
                        {
                            error = dialog.showMessageBox({message: "File or Directory does not exist", title: "Oops!"})
                            console.log(error)
                        }
                        else
                        {
                            try {
                                if(fs.lstatSync(deleteFile).isDirectory())
                                {
                                    rimraf(deleteFile, function() {
                                        correctedDir = fs.readdirSync(correctedPath);
                                        if(pos >= 12)
                                            replaceButtons(correctedDir, pos-12)
                                        else if(pos >= 10)
                                            replaceButtons(correctedDir, pos-10)
                                        else
                                            replaceButtons(correctedDir, 0)
                                            console.log(correctedDir)
                                    })
                                }
                                else {
                                    fs.unlinkSync(deleteFile)
                                }
                                correctedDir = fs.readdirSync(correctedPath);
                                success = dialog.showMessageBox({message: "File Successfully Deleted", title: "Success"})
                                console.log(success)
                                if(pos >= 12)
                                    replaceButtons(correctedDir, pos-12)
                                else if(pos >= 10)
                                    replaceButtons(correctedDir, pos-10)
                                else
                                    replaceButtons(correctedDir, 0)
                                    console.log(correctedDir)
                            } catch(err) {
                                dialog.showMessageBox({message: err, title: "!"})
                            }
                        }
                    }
                })
            }
        })
    }
    document.getElementById("buttons").appendChild(trashButton)

    cutButton = document.createElement('button')
    cutButton.style.position = "absolute"
    cutButton.className = "cutButton"
    cutButton.onclick = function() {
        absolutePath = path.resolve(FileSystem.currentDirectory);
        correctedPath = path.normalize(absolutePath);
        copyFile = clipboard.readText()
        copyFileCorrected = copyFile.replace(/^.*[\\\/]/, '')
        newDir = path.join(FileSystem.currentDirectory, copyFileCorrected)
        absolutePathcopy = path.resolve(newDir);
        correctedPathcopy = path.normalize(absolutePathcopy);
        options = {
            type: 'question',
            buttons: ['No', 'Yes'],
            title: 'Are you sure?',
            message: 'Are you sure you want to move ' + copyFile + ' to ' + correctedPathcopy + ' ?',
        }
        options2 = {
            type: 'question',
            buttons: ['No', 'Yes'],
            title: 'Are you SURE?',
            message: 'Are you SURE you want to move ' + copyFile + ' to ' + correctedPathcopy + ' ?',
        }
        dialog.showMessageBox(null, options, (response) => {
            if(response == 1)
            {
                dialog.showMessageBox(null, options2, (response) => {
                    if(response == 1)
                    {
                        deleteFile = clipboard.readText()
                        if(!fs.existsSync(deleteFile))
                        {
                            error = dialog.showMessageBox({message: "File does not exist", title: "Oops!"})
                            console.log(error)
                        }
                        else if(fs.existsSync(correctedPathcopy))
                        {
                            error = dialog.showMessageBox({message: "File already exists in this directory!", title: "Oops!"})
                            console.log(error)
                        }
                        else
                        {
                            try {
                                if(fs.lstatSync(deleteFile).isDirectory())
                                {
                                    error = dialog.showMessageBox({message: "Cannot Move Directories!", title: "Oops!"})
                                }
                                else
                                {
                                    fs.copyFile(deleteFile, correctedPathcopy, (err) => {
                                        if (err)
                                        { 
                                            throw err
                                        }
                                        fs.unlinkSync(deleteFile)
                                        correctedDir = fs.readdirSync(FileSystem.currentDirectory);
                                        success = dialog.showMessageBox({message: "File Successfully Moved", title: "Success"})
                                        console.log(success)
                                        if(pos >= 12)
                                            replaceButtons(correctedDir, pos-12)
                                        else if(pos >= 10)
                                            replaceButtons(correctedDir, pos-10)
                                        else {
                                            console.log("here")
                                            replaceButtons(correctedDir, 0)
                                        }
                                    })
                                }
                            } catch(err) {
                                dialog.showMessageBox({message: err, title: "!"})
                            }
                        }
                    }
                })
            }
        })
    }
    document.getElementById("buttons").appendChild(cutButton)
}

//Creates a new file if it can
function createFile() {
    fileName = document.getElementById("miiText").value
    newDir = path.join(FileSystem.currentDirectory, fileName)
    absolutePath = path.resolve(newDir);
    correctedPath = path.normalize(absolutePath);
    errorMessage = document.createElement("P")
    errorMessage.style.position = "absolute"
    errorMessage.className = "errorMessage"
    errorMessage.id = "miiErr"
    document.getElementById("buttons").appendChild(errorMessage)
    try {
        if(fs.existsSync(correctedPath))
        {
            document.getElementById("miiErr").innerHTML = "File Already Exists"
            document.getElementById("miiPicture").src = "MiiBrawlPic.png"
        }
        else {
            fs.closeSync(fs.openSync(correctedPath, 'a'))
            document.getElementById("miiErr").innerHTML = "File Successfully Created"
            document.getElementById("miiPicture").src = "MiiGunnerPic.png"
        }
    } catch {
        document.getElementById("miiErr").innerHTML = "File Could Not Be Created"
        document.getElementById("miiPicture").src = "MiiBrawlPic.png"

    }
}

//Creates a new directory if it can
function createDir() {
    fileName = document.getElementById("dirText").value
    newDir = path.join(FileSystem.currentDirectory, fileName)
    absolutePath = path.resolve(newDir);
    correctedPath = path.normalize(absolutePath);
    errorMessage = document.createElement("P")
    errorMessage.style.position = "absolute"
    errorMessage.className = "direrrorMessage"
    errorMessage.id = "dirErr"
    document.getElementById("buttons").appendChild(errorMessage)
    try {
        if(fs.existsSync(correctedPath))
        {
            document.getElementById("dirErr").innerHTML = "Directroy Already Exists"
            document.getElementById("miiPicture").src = "MiiBrawlPic.png"
        }
        else {
            fs.mkdirSync(correctedPath)
            document.getElementById("dirErr").innerHTML = "Directory Successfully Created"
            document.getElementById("miiPicture").src = "MiiGunnerPic.png"
        }
    } catch {
        document.getElementById("dirErr").innerHTML = "Directory Could Not Be Created"
        document.getElementById("miiPicture").src = "MiiBrawlPic.png"

    }
}

//Creates the UI for file creation and directory creation
function fileChannelUI() {
    fileName = document.createElement("INPUT")
    fileName.setAttribute("type", "text")
    fileName.style.position = "absolute"
    fileName.className = "textBox"
    fileName.id = "miiText"
    document.getElementById("buttons").appendChild(fileName)

    miiSubmit = document.createElement('button')
    miiSubmit.style.position = "absolute"
    miiSubmit.className = "miiSubmit"
    miiSubmit.innerHTML = "Create"
    miiSubmit.onclick = function() {
        createFile()
    }
    document.getElementById("buttons").appendChild(miiSubmit)

    dirName = document.createElement("INPUT")
    dirName.setAttribute("type", "text")
    dirName.style.position = "absolute"
    dirName.className = "dirtextBox"
    dirName.id = "dirText"
    document.getElementById("buttons").appendChild(dirName)

    miiDir = document.createElement('button')
    miiDir.style.position = "absolute"
    miiDir.className = "dirSubmit"
    miiDir.innerHTML = "Create"
    miiDir.onclick = function() {
        createDir()
    }
    document.getElementById("buttons").appendChild(miiDir)

    miiBack = document.createElement('button')
    miiBack.style.position = "absolute"
    miiBack.className = "miiBack"
    miiBack.innerHTML = "Back"
    miiBack.onclick = function() {
        while(oldNodes.firstChild)
        {
            oldNodes.removeChild(oldNodes.firstChild);
        }
        restoreWiiMenu()
        try {
            dir = fs.readdirSync(FileSystem.currentDirectory);
            replaceButtons(dir, 0)
    
        } catch(err) {
            return 1;
        }

    }
    document.getElementById("buttons").appendChild(miiBack)

    miiPic = document.createElement('IMG')
    miiPic.style.position = "absolute"
    miiPic.className = "miiPic"
    miiPic.src = "miiSwordPic.png"
    miiPic.id = "miiPicture"
    document.getElementById("buttons").appendChild(miiPic)
}

//Draws buttons for the music channel feature
function musicChannelUI() {
    musicBack = document.createElement('button')
    musicBack.style.position = "absolute"
    musicBack.className = "miiBack"
    musicBack.innerHTML = "Back"
    musicBack.onclick = function() {
        while(oldNodes.firstChild)
        {
            oldNodes.removeChild(oldNodes.firstChild);
        }
        restoreWiiMenu()
        try {
            dir = fs.readdirSync(FileSystem.currentDirectory);
            replaceButtons(dir, 0)
    
        } catch(err) {
            return 1;
        }

    }
    document.getElementById("buttons").appendChild(musicBack)

    buttonTop = 160
    for(i = 0; i < 6; i++)
    {
        songButton = document.createElement('button')
        songButton.className = "songButton"
        songButton.style.position = "absolute"
        songButton.style.left = "20px"
        songButton.style.top = (buttonTop) + "px"
        if(i === 0)
        {
            songButton.innerHTML = "Wii Theme"
            songButton.onclick = function() {
                oldSong = document.getElementById("music")
                newSong = oldSong.cloneNode(true)
                newSong.src = "Main Menu.mp3"
                oldSong.parentNode.replaceChild(newSong, oldSong)
            }
        }
        else if(i === 1)
        {
            songButton.innerHTML = "Mii Theme"
            songButton.onclick = function() {
                oldSong = document.getElementById("music")
                newSong = oldSong.cloneNode(true)
                newSong.src = "Mii Channel.mp3"
                oldSong.parentNode.replaceChild(newSong, oldSong)
            }
        }
        else if(i === 2)
        {
            songButton.innerHTML = "Wii Shop Theme"
            songButton.onclick = function() {
                oldSong = document.getElementById("music")
                newSong = oldSong.cloneNode(true)
                newSong.src = "Shop Channel.mp3"
                oldSong.parentNode.replaceChild(newSong, oldSong)
            }
        }
        else if(i === 3)
        {
            songButton.innerHTML = "Wii Sports (Bowling)"
            songButton.onclick = function() {
                oldSong = document.getElementById("music")
                newSong = oldSong.cloneNode(true)
                newSong.src = "Bowling.mp3"
                oldSong.parentNode.replaceChild(newSong, oldSong)
            }
        }
        else if(i === 4)
        {
            songButton.innerHTML = "Wii Sports Theme"
            songButton.onclick = function() {
                oldSong = document.getElementById("music")
                newSong = oldSong.cloneNode(true)
                newSong.src = "Wii Sports.mp3"
                oldSong.parentNode.replaceChild(newSong, oldSong)
            }
        }
        else
        {
            songButton.innerHTML = "Your Own Music"
            songButton.onclick = function() {
                dialog.showOpenDialog(function (chosenSong) {
                    oldSong = document.getElementById("music")
                    newSong = oldSong.cloneNode(true)
                    if(chosenSong.length > 1)
                    {
                        dialog.showMessageBox({message: "Please select one song at a time!", title: "Oops!"})
                    }
                    else if((chosenSong[0].substr(chosenSong[0].lastIndexOf(".") + 1)) !== "mp3") {
                        dialog.showMessageBox({message: "Sorry, only MP3 files are accepted!", title: "Oops!"})
                    }
                    else
                    {
                        newSong.src = chosenSong[0]
                        oldSong.parentNode.replaceChild(newSong, oldSong)
                    }
                })
            }
        }
        document.getElementById("buttons").appendChild(songButton)
        buttonTop += 52
    }

    muteButton = document.createElement('button')
    muteButton.className = "muteButton"
    muteButton.style.position = "absolute"
    muteButton.onclick = function() {
        oldSong = document.getElementById("music")
        newSong = oldSong.cloneNode(true)
        newSong.src = ""
        oldSong.parentNode.replaceChild(newSong, oldSong)
    }
    document.getElementById("buttons").appendChild(muteButton)

    miiPic = document.createElement('IMG')
    miiPic.style.position = "absolute"
    miiPic.className = "musicPic"
    miiPic.src = "MarioDance.png"
    miiPic.id = "miiPicture"
    document.getElementById("buttons").appendChild(miiPic)
}

//Creates the Fiile Channel
function createImportantChannels() {
    fileChannel = document.createElement('button')
    fileChannel.style.position = "absolute"
    fileChannel.className = "fileChannel"
    fileChannel.style.left = "50px"
    fileChannel.style.top = "5px"
    fileChannel.onclick = function() {
        clearCanvas()
        oldNodes = document.getElementById("buttons")
        while(oldNodes.firstChild)
        {
            oldNodes.removeChild(oldNodes.firstChild);
        }
        drawFileChannel()
        fileChannelUI()
    }
    document.getElementById("buttons").appendChild(fileChannel)

    dirChannel = document.createElement('button')
    dirChannel.style.position = "absolute"
    dirChannel.className = "musicChannel"
    dirChannel.style.left = "275px"
    dirChannel.style.top = "5px"
    dirChannel.onclick = function() {
        clearCanvas()
        oldNodes = document.getElementById("buttons")
        while(oldNodes.firstChild)
        {
            oldNodes.removeChild(oldNodes.firstChild);
        }
        drawMusicChannel()
        musicChannelUI()
    }
    document.getElementById("buttons").appendChild(dirChannel)
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