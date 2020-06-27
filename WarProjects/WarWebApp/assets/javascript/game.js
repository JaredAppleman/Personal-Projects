//File: game.js
//Author: Jared Appleman
//For: Dev10 Prework
//Hangman

//GLOBAL VARIABLES
let GAME = true;
const GUESSES = 12;
//Used to play intro song, since some browsers don't allow sounds until user has interacted with page
firstInteraction = true;

//DOM VARIABLES
const letters_guessed_block = document.querySelector('#letters_Guessed_block');
const guess_count_block = document.querySelector('#guess_count_block');
const word_block = document.querySelector('#word_block');
const win_block = document.querySelector('#win_block');
const hint_block = document.querySelector('#hint_block');
const image_HTML = document.querySelector('#img_block');
const prev_word_block = document.querySelector('#prev_word_block');
const music = document.querySelector('audio');
const sound_block = document.querySelector('#sound_block');



//FUNCTIONS

//EVENTFUNCTION: Gives the key-press to the main hangman method from the game object if there are still words to play
const eventFunction = function(event) {
    if (firstInteraction){
        music.play()
        firstInteraction = false;
    }
    if (GAME){
        let key = event.key;
        key = key.toLowerCase()
        gameObject.hangman(key);
    }
}



//OBJECTS

//Sound Object: list of music/sounds.
const soundObject = {
    win: {
        name: 'Dance Monkey by Tones and I (Bongo Cat Edition)',
        html: '<source src="assets/music/bongo-cat_dance-monkey.mp3" type="audio/mpeg"></source>'
    },
    loss: {
        name: 'See you Again by Wiz Khalifa (Bongo Cat Edition)',
        html: '<source src="assets/music/bongo-cat_see-you-again.mp3" type="audio/mpeg"></source>'
    },
    end: {
        name: 'Coffin Dance Music',
        html: '<source src="assets/music/coffin-dance-music.mp3" type="audio/mpeg"></source>'
    }
}

//Word Object: This is a list of words for the hangman game. Each entry has its word, a picture, and a hint
const wordObject = {
    raccoon: {
        word: 'raccoon',
        imageInfo: '<img src="assets/images/raccoon.jpg" alt="picture of animal" width="50%">',
        hint: '"Trash panda"'
    },
    leopard: {
        word: 'leopard',
        imageInfo: '<img src="assets/images/leopard.jpg" alt="picture of animal" width="50%">',
        hint: '"Rose cat"'
    },
    cheetah: {
        word: 'cheetah',
        imageInfo: '<img src="assets/images/cheetah.jpg" alt="picture of animal" width="50%">',
        hint: '"Speedy boi"'
    }
    /*
    salamander: {
        word: 'salamander',
        imageInfo: ' ',
        hint: '"Amphibian lizard'
    },
    dragon: {
        word: 'dragon',
        imageInfo: ' ',
        hint: '"mythical beast"'
    },
    //polar bear: ice bear*/

};

