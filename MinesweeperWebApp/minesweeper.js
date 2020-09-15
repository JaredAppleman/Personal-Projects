/*###################################
DOM variables
####################################*/
var gridContainer = document.querySelector('.grid-container');//used for resizing board when window resized
var gridItemDomList = document.querySelectorAll('.grid-item');//targets the square buttons
var gridItemParList = document.querySelectorAll('.grid-item p');//targets the content within each square 
var flagButtonDom = document.querySelector('#flagButton')
var emojiDom = document.querySelector('#emoji')
var gameBoard = document.querySelector('#gameBoard')







/*###################################
CLASSES
####################################*/
class square{
    constructor(domObject, gridParObject, row, col){
        this.domObject = domObject;
        this.gridParObject = gridParObject;
        this.isMine;
        this.isWarning;
        this.isSafe;
        this.row = row;
        this.col = col;
        this.isFlagged = false;
        //for squares on the border, finds which walls they have
        this.wallList = getWallList(this.row, this.col)
    }
    //Getters
    get getNeighbors(){
        //Input: none (wallList)
        //Output: list of square objects
        //Using the wallList, it finds all the neighbors for the square
        let neighborList = []

        if (!(this.wallList.includes('topLeft'))){
            neighborList.push(squareObjectList[this.row - 1][this.col - 1])
        }
        if (!(this.wallList.includes('top'))){
            neighborList.push(squareObjectList[this.row - 1][this.col])
        }
        if (!(this.wallList.includes('topRight'))){
            neighborList.push(squareObjectList[this.row - 1][this.col + 1])
        }
        if (!(this.wallList.includes('right'))){
            neighborList.push(squareObjectList[this.row][this.col + 1])
        }
        if (!(this.wallList.includes('bottomRight'))){
            neighborList.push(squareObjectList[this.row + 1][this.col + 1])
        }
        if (!(this.wallList.includes('bottom'))){
            neighborList.push(squareObjectList[this.row + 1][this.col])
        }
        if (!(this.wallList.includes('bottomLeft'))){
            neighborList.push(squareObjectList[this.row + 1][this.col - 1])
        }
        if (!(this.wallList.includes('left'))){
            neighborList.push(squareObjectList[this.row][this.col - 1])
        }
        return neighborList;
    }
    //Setters
    set is_Mine(bool){
        this.isMine = bool;
    }
    set is_Warning(bool){
        this.isWarning = bool;
    }
    set is_Safe(bool){
        this.isSafe = bool;
    }
    set is_flagged(bool){
        this.isFlagged = bool;
    }
}







/*###################################
GLOBAL VARIABLES
####################################*/
var numberOfBombs = 12;
var numberOfSquares = 64;
var numberOfRows = 8;
var numberOfColumns = 8;

var squareObjectList = [];
var loss = false;
var win = false;
var hasTextList = [];
var lockedSquareList = [];
var flagLockList = [];
var bombIndexList = [];
var warningIndexList = [];
var flagButtonBool = false;
//Font Awesome Variables
const fontFlag = '<i class="fas fa-flag"></i>'
const fontBomb = '<i class="fas fa-bomb"></i>'
const fontLightning = '<i class="fas fa-bolt"></i>'
const fontLeaf = '<i class="fas fa-leaf"></i>'
const fontSuprise = '<i class="far fa-surprise"></i>'
const fontSmile = '<i class="far fa-smile"></i>'
const fontSad = '<i class="far fa-frown-open"></i>'
const fontLaugh = '<i class="far fa-laugh-beam"></i>'








