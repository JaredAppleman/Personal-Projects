

/*###################################
DOM variables
####################################*/

var gridContainer = document.querySelector('.grid-container');
var gridItemDomList = document.querySelectorAll('.grid-item');

/*###################################
CLASSES
####################################*/

//use gridNumber to retrieve square object instead of just dom
class square{
    constructor(squareNumber, domObject, isMine, row, col){
        this.squareNumber = squareNumber;
        this.domObject = domObject;
        this.isMine = isMine;
        this.isWarning = false;
        this.isSafe = false;
        this.row = row;
        this.column = col;

        this.wallList = []

        if (this.row === 0){
            this.wallList = this.wallList.concat(['topLeft', 'top', 'topRight'])    
        }
        if (this.row === 5){
            this.wallList = this.wallList.concat(['bottomLeft', 'bottom', 'bottomRight'])
        }
        if (this.column === 0){
            this.wallList = this.wallList.concat(['topLeft', 'left', 'bottomLeft'])
        }
        if (this.column === 5){
            this.wallList = this.wallList.concat(['topRight', 'right', 'bottomRight'])
        }

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
}


/*###################################
GLOBAL VARIABLES
####################################*/
squareObjectList = [];


/*###################################
FUNCTIONS
####################################*/

const windowResize = function(){
    console.log('okay')
    gridContainer.style.height = gridContainer.offsetWidth.toString() + 'px';
}

const startFunction = function(){
    var isMine;
    var tmpSquareObjectList = []

    //resize inital window
    gridContainer.style.height = gridContainer.offsetWidth.toString() + 'px';
    //plant bombs
    bombIndexList = plantBombs();
    //make square objects; 0-36
    for (row = 0; row < 6; row++){
        for (col = 0; col < 6; col++){
            squareNumber = 6 * row + col
            if (bombIndexList.includes(squareNumber)){
                isMine = true;
            }
            else{
                isMine = false;
            }
            squareObject = new square(squareNumber, gridItemDomList[squareNumber], isMine, row, col)
            tmpSquareObjectList.push(squareObject);
        }
        squareObjectList.push(tmpSquareObjectList);
        tmpSquareObjectList = [];
    }
}



const squareClick = function(gridItemNumber){
    gridItem = gridItemDomList[gridItemNumber];
    gridItem.style.background = "orange";
}

const plantBombs = function(){
//Output: list of 6 unique numbers [0-35]
    randomNumberList = [];
    //plant  bombs
    for (x = 0; x < 6; x++){
        randomNumber = Math.floor(Math.random()*36);
        while (randomNumberList.includes(randomNumber)){
            randomNumber = Math.floor(Math.random()*37);
        }
        randomNumberList.push(randomNumber);
    }
    console.log(randomNumberList);
    return randomNumberList;
}




startFunction()
window.addEventListener('resize',windowResize);