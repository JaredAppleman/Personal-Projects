//File: game.js
//Author: Jared Appleman
//For: Personal Project
//War

/*###################################
DOM variables
####################################*/

const startGameButton = document.querySelector('#startGameButton');
const drawButton = document.querySelector('#drawButton');
const p1CurrentCardHTML = document.querySelector('#p1CurrentCard');
const p2CurrentCardHTML = document.querySelector('#p2CurrentCard');
const messageHTML = document.querySelector('#message');
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
    get imageHTML(){
        const alt = 'alt="' + this.name + '"';
        const src = 'src="assets/images/PlayingCardsAlbum/' + this.imageURL + '.jpg"';
        return "<img " + src + " " + alt + ">";
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


/*###################################
DECK FUNCTIONS
####################################*/

const createShuffledDeck = function(){
    //input: none
    //output: deck
    //doesn't change display
    const deck = [];
    const cardWeightList = [...Array(53).keys()]
    cardWeightList.splice(0,1)
    for (limit = 52; limit > 0; limit --){
        index = Math.floor(Math.random()*limit);
        deckWeight = cardWeightList[index];
        cardWeightList.splice(index,1);
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
        //console.log(newCard.name)
        deck.push(newCard)
    }
    
    return deck;
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
    playerDecks = dealCards(deck);
    console.log(playerDecks[0].length)
    player1.deck = playerDecks[0];
    player2.deck = playerDecks[1];
    console.log(player1.deckLength)
    console.log(player2.deckLength)

    updateGameInfo()
    startGameButton.disabled = true;
    
    //alert("hello");
}

const drawFunction = function(){
    isEmptyDeck(player1)
    isEmptyDeck(player2)

    let p1Card = player1.deck.pop();
    let p2Card = player2.deck.pop();
    let cardPot = [p1Card, p2Card];
    console.log([p1Card.name,p2Card.name])


    if (p1Card.weight > p2Card.weight){
        trickWinner = player1;
    }
    else if (p1Card.weight < p2Card.weight){
        trickWinner = player2;
    }

    else{
        console.log("there is a tie")
        messageHTML.innerHTML = "There is a tie"
        //tieFunction(cardPot)
        trickWinner = player1;
    }

    roundOver(trickWinner, cardPot);
  
    p1CurrentCardHTML.innerHTML =  p1Card.imageHTML +'<p class="cardInfo">' + p1Card.name+ '</p>'
    p2CurrentCardHTML.innerHTML =  p2Card.imageHTML +'<p class="cardInfo">' + p2Card.name+ '</p>'
    updateGameInfo()
    gameOver(player1)
    gameOver(player2)
   // p1DeckLengthHTML.innerHTML
}

const displayCards = function(cardList){

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

/*###################################
Tie FUNCTIONS
####################################*/

const tieFunction = function(cardPot){
    cardPot = tieFunction_getCards(cardPot)
}

const tieFunction_getCards = function(cardPot){
    //Get player1's Cards
    const p1CardPot = [];

    //normal
    if (p1DECK.length >= 4){
        for (x = 0; x < 4; x++){
            p1CardPot.push(p1DECK.pop())
        }
    }

    else if ((p1PILE.length + p1DECK.length) >= 4){
        p1DECK = shuffleCards(p1PILE);
        p1PILE = [];
        for (x = 0; x < 4; x++){
            p1CardPot.push(p1DECK.pop())
        }
    }
    else if (((p1PILE.length + p1DECK.length) > 0) && ((p1PILE.length + p1DECK.length) < 4)){}

    else{
        gameOver()
    }
}


/*###################################
OTHER HELPER FUNCTIONS
####################################*/

const roundOver = function(trickWinner, cardPot){
    trickWinner.pile = trickWinner.pile.concat(cardPot);
    console.log(trickWinner.string);
    messageHTML.innerHTML = trickWinner.string + " won the trick";

}

const gameOver = function(player){
    if (player.totalCards === 0){
        messageHTML.innerHTML = "The Game is over. " + player.opponent + "wins!";
        drawButton.disabled = true;
    }
}

const isEmptyDeck = function(player){
    if (player.deckLength === 0){
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




