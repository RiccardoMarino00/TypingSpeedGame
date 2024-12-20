/////////////////////////////////////////////////////////////// ELEMENTI /////////////////////////////////////////////////////////////////////

//API
const RANDOM_QUOTE_API_URL = 'https://it.wikipedia.org/api/rest_v1/page/random/summary';

//Testo
let phrase = document.querySelector('.phrase');

//Text-input
let input = document.querySelector('.user-input');

//Tempo
let time = document.querySelector('.time');

//Punteggio El
let score = document.querySelector('.score');

//Tasto Inizio gioco
let play = document.querySelector('.play');

//Tasto reset gioco
let restart = document.querySelector('.restart');

//Errori El
let mistake = document.querySelector('.mistake');

//Statistiche Finali
let final = document.querySelector('.final');

//WPM
let wpmEl = document.querySelector('.wpm');

//CPM
let cpmEl = document.querySelector('.cpm');

//Frase finale
let resEl = document.querySelector('.res');

//Bottone mostra grafico 
let showGraphButton = document.querySelector('.show-graph');

//Contenitore del grafico
let graphContainer = document.querySelector('.chart-container');

//Per tenere traccia dei cambiamenti quando utente digita 
let previousLength = 0;

//Condizione per verificare se utente sta giocando
let isPlaying = false;

//Per tenere traccia del tempo
let countdownInterval;

//Per Tenere traccia del punteggio
let currentScore = 0;

//Frase presa da Api
let quote = '';

//Valore per tenere traccia degli errori 
let mistakes = 0;

//Valore per tenere traccia dei wpm
let wpm = 0;

// let audio;
let audio = new Audio("./img/background.mp3");
let errorAudio = new Audio("./img/error.mp3")

//GRAFICO
let myChart = null;
let wpmChart = [];
let timeChart = [];
let mistakeChart = [];

let remainTime = false;


///////////////////////////////////////////////////////////////FUNZIONI///////////////////////////////////////////////////////////////




