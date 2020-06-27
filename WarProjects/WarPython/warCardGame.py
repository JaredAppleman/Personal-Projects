"""
Author: Jared Appleman
Description: Python, Text-based War Card Game
"""


import random
"""
##################################################
Card Class
##################################################
"""
class Card:
    def __init__(self, suit, value, weight):
        self.suit = suit
        self.value = value
        self.weight = weight
        self.name = value + ' of ' + suit + 's'

"""
##################################################
Deck Class
##################################################
"""
class Deck:
    #def __init__(self):

    def createShuffledDeck():
        deck = []
        cardWeightList = list(range(1,53))
        for cardsToAdd in range(52,0,-1):
            index = random.randint(0,cardsToAdd-1)
            weight = cardWeightList[index]
            del cardWeightList[index]
            if weight <= 13:
                suit = 'heart'
            elif weight <= 26:
                suit = 'spade'
                weight = weight - 13
            elif weight <= 39:
                suit = 'diamond'
                weight = weight - 26
            else:
                suit = 'club'
                weight = weight - 39

            if weight == 13:
                value = 'ace'
            elif weight == 12:
                value = 'king'
            elif weight == 11:
                value = 'queen'
            elif weight == 10:
                value = 'jack'
            else:
                value = str(weight + 1)
            newCard = Card(suit, value, weight)
            deck.append(newCard)
        return deck
        
    def dealCards(deck):
        player1 = True

        player1Deck = []
        player2Deck = []
        
        for card in deck:
            if player1:
                player1Deck.append(card)
                player1 = False
            else:
                player2Deck.append(card)
                player1 = True

        return player1Deck, player2Deck

    def shuffleCards(deck):
        shuffledDeck = []

        for cardsToShuffle in range(len(deck),0,-1):
            index = random.randint(0,cardsToShuffle-1)
            card = deck[index]
            del deck[index]
            shuffledDeck.append(card)
        return shuffledDeck
                
"""
##################################################
Main Function
##################################################
"""           
def War():
    #variables
    player1Pile = []
    player2Pile = []
    #create deck
    startDeck = Deck.createShuffledDeck()
    print("The cards are shuffled")
    #deal cards
    player1Deck, player2Deck = Deck.dealCards(startDeck)
    print("The cards have been delt")
    input("Press ENTER to start the game :) ")
    print("======================")
    
    #main loop: while there is not a player with 0 combined cards in their...
    #           deck and pile
    while ((len(player1Deck) + len(player1Pile)) != 0) and\
          ((len(player2Deck) + len(player2Pile)) != 0):
        #checks if current hand is empty, if so, moves cards from pile into hand
        if (len(player1Deck) == 0):
            print("*player1 no more cards, gathering pile*")
            player1Deck = Deck.shuffleCards(player1Pile)
            player1Pile = []
        if (len(player2Deck) == 0):
            print("*player2 no more cards, gathering pile*")
            player2Deck = Deck.shuffleCards(player2Pile)
            player2Pile = []
        #gets card for each player
        p1CurrentCard = player1Deck.pop()
        p2CurrentCard = player2Deck.pop()
        #makes winning pot
        handPot = [p1CurrentCard, p2CurrentCard]
        #prints each player's card
        print("player1: " + p1CurrentCard.name)
        print("player2: " + p2CurrentCard.name)
        #compares cards and adds cards to winner pile
        if p1CurrentCard.weight > p2CurrentCard.weight:
            print("PLAYER1 WON THE HAND")
            player1Pile = player1Pile + handPot
        elif p1CurrentCard.weight < p2CurrentCard.weight:
            print("PLAYER2 WON THE HAND")
            player2Pile = player2Pile + handPot
        else:#handles ties
            print("It is a TIE!")
            player1Deck, player1Pile, player2Deck, player2Pile = \
                         tieFunction(player1Deck, player2Deck, player1Pile, \
                                     player2Pile, handPot)
        #End of Round
        userInput = userInputFunction(player1Deck,player1Pile,player2Deck,player2Pile)
        if userInput == 'Q':
            break
        
    #End of Game
    if (len(player1Deck) == 0):
        print("player2 wins")
    elif (len(player2Deck) == 0):
        print("player1 wins")
    else:
        print("======================")
        print("The game was incomplete.")
        print("Player1 had ",len(player1Deck)+len(player1Pile)," cards.")
        print("Player2 had ",len(player2Deck)+len(player2Pile)," cards.")
    print("\nThanks for playing! Have a purrrrrfect day :D")


