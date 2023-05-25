const header = $("h1");
const buttons = $("div.btn");
const playerPattern = [];
const gamePattern = [];
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

  if (clicks === gamePattern.length) {
    setTimeout(function () {
      nextSecuence();
      clicks = 1;
    }, 1000);
  } else {
    clicks += 1;
  }
};

const addBtnListeners = function () {
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

const btnAnimation = function (btn, audios) {
  btn.fadeToggle("fast", "linear");
  btn.fadeToggle("fast", "linear");

  playSound(btn, audios);
};

const nextSecuence = function () {
  if (level === 0) {
    stopKeyListener();
    addBtnListeners();
  }

  playerPattern.splice(0, playerPattern.length);
  const randomNum = generateRandom();
  const color = btnArr[randomNum];
  const btn = $(`.${color}`);
  const audios = generateAudio();
  gamePattern.push(color);
  console.log(gamePattern);

  header.text(`Level ${level}`);
  btnAnimation(btn, audios);

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