/*###################################
MAIN FUNCTIONS start, squareClick, safeSquareFunction
####################################*/
const startFunction = function(){
    //Input: None
    //Output: returns None; Updates global variable: list of square objects
    //runs right away when webpage is opened

    //resize inital window
    gridContainer.style.height = gridContainer.offsetWidth.toString() + 'px';

    newBoard()

    //plant bombs: list of 6 numbers: [0-35]; updates global variable
    plantBombs();
    //local variable
    var tmpSquareObjectList = []

    //makes 2D array to hold square objects ~ resembles the board
    for (row = 0; row < numberOfRows; row++){
        for (col = 0; col < numberOfColumns; col++){
            let squareNumber = numberOfRows * row + col
            let squareObject = new square(gridItemDomList[squareNumber], gridItemParList[squareNumber], row, col)

            if (bombIndexList.includes(squareNumber)){
                squareObject.is_Mine = true;
                squareObject.is_Warning = true;
                squareObject.is_Safe = true;
            }
            else if (warningIndexList.includes(squareNumber)){
                squareObject.is_Mine = false;
                squareObject.is_Warning = true;
                squareObject.is_Safe = false;
            }
            else{
                squareObject.is_Mine = false;
                squareObject.is_Warning = false;
                squareObject.is_Safe = true;
            }
            //list of most recent 6 square objects
            tmpSquareObjectList.push(squareObject);
        }
        //add list of 6 square objects to main list, creating the 2d array
        squareObjectList.push(tmpSquareObjectList);
        tmpSquareObjectList = [];
    } 
}
const squareClick = function(gridItemNumber){
    //Input: squareNumber passed in from html
    //Output: returns none; reacts accordingly to square click

    //selects appropriate square object from 2D-array
    let row = Math.floor(gridItemNumber / numberOfRows);
    let col = gridItemNumber % numberOfRows;
    let squareObject = squareObjectList[row][col];

    //if flagButton Enabled
    if (flagButtonBool){
        //if the square that was clicked, was already flagged...
        if (squareObject.isFlagged){
            squareObject.gridParObject.style.color = 'initial'
            squareObject.gridParObject.innerHTML = '';
            squareObject.is_flagged = false;
            //remove square from flagList
            unlockFlag(squareObject)
        }
        //if the clicked square wasn't already flagged...
        else{
            //displays flag icon
            //sets the width of the flag icon to the same width of the square - 15
            width = squareObject.domObject.offsetWidth - 15
            squareObject.gridParObject.style.fontSize = width.toString() + 'px';
            hasTextList.push(squareObject)
            squareObject.gridParObject.style.color = 'red'
            squareObject.gridParObject.innerHTML = fontFlag;
            squareObject.is_flagged = true;
            //add square to flagList
            flagLockList.push(squareObject)
        }
    }
    else if (squareObject.isMine){
        //game is over if clicked square is mine
        loss = true;
        gameOver()
        //displays bomb icon
        //sets the width of the bomb icon to the same width of the square - 15
        squareObject.domObject.style.background = "red";
        squareObject.gridParObject.innerHTML = fontBomb;
        width = squareObject.domObject.offsetWidth - 15
        squareObject.gridParObject.style.fontSize = width.toString() + 'px';
        hasTextList.push(squareObject)
        //changes emoji
        emojiDom.innerHTML = fontSuprise;
        setTimeout(changeEmoji,750)
    }
    else if (squareObject.isWarning){
        squareObject.domObject.style.background = "lightGray";
        //gets the # of bombs surrounding square
        bombCount = getBombCount(squareObject.getNeighbors)
        //sets the color of the number: depending of # of bombs
        numberColor(squareObject, bombCount)
        //displays the number
        //sets the width of the number to the same width of the square - 15
        squareObject.gridParObject.innerHTML = bombCount
        width = squareObject.domObject.offsetWidth - 15
        squareObject.gridParObject.style.fontSize = width.toString() + 'px';
        hasTextList.push(squareObject)
        //lock the square
        lockSquare(squareObject)
        //check win conditon
        if (lockedSquareList.length === (numberOfSquares - numberOfBombs)){
            win = true;
            gameOver()
        }
        //changes emoji
        emojiDom.innerHTML = fontSuprise;
        setTimeout(changeEmoji,750)
    }
    else{
        squareObject.domObject.style.background = "lightGray";
        //lock the square
        lockSquare(squareObject);
        //gets list of the surrounding square objects
        let neighborList = squareObject.getNeighbors;
        safeSquareFunction(neighborList);
        //check win condition
        if (lockedSquareList.length === (numberOfSquares - numberOfBombs)){
            win = true;
            gameOver()
        }
        //changes emoji
        emojiDom.innerHTML = fontSuprise;
        setTimeout(changeEmoji,750)
    }
}
const safeSquareFunction = function(neighborList){
    //Input: list of surrounding squares of clicked square
    //Output: returns none; updates the board according to minesweeper rules
    const checkedSquares = [];
    //while there is a neighbor to check...
    while (neighborList.length > 0){
        //get neighbor from list to check
        currentNeighbor = neighborList.shift();
        //Unknow rule: what to do if flagged square is a safe square, it was buggy in official minesweeper
        //what this does is ignore it, keeps flag, doesnt add flag's neighbor...
        //if unflagged, it can still be clicked to complete the path... unless there is more flags
        if (!(flagLockList.includes(currentNeighbor))){
            //if the neighbor is a warningSquare AND if it is not already locked(been clicked on)...
            if ((currentNeighbor.isWarning) && (!(lockedSquareList.includes(currentNeighbor)))){
                //display the warning square with the number of surrounding bombs
                currentNeighbor.domObject.style.background = "lightGray";
                width = currentNeighbor.domObject.offsetWidth - 15
                currentNeighbor.gridParObject.style.fontSize = width.toString() + 'px';
                hasTextList.push(currentNeighbor)
                bombCount = getBombCount(currentNeighbor.getNeighbors)
                numberColor(currentNeighbor, bombCount)
                currentNeighbor.gridParObject.innerHTML = bombCount
                lockSquare(currentNeighbor);
            }
            //if the neighbor is also a safe square...
            else if (currentNeighbor.isSafe){
                currentNeighbor.domObject.style.background = "lightGray";
                //get the neighbors of the square
                newNeighbors = currentNeighbor.getNeighbors
                //checks all the new neighbors...
                for (index = 0; index < newNeighbors.length; index++){
                    //if it is not already locked AND it is not already apart of the neighborList...
                    if (!(lockedSquareList.includes(newNeighbors[index])) && (!(neighborList.includes(newNeighbors[index])))){
                        //add newNeighbor to neighborList to check
                        neighborList.push(newNeighbors[index])
                    }
                }
                //lock the neighbor
                lockSquare(currentNeighbor);
            }
        }
    }
}








