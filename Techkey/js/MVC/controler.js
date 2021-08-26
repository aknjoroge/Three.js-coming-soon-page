import App from "./modal.js";
import ThreeDView from "./views/ThreeDView.js";
import View from "./views/views.js";
let firstrun = true;
let globalData = {};
App.setUpCamera();
App.setUpGeometries();
App.setUpMaterials();
App.setUpMesh();
App.setUpLight();
App.setUpParticles(5000);
App.setUpRenderer();
App.setupModel();
App.returnModel();
App.setPositions();
App.setUpScene();
App.setUpText("<Code/>");
App.initializeRenderer();
let data = App.saveData();
View.setUpView(data.renderer);
///////////////////////////////////

let mouseY = 0,
  mouseX = 0;
document.addEventListener("mousemove", function (e) {
  mouseX = e.clientX;
  mouseY = e.clientY;
});
let clock = new THREE.Clock();
let intervals = 0.01;
function update(data) {
  let customText = data.scene.getObjectByName("text");
  customText ? (customText.rotation.y += 0.002) : "";
  //console.log(customText);
  //Rotation
  data.outline.rotation.y -= 0.004;
  data.outline.rotation.x -= 0.0;
  // shape.rotation.x += 0.0;
  //mouse responce
  let elapseTime = clock.getElapsedTime();
  // data.planeparticle.rotation.y -= 0.002;

  if (!mouseY * (elapseTime * 0.0008)) {
    data.planeparticle.rotation.x += 0.005;
  } else {
    if (elapseTime > 6.5) {
      elapseTime -= 8;
      if (elapseTime > 10) {
        elapseTime -= 11;
      }
    }
    elapseTime -= 11;

    elapseTime - +7;
    let angleX = mouseX * (intervals * 0.0005);
    let angleY = mouseY * (intervals * 0.0005);
    data.planeparticle.rotation.x = angleY;
    data.planeparticle.rotation.y = angleX;
  }
  TWEEN.update();
  //data.shape.rotation.x = mouseY * (elapseTime * 0.0005);
  data.shape.rotation.y = mouseX * (intervals * 0.0005);
  data.renderer.render(data.scene, data.camera);
  requestAnimationFrame(function () {
    if (intervals > 4) {
      intervals = 0.05;
    }
    intervals += 0.007;

    update(data);
  });
}
update(data);

window.addEventListener("resize", () => {
  data.camera.aspect = window.innerWidth / window.innerHeight;
  data.camera.updateProjectionMatrix();
  data.renderer.setSize(window.innerWidth, window.innerHeight);
});

/////////////////////////////
function reStartControls() {
  App.setUpControlls(true);
  data = App.saveData();
}
function changeDisplay() {
  let html = [
    document.querySelector(".ts-page-wrapper"),
    document.querySelector(".ts-side-panel"),
  ];
  App.saveMarkup(html);
  html.forEach(function (ele) {
    ele.style.opacity = "0";
    setTimeout(function () {
      ele.style.display = "none";
    }, 1000);
  });
  let action = firstrun
    ? `<a href="#"  data-who="who"class="btn btn-outline-light"> Who are we </a>`
    : "";

  let markup = `
  <div class="row">
  <!--Page Title-->
  <div class="col-md-6">
    <br />
    <p>Hold & Drag the mouse/screen to explore the Scene</p>
    <p class="main-content_text">
      Use This Buttons to Change the Environment
    </p>
   ${action}     
  </div>
  <div class="col-md-6">
  <br>
  <br>
  <a href="#" class="btn btn-outline-light" data-function= "exit-3D"> EXIT 3D</a>
  </div>
</div>`;
  if (firstrun) {
    App.welcomeAnimation();
    firstrun = false;
  }
  document.querySelector(".controlls").insertAdjacentHTML("afterbegin", markup);
}

function startThreeD() {
  reStartControls();
  // data.controls.enableZoom = true;

  changeDisplay();
}
function CloseThreeD(e) {
  if (e.target.dataset.function) {
    document.querySelector(".controlls").innerHTML = "";
    App.getMArkup().forEach(function (ele) {
      ele.style.opacity = "1";
      setTimeout(function () {
        ele.style.display = "block";
      }, 1000);
    });
    // document.querySelector(".ts-side-panel").style.opacity = "0";
    App.controls.enabled = false;
  }
}

function goToWhoWeare(e) {
  if (e.target.dataset.who) {
    App.setUpWho();
    e.target.remove();
  }
}

ThreeDView.initializeView(startThreeD);
ThreeDView.exitView(CloseThreeD);
ThreeDView.RunwhoAreWe(goToWhoWeare);
