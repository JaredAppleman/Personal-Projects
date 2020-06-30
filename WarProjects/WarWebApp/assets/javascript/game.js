//File: game.js
//Author: Jared Appleman
//For: Personal Project
//War

const p1CurrentCardHTML = document.querySelector('#p1CurrentCard');
const p2CurrentCardHTML = document.querySelector('#p2CurrentCard');

class playingCard {
    constructor(suit, value, weight, imageURL){
        this.suit = suit;
        this.value = value;
        this.weight = weight;
        this.imageURL = imageURL;
        this.name = value + ' of ' + suit + 's';
    }
    get imageHTML(){
        const alt = 'alt="' + this.name + '"';
        const src = 'src="assets/images/PlayingCardsAlbum/' + this.imageURL + '.jpg"';
        return "<img " + src + " " + alt + ">";
    }
}



const createShuffledDeck = function(){
    const deck = [];
    const cardWeightList = [...Array(53).keys()]
    cardWeightList.splice(0,1)
    for (limit = 52; limit > 0; limit --){
        index = Math.floor(Math.random()*limit);
        weight = cardWeightList[index];
        cardWeightList.splice(index,1);
        if (weight <= 13){
            suit = "Heart";
        }
        else if (weight <= 26){
            suit = "Spade";
            weight = weight - 13;
        }
        else if (weight <= 39){
            suit = "Diamond";
            weight = weight - 26;
        }
        else{
            suit = "Club";
            weight = weight - 39;
        }

        if (weight === 13){
            value = "Ace";
        }
        else if (weight === 12){
            value = "King";
        }
        else if (weight === 11){
            value = "Queen";
        }
        else if (weight === 10){
            value = "Jack";
        }
        else{
            value = weight + 1;
            value = value.toString();
        }
        imageURL = value + suit[0];
        //console.log(suit + ' ' + value)
        let newCard = new playingCard(suit, value, weight, imageURL);
        //console.log(newCard.name)
        deck.push(newCard)
    }
    
    return deck;
}

const shuffleCards = function(deck){
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
    player1 = true;

    const p1Deck = [];
    const p2Deck = [];

    for (index = 0; index < deck.length; index++){
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
    const output = [p1Deck, p2Deck];

    return output;
}
    



const testFunction = function(){
    deck = createShuffledDeck();
    playerDecks = dealCards(deck);
    p1Deck = playerDecks[0];
    p2Deck = playerDecks[1];
    //alert("hello");
    p1Card = p1Deck.pop();
    p2Card = p2Deck.pop();
    console.log(p1Card.suit)
    //p1CurrentCardHTML.innerHTML =  currentCard.imageURL
    p1CurrentCardHTML.innerHTML =  p1Card.imageHTML +'<p class="cardInfo">' + p1Card.name+ '</p>'
    p2CurrentCardHTML.innerHTML =  p2Card.imageHTML +'<p class="cardInfo">' + p2Card.name+ '</p>'
}

