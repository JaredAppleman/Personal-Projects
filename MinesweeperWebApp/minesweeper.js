
let gridContainer = document.querySelector('.grid-container');

const windowResize = function(){
    console.log('okay')
    gridContainer.style.height = gridContainer.offsetWidth.toString() + 'px';
}

const startFunction = function(){
    console.log('tiger')
    gridContainer.style.height = gridContainer.offsetWidth.toString() + 'px';

}
const test = function(){
    
}

startFunction()
window.addEventListener('resize',windowResize);