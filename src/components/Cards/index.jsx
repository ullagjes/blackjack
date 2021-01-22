import React, { useState, useEffect } from 'react';

import Wrapper from '../Wrapper'
import PlayingCards from '../PlayingCards';
import DealerCards from '../DealerCards';

function Cards(){
    const[deckId, setDeckId] = useState("")
    const[deck, setDeck] = useState("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
    const [playerCards, setPlayerCards] = useState([]);
    const [dealerCards, setDealerCards] = useState([]);
    const [playerTotal, setPlayerTotal] = useState([]);
    const [dealerTotal, setDealerTotal] = useState([]);
    const [result, setResult] = useState("");
    const [isActive, setIsActive] = useState(null);
    
    //Henter inn en ny kortstokk. Oppretter deck_id for å beholde samme kortstokk ved senere innhenting av data.
    useEffect(() => {
        fetch(deck)
            .then(response => response.json())
            .then (data => {
                    setDeckId(data.deck_id)
            })}, []);

     //Trekker fire kort. De to første tilskrives bruker, de to andre til dealer. Oppretter også verdien av kortene i en egen state. Se convertCards-funksjon for hvordan bokstav-verdier endres til tallverdier.     
    function drawCards() {
        fetch("https://deckofcardsapi.com/api/deck/" + deckId + "/draw/?count=4")
            .then(response => response.json())
            .then(data => {
                setPlayerCards(prevPlayerCards => [...prevPlayerCards, data.cards[0], data.cards[1]]),
                setDealerCards(prevDealerCards => [...prevDealerCards, data.cards[2], data.cards[3]]),
                setPlayerTotal(Number(convertCards(data.cards[0].value)) + Number(convertCards(data.cards[1].value))) 
                setDealerTotal(Number(convertCards(data.cards[2].value)) + Number(convertCards(data.cards[3].value))) 
            });
    };

    //funksjonen har et argument som går inn i en rekke if-setninger. Dette avgjør hvilket tall som returneres dersom verdien består av bokstaver.
    function convertCards(value){
        if(value === "KING") {
            return 10
        } else if (value === "QUEEN") {
            return 10
        } else if (value === "JACK") {
            return 10
        } else if (value === "ACE") {
            return 1
        } else {
            return value
        }
    };

    //trekker inn et nytt kort fra samme kortstokk. Legges til på brukerens hånd + totalsummen oppdateres.
    function hitMe() {
        fetch("https://deckofcardsapi.com/api/deck/" + deckId + "/draw/?count=1")
        .then(response => response.json())
        .then(data => {
            setPlayerCards(prevPlayerCards => [...prevPlayerCards, data.cards[0]]),
            setPlayerTotal(playerTotal + Number(convertCards(data.cards[0].value)))
        });
    };

    //når brukeren er ferdig med å trekke kort, trykker han call it. Nå er det dealeren sin tur. Funksjonen sørger for at dealer enten trekker inn et kort, eller lar være dersom brukeren allerede har oversteget 21.
    function callIt(){
        if(playerTotal >= 21){
            console.log("do nothing")
        } else if(playerTotal < 21 && dealerTotal < 17 && dealerTotal < playerTotal){
            console.log("hepp")
            fetch("https://deckofcardsapi.com/api/deck/" + deckId + "/draw/?count=1")
            .then(response => response.json())
            .then(data => {
                setDealerCards(prevDealerCards => [...prevDealerCards, data.cards[0]]),
                setDealerTotal(dealerTotal + Number(convertCards(data.cards[0].value)))
            })
        }
    };

    //Når brukeren så ber om å se dealerens kort, kjører funksjonen som gir ulike resultater basert på om bruker eller dealer har høyest verdi på hånden, eller om bruker har oversteget 21.
    function showResults(){ 
        setIsActive(1)
        if(playerTotal < dealerTotal || dealerTotal == 21 || playerTotal > 21) {
            setResult("Dealer's total is: "+ dealerTotal +". Dealer wins!")
        } else if (playerTotal == dealerTotal) {
            setResult("Dealer's total is: "+ dealerTotal +". It's a draw! Dealer wins!")
        } else if (playerTotal == 21 && dealerTotal < 21) {
            setResult("Dealer's total is: "+ dealerTotal +". You win!")
        } else if (playerTotal > dealerTotal) {
            setResult("Dealer's total is: "+ dealerTotal +". You win!")
        };
    };

    //Nullstiller alle states og stokker kortstokken.
    function startNewGame() {
        setIsActive(null)
        setPlayerCards([]);
        setDealerCards([]);
        setPlayerTotal([]);
        setDealerTotal([]);
        setResult("");
        setDeck("https://deckofcardsapi.com/api/deck/"+ deckId +"/shuffle/");
    };

    //Sørger for at dealerens kort er skjult, med unntak av det første kortet. Benytter &:first-child i DealerCards for å oppnå denne effekten.
    function hideDealerHand(){
        return(
            <>
            {dealerCards.map(i => {
                return <DealerCards src={i.image} key={i.code}></DealerCards>
            })}
            </>
        )
    }

    //Sørger for å vise alle kortene dealeren har på hånden ved å bruke PlayingCards som komponent i stedet for DealerCards.
    function showDealerHand(){
        return(
            <>
            {dealerCards.map(i => {
                return <PlayingCards src={i.image} key={i.code}></PlayingCards>
            })}
            </>
        )
    }

    return( 
        <>  
            <Wrapper>
                <button onClick={drawCards}> Draw Cards </button>
                <button onClick={hitMe}>Hit me</button>
                <button onClick={callIt}>Call it!</button>
                <button onClick={showResults}>Show dealer's hand</button>
                <button onClick={startNewGame}>Start a new game</button>
                
                <div>
                    <p>Your current sum is {playerTotal}</p>
                    <p>{result}</p>
                    {playerCards.map(i => {
                        return <PlayingCards src={i.image} key={i.code}></PlayingCards>
                    })}
                </div>
                    
                <div>
                    {(isActive === null) ? hideDealerHand() : showDealerHand()}
                </div>
            </Wrapper>
            
        </>
    );
};

export default Cards
