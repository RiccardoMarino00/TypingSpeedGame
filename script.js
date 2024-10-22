import { faker } from 'https://esm.sh/@faker-js/faker';



let phrase = document.querySelector('.phrase');
let input = document.querySelector('.user-input');
let time = document.querySelector('.time');
let score = document.querySelector('.score');
let play = document.querySelector('.play');
let restart = document.querySelector('.restart');
let interval;
let playClick = false;

console.log(phrase, input, time, score, play, restart);


function startTimer() {

    if(playClick == false) {
            const randomSentence = faker.hacker.phrase();
            phrase.textContent = randomSentence
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
        
            console.log('Frase casuale:', randomSentence);
    }
}


function restartTimer() {
    time.innerHTML = '01:00'
    clearInterval(interval);
    playClick = false;
    phrase.textContent = 'Ale fa i pompini';
}



play.addEventListener('click', startTimer );

restart.addEventListener('click', restartTimer );