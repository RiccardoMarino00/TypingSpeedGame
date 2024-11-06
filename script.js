                                                                                    // ELEMENTI

const RANDOM_QUOTE_API_URL = 'https://random-word-api.herokuapp.com/word?number=40';
let output = document.querySelector('.output');
let phrase = document.querySelector('.phrase');
let input = document.querySelector('.user-input');
let time = document.querySelector('.time');
let score = document.querySelector('.score');
let play = document.querySelector('.play');
let restart = document.querySelector('.restart');
let video = document.querySelector('.video');
let mistake = document.querySelector('.mistake');
let interval;
let playClick = false;
let parole = '';
let tagletters = [];
let lettere = [];
let isCorrect = true;
let previousLength = 0;
let highestScore = 0;
let isPlaying = false;
let countdownInterval;
let currentScore = 0;
let quote = '';
let mistakes = 0;

                                                                                    //FUNZIONI




//timer conto alla rovescia
function countdown() {
    let remain = parseInt(time.innerHTML);
    time.innerHTML = remain;
    countdownInterval = setInterval(() => {
        remain--;
        time.innerHTML = remain;

        if (remain <= 0) {
            clearInterval(countdownInterval)
            isPlaying = false;
            input.disabled = true;
        }
    }, 1000)

    

}


//clicco play
async function startTimer() {
    input.disabled = false;
    if (!isPlaying) {
        isPlaying = true;
        await getNextQuote();
        countdown()
        input.focus()
        mistakes = 0;

    }
    
}

//riavvia timer
function restartTimer() {
    time.innerHTML = '60'
    clearInterval(countdownInterval);
    playClick = false;
    phrase.textContent = 'Play';
    output.textContent = [];
    input.value = '';
    score.textContent = 'score: 0'
    isPlaying = false;
    currentScore = 0;
    mistakes = 0;

}


// chiamata api
function getRandomQuote() {
    return fetch(RANDOM_QUOTE_API_URL)
    .then(response => response.json())
    .then(data => data.join(' '))
}



//salvataggio frase
async function getNextQuote() {
    quote = await getRandomQuote()
    console.log(quote)
    phrase.innerHTML = ''

    quote.split('').forEach(char => {
        const charSpan = document.createElement('span');
        charSpan.innerText = char;
        phrase.appendChild(charSpan)
    })
    input.value = null;
}



                                                                                    //EVENT LISTENER


input.addEventListener('input', () => {
    const span = phrase.querySelectorAll('span')
    const inputValue = input.value.split('');
    const lengthInput = input.value.length;
 
    span.forEach((outputSpan, i) => {
            const inputChar = inputValue[i]

                    if (inputChar === undefined) {
                        outputSpan.classList.remove('green')
                        outputSpan.classList.remove('red')
                        

                    } else if (inputChar === outputSpan.innerText && lengthInput > previousLength) {
                            
                            if (!outputSpan.classList.contains('green')) {
                                outputSpan.classList.add('green')
                                outputSpan.classList.remove('red')
                                currentScore += 1;
                                score.textContent = `Score: ${currentScore}`;
                                // Animazione +1
                                const plusOne = document.createElement('span');
                                plusOne.innerText = '+1';
                                plusOne.classList.add('float-up-right');
                                score.appendChild(plusOne);

                                // Rimuove l'elemento dopo l'animazione
                                setTimeout(() => {
                                    plusOne.remove();
                                }, 1000);
                            }

                    } else if ( lengthInput === 0) {
                        outputSpan.classList.remove('green')                    //FIXME: Non funziona più cancellazione punti
                        outputSpan.classList.add('red')                         //FIXME: Gli spazi li conta come punto fatto
                        currentScore = 0;                                       //FIXED: togliere possibilità di ricliccare sulla phrase/play
                        score.textContent = `Score: ${currentScore}`;           //FIXED: sitemare riavvia 
                    }  else if (lengthInput < previousLength) {                 //TODO: aggiungere numero errori
                        currentScore -= 1;
                        score.textContent = `Score: ${currentScore}`;
                        // if (outputSpan.classList.contains('green')) {
                        //     const minusOne = document.createElement('span');
                        //     minusOne.innerText = '-1';
                        //     minusOne.classList.add('float-up-error');
                        //     score.appendChild(minusOne);
                        //     // Rimuove l'elemento dopo l'animazione
                        //     setTimeout(() => {
                        //         minusOne.remove();
                        //     }, 1000);
                        // }
                        
                    } else if (inputChar !== outputSpan.innerText) {
                        outputSpan.classList.remove('green')
                        outputSpan.classList.add('red')
                        mistakes += 1;
                        mistake.textContent = `Mistakes: ${mistakes}`
                    }

                    if (lengthInput === i) {
                        span[i].classList.add('currentLetter')
                        // outputSpan.scrollIntoView({ behavior: "auto", block: "center", inline: "center" });
                    } else {
                        span[i].classList.remove('currentLetter')

                    }
           
            
    })
    // countPoints()
})