//timer conto alla rovescia
function countdown() {
    let remain = parseInt(time.innerHTML);
    time.innerHTML = remain;
    countdownInterval = setInterval(() => {
        remain--;
        time.innerHTML = remain;

        if (remain > 1) {
            remainTime = true;
        } else {
            remainTime = false;
        }

        if (remain % 5 === 0 && remain > 0) {
            aggiornaGrafico(currentScore / 5, 60 - remain);
        }
        if (remain <= 0) {
            clearInterval(countdownInterval)
            phrase.innerHTML = '';
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
            if(showGraphButton.classList.contains('d-none')) {
                showGraphButton.classList.remove('d-none')
            }
            wpm = currentScore / 5;
            wpmEl.textContent = `WPM: ${wpm}`;
            cpmEl.textContent = `CPM: ${currentScore}`;
            phrase.textContent = '';
            if (myChart) {
                myChart.destroy();
                myChart = null;
                wpmChart = [];
                timeChart = [];
                mistakeChart = [];
            }
            aggiornaGrafico(wpm, 60);
            creaGrafico()
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
    // playClick = false;
    phrase.textContent = 'Play';
    // output.textContent = [];
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
    wpmChart = [];
    timeChart = [];
    mistakeChart = [];
    if (myChart) {
        myChart.destroy();
        myChart = null;
    }
    if (!graphContainer.classList.contains('d-none')) {
        graphContainer.classList.add('d-none');
        graphContainer.classList.remove('d-block')
    } 
    if (final.classList.contains('opacity-0')) {
        final.classList.remove('opacity-0')
    }
    showGraphButton.classList.add('d-none')
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


function mostraGrafico() {
    if (graphContainer.classList.contains('d-none')) {
        graphContainer.classList.remove('d-none');
        graphContainer.classList.add('d-block');
    } else if (graphContainer.classList.contains('d-block')) {
        graphContainer.classList.remove('d-block');
        graphContainer.classList.add('d-none');
    }
    if (!final.classList.contains('opacity-0')) {
        final.classList.add('opacity-0')
        final.classList.remove('opacity-1')
    } else if (final.classList.contains('opacity-0')) {
        final.classList.remove('opacity-0')
        final.classList.add('opacity-1')
    }
    if(showGraphButton.textContent === 'Mostra Grafico') {
        showGraphButton.textContent = 'Nascondi Grafico'
    } else if (showGraphButton.textContent === 'Nascondi Grafico') {
        showGraphButton.textContent = 'Mostra Grafico'
    }
}

//   MAPPA

function creaGrafico() {

    const canvas = document.querySelector('.myChart'); 
    if (canvas) {
                
        const ctx = canvas.getContext('2d');
        console.log(wpm)
        console.log(mistakeChart)
                
        myChart = new Chart(ctx, {
            type: 'line', // line, bar, pie, bubble
            data:{
                labels: timeChart,
                datasets: [
                    {
                        label: 'Parole per intervallo di tempo',
                        data: wpmChart, // qui devi passare un array di valori per ogni intervallo
                        backgroundColor: 'rgb(0, 255, 0)',
                        borderColor: '#fff',
                        borderWidth: 2,
                        pointRadius: 3, // Aumenta la dimensione dei punti
                        pointBackgroundColor: 'rgba(0, 255, 10, 1)', // Colore dei punti
                        tension: 0.4, // Rende la curva della linea più fluida
                    },
                    {
                        label: 'Errori per intervallo di tempo',
                        data: mistakeChart,
                        backgroundColor: 'rgb(255, 0, 0)',
                        borderColor: '#fff',
                        borderWidth: 2,
                        pointRadius: 3, // Aumenta la dimensione dei punti
                        pointBackgroundColor: 'rgb(255, 0, 0)', // Colore dei punti
                        tension: 0.4, // Rende la curva della linea più fluida
                    },
                ]
                },
                options: {
                    scales: {
                        x: {
                            ticks: {
                                color: 'rgba(192,192,192, 1)', // Colore dei numeri sull'asse X
                                font: {
                                    size: 14, // Aumenta la dimensione del font
                                    weight: 'bold', // Rendi il testo più visibile
                                    family: 'Voces, sans-serif'
                                },
                            },
                            title: {
                                display: true,
                                text: 'Secondi',
                                color: '#fff',
                                font: {
                                    size: 16,
                                    weight: 'bold',
                                    family: 'Voces, sans-serif'
                                },
                            },
                            grid: {
                                color: 'rgba(192,192,192, 0)', 
                                lineWidth: 2, // Spessore delle linee
                                borderColor: 'rgba(0, 0, 0, 0)', // Colore del bordo dell'asse
                                borderWidth: 2, // Spessore del bordo dell'asse
                            },
                        },
                        y: {
                            ticks: {
                                color: 'rgba(192,192,192, 1)', // Colore dei numeri sull'asse Y
                                font: {
                                    size: 14, // Aumenta la dimensione del font
                                    weight: 'bold', // Rendi il testo più visibile
                                    family: 'Voces, sans-serif'
                                },
                            },
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'WPM',
                            color: '#fff',
                            font: {
                                size: 16,
                                weight: 'bold',
                                family: 'Voces, sans-serif'
                            },
                        },
                        grid: {
                            color: 'rgba(192,192,192, 0)', 
                            lineWidth: 2, // Spessore delle linee
                            borderColor: 'rgba(0, 0, 0, 0)', // Colore del bordo dell'asse
                            borderWidth: 2, // Spessore del bordo dell'asse
                            backgroundColor: 'rgb(93, 41, 75)',
                        },
                    }
                },
                plugins: {
                    legend: {
                        position: 'bottom', // Posizione della legenda
                        labels: {
                            color: '#fff', // Colore delle etichette nella legenda
                            font: {
                                size: 14,
                                weight: 'bold',
                                family: 'Voces, sans-serif'
                            },
                        },
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0)', // Colore di sfondo del tooltip
                        titleColor: '#fff', // Colore del titolo del tooltip
                        bodyColor: '#fff', // Colore del corpo del tooltip
                        borderColor: '#fff', // Colore del bordo del tooltip
                        borderWidth: 1, // Spessore del bordo
                    },
                },              
            }               
        });          
    } else {
        console.error('Canvas element not found');
    }
}
                

                                   



function aggiornaGrafico(wpm, secondi) {
    wpmChart.push(wpm);
    timeChart.push(secondi);
    mistakeChart.push(mistakes)

    if(myChart) {
        myChart.data.labels = timeChart;
        myChart.data.datasets[0].data = wpmChart;
        myChart.data.datasets[1].data = mistakeChart
        myChart.update();
    }
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
    
    if ( lengthInput === quoteLength && remainTime === true) {
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
                    }

                    if (lengthInput === i) {
                        span[i].classList.add('currentLetter')
                    } else {
                        span[i].classList.remove('currentLetter')
                    }
    })
    previousLength = lengthInput;
})


