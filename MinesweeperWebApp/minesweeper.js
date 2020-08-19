

/*###################################
DOM variables
####################################*/

var gridContainer = document.querySelector('.grid-container');
var gridItemDomList = document.querySelectorAll('.grid-item');
var gridItemParList = document.querySelectorAll('.grid-item p');
var flagButtonDom = document.querySelector('#flagButton')
var emojiDom = document.querySelector('#emoji')

/*###################################
CLASSES
####################################*/

//use gridNumber to retrieve square object instead of just dom
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

        this.wallList = getWallList(this.row, this.col)


    }



    get getNeighbors(){
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

const flagButton = function(){
    flagButtonBool = !flagButtonBool
    if (flagButtonBool){
        flagButtonDom.style.color = 'red'
    }
    else{
        flagButtonDom.style.color = 'initial'
    }
    console.log(flagButtonBool)
}

const getWallList = function(row, col){
    let wallList = [];
    if (row === 0){
        wallList = arrayUnion(wallList,['topLeft', 'top', 'topRight'])   
    }
    if (row === 5){
        wallList = arrayUnion(wallList,['bottomLeft', 'bottom', 'bottomRight'])
    }
    if (col === 0){
        wallList = arrayUnion(wallList,['topLeft', 'left', 'bottomLeft'])
    }
    if (col === 5){
        wallList = arrayUnion(wallList,['topRight', 'right', 'bottomRight'])
    }
    return wallList;
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


const warningIndexHelper = function(warningIndex){
    //Input: Index of a warning square
    //Output: list of warning indexes
    //only adds new warningIndex if its not already in list AND if it isn't a bomb index
    if ((!(bombIndexList.includes(warningIndex))) && (!(warningIndexList.includes(warningIndex)))){
        warningIndexList.push(warningIndex);
    }
}

const getWarningIndexes = function(wallList, bombIndex){
    //Input: Index of a bomb, walls surrounding bomb
    //Output: list of warning indexes (indexes of squares that are neighbors to bomb)

    if (!(wallList.includes('topLeft'))){
        warningIndexHelper(bombIndex - 7)
    }
    if (!(wallList.includes('top'))){
        warningIndexHelper(bombIndex - 6)
    }
    if (!(wallList.includes('topRight'))){
        warningIndexHelper(bombIndex - 5)
    }
    if (!(wallList.includes('right'))){
       warningIndexHelper(bombIndex + 1)
    }
    if (!(wallList.includes('bottomRight'))){
       warningIndexHelper(bombIndex + 7)
    }
    if (!(wallList.includes('bottom'))){
        warningIndexHelper(bombIndex + 6)
    }
    if (!(wallList.includes('bottomLeft'))){
        warningIndexHelper(bombIndex + 5)
    }
    if (!(wallList.includes('left'))){
        warningIndexHelper(bombIndex - 1)
    }
    //console.log(warningIndexList)
}


/*###################################
GLOBAL VARIABLES
####################################*/
squareObjectList = [];
bombSquareList = []
//warningSquareList = []
var loss = false;

var hasTextList = [];
var lockedSquareList = [];

var bombIndexList = [];
var warningIndexList = [];

var flagButtonBool = false;

const fontFlag = '<i class="fas fa-flag"></i>'
const fontBomb = '<i class="fas fa-bomb"></i>'
const fontLightning = '<i class="fas fa-bolt"></i>'
const fontLeaf = '<i class="fas fa-leaf"></i>'
const fontSuprise = '<i class="far fa-surprise"></i>'
const fontSmile = '<i class="far fa-smile"></i>'
const fontSad = '<i class="far fa-frown-open"></i>'
const fontLaugh = '<i class="far fa-laugh-beam"></i>'

/*###################################
FUNCTIONS
####################################*/

const windowResize = function(){
    console.log('okay')
    gridContainer.style.height = gridContainer.offsetWidth.toString() + 'px';
    for (index = 0; index < hasTextList.length; index ++){
        let squareObject = hasTextList[index];
        width = squareObject.domObject.offsetWidth - 15
        squareObject.gridParObject.style.fontSize = width.toString() + 'px';
    }
}

const startFunction = function(){
    var isMine;
    var tmpSquareObjectList = []

    //resize inital window
    gridContainer.style.height = gridContainer.offsetWidth.toString() + 'px';
    //plant bombs: list of 6 numbers: [0-35]
    plantBombs();

    //make square objects; 0-36
    for (row = 0; row < 6; row++){
        for (col = 0; col < 6; col++){
            let squareNumber = 6 * row + col

            let squareObject = new square(gridItemDomList[squareNumber], gridItemParList[squareNumber], row, col)

            if (bombIndexList.includes(squareNumber)){
                squareObject.is_Mine = true;
                squareObject.is_Warning = true;
                squareObject.is_Safe = true;
                bombSquareList.push(squareObject)
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
            tmpSquareObjectList.push(squareObject);
        }
        squareObjectList.push(tmpSquareObjectList);
        tmpSquareObjectList = [];
    } 
}

const lockSquare = function(square){
    square.domObject.disabled = true;
    lockedSquareList.push(square);
}

const squareClick = function(gridItemNumber){
    let row = Math.floor(gridItemNumber / 6);
    let col = gridItemNumber % 6;
    let squareObject = squareObjectList[row][col];
    console.log(squareObject)
    if (flagButtonBool){
        if (squareObject.isFlagged){
            squareObject.gridParObject.style.color = 'initial'
            squareObject.gridParObject.innerHTML = '';
            squareObject.is_flagged = false;
        }
        else{
            width = squareObject.domObject.offsetWidth - 15
            squareObject.gridParObject.style.fontSize = width.toString() + 'px';
            hasTextList.push(squareObject)
            squareObject.gridParObject.style.color = 'red'
            squareObject.gridParObject.innerHTML = fontFlag;
            squareObject.is_flagged = true;
        }
    }
    else if (squareObject.isMine){
        loss = true;
        gameOver()
        squareObject.domObject.style.background = "red";

        squareObject.gridParObject.innerHTML = fontBomb;
        
        width = squareObject.domObject.offsetWidth - 15
        squareObject.gridParObject.style.fontSize = width.toString() + 'px';
        hasTextList.push(squareObject)
        emojiDom.innerHTML = fontSuprise;
        setTimeout(isOver,750)
    }
    else if (squareObject.isWarning){
        squareObject.domObject.style.background = "lightGray";
        numberOfBombs = bombCount(squareObject.getNeighbors)
        numberColor(squareObject, numberOfBombs)
        squareObject.gridParObject.innerHTML = numberOfBombs
        
        width = squareObject.domObject.offsetWidth - 15
        squareObject.gridParObject.style.fontSize = width.toString() + 'px';
        hasTextList.push(squareObject)
        lockSquare(squareObject)
        emojiDom.innerHTML = fontSuprise;
        setTimeout(isOver,750)
    }
    else{
        squareObject.domObject.style.background = "lightGray";
        lockSquare(squareObject);
        let neighborList = squareObject.getNeighbors;
        safeSquareFunction(neighborList);
        emojiDom.innerHTML = fontSuprise;
        setTimeout(isOver,750)
    }

    console.log(lockedSquareList)
}
const numberColor = function(square,numberOfBombs){
    let color;
    if (numberOfBombs === 1){
        color = 'blue'
    }
    else if (numberOfBombs === 2){
        color = 'green'
    }
    else if (numberOfBombs === 3){
        color = 'yellow'
    }
    else if (numberOfBombs === 4){
        color = 'orange'
    }
    else if (numberOfBombs === 5){
        color = 'red'
    }
    else{
        color = 'black'
    }
    square.gridParObject.style.color = color

}
const isOver = function(){
    if (lockedSquareList.length === 30){
        emojiDom.innerHTML = fontLaugh;
        gameOver()
    }
    else if (loss){
        emojiDom.innerHTML = fontSad;
    
    }
    else{
        emojiDom.innerHTML = fontSmile;
    }
}
const gameOver = function(){
    for (row = 0; row < 6; row++){
        for(col = 0; col < 6; col++){
            let squareObject = squareObjectList[row][col];
            if (squareObject.isMine){
                if (loss){
                    squareObject.gridParObject.style.color = 'initial'
                    squareObject.gridParObject.innerHTML = fontBomb;
                }
                else{
                    squareObject.gridParObject.style.color = 'red'
                    squareObject.gridParObject.innerHTML = fontFlag;
                }
                width = squareObject.domObject.offsetWidth - 15
                squareObject.gridParObject.style.fontSize = width.toString() + 'px';
                lockSquare(squareObject)
            }
            else if (!(lockedSquareList.includes(squareObject))){
                lockSquare(squareObject)
            }
        }
    }
}

const bombCount = function(neighborList){
    bombs = 0;
    for (index = 0; index < neighborList.length; index++){
        threat = neighborList[index];
        if (threat.isMine){
            bombs += 1;
        }
    }
    return bombs;
}

const safeSquareFunction = function(neighborList){
    const checkedSquares = [];
    while (neighborList.length > 0){
        currentNeighbor = neighborList.shift();
        if ((currentNeighbor.isWarning) && (!(lockedSquareList.includes(currentNeighbor)))){
            currentNeighbor.domObject.style.background = "lightGray";
            width = currentNeighbor.domObject.offsetWidth - 15
            currentNeighbor.gridParObject.style.fontSize = width.toString() + 'px';
            hasTextList.push(currentNeighbor)
            numberOfBombs = bombCount(currentNeighbor.getNeighbors)
            numberColor(currentNeighbor, numberOfBombs)
            currentNeighbor.gridParObject.innerHTML = numberOfBombs
            lockSquare(currentNeighbor);
        }
        else if (currentNeighbor.isSafe){
            currentNeighbor.domObject.style.background = "lightGray";
            newNeighbors = currentNeighbor.getNeighbors
            for (index = 0; index < newNeighbors.length; index++){
                if (!(lockedSquareList.includes(newNeighbors[index])) && (!(neighborList.includes(newNeighbors[index])))){
                    neighborList.push(newNeighbors[index])
                }
            }
            lockSquare(currentNeighbor);
        }
    }
}

const refreshPage = function(){
    location.reload();
    return false;
}
const plantBombs = function(){
//Output: list of 6 unique numbers [0-35]

    //plant  bombs
    for (x = 0; x < 6; x++){
        bombIndex = Math.floor(Math.random()*36);
        while (bombIndexList.includes(bombIndex)){
            bombIndex = Math.floor(Math.random()*36);
        }
        //have bombIndex
        let row = Math.floor(bombIndex / 6);
        let col = bombIndex % 6;
        //console.log(bombIndex)
        wallList = getWallList(row,col);
        //console.log(wallList)
        getWarningIndexes(wallList, bombIndex);
        if (warningIndexList.includes(bombIndex)){
            warningIndexList.splice(warningIndexList.indexOf(bombIndex),1)
        }
        bombIndexList.push(bombIndex);
    }
    console.log(warningIndexList)
    console.log(bombIndexList)

}




startFunction()
window.addEventListener('resize',windowResize);