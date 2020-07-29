//File: game.js
//Author: Jared Appleman
//For: Personal Project
//War

const p1CurrentCardHTML = document.querySelector('#p1CurrentCard');
const p2CurrentCardHTML = document.querySelector('#p2CurrentCard');
const messageHTML = document.querySelector('#message');
const p1DeckLengthHTML = document.querySelector('#p1DeckLength')
const p2DeckLengthHTML = document.querySelector('#p2DeckLength')
const p1PileLengthHTML = document.querySelector('#p1PileLength')
const p2PileLengthHTML = document.querySelector('#p2PileLength')
let p1DECK = [];
let p2DECK = [];
let p1PILE = [];
let p2PILE = [];

let p1DECK_LENGTH = 0;
let p2DECK_LENGTH = 0;
let p1PILE_LENGTH = 0;
let p2PILE_LENGTH = 0;

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
        deck.splice(index,0)
    }
    return shuffledDeck;
}
const dealCards = function(deck){
    //Input: deck
    //Output: 2 lists
    //doesn't change display.
    player1 = true;

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
    
const updateGameInfo = function(){

    p1DeckLengthHTML.innerHTML = 'Cards in Deck: ' + p1DECK.length;
    p1PileLengthHTML.innerHTML = 'Cards in Pile: ' + p1PILE.length;
    p2DeckLengthHTML.innerHTML = 'Cards in Deck: ' + p2DECK.length;
    p2PileLengthHTML.innerHTML = 'Cards in Pile: ' + p2PILE.length;

}


const testFunction = function(){
    //Input: none
    //Output: 2 lists
    // change from outline cards to back of cards; Draw button appears
    deck = createShuffledDeck();
    console.log(deck.length)
    playerDecks = dealCards(deck);
    p1DECK = playerDecks[0];
    p2DECK = playerDecks[1];
    p1DECK_LENGTH = p1DECK.length;
    p2DECK_LENGTH = p2DECK.length;

    updateGameInfo()
    
    //alert("hello");
}

const drawFunction = function(){
    let p1Card = p1DECK.pop();
    let p2Card = p2DECK.pop();
    let cardPot = [p1Card, p2Card];

    if (p1Card.weight > p2Card.weight){
        p1PILE = p1PILE.concat(cardPot);
        console.log("Player1 won the trick")
        messageHTML.innerHTML = "Player1 Won the Trick"

    }
    else{
        p2PILE = p2PILE.concat(cardPot)
        console.log("Player2 won the trick")
        messageHTML.innerHTML = "Player2 Won the Trick"
    }
    else(
        console.log("there is a tie")

        

    )
    
    p1CurrentCardHTML.innerHTML =  p1Card.imageHTML +'<p class="cardInfo">' + p1Card.name+ '</p>'
    p2CurrentCardHTML.innerHTML =  p2Card.imageHTML +'<p class="cardInfo">' + p2Card.name+ '</p>'
    updateGameInfo()
   // p1DeckLengthHTML.innerHTML
}

const tieFunction = function(){}

const emptyDeck = function(deck){
    
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
