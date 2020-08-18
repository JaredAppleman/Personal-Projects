//File: game.js
//Author: Jared Appleman
//For: Personal Project
//War

/*###################################
DOM variables
####################################*/

//Buttons
const startGameButton = document.querySelector('#startGameButton');
const drawButton = document.querySelector('#drawButton');
const newGameButton = document.querySelector('#newGameButton');

//Current Cards + Message
const p1CurrentCardHTML = document.querySelector('#p1CurrentCard');
const p2CurrentCardHTML = document.querySelector('#p2CurrentCard');
const messageHTML = document.querySelector('#message');

//Pot Areas
const p1PotAreaHTML = document.querySelector(".p1PotArea")
const p2PotAreaHTML = document.querySelector(".p2PotArea")
const potAreaDepth1 = Array.from(document.querySelectorAll(".tieDepth-1"))
const potAreaDepth2 = Array.from(document.querySelectorAll(".tieDepth-2"))
const potAreaDepth3 = Array.from(document.querySelectorAll(".tieDepth-3"))
const potAreaDepth4 = Array.from(document.querySelectorAll(".tieDepth-4"))
const potAreaDepth5 = Array.from(document.querySelectorAll(".tieDepth-5"))
const potAreaDepth6 = Array.from(document.querySelectorAll(".tieDepth-6"))
const potAreaDepth7 = Array.from(document.querySelectorAll(".tieDepth-7"))
var extraPotArea = document.querySelectorAll(".extra")

//Game Info Buttons
const p1DeckLengthHTML = document.querySelector('#p1DeckLength')
const p2DeckLengthHTML = document.querySelector('#p2DeckLength')
const p1PileLengthHTML = document.querySelector('#p1PileLength')
const p2PileLengthHTML = document.querySelector('#p2PileLength') 

/*###################################
CLASSES
####################################*/

class player{
    constructor(string){
        this.deck = [];
        this.pile = [];
        this.string = string;
    }
    get deckLength(){
        return this.deck.length
    }
    get pileLength(){
        return this.pile.length
    }
    get totalCards(){
        return this.deck.length + this.pile.length
    }
    get opponent(){
        if (this.string === "player1"){
            return "Player2";
        }
        else{
            return "Player1";
        }
    }
}

class playingCard {
    constructor(suit, value, suitWeight, deckWeight, imageURL){
        this.suit = suit;
        this.value = value;
        this.weight = suitWeight;
        this.deckWeight = deckWeight
        this.imageURL = imageURL;
        this.name = value + ' of ' + suit + 's';
    }
    get imageSource(){
        const alt = 'alt="' + this.name + '"';
        //const src = 'src="assets/images/PlayingCardsAlbum/' + this.imageURL + '.jpg"';
        //return "<img " + src + " " + alt + ">";
        return "assets/images/PlayingCardsAlbum/" + this.imageURL + ".jpg"
    }
    get abbreValue(){
        if (! (this.value === '10')){
            return this.value[0]
        }
        else{
            console.log(this.value)
            return this.value;
        }
    }
    
}

/*###################################
GLOBAL VARIABLES
####################################*/

var player1 = new player("Player1");
var player2 = new player("Player2");

var cardPot = [];
var trickWinner;

var potAreaDepthList = [potAreaDepth1, potAreaDepth2, potAreaDepth3, potAreaDepth4, 
    potAreaDepth5, potAreaDepth6, potAreaDepth7];
var tieDepth = 0;
var resetTiePotBool = false
var flopPotCards = [];
var totalPotArea = []


/*###################################
DECK FUNCTIONS
####################################*/

const createShuffledDeck = function(){
    //input: none
    //output: deck
    //doesn't change display

    const deck = [];
    //array of integers from [0-52]
    const cardWeightList = [...Array(53).keys()]
    //removes first item (0) from the array, so its [1-52]
    cardWeightList.splice(0,1)
    for (limit = 52; limit > 0; limit --){
        index = Math.floor(Math.random()*limit);
        deckWeight = cardWeightList[index];
        cardWeightList.splice(index,1);
        newCard = getCardInfo(deckWeight);
        //console.log(newCard.name)
        deck.push(newCard)
    }
    
    return deck;
}

const getCardInfo = function(deckWeight){
    if (deckWeight <= 13){
        suit = "Heart";
        suitWeight = deckWeight;
    }
    else if (deckWeight <= 26){
        suit = "Spade";
        suitWeight = deckWeight - 13;
    }
    else if (deckWeight <= 39){
        suit = "Diamond";
        suitWeight = deckWeight - 26;
    }
    else{
        suit = "Club";
        suitWeight = deckWeight - 39;
    }

    if (suitWeight === 13){
        value = "Ace";
    }
    else if (suitWeight === 12){
        value = "King";
    }
    else if (suitWeight === 11){
        value = "Queen";
    }
    else if (suitWeight === 10){
        value = "Jack";
    }
    else{
        value = suitWeight + 1;
        value = value.toString();
    }
    imageURL = value + suit[0];
    //console.log(suit + ' ' + value)
    let newCard = new playingCard(suit, value, suitWeight, deckWeight, imageURL);
    
    return newCard;
}

