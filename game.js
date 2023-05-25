// Variables
const header = $("h1");
const buttons = $("div.btn");
let playerPattern = [];
let gamePattern = [];
const btnArr = ["green", "red", "yellow", "blue"];
let maxScore;
let level = 0;
let clicks = 1;
let player = "";
let players = [];

//////////////////////////////////////////////////////////////////////////////////////////////////
// DATA

// Load data from local storage
const loadData = function () {
  console.log(localStorage.getItem("players") ?? 0);
  return JSON.parse(localStorage.getItem("players")) ?? [];
};

// Save data into local storage
const saveData = function () {
  // Check if saved max score is greater than current level
  localStorage.setItem("players", JSON.stringify(players));
};

//////////////////////////////////////////////////////////////////////////////////////////////////
// UTILS

// Generate a randon number (0-3)
const generateRandom = function () {
  return Math.trunc(Math.random() * 4);
};

//////////////////////////////////////////////////////////////////////////////////////////////////
// LISTENERS

//////////////////////////////////////////////////////////////////////////////////////////////////
// Modal

// Close modal
const closeModal = function () {
  $(".overlay").addClass("hidden");
  $(".modal").stop().animate({ opacity: 0 });
  setTimeout(function () {
    $(".modal").css("z-index", -1);
  }, 500);
};
// Close Modal listeners
const escCloseModal = function () {
  $(".close-modal").on("click", function (event) {
    event.preventDefault();
    closeModal();
  });
};

const acceptModal = function () {
  $("#form-button").on("click", function (event) {
    event.preventDefault();
    const player = {
      name: "Player 1",
      maxScore: 100,
    };
    players.push(player);
    saveData();
    closeModal();
    console.log(this);
  });
};

// Start button listener
const startBtnListeners = function () {
  buttons.on("click", btnClicked);
};

// Stop button listener
const stopBtnListeners = function () {
  buttons.off();
};

// Start keyboard listener
const startKeyListener = function () {
  $(document).on("keydown", nextSecuence);
};

// Stop keybard listener
const stopKeyListener = function () {
  $(document).off();
};

//////////////////////////////////////////////////////////////////////////////////////////////////
// AUDIO

// Generate button audio elements
const generateBtnAudio = function () {
  return btnArr.map((color) => {
    const audioElement = document.createElement("audio");
    audioElement.setAttribute("src", `./sounds/${color}.mp3`);
    audioElement.setAttribute("data-color", color);

    return audioElement;
  });
};

// Play sound for given btn
const playBtnSound = function (btn, audios) {
  audios.forEach((audio) => {
    if (audio.dataset.color === btn.attr("id")) audio.play();
  });
};

//////////////////////////////////////////////////////////////////////////////////////////////////
// ANIMATIONS

// Game loop animation
const showGameAnimation = function (item, audios) {
  item.fadeToggle("fast", "linear");
  item.fadeToggle("fast", "linear");

  playBtnSound(item, audios);
};

// Button click animation
const showBtnAnimation = function (btn) {
  $(`div#${btn.id}`).addClass("pressed");
  setTimeout(function () {
    $(`div#${btn.id}`).removeClass("pressed");
  }, 100);
};

// Game over animation
const showGameOverAnimation = function () {
  header.text("Game Over, Press Any Key To Restart");
  $("body").addClass("game-over");
  setTimeout(function () {
    $("body").removeClass("game-over");
  }, 100);
};

//////////////////////////////////////////////////////////////////////////////////////////////////
// EVENTS

// Button click behaviour
const btnClicked = function (event) {
  // Show animation
  showBtnAnimation(event.target);

  // Play audio
  const audios = generateBtnAudio();
  const jButton = $(`#${event.target.id}`);
  playBtnSound($(jButton), audios);

  // Save player pattern
  playerPattern.push(event.target.id);

  // Check if button's color is equal to color in gamePatter
  // If not GAME OVER
  if (gamePattern[clicks - 1] !== playerPattern[clicks - 1]) {
    gameOver();

    // If Clicks are the same amount of colors in gamePattern
  } else if (clicks === gamePattern.length) {
    setTimeout(function () {
      // Call next secuence of colors
      nextSecuence();
      // Reset clicks
      clicks = 1;
    }, 1000);
    // If not increase clicks and keep checking
  } else {
    clicks += 1;
  }
};

// Game Over Event
const gameOver = function () {
  // Show animation
  showGameOverAnimation();

  // Save score
  saveData();

  // Play sound
  const wrongAudio = document.createElement("audio");
  wrongAudio.setAttribute("src", "./sounds/wrong.mp3");
  wrongAudio.play();

  // Reset variables and listeners
  stopBtnListeners();
  startKeyListener();
  gamePattern = [];
  playerPattern = [];
  level = 0;
};

//////////////////////////////////////////////////////////////////////////////////////////////////
// GAME LOOP

// Game secuene
const nextSecuence = function () {
  // If first call
  if (level === 0) {
    stopKeyListener();
    startBtnListeners();
    players = loadData();
    $("#max-score").text(`Max Score: ${players[0].maxScore}`);
    $("#player-name").text(`${players[0].name}`);
  }
  console.log(maxScore);

  // Secuence loop
  playerPattern = [];
  const randomNum = generateRandom();
  const color = btnArr[randomNum];
  const btn = $(`.${color}`);
  const audios = generateBtnAudio();
  gamePattern.push(color);
  showGameAnimation(btn, audios);
  header.text(`Level ${level}`);
  level += 1;
};

// Game Start
const gameLoop = function () {
  // player = prompt("Player name?");
  // $(".modal").removeClass("hidden");
  $(".overlay").removeClass("hidden");
  escCloseModal();
  acceptModal();
  startKeyListener();
};

gameLoop();
