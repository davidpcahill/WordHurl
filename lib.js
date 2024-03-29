// General library and UI functions for WordHurl

//
function getISODate() {
  return new Date().toISOString().split("T")[0];
}

// UTILITY COOKIE FUNCTIONS
function getCookie(name) {
  var v = document.cookie.match("(^|;) ?" + name + "=([^;]*)(;|$)");
  return v ? v[2] : null;
}
function setCookie(name, value, days) {
  var d = new Date();
  d.setTime(d.getTime() + 24 * 60 * 60 * 1000 * days);
  document.cookie = name + "=" + value + ";path=/;expires=" + d.toGMTString();
}
function deleteCookie(name) {
  setCookie(name, "", -1);
}

// MODAL FUNCTIONS
// TODO: Create modal for How To Play
// Get the modals
var gameOverModal = document.getElementById("gameover-modal");
var howToPlayModal = document.getElementById("howtoplay-modal");
var roadmapModal = document.getElementById("roadmap-modal");

// Get the <span> element that closes the modal
var gameOverModalClose = document.getElementById("gameover-modal-close");
var howToPlayModalClose = document.getElementById("howtoplay-modal-close");
var roadmapModalClose = document.getElementById("roadmap-modal-close");

// Open Modal Buttons
// How to Play Button
howToPlayModalButton = document.getElementById("howtoplay-modal-button");
howToPlayModalButton.onclick = function () {
  howToPlayModal.style.display = "block";
};

gameOverModalButton = document.getElementById("gameover-modal-button");
gameOverModalButton.onclick = function () {
  gameOverModal.style.display = "block";
};

roadmapModalButton = document.getElementById("roadmap-modal-button");
roadmapModalButton.onclick = function () {
  roadmapModal.style.display = "block";
};

// When the user clicks on <span> (x), close the modal
howToPlayModalClose.onclick = function () {
  howToPlayModal.style.display = "none";
};

gameOverModalClose.onclick = function () {
  gameOverModal.style.display = "none";
};

roadmapModalClose.onclick = function () {
  roadmapModal.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == gameOverModal || event.target == howToPlayModal || event.target == roadmapModal) {
    howToPlayModal.style.display = "none";
    gameOverModal.style.display = "none";
    roadmapModal.style.display = "none";
  }
};
