function startLevel(levelUrl) {
  window.location.href = levelUrl;
}

function showInstructions() {
  document.getElementById('landing-page').style.display = 'none';
  document.getElementById('instructions-page').style.display = 'flex';
}

function backToMenu() {
  window.location.href = '/index.html';
}
