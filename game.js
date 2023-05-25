const header = $("h1");
const buttons = $("div.btn");
const played = [];
const btnArr = ["green", "red", "yellow", "blue"];

const btnClicked = function (btn) {
  $(`div#${btn.target.id}`).addClass("pressed");
  setTimeout(function () {
    $(`div#${btn.target.id}`).removeClass("pressed");
  }, 100);
};

const addBtnListeners = function () {
  buttons.on("click", btnClicked);
};

const generateRandom = function () {
  return Math.trunc(Math.random() * 4 + 1);
};

const activeButton = function (btn) {
  btn.fadeToggle();
};

const btnAnimation = function (btn) {
  btn.fadeToggle("fast", "linear");
  btn.fadeToggle("fast", "linear");
};

const game = function () {
  stopKeyListener();
  const randomNum = generateRandom();
  const color = btnArr[randomNum];
  const btn = $(`.${color}`);
  played.push(btn);
  btnAnimation(btn);
  addBtnListeners();
};

const startKeyListener = function () {
  $(document).on("keydown", function (event) {
    game();
  });
};

const stopKeyListener = function () {
  $(document).off();
};

const gameLoop = function () {
  startKeyListener();
};

gameLoop();