const createMiracleDeck = function(){
    //custom decks for testing
    const p1Deck = [];
    const p2Deck = [];

/*     //last 12 cards
    p1Deck.push(getCardInfo(49))
    p1Deck.push(getCardInfo(48))
    p1Deck.push(getCardInfo(47))
    p1Deck.push(getCardInfo(50))
    p1Deck.push(getCardInfo(51))
    p1Deck.push(getCardInfo(52))
    //1 Card tie: 26, 22, 21, 23, 24, 25
    //2 Card tie: 26. 22. 21. 24. 23. 25
    p2Deck.push(getCardInfo(26))
    p2Deck.push(getCardInfo(22))
    p2Deck.push(getCardInfo(21))
    p2Deck.push(getCardInfo(24))
    p2Deck.push(getCardInfo(23))
    p2Deck.push(getCardInfo(25))

    for (index = 52; index > 0; index--){
        if ((index > 26) && (index < 47)){
            p1Deck.push(getCardInfo(index))
        }
        else if (index < 21){
            p2Deck.push(getCardInfo(index))
        }
    } */
    for (index = 52; index > 0; index--){
        if (index > 26){
            p1Deck.push(getCardInfo(index))
        }
        else{
            p2Deck.push(getCardInfo(index))
        }
    }
    const output = [p1Deck, p2Deck];
    return output;
}
const shuffleCards = function(deck){
    //Input: deck
    //Output: deck
    //doesn't change dispaly
    shuffledDeck = [];
    deckLength = deck.length

    for (limit = deckLength; limit > 0; limit --){
        index = Math.floor(Math.random()*limit);
        card = deck[index]
        shuffledDeck.push(card)
        deck.splice(index,1)
    }
    return shuffledDeck;
}
const dealCards = function(deck){
    //Input: deck
    //Output: 2 lists
    //doesn't change display.
    let player1 = true;

    const p1Deck = [];
    const p2Deck = [];

    for (index = 0; index < deck.length;){
        card = deck.pop();
        if (player1){
            p1Deck.push(card);
            player1 = false;
        }
        else{
            p2Deck.push(card);
            player1 = true;
        }
    }
    console.log(p1Deck.length)
    console.log(p2Deck.length)
    const output = [p1Deck, p2Deck];

    return output;
}

/*###################################
BUTTON FUNCTIONS
####################################*/

const testFunction = function(){
    //Input: none
    //Output: 2 lists
    // change from outline cards to back of cards; Draw button appears
    deck = createShuffledDeck();
    //playerDecks = createMiracleDeck();
    playerDecks = dealCards(deck);
    console.log(playerDecks[0].length)
    player1.deck = playerDecks[0];
    player2.deck = playerDecks[1];
    updateGameInfo()
    startGameButton.disabled = true;
    drawButton.disabled = false;
    newGameButton.disabled = false;
    p1CurrentCardHTML.src = "assets/images/playingCard.jpg"
    p2CurrentCardHTML.src = "assets/images/playingCard.jpg"
    //alert("hello");
}

const drawFunction = function(){
    let tieBool = false;

    //reset tie pot cards if needed
    //needed to be done the following round, after tie is resolved so the pot cards can be revealed
    if (resetTiePotBool){
        resetTiePot();
        resetTiePotBool = false;
    }

    //shuffle decks if needed
    isEmptyDeck(player1)
    isEmptyDeck(player2)

    //get cards
    let p1Card = player1.deck.pop();
    let p2Card = player2.deck.pop();
    //add cards to pot
    cardPot.push(p1Card); cardPot.push(p2Card);
    console.log([p1Card.name,p2Card.name])

    //compare cards
    if (p1Card.weight > p2Card.weight){
        trickWinner = player1;
    }
    else if (p1Card.weight < p2Card.weight){
        trickWinner = player2;
    }

    else{
        console.log("there is a tie")
        messageHTML.innerHTML = "There is a tie"
        tieBool = true;

    }
    //if there is a tie...
    if (tieBool){
        cards = tieFunction()
    }
    //if there isn't a tie ~ round decided
    else{
        //if there was a tie the previous round
        if (tieDepth > 0){
            revealPotCards()
            //reset tie global variables
            resetTiePotBool = true;
            //p1Pot = []; p2Pot = []
            tieDepth = 0
            flopPotCards = []
            totalPotArea = []
        }
        roundOver();
    }
    
    p1CurrentCardHTML.src = p1Card.imageSource;
    p2CurrentCardHTML.src = p2Card.imageSource;
    updateGameInfo()
    gameOver(player1)
    gameOver(player2)
}