/*###################################
BUTTON/EVEN FUNCTIONS: windowResize, flagButton, refreshPage
####################################*/

const windowResize = function(){
    //Input: none
    //Output: returns None; 
    // whenever the window is resized, updates the height of the board and the height of the width of the
    //content inside the squares
    //updates the height to match the width, to keep it a square
    gridContainer.style.height = gridContainer.offsetWidth.toString() + 'px';
    //for all the squares that have text (icon or number), resizes the font-size to be the same as the square width
    for (index = 0; index < hasTextList.length; index ++){
        let squareObject = hasTextList[index];
        width = squareObject.domObject.offsetWidth - 15
        squareObject.gridParObject.style.fontSize = width.toString() + 'px';
    }
}
const flagButton = function(){
    //Input: none
    //Output: returns None; updates global variable
    flagButtonBool = !flagButtonBool
    //activate flag mode
    if (flagButtonBool){
        //change css color property to red
        flagButtonDom.style.color = 'red'
        //make the flags in the list clickable
        for (index = 0; index < flagLockList.length; index++){
            flagLockList[index].domObject.disabled = false;
        }
    }
    else{
        //deactivate flag mode
        //rever css color property
        flagButtonDom.style.color = 'initial'
        //make the flags in the list unclickable
        for (index = 0; index < flagLockList.length; index++){
            flagLockList[index].domObject.disabled = true;
        }
    }
}
const refreshPage = function(){
    location.reload();
    return false;
}

const settingsButton = function(){
    answer1 = prompt('How many rows?')
    if (answer1){
        answer2 = prompt('How many bombs?')
        if (answer2){
            sessionStorage.setItem("update",true)
            sessionStorage.setItem("rows",answer1)
            sessionStorage.setItem("bombs",answer2)
        }
        //store answers in localwindow storage
        //reload page
        //edit newBoard function to read values and update board

        //or build custom pop-up with jquery
    }
}









