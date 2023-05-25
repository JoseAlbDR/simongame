const header = $("h1");
const buttons = $("div.btn");
let playerPattern = [];
let gamePattern = [];
const btnArr = ["green", "red", "yellow", "blue"];
let level = 0;
let clicks = 1;

const generateAudio = function () {
  return btnArr.map((color) => {
    const audioElement = document.createElement("audio");
    audioElement.setAttribute("src", `./sounds/${color}.mp3`);
    audioElement.setAttribute("data-color", color);

    return audioElement;
  });
};

const checkEquals = function (game, player) {
  if (game.length !== player.length) return false;

  for (let i = 0; i < game.length; i++) if (game[i] !== player[i]) return false;

  return true;
};

const gameOver = function () {
  header.text("Game Over, Press Any Key To Restart");
  $("body").addClass("game-over");
  setTimeout(function () {
    $("body").removeClass("game-over");
  }, 100);
  const wrongAudio = document.createElement("audio");
  wrongAudio.setAttribute("src", "./sounds/wrong.mp3");
  wrongAudio.play();
  stopBtnListeners();
  startKeyListener();
  gamePattern = [];
  playerPattern = [];
  level = 0;
};

const btnClicked = function (btn) {
  $(`div#${btn.target.id}`).addClass("pressed");
  setTimeout(function () {
    $(`div#${btn.target.id}`).removeClass("pressed");
  }, 100);
  const audios = generateAudio();
  const jButton = $(`#${btn.target.id}`);
  playSound($(jButton), audios);
  playerPattern.push(btn.target.id);
  console.log(playerPattern);
  console.log(gamePattern);

  console.log(checkEquals(gamePattern, playerPattern));
  if (gamePattern[clicks - 1] !== playerPattern[clicks - 1]) {
    gameOver();
  } else if (clicks === gamePattern.length) {
    setTimeout(function () {
      nextSecuence();
      clicks = 1;
    }, 1000);
  } else {
    clicks += 1;
  }
};

const stopBtnListeners = function () {
  buttons.off();
};

const startBtnListeners = function () {
  buttons.on("click", btnClicked);
};

const generateRandom = function () {
  return Math.trunc(Math.random() * 4);
};

const activeButton = function (btn) {
  btn.fadeToggle();
};

const playSound = function (btn, audios) {
  audios.forEach((audio) => {
    if (audio.dataset.color === btn.attr("id")) audio.play();
  });
};

const showAnimation = function (item, audios) {
  item.fadeToggle("fast", "linear");
  item.fadeToggle("fast", "linear");

  playSound(item, audios);
};

const nextSecuence = function () {
  if (level === 0) {
    stopKeyListener();
    startBtnListeners();
  }

  playerPattern.splice(0, playerPattern.length);
  const randomNum = generateRandom();
  const color = btnArr[randomNum];
  const btn = $(`.${color}`);
  const audios = generateAudio();
  gamePattern.push(color);

  header.text(`Level ${level}`);
  showAnimation(btn, audios);

  level += 1;
};

const startKeyListener = function () {
  $(document).on("keydown", function () {
    nextSecuence();
  });
};

const stopKeyListener = function () {
  $(document).off();
};

const gameLoop = function () {
  startKeyListener();
};

gameLoop();