const displayCards = function(playerCardList){
    cardList = Array.from(playerCardList)

    let newLineBool = false;
    let currentSuit = ''
    let text = ''

    if (cardList.length === 0){
        alert("There are no cards.")
    }

    else{
        cardList.sort((a,b) => {
            return a.deckWeight - b.deckWeight});

        for (index = 0; index < cardList.length; index++){
            if (!(cardList[index].suit === currentSuit) && newLineBool){
                text += '\n' + cardList[index].suit + ': ' + cardList[index].abbreValue;
                currentSuit = cardList[index].suit;
            }
            else if (!(cardList[index].suit === currentSuit) && (!(newLineBool))){
                text += cardList[index].suit + ': ' + cardList[index].abbreValue;
                currentSuit = cardList[index].suit;
                newLineBool = true;
            }
            else{
                text += ', ' + cardList[index].abbreValue;
            }
        }
        alert(text)
    }
}

const newGame = function(){
    let response = confirm("This will reload the page.")
    if (response){
        location.reload();
        return false;
    }
} 

/*###################################
TIE FUNCTIONS
####################################*/

const tieFunction = function(){
    //when a player is almost out of cards...
    let min = Math.min(player1.totalCards, player2.totalCards);

    //The flop the resulted in a tie was the player's last card
    if (min === 0){
        gameOver(player1)
        gameOver(player2)
    }
    //Have 1 remaining ~ can't put any cards face down
    else if (min === 1){
    }
    else{
        //normal case
        if (min >= 4){
            min = 4;
        }
        currentPotArea = potAreaDepthList[tieDepth]

        //unhide blank cards
        if (tieDepth >= 1){
            for (index = 0; index < currentPotArea.length; index++){
                currentPotArea[index].style.display = "inline-block";
            }
        }
    
        let potCardIndex = 0
        for (let x = 0; x < min - 1; x++){
            console.log('okay')
            console.log(potCardIndex)
            //check for shuffle
            isEmptyDeck(player1)
            isEmptyDeck(player2)

            //Get player cards and add to pot
            //get player1Card
            tmp = player1.deck.pop()
            console.log(tmp.name)
            //add card to whole pot, tie flop pot
            flopPotCards.push(tmp)
            cardPot.push(tmp);
            //get player2Card
            tmp = player2.deck.pop()
            console.log(tmp.name)
            //add card to whole pot, and tie flop pot
            cardPot.push(tmp); 
            flopPotCards.push(tmp)

            //Display pot Cards
            tmpPotCardDom = currentPotArea[potCardIndex]
            //add card to tie flop Dom list
            totalPotArea.push(tmpPotCardDom)
            //display card
            tmpPotCardDom.src = "assets/images/playingCard.jpg"
            tmpPotCardDom = currentPotArea[potCardIndex+3]
            //add card to tie flop Dom list
            totalPotArea.push(tmpPotCardDom)
            //display card
            tmpPotCardDom.src = "assets/images/playingCard.jpg"
            potCardIndex += 1
        }
        
        tieDepth = tieDepth + 1;
    }
}



/*###################################
OTHER HELPER FUNCTIONS
####################################*/

const roundOver = function(){
    trickWinner.pile = trickWinner.pile.concat(cardPot);
    console.log(trickWinner.string);
    messageHTML.innerHTML = trickWinner.string + " won the trick";
    cardPot = [];

}

const gameOver = function(player){
    let gameOverBool = false;

    if ((player1.totalCards === 0) && (player2.totalCards === 0)){
        messageHTML.innerHTML = "The Game is over. Both players lose."
        gameOverBool = true;
    }
    else if (player.totalCards === 0){
        messageHTML.innerHTML = "The Game is over. " + player.opponent + " wins!";
        gameOverBool = true;
    }

    if (gameOverBool){
        drawButton.disabled = true;
        if (totalPotArea.length > 0){
            revealPotCards()
        }
    }
}

const isEmptyDeck = function(player){
    if (player.deckLength === 0){
        console.log("player had "+player.pileLength+"cards in their pile")
        player.deck = shuffleCards(player.pile);
        player.pile = [];
        console.log(player.string+" shuffled")

    }
}

const updateGameInfo = function(){

    p1DeckLengthHTML.innerHTML = 'Cards in Deck: ' + player1.deckLength;
    p1PileLengthHTML.innerHTML = 'Cards in Pile: ' + player1.pileLength;
    p2DeckLengthHTML.innerHTML = 'Cards in Deck: ' + player2.deckLength;
    p2PileLengthHTML.innerHTML = 'Cards in Pile: ' + player2.pileLength;
}

const revealPotCards = function(){
    for (index = 0; index < flopPotCards.length; index++){
        totalPotArea[index].src = flopPotCards[index].imageSource
    }
}

const resetTiePot = function(){
    let imageList = potAreaDepth1;

    for (index = 0; index < imageList.length; index++){
        imageList[index].src = "assets/images/blankCard2.png";
    }
    for (index = 0; index < extraPotArea.length; index++){
        extraPotArea[index].style.display = "none";    
    }
}