/*###################################
HELPER FUNCTIONS: plantBombs, lockSquare, getWarningIndes, warningIndexHelper, 
getWallList, unlockFlag, getBombCount, numberColor, isOver, gameOver
####################################*/
const plantBombs = function(){
    //Input: none;
    //Output: returns list of 6 unique numbers [0-35]
    //        builds warningIndexList from the bomb locations (list of any square that has a bomb as a neighbor)
    
    //plant  bombs
    for (x = 0; x < numberOfBombs; x++){
        //get unique random number [0-35]
        bombIndex = Math.floor(Math.random() * numberOfSquares);
        while (bombIndexList.includes(bombIndex)){
            bombIndex = Math.floor(Math.random() * numberOfSquares);
        }
        //get board row/column of random number
        let row = Math.floor(bombIndex / numberOfRows);
        let col = bombIndex % numberOfRows;
        //gets the walls of the square at that [row][column]
        wallList = getWallList(row,col);
        //given the wallList, gets the neighbors of the square
        getWarningIndexes(wallList, bombIndex);
        //if any of the added squares is the bomb...
        if (warningIndexList.includes(bombIndex)){
            //removes it fromlist
            warningIndexList.splice(warningIndexList.indexOf(bombIndex),1)
        }
        bombIndexList.push(bombIndex);
    }
}
const getWarningIndexes = function(wallList, bombIndex){
    //Input: Index of a bomb, walls surrounding bomb
    //Output: list of warning indexes (indexes of squares that are neighbors to bomb)

    if (!(wallList.includes('topLeft'))){
        warningIndexHelper(bombIndex - (numberOfRows + 1))
    }
    if (!(wallList.includes('top'))){
        warningIndexHelper(bombIndex - numberOfRows)
    }
    if (!(wallList.includes('topRight'))){
        warningIndexHelper(bombIndex - (numberOfRows - 1))
    }
    if (!(wallList.includes('right'))){
       warningIndexHelper(bombIndex + 1)
    }
    if (!(wallList.includes('bottomRight'))){
       warningIndexHelper(bombIndex + (numberOfRows + 1))
    }
    if (!(wallList.includes('bottom'))){
        warningIndexHelper(bombIndex + numberOfRows)
    }
    if (!(wallList.includes('bottomLeft'))){
        warningIndexHelper(bombIndex + (numberOfRows - 1))
    }
    if (!(wallList.includes('left'))){
        warningIndexHelper(bombIndex - 1)
    }
    //console.log(warningIndexList)
}
const warningIndexHelper = function(warningIndex){
    //Input: Index of a warning square
    //Output: list of warning indexes
    //only adds new warningIndex if its not already in list AND if it isn't a bomb index
    if ((!(bombIndexList.includes(warningIndex))) && (!(warningIndexList.includes(warningIndex)))){
        warningIndexList.push(warningIndex);
    }
}
const getWallList = function(row, col){
    //Input: row, col ~location of square on the board
    //output: returns list of walls surrounding square
    let wallList = [];
    if (row === 0){
        wallList = arrayUnion(wallList,['topLeft', 'top', 'topRight'])   
    }
    if (row === (numberOfRows - 1)){
        wallList = arrayUnion(wallList,['bottomLeft', 'bottom', 'bottomRight'])
    }
    if (col === 0){
        wallList = arrayUnion(wallList,['topLeft', 'left', 'bottomLeft'])
    }
    if (col === (numberOfColumns - 1)){
        wallList = arrayUnion(wallList,['topRight', 'right', 'bottomRight'])
    }
    return wallList;
}
const lockSquare = function(square){
    //Input: square object, flagbool
    //output: returns none; 
    //disables square (makes it unclickable) and add its to list of locked squares

    if (!(lockedSquareList.includes(square))){
        square.domObject.disabled = true;
        lockedSquareList.push(square);
    }
}
const unlockFlag = function(square){
    //Input: squareobject that currently flagged
    //output: returns none; unlocks square ~ make it clickable, remove from lockedFlagList

    //make the square clickable
    square.domObject.disabled = false;
    //remove from flag list
    flagLockList.splice(flagLockList.indexOf(square),1)
}