"""
##################################################
User Input Function
##################################################
"""
def userInputFunction(player1Deck,player1Pile,player2Deck,player2Pile):
        print()
        userInput = input("press ENTER to continue, Q to quit, or I for current\
game info ")
        if userInput == 'I':
            print("======================")
            print("Player1 Info:")
            print("Number of Cards in hand: ", len(player1Deck))
            print("Number of Cards in pile: ", len(player1Pile))
            print("Player2 Info:")
            print("Number of Cards in hand: ", len(player2Deck))
            print("Number of Cards in pile: ", len(player2Pile))
            print("======================")
            print()
            input("press ENTER to continue")
        print()
        return userInput
"""
##################################################
Tie Function
##################################################
"""  
def tieFunction(player1Deck, player2Deck, player1Pile, player2Pile, handPot):
    #gets player1 pot then flop
    player1Deck, player1Pile, p1FlopCard, player1Pot = \
                 tieFunction_getCards(player1Deck, player1Pile)
    
    #gets player2 pot then flop
    player2Deck, player2Pile, p2FlopCard, player2Pot = \
                 tieFunction_getCards(player2Deck, player2Pile)
    
    #if a player has no more cards (last card initiated the tie)
    if (p1FlopCard == 0) or (p2FlopCard == 0):
        return player1Deck, player1Pile, player2Deck, player2Pile
         
    #makes winning pot
    tiePot = [p1FlopCard] + [p2FlopCard] + player1Pot + player2Pot + handPot

    #prints each players flop
    print()
    print("player1 Flop: " + p1FlopCard.name)
    print("player2 Flop: " + p2FlopCard.name)

    #compares and adds winning pot to winning players pile
    if p1FlopCard.weight > p2FlopCard.weight:
        print("Player1 won the hand")
        player1Pile = player1Pile + tiePot
    elif p1FlopCard.weight < p2FlopCard.weight:
        print("Player2 won the hand")
        player2Pile = player2Pile + tiePot

    #in event of 2nd tie: return cards to owners, combine deck/pile, and shuffle
    else:
        print("There is ANOTHER TIE\n\n\n")
        player1Deck = player1Deck + player1Pile + player1Pot + \
                      [p1FlopCard] + handPot[0:1] 
        player2Deck = player2Deck + player2Pile + player2Pot + \
                      [p2FlopCard] + handPot[1:]
        player1Pile = []
        player2Pile = []
        print("*Cards returned to players*")
        player1Deck = Deck.shuffleCards(player1Deck)
        player2Deck = Deck.shuffleCards(player2Deck)
        print("*Cards shuffled*")
        print("*next round ready*")
        return player1Deck, player1Pile, player2Deck, player2Pile

    #prints each players pot
    print("======================")
    tieFunction_displayPot("player1", player1Pot)
    tieFunction_displayPot("player2", player2Pot)
    print("======================")
    
    return player1Deck, player1Pile, player2Deck, player2Pile

"""
##################################################
Tie Helper Functions
##################################################
"""  
def tieFunction_getCards(deck, pile):
    #gets a player's pot then flop
    #if the player doesn't have 4 cards in their hand (3 for pot, 1 for flop)
    if (len(deck) < 4):
        print("*shuffling player deck*")
        shuffledPile = Deck.shuffleCards(pile)
        deck = shuffledPile + deck
        pile = []
        #if player has 4 or more cards (common)
        if (len(deck) >= 4):
            flopCard, pot = tieFunction_fullPot(deck)
        #if player still only has 1-3 after combining their pile and deck...
        elif ((len(deck) > 0) and (len(deck) < 4)):
            flopCard, pot = tieFunction_smallPot(deck)
        else: #if player still has 0 cards meaning their last card initiated the tie
            #returns, the next loop will cause the game to end
            print("*player 1 ran has no more cards*")
            flopCard, pot = 0,0
    #if the player had 4 or more cards...
    else:
        flopCard, pot = tieFunction_fullPot(deck)
        
    return deck, pile, flopCard, pot
    
def tieFunction_smallPot(deck):
    pot = []
    while (len(deck) > 1):
        pot.append(deck.pop())
    return deck.pop(),pot

def tieFunction_fullPot(deck):
    pot = []
    for x in range(0,3):
        pot.append(deck.pop())
    return deck.pop(), pot
def tieFunction_displayPot(player, pot):
    print()
    print(player + "'s Pot:")
    for card in pot:
        print(card.name)

"""
##################################################
Code
##################################################
"""   
War() 
            
