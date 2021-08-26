class ThreeDView {
  exploreBtn = document.querySelector(".explore-btn");
  exit3D = document.querySelector(".controlls");
  whoAreWe = document.querySelector(".controlls");
  initializeView(callback) {
    this.exploreBtn.addEventListener("click", callback);
  }
  exitView(callback) {
    this.exit3D.addEventListener("click", callback);
  }
  RunwhoAreWe(callback) {
    this.exit3D.addEventListener("click", callback);
  }
}

export default new ThreeDView();