const getBombCount = function(neighborList){
    //Input: a list of square objects
    //Output: integer; counts how many of the square objects are mines
    bombs = 0;
    for (index = 0; index < neighborList.length; index++){
        threat = neighborList[index];
        if (threat.isMine){
            bombs += 1;
        }
    }
    return bombs;
}

const numberColor = function(square,number){
    //Input: square object, interger
    //output: returns none; sets color property of content of squareobject
    let color;
    if (number === 1){
        color = 'blue'
    }
    else if (number === 2){
        color = 'green'
    }
    else if (number === 3){
        color = 'yellow'
    }
    else if (number === 4){
        color = 'orange'
    }
    else if (number === 5){
        color = 'red'
    }
    else{
        color = 'black'
    }
    square.gridParObject.style.color = color
}
const arrayUnion = function(list1, list2){
    //Input: two lists
    //Output: Union of two lists (adds element of list2 if it is not in list1 )
    for (index = 0; index < list2.length; index++){
        if (!(list1.includes(list2[index]))){
            list1.push(list2[index])
        }
    }
    return list1
}
const changeEmoji = function(){
    //Input: none;
    //Output: returns none; changes emoji expression based on win/loss/still playing

    if (loss){
        //sets loser emoji
        emojiDom.innerHTML = fontSad;
    }
    //game still alive, revert emoji to smiley face from suprise face
    else if (win){
        emojiDom.innerHTML = fontLaugh;
    }
    else{
        emojiDom.innerHTML = fontSmile;
    }
}
const gameOver = function(){
    //Input: none
    //output: returns none; changes display of all the bombs
    //        if loss: reveals all the bombs
    //        if win: reveals all flags at bomb spots

    //for each square object
    for (row = 0; row < numberOfRows; row++){
        for(col = 0; col < numberOfColumns; col++){
            //get current square object
            let squareObject = squareObjectList[row][col];
            if (squareObject.isMine){
                width = squareObject.domObject.offsetWidth - 15
                squareObject.gridParObject.style.fontSize = width.toString() + 'px';
                hasTextList.push(squareObject)
                if (loss){
                    squareObject.gridParObject.style.color = 'initial'
                    squareObject.gridParObject.innerHTML = fontBomb;
                }
                else{
                    squareObject.gridParObject.style.color = 'red'
                    squareObject.gridParObject.innerHTML = fontFlag;
                }
            }
            //locks the square so its unclickable
            lockSquare(squareObject)
        }
    }
}

const newBoard = function(){
    let cssValue = ''
    let gameBoardHTML = ''

    numberOfRows = Number(sessionStorage.getItem("rows"))
    numberOfColumns = numberOfRows
    numberOfSquares = Math.pow(numberOfRows,2)
    numberOfBombs = Number(sessionStorage.getItem("bombs"))

    if (sessionStorage.getItem("update")){
        for (x = 0; x < numberOfSquares; x++){
            gameBoardHTML += '<button class="grid-item" id="grid-item" type="button" onclick="squareClick(' + x +
            ')"><p></p></button>'
        }

        for (x = 0; x < numberOfRows; x++){
            cssValue += 'auto ';
        }
        gameBoard.style.gridTemplateColumns = cssValue;
        gameBoard.innerHTML = gameBoardHTML;

        //squareHTML = '<button class="grid-item" id="grid-item" type="button" onclick="squareClick(' + okay +
        //')"><p></p></button>'
        gridContainer = document.querySelector('.grid-container');
        gridItemDomList = document.querySelectorAll('.grid-item');
        gridItemParList = document.querySelectorAll('.grid-item p');
    }
}







/*###################################
ACTIVE CODE
####################################*/
startFunction()
window.addEventListener('resize',windowResize);