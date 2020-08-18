
var gridContainer = document.querySelector('.grid-container');
var gridItemDomList = document.querySelectorAll('.grid-item');

const windowResize = function(){
    console.log('okay')
    gridContainer.style.height = gridContainer.offsetWidth.toString() + 'px';
}

const startFunction = function(){
    console.log('tiger')
    gridContainer.style.height = gridContainer.offsetWidth.toString() + 'px';

}
const test = function(gridItemNumber){
    gridItem = gridItemDomList[gridItemNumber-1];
    gridItem.style.background = "orange";
}

startFunction()
window.addEventListener('resize',windowResize);