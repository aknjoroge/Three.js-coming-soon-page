class View {
  parentElement = document.querySelector(".webgl");
  setUpView(renderer) {
    this.parentElement.appendChild(renderer.domElement);
  }
}

export default new View();
