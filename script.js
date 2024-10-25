
let output = document.querySelector('.output');
let phrase = document.querySelector('.phrase');
let input = document.querySelector('.user-input');
let time = document.querySelector('.time');
let score = document.querySelector('.score');
let play = document.querySelector('.play');
let restart = document.querySelector('.restart');
let interval;
let playClick = false;
let parole = '';
let tagletters = [];
let lettere = [];
let isCorrect = true;

function creatag() {
    parole = phrase.textContent.split(' ');
    parole.forEach(parola => {
        const tagword = document.createElement('word');
        for (let lettera of parola) {
            const tagletter = document.createElement('letter');
            tagletter.textContent = lettera;
            tagletters.push(lettera);
            lettere.push(lettera);
            tagword.appendChild(tagletter);
        }
        phrase.innerHTML = '';
        output.appendChild(tagword);

    });

}

async function startTimer() {
    if(playClick == false) {
            input.value = '';
            await getNextQuote();
            creatag();
            let sec = 59;
            playClick = true;
            interval = setInterval(() => {
                let formattedSec = sec.toString().padStart(2, '0');
                time.innerHTML = '00:' + formattedSec;
                sec --
            }, 1000); 

            setTimeout(function() {
                clearInterval(interval);
                playClick = false;
            }, 60000);
        
            // console.log('Frase casuale:', randomSentence);
    }
}


function restartTimer() {
    time.innerHTML = '01:00'
    clearInterval(interval);
    playClick = false;
    phrase.textContent = 'Ale fa i pompini';
    output.textContent = [];
    input.value = '';
}



play.addEventListener('click', startTimer );

restart.addEventListener('click', restartTimer );


// API per frasi
// const RANDOM_QUOTE_API_URL = 'http://api.quotable.io/random';
const RANDOM_QUOTE_API_URL = 'http://api.quotable.io/random?minLength=300&maxLength=500';

function getRandomQuote() {
    return fetch(RANDOM_QUOTE_API_URL)
    .then(response => response.json())
    .then(data => data.content)
}

async function getNextQuote() {
    phrase.textContent = await getRandomQuote()
    console.log(phrase)
}




input.addEventListener('input', () => {
    const inputArray = input.value.split('');
    let letter = document.querySelectorAll('letter')
    const length = Math.min(inputArray.length, lettere.length);
             for (let i = 0; i < length; i++) {
                letter 
                if (inputArray[i] === lettere[i]) {
                        console.log('letter giusta')
                        console.log(tagletters[i])
                        letter[i].classList.add('green');
                } else {
                        console.log('letter sbagliata')
                        letter[i].classList.add('red');
                }
            }    
})