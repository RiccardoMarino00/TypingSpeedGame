
let output = document.querySelector('.output');
let phrase = document.querySelector('.phrase');
let input = document.querySelector('.user-input');
let time = document.querySelector('.time');
let score = document.querySelector('.score');
let play = document.querySelector('.play');
let restart = document.querySelector('.restart');
let video = document.querySelector('.video');
let interval;
let playClick = false;
let parole = '';
let tagletters = [];
let lettere = [];
let isCorrect = true;
let previousLength = 0;

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
            score.textContent = 'score: 0'
            input.value = '';
            input.focus();
            await getNextQuote();
            console.log(output)
            tagletters = [];
            lettere = [];
            score.textContent = 'Score: 0';
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
                output.textContent = [];
                phrase.textContent = 'Try Again';  
                input.value = '';
            }, 60000);
        
    }
}


function restartTimer() {
    time.innerHTML = '01:00'
    clearInterval(interval);
    playClick = false;
    phrase.textContent = 'Play';
    output.textContent = [];
    input.value = '';
    score.textContent = 'score: 0'
}



play.addEventListener('click', startTimer );

restart.addEventListener('click', restartTimer );


// API per frasi
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
    let inputArray = input.value.split(''); // Divide l'input dell'utente in un array di lettere
    console.log(inputArray)

    const lengthInput = inputArray.length;
    const length = Math.min(inputArray.length, lettere.length); //Math.min garantisce che non si vada mai oltre la lunghezza della frase stessa.

    let currentText = score.textContent;
    let currentScore  = parseInt(currentText.split(': ')[1]);
               
                let i = lengthInput - 1; //prende indice ultima lettera digitata
                let j = lengthInput;
                let letter = document.querySelectorAll('letter')
                letter 
                inputArray
                console.log(letter[i])
                console.log(inputArray)
                if (lengthInput > previousLength) { // Verifica se l'input è più lungo rispetto al precedente (nuova lettera inserita)
                    if (inputArray[i] === lettere[i]) {
                        console.log('letter giusta', inputArray[i])
                        console.log(letter[i])
                        console.log(tagletters[i])
                        letter[i].classList.add('green');
                        letter[i].classList.remove('red');

                        currentScore += 1;
                        console.log(currentScore);
                        score.textContent = `Score: ${currentScore}`;
                        
                    } else {
                        console.log('letter sbagliata' , inputArray[i])
                        letter[i].classList.add('red');
                        letter[i].classList.remove('green');

                    }
                }  else {
                    console.log('ha cancellato')
                    if(letter[j].classList.contains('green')) {
                        letter[j].classList.remove('green');
                        currentScore -= 1;
                        score.textContent = `Score: ${currentScore}`;
                    } else if (letter[j].classList.contains('red')) {
                        letter[j].classList.remove('red');

                    }

                }
            previousLength = lengthInput;
})