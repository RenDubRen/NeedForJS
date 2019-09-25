const score = document.querySelector('.score');
const start = document.querySelector('.start');
const gameArea = document.querySelector('.gameArea');
const car = document.createElement('div');
const music = document.createElement('embed');

music.setAttribute('src', './audio.mp3');
music.setAttribute('type', 'audio/mp3');
music.classList.add('music');

car.classList.add('car');

start.addEventListener('click', startGame);
document.addEventListener('keydown', startRun);
document.addEventListener('keyup', stopRun);

const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false
};

const settings = {
    start: false,
    score: 0,
    speed: 3,
    traffic: 3
}

function getQuantityElements (heightElement) {
    return document.documentElement.clientHeight / heightElement;
}

function startGame () {
    start.classList.add('hide');
    gameArea.innerHTML = '';
    // Цикл создания полос
    for (let i = 0; i < getQuantityElements(50); i++) {
        const line = document.createElement('div');
        line.classList.add('line');
        line.style.top = (i * 100) + 'px';
        line.y = i * 100;
        gameArea.appendChild(line);
    }
    // Цикл создания машин-противников
    for (let i = 0; i < getQuantityElements(100 * settings.traffic); i++) {
        const enemy = document.createElement('div');
        enemy.classList.add('enemy');
        enemy.y = -100 * settings.traffic * (i + 1);
        enemy.style.top = enemy.y + 'px';
        enemy.style.background = 'transparent url(images/enemy.png) center / cover no-repeat'
        enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
        gameArea.appendChild(enemy);

    }

    settings.score = 0;
    settings.start = true;
    gameArea.appendChild(car);
    car.style.left = (gameArea.offsetWidth / 2) - (car.offsetWidth / 2);
    car.style.top = 'auto';
    car.style.bottom = '10px';
    gameArea.appendChild(music);
    settings.x = car.offsetLeft;
    settings.y = car.offsetTop;
    requestAnimationFrame(playGame);
};

function playGame () {
    if (settings.start) {
        settings.score += settings.speed;
        score.innerHTML = 'SCORE<br>' + settings.score;
        moveRoad();
        moveEnemy();
        if (keys.ArrowLeft && settings.x > 0) {
            settings.x -= settings.speed;
        }
        if (keys.ArrowRight && settings.x < (gameArea.offsetWidth - car.offsetWidth)) {
            settings.x += settings.speed;
        }
        if (keys.ArrowDown && settings.y < (gameArea.offsetHeight - car.offsetHeight)) {
            settings.y += settings.speed;
        }
        if (keys.ArrowUp && settings.y > 0) {
            settings.y -= settings.speed;
        }

        car.style.left = settings.x + 'px';
        car.style.top = settings.y + 'px';

        requestAnimationFrame(playGame);
    }
};

function startRun (event) {
    event.preventDefault();
    if (event.key in keys) {
        keys[event.key] = true;
    }
};

function stopRun (event) {
    event.preventDefault();
    if (event.key in keys) {
        keys[event.key] = false;
    }
};

function moveRoad () {
    let lines = document.querySelectorAll('.line');
    lines.forEach(function (line) {
        line.y += settings.speed;
        line.style.top = line.y + 'px';

        if (line.y >= document.documentElement.clientHeight) {
            line.y = -100;
        }
    });

}

function moveEnemy () {
    let enemy = document.querySelectorAll('.enemy');

    enemy.forEach(function (item) {
        let carRect = car.getBoundingClientRect();
        let enemyRect = item.getBoundingClientRect();

        if (carRect.top <= enemyRect.bottom &&
            carRect.right >= enemyRect.left &&
            carRect.left <= enemyRect.right &&
            carRect.bottom >= enemyRect.top) {
                settings.start = false;
                console.warn('ДТП');
                start.classList.remove('hide');
                start.style.top = score.offsetHeight;
        }

        item.y += settings.speed / 2;
        item.style.top = item.y + 'px';

        if (item.y >= document.documentElement.clientHeight) {
            item.y = -100;
            item.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
        }
    });
}