// Variables
const header = $("h1");
const buttons = $("div.btn");
let playerPattern = [];
let gamePattern = [];
const btnArr = ["green", "red", "yellow", "blue"];
let maxScore;
let level = 0;
let clicks = 1;
let player;
let players = [];

//////////////////////////////////////////////////////////////////////////////////////////////////
// DATA

// Load data from local storage
const loadData = function () {
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

// Select form (empit input when select change)
const optionListListener = function () {
  $("#players").on("change", function () {
    $("#player").val("");
  });
};

// Accept button
const acceptModal = function () {
  $("#form-button").on("click", function (event) {
    // Prevent submit button default
    event.preventDefault();

    // Save input data
    const inputName = $("#player").val();

    // If no input and no player selected
    if (inputName.trim() === "" && $("#players").val() === "") {
      $("#err-msg").html("<p>New Player Name Cant Be Empty</p>");
      return;

      // If player selected already exist
    } else if (
      players.some(function (player) {
        return inputName === player.name;
      })
    ) {
      $("#err-msg").html(
        "<p>Player already exist.</p><p>Choose player from list and Click Accept.</p>"
      );

      // If input not empty and player does not exist
    } else {
      // If no player is selected from list, create new player
      if ($("#players").val() === "") {
        player = { name: inputName, maxScore: 0 };

        // If there is a player selected in list, load that player
      } else {
        player = players.filter((player) => {
          if (player.name === $("#players").val()) return player;
        });
      }

      // Save player in variable, close modal and star keylistener
      players.push(player);
      saveData();
      closeModal();
      startKeyListener();
    }
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

  if (level - 1 > player.maxScore) player.maxScore = level - 1;
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
    $("#player-name").text(player.name);
    $("#max-score").text(`Max Score: ${player.maxScore}`);
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

// Render form player list from saved data
const renderModalForm = function () {
  $("#players").html("");

  $("#players").append(`<option value=""></option>`);
  players.forEach((player) => {
    $("#players").append(
      `<option value="${player.name}">${player.name}</option>`
    );
  });
};

// Game Start
const gameLoop = function () {
  // player = prompt("Player name?");
  // $(".modal").removeClass("hidden");
  $(".overlay").removeClass("hidden");
  escCloseModal();
  acceptModal();
  players = loadData();
  renderModalForm();
  optionListListener();
};

gameLoop();