input.addEventListener('blur', (e) => {
    // Se l'utente cerca di uscire dall'input, forziamo di nuovo il focus
    if (isPlaying) {
        e.preventDefault();  // Evita la perdita di focus
        input.focus();  // Ristabilisce il focus
    }
});



play.addEventListener('click', startTimer );
play.addEventListener('click', playAudioStart)

restart.addEventListener('click', restartTimer );

showGraphButton.addEventListener('click', mostraGrafico)
 

//FIXME: sistemare CSS
//FIXME: se finito il tempo l'utente clicca mostra grafico e dopo reset, rimane contenitore del grafico visibile
//TODO: animazione -1
//TODO: Offri tre livelli (facile, medio, difficile) con testi sempre più lunghi o con vocaboli più complessi.
//TODO: Permetti agli utenti di scegliere il tempo del test (es. 30, 60, 120 secondi).
//TODO: Oscura il testo digitato e mostra solo gli errori dopo la fine del tempo.
//TODO: Sfida un "ghost" (il tuo punteggio migliore) o un benchmark preimpostato.
//TODO: Mostra quali lettere o parole vengono sbagliate più spesso.
//TODO: Grafico o contatore che mostra il WPM in tempo reale
//TODO: Salva i risultati delle sessioni precedenti in locale (usando localStorage) e visualizza miglioramenti nel tempo.
//TODO: cambia colore al progresso (es. passa dal rosso al verde in base alla precisione). ????
//TODO:  Aggiungi un'opzione per salvare il punteggio su un database e confrontarlo con altri utenti.
//TODO: Genera testi basati sui caratteri più frequentemente sbagliati dall’utente.
//TODO: Una barra visiva che si riempie man mano che il tempo scade
//TODO: Animazioni per "combo" (es. 10 parole consecutive corrette) o suoni motivazionali.
//TODO:  Permetti a due utenti di competere digitando lo stesso testo in contemporanea, con punteggi aggiornati live.
//TODO: Aggiungi testi in italiano, inglese, francese, ecc., e confronta la velocità di digitazione per ciascuna lingua. ?????
//TODO: Rimuovi il limite di tempo e misura per quanto l’utente riesce a mantenere alte velocità e precisione.
//TODO: Aggiungi obiettivi da sbloccare, ad esempio:
            // "Velocista" per aver superato i 100 WPM.
            // "Precisione Perfetta" per una sessione senza errori.
            // Medaglie o Badge: Mostra graficamente i progressi con premi visivi.
//TODO:  Rimuovi il limite di tempo e misura per quanto l’utente riesce a mantenere alte velocità e precisione.
//TODO: Potenziamenti e Penalità
        // Boosters:
        // "Tempo extra" aggiunge secondi.
        // "Correzione automatica" rimuove l'ultimo errore.
        // Penalità:
        // Riduzione del tempo per ogni errore.
        // Oscuramento del testo per qualche secondo se l'utente sbaglia troppo.
//TODO: Alla fine del gioco mostra:
        // Tempo medio per parola.
        // Tempo di reazione al cambio parola.
        // Migliori 10 secondi della sessione.
//TODO: Le parole appaiono e spariscono in rapida successione.
//TODO: Mostra snippet di codice da digitare 
//TODO: Ogni utente può scegliere un avatar che evolve man mano che migliorano le loro abilità.
//TODO: L’utente può salvare o comporre una serie di testi preferiti
//TODO: Cambia lo stile del gioco con temi diversi, es. "Cyberpunk" o "Retro"
//TODO: Sistema a livelli: Guadagna punti esperienza e sali di livello per sbloccare nuovi testi o sfide.
        // Economia virtuale: Accumula monete per acquistare potenziamenti o temi personalizzati.








// let interval;
// let playClick = false;
// let parole = '';
// let tagletters = [];
// let lettere = [];
// let isCorrect = true;
// let highestScore = 0;


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