//GAME OBJECT: This is the code for the hangman game
const gameObject = {

    //GAME PROPERTIES
    guesses_left: GUESSES,
    letters_guessed: '',
    wins: 0,
    currentWordIndex: -1,
    wordList: ['raccoon', 'leopard','cheetah'],
    currentWord: '',
    blank_word: '',
    //This variable is used to control the music. (ex. I don't want to restart the win song everytime I win.)
    // 0 = start (no win/loss); 1 = won last round; 2 = lost last round
    won_prev: 0,

    //GAME METHODS

    //START: This method selects the word and sets/resets variables for the game.
    //returns nothing, updates the object variables/website
    start: function(){
        //selects a random word
        currentWordIndex = Math.floor(Math.random()*this.wordList.length); //get random index
        this.currentWord = this.wordList[currentWordIndex] //get word from index
        this.makeBlankWord(wordObject[this.currentWord].word.length)//make into blank word
        this.wordList.splice(currentWordIndex,1)//remove word
        //set(or reset) variables to page
        this.guesses_left = GUESSES
        this.letters_guessed = ''
        hint_block.innerText = wordObject[this.currentWord].hint
        word_block.innerText = this.blank_word;
        guess_count_block.innerText = this.guesses_left;
        win_block.innerText = this.wins;
        letters_guessed_block.innerText = this.letters_guessed;
    },

    //HANGMAN: This is the main game method. It handles the key-press, updating the blank word and variables, and checking for
    // end game conditions
    // returns nothing
    hangman: function(key){
        //if pressed key is a letter AND hasn't already been guessed ...
        if (this.isValidGuess(key)){
            //add letter to letters guessed
            if (this.letters_guessed.length === 0){ //if first letters guessed, just add key
                this.letters_guessed += key;
            }
            else {                                  //else add comma, space, and key
                this.letters_guessed += ', '+key;  
            }
            //Check and update blank word
            //gets a list of indexes if the letter appears in the word
            const indexList = this.checkWord(key, this.currentWord);
            //updates the blank word with the list of indexes
            this.updateWord(indexList, key);
            //Updates variables and website
            this.guesses_left--;
            letters_guessed_block.innerText = this.letters_guessed;
            guess_count_block.innerText = this.guesses_left;
        }

        //checks for 2 end-game conditions
        //Condition 1: if there are no more dashes ~ the players guessed all the letters ~player won ...
        if (this.blank_word.includes('_') === false){
            //plays winner music
            if (this.won_prev !== 1){
                this.playSound('win')
            }
            //Updates variables and website
            this.wins = this.wins + 1;
            win_block.innerText = this.wins
            this.won_prev = 1;
            //end round function
            this.end()
        }
        //Condition 2: no more guesses ~ player lost
        else if (this.guesses_left === 0){
            //plays loser music
            if (this.won_prev !== 2){
                this.playSound('loss')
            }
            this.won_prev = 2;
            //end round function
            this.end()
        }
        //game continues if neither end-condition met    
    },

    //END: This method updates the variables that need updated after each round. It also checks to see if there are more words to play.
    //Prevents the call to the hangman function if there are no more words left to play
    //returns nothing
    end: function(){
        //updates website with the previous word info
        image_HTML.innerHTML = wordObject[this.currentWord].imageInfo
        prev_word_block.innerText = wordObject[this.currentWord].word
        //if user played through all the words...
        if (this.wordList.length === 0){
            //this variable prevents the event function from calling the hangman method
            GAME = false;
            //play final music
            this.playSound('end')
            //alert
            alert("There are no more words left. Thank you for playing. Have a purrrrrrfect day!")
        }
        //if there are more words to play, restart the game
        else{
            this.start()
        }
    },

    //PLAYSOUND: This method plays the sound according to state of the game. It also updates the website with the song info.
    //returns nothing
    playSound: function(musicType){
        if (musicType === 'win'){
            sound_html = soundObject.win.html
            sound_info = soundObject.win.name
        }
        else if (musicType === 'loss'){
            sound_html = soundObject.loss.html
            sound_info = soundObject.loss.name
        }
        else{ //musicType === 'end'
            sound_html = soundObject.end.html
            sound_info = soundObject.end.name
        }
        sound_block.innerText = sound_info;
        music.innerHTML = sound_html;
        music.pause();
        music.load();
        music.play();
        music.loop = true;
    },

    //MAKEBLANKWORD: This method makes the dashed word at the start of every round
    //returns nothing, updates the object variable
    makeBlankWord: function(wordLength){
        this.blank_word = '';
        for (let x = 0; x < wordLength; x++){
            this.blank_word += '_ ';
        }
    },

    //CHECKWORD: This method returns a list of indexes where a letter occurs in the word
    checkWord: function(letter, word){
        let index = word.indexOf(letter,0);
        const indexList = [];

        while (index !== -1){
            indexList.push(index);
            index = word.indexOf(letter,index+1);
        }
        return indexList;
    },

    //UPDATEWORD: This method updates the blank word given a letter and a list of indexes where it occurs in the word
    //returns nothing, updates the object variable/website
    updateWord: function(indexList, letter){
        for (index = 0; index < indexList.length; index++){
            indexToUpdate = indexList[index];
            indexToUpdate = indexToUpdate * 2; //there is a space between every letter
            temp = this.blank_word;
            this.blank_word = temp.slice(0,indexToUpdate) + letter + temp.slice(indexToUpdate+1, temp.length);
            word_block.innerText = this.blank_word
        }
    },

    //ISVALIDGUESS: This method checks if a key-press is a letter and if it has already been guessed
    //returns T or F
    isValidGuess: function(key){
        pattern = /[a-z]/i;
        isLetter = pattern.test(key);
        if (isLetter & key.length === 1){
            if (!(this.letters_guessed.includes(key))){
                return true;
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    }
};

//CALLS

//calls the start method right away to get the first word and initiate the variables
gameObject.start()
//event listener that calls the eventfunction for every key press
document.addEventListener('keyup',eventFunction);

