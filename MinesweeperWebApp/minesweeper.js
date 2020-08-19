

/*###################################
DOM variables
####################################*/

var gridContainer = document.querySelector('.grid-container');
var gridItemDomList = document.querySelectorAll('.grid-item');
var gridItemParList = document.querySelectorAll('.grid-item p');
var flagButtonDom = document.querySelector('flagButton')

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
        this.column = col;

        this.wallList = getWallList(this.row, this.col)


    }



    get getNeighbors(){
        var neighborList = []

        if (!(this.wallList.includes('topLeft'))){
            neighborList.push(squareObjectList[this.row - 1][this.column - 1])
        }
        if (!(this.wallList.includes('top'))){
            neighborList.push(squareObjectList[this.row - 1][this.column])
        }
        if (!(this.wallList.includes('topRight'))){
            neighborList.push(squareObjectList[this.row - 1][this.column + 1])
        }
        if (!(this.wallList.includes('right'))){
            neighborList.push(squareObjectList[this.row][this.column + 1])
        }
        if (!(this.wallList.includes('bottomRight'))){
            neighborList.push(squareObjectList[this.row + 1][this.column + 1])
        }
        if (!(this.wallList.includes('bottom'))){
            neighborList.push(squareObjectList[this.row + 1][this.column])
        }
        if (!(this.wallList.includes('bottomLeft'))){
            neighborList.push(squareObjectList[this.row + 1][this.column - 1])
        }
        if (!(this.wallList.includes('left'))){
            neighborList.push(squareObjectList[this.row][this.column - 1])
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


}

const flagButton = function(){
    flagButtonBool = !flagButtonBool
    console.log(flagButtonBool)
}

const getWallList = function(row, col){
    var wallList = [];
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
    console.log(warningIndexList)
}


/*###################################
GLOBAL VARIABLES
####################################*/
squareObjectList = [];
bombSquareList = []
warningSquareList = []

var unHiddenWarningList = [];

var bombIndexList = [];
var warningIndexList = [];

var flagButtonBool = false;

/*###################################
FUNCTIONS
####################################*/

const windowResize = function(){
    console.log('okay')
    gridContainer.style.height = gridContainer.offsetWidth.toString() + 'px';
    for (index = 0; index < unHiddenWarningList.length; index ++){
        let squareObject = unHiddenWarningList[index];
        squareObject.gridParObject.style.fontSize = squareObject.domObject.offsetWidth.toString() + 'px';
    }
}

const startFunction = function(){
    var isMine;
    var tmpSquareObjectList = []

    //resize inital window
    gridContainer.style.height = gridContainer.offsetWidth.toString() + 'px';
    //plant bombs: list of 6 numbers: [0-35]
    plantBombs();
/* 
    for(bombIndex = 0; bombIndex < bombIndexList; bombIndex++){
        bombSquareNumber = bombIndexList[bombIndex];
        let row = Math.floor(bombSquareNumber / 6);
        let col = bombSquareNumber % 6;
        wallList = getWallList(row,col);
        warningIndexList = warningIndexList.concat(getNeighborSquareNumbers(wallList));
    } */



 
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
/*
    for (bombIndex = 0; bombIndex < 6; bombIndex ++){
        let row = Math.floor(bombIndex / 6);
        let col = bombIndex % 6;
        bombSquare = squareObjectList[row][col];
        warningSquareList = warningSquareList.concat(bombSquare.getNeighbors);
    }
    console.log(warningSquareList)
    for (index = 0; index < warningSquareList.length; index++){
        let warningSquare = warningSquareList[index];
        warningSquare.is_Warning = true;
    } */
}



const squareClick = function(gridItemNumber){
    let row = Math.floor(gridItemNumber / 6);
    let col = gridItemNumber % 6;
    let squareObject = squareObjectList[row][col];
    console.log(squareObject)
    if (squareObject.isMine){
        squareObject.domObject.style.background = "red";
        if (flagButtonBool){
            squareObject.gridParObject.innerText = ":)"
        }
        else{
            squareObject.gridParObject.innerText = ":("
        }
        squareObject.gridParObject.style.fontSize = squareObject.domObject.offsetWidth.toString() + 'px';
        unHiddenWarningList.push(squareObject)
    }
    else if (squareObject.isWarning){
        squareObject.domObject.style.background = "orange";
    }
    else{
        squareObject.domObject.style.background = "green";
    }
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
        console.log(bombIndex)
        wallList = getWallList(row,col);
        console.log(wallList)
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