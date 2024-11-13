                                                                                    // ELEMENTI

const RANDOM_QUOTE_API_URL = 'https://it.wikipedia.org/api/rest_v1/page/random/summary';
let output = document.querySelector('.output');
let phrase = document.querySelector('.phrase');
let input = document.querySelector('.user-input');
let time = document.querySelector('.time');
let score = document.querySelector('.score');
let play = document.querySelector('.play');
let restart = document.querySelector('.restart');
let video = document.querySelector('.video');
let mistake = document.querySelector('.mistake');
let final = document.querySelector('.final');
let wpmEl = document.querySelector('.wpm');
let cpmEl = document.querySelector('.cpm');
let resEl = document.querySelector('.res');
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
let wpm = 0;
// let audio;
let audio = new Audio("./img/background.mp3");
let errorAudio = new Audio("./img/error.mp3")


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
            final.classList.remove('final');
            final.classList.add('final-gamend')
            let win = new Audio("./img/win.mp3")
            win.play()
            if(audio) {
                audio.pause();
                audio.currentTime = 0;
            }

            wpm = currentScore / 5;
            wpmEl.textContent = `WPM: ${wpm}`;
            cpmEl.textContent = `CPM: ${currentScore}`;
            phrase.textContent = '';

            if (wpm < 10) {
                resEl.textContent = 'La velocità media di battitura di una persona inesperta è circa 10-20 WPM. Continua ad allenarti! Prova a migliorare la tua postura e usa tutte le dita'
            } else if (wpm >= 10 && wpm < 20) {
                resEl.textContent = 'Questo è il livello di battitura di una persona che digita con due dita. Prova ad allenarti a digitare senza guardare la tastiera! Sapevi che digitare senza guardare la tastiera (touch typing) può migliorare la tua velocità e precisione?'
            } else if (wpm >= 20 && wpm < 40 ) {
                resEl.textContent = 'Ottimo, sei nella media! La velocità media di battitura è 30-40 WPM per chi non pratica regolarmente. Ora prova a concentrarti sulla precisione e a non correggere troppo gli errori.'
            } else if (wpm >= 40 && wpm < 60 ) {
                resEl.textContent = 'Sei più veloce della maggior parte delle persone! Stai raggiungendo la velocità di una persona che digita regolarmente.'
            } else if (wpm >= 60 && wpm < 80 ) {
                resEl.textContent = 'Impressionante! La velocità media di una persona che usa la tastiera regolarmente è 60-70 WPM. Sei vicino ai professionisti!'
            } else {
                resEl.textContent = 'Straordinario! Solo il 10% delle persone raggiunge questa velocità. Sei tra i migliori. Per sfidarti ulteriormente, prova a battere il tuo record personale e confrontalo con quello dei dattilografi professionisti, che superano anche i 100 WPM!'
            }
            
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
        playAudioTension();
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
    score.textContent = 'Score: 0'
    isPlaying = false;
    currentScore = 0;
    mistakes = 0;
    mistake.textContent = 'Mistakes: 0';
    final.classList.add('final');
    final.classList.remove('final-gamend')
    if(audio) {
        audio.pause();
        audio.currentTime = 0;
    }
    win.pause()

}


// chiamata api
function getRandomQuote() {
    return fetch(RANDOM_QUOTE_API_URL)
    .then(response => response.json())
    .then(data => data.extract)
}




//salvataggio frase
async function getNextQuote() {
    quote = await getRandomQuote()
    phrase.innerHTML = ''

    quote.split('').forEach(char => {
        const charSpan = document.createElement('span');
        charSpan.innerText = char;
        phrase.appendChild(charSpan)
    })
    input.value = '';
    previousLength = 0;
}

function playAudioButton() {
    let audio = new Audio("./img/button.mp3")
    audio.volume = 0.2
    audio.play();
}

function playAudioStart() {
    let audio = new Audio("./img/start.mp3");
    audio.volume = 0.2;
    audio.play();
}

function playAudioTension() {
    audio.volume = 0.1;
    audio.play();
}



                                                                                    //EVENT LISTENER

input.addEventListener('input', playAudioButton);

input.addEventListener('input', () => {
    const span = phrase.querySelectorAll('span')
    const inputValue = input.value.split('');
    const lengthInput = input.value.length;
    const lastInput = input.value.length;
    const lastSpan = span[lengthInput]; 
    const penultimoSpan = span[lengthInput - 1 ]
    const quoteLength = span.length;
    
    if ( lengthInput === quoteLength) {
        getNextQuote()

    }


    if (lengthInput < previousLength) {

        // Verifica se era una lettera corretta (green) e rimuovila
        if (lastSpan && lastSpan.classList.contains('correct')) {
            lastSpan.classList.remove('correct');
            currentScore -= 1;
            score.textContent = `Score: ${currentScore}`;
        } else if (lastSpan && lastSpan.classList.contains('error')) {
            lastSpan.classList.remove('error');
            mistakes -= 1;
            mistake.textContent = `Mistakes: ${mistakes}`                       
        }
    } else if ( lengthInput > previousLength) {
        if (  penultimoSpan && penultimoSpan.innerHTML !== inputValue[lengthInput - 1] ) {
            mistakes += 1;
            mistake.textContent = `Mistakes: ${mistakes}` 
        }
       
    }
 
    span.forEach((outputSpan, i) => {
            const inputChar = inputValue[i]

                    if (inputChar === undefined) {
                        outputSpan.classList.remove('correct')
                        outputSpan.classList.remove('error')
                        

                    } else if (inputChar === outputSpan.innerText && lengthInput > previousLength) {
                            
                            if (!outputSpan.classList.contains('correct')) {
                                outputSpan.classList.add('correct')
                                outputSpan.classList.remove('error')
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
                        outputSpan.classList.remove('correct')                   
                        outputSpan.classList.add('error')                         
                        currentScore = 0;                                       
                        score.textContent = `Score: ${currentScore}`;   
                 
                     
                    } else if (inputChar !== outputSpan.innerText && lengthInput > previousLength) {
                        outputSpan.classList.remove('correct')
                        outputSpan.classList.add('error')
                    
                        // errorAudio.volume = 1;
                        // errorAudio.play();
                    }

                    if (lengthInput === i) {
                        span[i].classList.add('currentLetter')
                        // outputSpan.scrollIntoView({ behavior: "auto", block: "center", inline: "center" });
                    } else {
                        span[i].classList.remove('currentLetter')

                    }
            
    })
    // countPoints()
    previousLength = lengthInput;
})



play.addEventListener('click', startTimer );
play.addEventListener('click', playAudioStart)

restart.addEventListener('click', restartTimer );



//DONE: la prima lettera digitata a volte non viene subito colorata di bianco
//TODO: animazione -1
//FIXME: sistemare CSS


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