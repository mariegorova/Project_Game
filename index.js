// CLASSES
class Ball {
    constructor(x, y, dx, dy, radius) {
      this.x = x;
      this.y = y;
      this.dx = dx;
      this.dy = dy;
      this.radius = radius;
    }
  }
  
  class MarsRover {
    constructor(x, y, height, width, speed) {
      this.x = x;
      this.y = y;
      this.height = height;
      this.width = width;
      this.speed = speed;
  
      this.imageUp = new Image();
      this.imageUp.src = "img/marsRover_up.png";
      this.imageUp.onload = function () {
        ctx.drawImage(this.imageUp, this.x, this.y, this.width, this.height);
      };
  
      this.imageDown = new Image();
      this.imageDown.src = "img/marsRover_down.png";
  
      this.imageRight = new Image();
      this.imageRight.src = "img/marsRover_right.png";
  
      this.imageLeft = new Image();
      this.imageLeft.src = "img/marsRover_left.png";
  
      this.direction = this.imageUp;
    }
  }
  // CLASSES

// MAIN CODE
const backgroundCanvas = document.getElementById("background-layer");
const backgroundCtx = backgroundCanvas.getContext("2d");
const backgroundImage = new Image();
backgroundImage.src = "img/mars.jpg";
backgroundImage.onload = function () {
  backgroundCtx.drawImage(backgroundImage, 0, 0, 1500, 1200);
};
const canvas = document.getElementById("game-layer");
const ctx = canvas.getContext("2d");

const ball1 = new Ball(canvas.width / 2, canvas.height - 30, 2, -2, 10);
const ball2 = new Ball(canvas.width - 30, canvas.height / 2, -1, 2, 10);
const ball3 = new Ball(canvas.width / 2, 30, -3, 1, 10);
const ball4 = new Ball(30, canvas.height / 2, 1, 1, 10);
const balls = [ball1, ball2, ball3, ball4];

const roverHeight = 130;
const roverWidth = 130;
const marsRover = new MarsRover(
  (canvas.width - roverWidth) / 2,
  (canvas.height - roverHeight) / 2,
  roverHeight, roverWidth, 7
);

// фолс потому что кнопки не нажаты
let rightPressed = false;
let leftPressed = false;
let upPressed = false;
let downPressed = false;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
// функция draw выполняется каждые 10 миллисекунд
const interval = setInterval(() => draw(marsRover, balls), 10);
// MAIN CODE


// FUNCTIONS
function draw(rover, balls) {
  // координаты x и y верхнего левого угла прямоугольника
  //и координаты x и y нижнего правого угла прямоугольника
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBalls(balls);
  drawRover(rover);

  if (roverAndBallsIsColliding(rover, balls)) {
    showGameOverMenu();
  }

 if (rightPressed && rover.x < canvas.width - rover.width) {
    rover.x += rover.speed;
  } else if (leftPressed && rover.x > 0) {
    rover.x -= rover.speed;
  } else if (upPressed && rover.y > 0) {
    rover.y -= rover.speed;
  } else if (downPressed && rover.y < canvas.height - rover.height) {
    rover.y += rover.speed;
  }

  balls.forEach(ball => {
    if (ball.x + ball.dx > canvas.width - ball.radius || ball.x + ball.dx < ball.radius) {
      ball.dx = -ball.dx;
    }
    
    if (ball.y + ball.dy > canvas.height - ball.radius || ball.y + ball.dy < ball.radius) {
      ball.dy = -ball.dy;
    }

    ball.x += ball.dx;
    ball.y += ball.dy;

    if (ball.dx >= 0) ball.dx = ball.dx + 0.001;
    if (ball.dx < 0) ball.dx = ball.dx - 0.001;
    if (ball.dy >= 0) ball.dy = ball.dy + 0.001;
    if (ball.dy < 0) ball.dy = ball.dy - 0.001;
  });
}

function drawBalls(balls) {
  balls.forEach((ball) => {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    // рисуем круг: x и y координаты центра дуги, радиус
    ctx.fillStyle = "#D2B48C";
    // хранит цвет
    ctx.fill();
    // метод для окрашивания
    ctx.closePath();
  });
}

// меняем картинку в зависимости от направления
function drawRover(rover) {
  if (upPressed) {
    rover.direction = rover.imageUp;
  } else if (downPressed) {
    rover.direction = rover.imageDown;
  } else if (rightPressed) {
    rover.direction = rover.imageRight;
  } else if (leftPressed) {
    rover.direction = rover.imageLeft;
  }

  ctx.drawImage(rover.direction, rover.x, rover.y, rover.width, rover.height);
}

// функция обнаружения столкновений
function roverAndBallsIsColliding(rover, balls) {
  let results = balls.map((ball) => roverAndBallIsColliding(rover, ball));
  return results.indexOf(true) != -1;
}

function roverAndBallIsColliding(rover, ball) {
  var collidingX = Math.abs(ball.x - (rover.x + rover.width / 2));
  var collidingY = Math.abs(ball.y - (rover.y + rover.height / 2));

  if (collidingX > ball.radius + rover.width / 2 
    ||collidingY > ball.radius + rover.height / 2) {
    return false;
  }

  if (collidingX <= rover.width || collidingY <= rover.height) {
    return true;
  }

  collidingX = collidingX - rover.width;
  collidingY = collidingY - rover.height;

  return Math.pow(collidingX, 2) + Math.pow(collidingY, 2) <= Math.pow(ball.radius, 2);
}

function showGameOverMenu() {
  ctx.globalAlpha = 0.5;

  ctx.fillStyle = "grey";
  ctx.fillRect(0, 0, 1500, 1200);

  ctx.font = "bold 130px verdana, sans-serif ";
  var message = "Game over!";
  ctx.textAlign = "center";
  ctx.fillStyle = "#D2B48C";
  ctx.fillText(message, canvas.width / 2, canvas.height / 2);

  var timer = false;
  var reloadTime = 5000;

  function reloadTimer() {
    if (!!timer) clearTimeout(timer);
    timer = setTimeout(function () {
      top.location.reload();
    }, reloadTime);
  }

  clearInterval(interval);
}

// кей содержит информацию о нажатой клавише
// событие в качестве параметра (е)
function keyDownHandler(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = true;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = true;
  } else if (e.key == "Up" || e.key == "ArrowUp") {
    upPressed = true;
  } else if (e.key == "Down" || e.key == "ArrowDown") {
    downPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = false;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = false;
  } else if (e.key == "Up" || e.key == "ArrowUp") {
    upPressed = false;
  } else if (e.key == "Down" || e.key == "ArrowDown") {
    downPressed = false;
  }
}
// FUNCTIONS