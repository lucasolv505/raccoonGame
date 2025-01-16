const char = document.querySelector('.char')
const pipe = document.querySelector('.pipe')
const clouds = document.querySelector('.clouds')
const startBtn = document.querySelector('.startBtn')
const gameboard = document.querySelector('.gameBoard')
let time = 'day'
let pipeSpeed = 1.5
let TurnRight = true


let gameoverText = document.querySelector('.gameOverText')
let scoreDiv = document.querySelector('.scoreDiv')
let score = 0
let scoreCount = 0
let scored = false
let difficultyMultiplier = 0
 
const jumpSound = new Audio('./sound/jump.mp3')
const gameOverSound = new Audio('./sound/gameover.mp3')

let start = false

function jump() {
    jumpSound.play();
    char.classList.add('jumping');
    setTimeout(() => {
        char.classList.remove('jumping');
    }, 600);
}

function gameStart() {
    startBtn.classList.add('hide')
    gameoverText.classList.add('hide')
    changeBtn(false)

    score = 0
    scoreCount = 0
    scoreDiv.textContent = score
    difficultyMultiplier = 0

    char.src = './imgs/raccoonRight.gif'
    
    pipe.style.left = ''

    char.style.bottom = ''
    char.style.width = '150px'
    char.style.left = '0px'

    pipe.style.animation = `pipeMovement ${pipeSpeed}s infinite linear`
    clouds.style.animation = 'cloudMovement 8s infinite linear'

    start = true
    
    lostCheck()
}

function lostCheck() {
    const LostCheckingLoop = setInterval(() => {
        const collisionMarginRight = 30
        const collisionMarginLeft = 65
        const pipePosition = pipe.offsetLeft;
        const charPositionY = +window.getComputedStyle(char).bottom.replace('px','')
        const charPositionX = char.getBoundingClientRect().left + 116       

        if (
            pipePosition + pipe.offsetWidth - collisionMarginLeft >= char.getBoundingClientRect().left &&
            pipePosition + collisionMarginRight <= char.getBoundingClientRect().left + char.offsetWidth &&
            charPositionY < 85
        ) {
            end(LostCheckingLoop , pipePosition, charPositionY, charPositionX)
        }

        if (pipePosition + pipe.offsetWidth < charPositionX && !scored) {
            score++;
            scoreCount++;
            difficultyMultiplier++;
            scoreDiv.textContent = score;
            scored = true;
            scoreDiv.classList.add('scored');
        }
        
        if (pipePosition + pipe.offsetWidth > charPositionX) {
            scored = false;
            scoreDiv.classList.remove('scored');
        }

        if(scoreCount === 30){
            if(time === 'day'){
                time = 'night'
                gameboard.style.background = 'linear-gradient(#00090d, #0a2d3a,rgb(199, 206, 200))'
            }else{
                time = 'day'
                gameboard.style.background = 'linear-gradient(#87CEEB, #E0F6FF)'
            }
            scoreCount = 0
        }


        if (difficultyMultiplier === 10 && pipePosition < -50 && pipeSpeed > 0.7) {
            pipeSpeed = pipeSpeed - 0.1
        
            pipe.style.animation = 'none'
        
            void pipe.offsetWidth
        
            pipe.style.animation = `pipeMovement ${pipeSpeed}s infinite linear`
        
            difficultyMultiplier = 0
        }


    }, 10);
}

//Game over
function end(LostCheckingLoop, pipePosition, charPositionY, charPositionX) {
    start = false;
    gameOverSound.play()
    gameoverText.classList.remove('hide')
    clearInterval(LostCheckingLoop)

    pipe.style.animation = 'none';
    pipe.style.left = `${pipePosition}px`
    
    char.style.left = `${charPositionX - 60}px`
    char.style.bottom = `${charPositionY}px`
    char.src = './imgs/game-over.png'
    char.style.width = '150px'
    
    clouds.style.animation = 'none';

    startBtn.classList.remove('hide')
    changeBtn(true)

}

function changeBtn(change){
    if(change){
        startBtn.textContent = 'restart'
        startBtn.style.fontSize = '.8rem'
        startBtn.style.top = '40%'
    }
}

function moveForward(){
    if(!TurnRight){
        char.src = './imgs/raccoonRight.gif'
        TurnRight = true
    }
    
    let currentLeft = parseInt(window.getComputedStyle(char).getPropertyValue('left'), 10);
    const screenWidth = window.innerWidth
    const charWidth = char.offsetWidth
    
    if(currentLeft + charWidth < screenWidth){
        currentLeft += 10;
        
        char.style.left = `${currentLeft}px`
    }
    
}

function moveBackwards(){
    if(TurnRight){
        char.src = './imgs/raccoonLeft.gif'
        TurnRight = false
    }

    let currentLeft = parseInt(window.getComputedStyle(char).getPropertyValue('left'), 10);
    
    if(currentLeft > 0){
        currentLeft -= 10;
        
        char.style.left = `${currentLeft}px`
    }
}

// Controles
startBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    gameStart();
});

document.addEventListener('click', (e) => {
    if (!start || e.target === startBtn) return;
    jump();
});

document.addEventListener('keydown', (e) => {
    if (e.key === ' ' && start) {
        jump();
    }
});

document.addEventListener('keydown', (e)=>{
    if(start && e.key === 'ArrowRight'){
        moveForward()
    }
}
)
document.addEventListener('keydown', (e)=>{
    if(start && e.key === 'ArrowLeft'){
        moveBackwards()
    }
})