play.addEventListener('click', startTimer );

restart.addEventListener('click', restartTimer );








// function creatag() {
//     parole = phrase.textContent.split(' ');
//     parole.forEach(parola => {
//         const tagword = document.createElement('word');
//         for (let lettera of parola) {
//             const tagletter = document.createElement('letter');
//             tagletter.textContent = lettera;
//             tagletters.push(lettera);
//             lettere.push(lettera);
//             tagword.appendChild(tagletter);
//         }
//         phrase.innerHTML = '';
//         output.appendChild(tagword);

//     });

// }


// async function startTimer() {
//     if(playClick == false) {
//             score.textContent = 'score: 0'
//             input.value = '';
//             input.focus();
//             await getNextQuote();
//             setTimeout(countdown, 1000)
//             console.log(output)
//             tagletters = [];
//             lettere = [];
//             score.textContent = 'Score: 0';
//             // creatag();
//             let sec = 59;
//             playClick = true;
//             // setTimeout(coutdown, 1000);

//             interval = setInterval(() => {
//                 let formattedSec = sec.toString().padStart(2, '0');
//                 time.innerHTML = '00:' + formattedSec;
//                 sec --
//             }, 1000); 

//             setTimeout(function() {
//                 clearInterval(interval);
//                 playClick = false;
//                 output.textContent = [];
//                 phrase.textContent = 'Try Again';  
//                 input.value = '';
//             }, 60000);
        
//     }
// }


// async function getNextQuote() {
//     phrase.textContent = await getRandomQuote()
//     console.log(phrase)
// }






// input.addEventListener('input', () => {
//     let inputArray = input.value.split(''); // Divide l'input dell'utente in un array di lettere
//     console.log(inputArray)

//     const lengthInput = inputArray.length;
//     const length = Math.min(inputArray.length, lettere.length); //Math.min garantisce che non si vada mai oltre la lunghezza della frase stessa.

//     let currentText = score.textContent;
//     let currentScore  = parseInt(currentText.split(': ')[1]);
               
//                 let i = lengthInput - 1; //prende indice ultima lettera digitata
//                 let j = lengthInput;
//                 let letter = document.querySelectorAll('letter')
//                 letter 
//                 inputArray
//                 console.log(letter[i])
//                 console.log(inputArray)
//                 if (lengthInput > previousLength) { // Verifica se l'input è più lungo rispetto al precedente (nuova lettera inserita)
//                     if (inputArray[i] === lettere[i]) {
//                         console.log('letter giusta', inputArray[i])
//                         console.log(letter[i])
//                         console.log(tagletters[i])
//                         letter[i].classList.add('green');
//                         letter[i].classList.remove('red');

//                         currentScore += 1;
//                         console.log(currentScore);
//                         score.textContent = `Score: ${currentScore}`;
                        
//                     } else {
//                         console.log('letter sbagliata' , inputArray[i])
//                         letter[i].classList.add('red');
//                         letter[i].classList.remove('green');

//                     }
//                 }  else {
//                     console.log('ha cancellato')
//                     if(letter[j].classList.contains('green')) {
//                         letter[j].classList.remove('green');
//                         currentScore -= 1;
//                         score.textContent = `Score: ${currentScore}`;
//                     } else if (letter[j].classList.contains('red')) {
//                         letter[j].classList.remove('red');

//                     }

//                 }
//             previousLength = lengthInput;
// })