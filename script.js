const gameArea = document.getElementById('gameArea');
const foodElement = document.getElementById('food');
const scoreElement = document.getElementById('score');
const mapInfoElement = document.getElementById('mapInfo');
const levelInfoElement = document.getElementById('levelInfo');
const changeMapButton = document.getElementById('changeMap');
const increaseLevelButton = document.getElementById('increaseLevel');
const decreaseLevelButton = document.getElementById('decreaseLevel');

let snake = [{ x: 1, y: 1 }];
let direction = { x: 0, y: 0 };
let food = { x: 0, y: 0 };
let score = 0;
let currentMap = 0;
let snakeSize = 20;
let level = 5; // Domyślny poziom
let speed;

const maps = [
    { backgroundColor: 'lightgreen', size: 450, name: "Mapa 1" }
    // Mapa 2 została usunięta
];

const levelSpeedMap = {
    1: 300,
    2: 270,
    3: 240,
    4: 210,
    5: 180,
    6: 150,
    7: 120,
    8: 90,
    9: 60,
    10: 30
};

let gameInterval;

function setMap() {
    gameArea.style.backgroundColor = maps[currentMap].backgroundColor;
    gameArea.style.width = maps[currentMap].size + 'px';
    gameArea.style.height = maps[currentMap].size + 'px';
    if (mapInfoElement) {
        mapInfoElement.innerText = `Mapa: ${maps[currentMap].name}`;
    }
    resetGame();
}

function renderSnake() {
    const segments = document.querySelectorAll('.segment');
    segments.forEach(segment => segment.remove());

    snake.forEach((segment, index) => {
        const segmentElement = document.createElement('div');
        segmentElement.classList.add('segment');
        segmentElement.style.left = segment.x * snakeSize + 'px';
        segmentElement.style.top = segment.y * snakeSize + 'px';
       
	   if (index === 0) {
    // Oczy
    const leftEye = document.createElement('div');
    const rightEye = document.createElement('div');

    leftEye.style.width = '5px';       // Szerokość lewego oka
    leftEye.style.height = '5px';      // Wysokość lewego oka
    leftEye.style.backgroundColor = 'black'; // Kolor lewego oka
    leftEye.style.borderRadius = '50%'; // Okrągły kształt
    leftEye.style.position = 'absolute'; // Pozycjonowanie absolutne
    leftEye.style.top = '3px';         // Położenie w pionie
    leftEye.style.left = '3px';        // Położenie w poziomie

    rightEye.style.width = '5px';      // Szerokość prawego oka
    rightEye.style.height = '5px';     // Wysokość prawego oka
    rightEye.style.backgroundColor = 'white'; // Kolor prawego oka
    rightEye.style.borderRadius = '50%'; // Okrągły kształt
    rightEye.style.position = 'absolute'; // Pozycjonowanie absolutne
    rightEye.style.top = '3px';        // Położenie w pionie
    rightEye.style.left = '12px';      // Położenie w poziomie

    // Dodajemy oczy do segmentu
    segmentElement.appendChild(leftEye);
    segmentElement.appendChild(rightEye);
}

segmentElement.style.borderRadius = '10%'; // Umożliwia zaokrąglenie segmentu ciała węża
	   
        gameArea.appendChild(segmentElement);
    });
}

function spawnFood() {
    let validPosition = false;

    while (!validPosition) {
        const maxX = Math.floor(maps[currentMap].size / snakeSize) - 1;
        const maxY = Math.floor(maps[currentMap].size / snakeSize) - 1;

        food.x = Math.floor(Math.random() * (maxX + 1));
        food.y = Math.floor(Math.random() * (maxY + 1));

        validPosition = !snake.some(segment => segment.x === food.x && segment.y === food.y);
    }

    foodElement.style.left = food.x * snakeSize + 'px';
    foodElement.style.top = food.y * snakeSize + 'px';
}

function startGameInterval() {
    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(() => {
        moveSnake();
        renderSnake(); // Rysowanie węża
    }, speed);
}

// Zmiany w moveSnake
function moveSnake() {
    const newHead = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

    if (newHead.x === food.x && newHead.y === food.y) {
        score++;
        scoreElement.innerText = `Punkty: ${score}`;
        spawnFood();
    } else {
        snake.pop();
    }

    if (snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        alert('Game Over! Punkty: ' + score);
        resetGame();
        return;
    }

    snake.unshift(newHead);
    const max = Math.floor(maps[currentMap].size / snakeSize) - 1;
    if (newHead.x < 0 || newHead.x > max || newHead.y < 0 || newHead.y > max) {
        alert('Game Over! Punkty: ' + score);
        resetGame();
    }
}

function resetGame() {
    snake = [{ x: 1, y: 1 }];
    direction = { x: 0, y: 0 };
    score = 0;
    scoreElement.innerText = `Punkty: ${score}`;
    speed = levelSpeedMap[level];
    levelInfoElement.innerText = `Poziom: ${level}`;
    spawnFood();
    startGameInterval();
}

document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'w':
            if (direction.y === 0) direction = { x: 0, y: -1 };
            break;
        case 's':
            if (direction.y === 0) direction = { x: 0, y: 1 };
            break;
        case 'a':
            if (direction.x === 0) direction = { x: -1, y: 0 };
            break;
        case 'd':
            if (direction.x === 0) direction = { x: 1, y: 0 };
            break;
    }
});

function startGameInterval() {
    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(() => {
        moveSnake();
        renderSnake();
    }, speed);
}

increaseLevelButton.addEventListener('click', () => {
    if (level < 10) {
        level++;
        resetGame();
    }
});

decreaseLevelButton.addEventListener('click', () => {
    if (level > 1) {
        level--;
        resetGame();
    }
});

setMap(); // też wywołuje resetGame() wewnątrz