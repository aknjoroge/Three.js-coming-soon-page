class App {
  scene = new THREE.Scene();
  camera;
  shapeGeometry;
  outlineGeometry;
  shapeMaterial;
  outlineMaterial;
  shape;
  outline;
  environmentLoader;
  environmentUrl;
  planeBuffer;
  lights;
  ambientLight;
  controls;
  renderer;
  planeparticle;
  markup = {};
  plane;
  globalHelper = [];

  gui;

  saveData() {
    return {
      //clock: clock,
      outline: this.outline,
      camera: this.camera,
      scene: this.scene,
      controls: this.controls,
      renderer: this.renderer,
      planeparticle: this.planeparticle,
      shape: this.shape,
    };
  }

  setUpCamera() {
    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));
  }
  setUpGeometries() {
    this.shapeGeometry = new THREE.BoxGeometry(1, 1, 1); //THREE.SphereGeometry(0.7, 24, 24);
    this.outlineGeometry = new THREE.IcosahedronGeometry(1, 1);
    this.planeBuffer = new THREE.BufferGeometry();
    // shapeGeometry.position.z = 4;
  }
  setUpMaterials() {
    this.shapeMaterial = new THREE.MeshStandardMaterial({ color: "white" });
    this.outlineMaterial = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      wireframe: true,
      side: THREE.DoubleSide,
    });
    let textureLoader = this.setUPTextureLoader();
    this.shapeMaterial.map = textureLoader.load(
      "Techkey/js/MVC/media/1080.png"
    );
    //particles material
    this.particlesMaterial = new THREE.PointsMaterial({
      size: 0.045,
      color: "white",
    });
  }

  setUpMesh() {
    this.shape = new THREE.Mesh(this.shapeGeometry, this.shapeMaterial);
    this.outline = new THREE.Mesh(this.outlineGeometry, this.outlineMaterial);
    this.shape.name = "mainShape";
    this.outline.name = "mainOutline";
  }
  setUpText(words = "aQ") {
    let fontLoader = new THREE.FontLoader();
    fontLoader.load(
      "Techkey/js/MVC/media/font.json",
      function (font) {
        let geometrySetting = {
          font: font,
          size: 1,
          height: 0.1,
          curveSegments: 1,
          bevelEnabled: true,
          bevelThickness: 0.005,
          bevelSize: 0.01,
          bevelSegments: 0.5,
        };
        let textMaterial = new THREE.MeshBasicMaterial({ color: 0xcccccc });
        let textGeometry = new THREE.TextGeometry(words, geometrySetting);
        let text = new THREE.Mesh(textGeometry, textMaterial);
        text.name = "text";
        text.position.x = -4;
        text.position.z = -4;
        text.name = "mainText";
        this.scene.add(text);
      }.bind(this)
    );
  }
  setUpEnvironment() {
    this.environmentLoader = new THREE.CubeTextureLoader();
    this.environmentUrl = [
      "media/posx.jpg",
      "media/negx.jpg",
      "media/posy.jpg",
      "media/negy.jpg",
      "media/posz.jpg",
      "media/negz.jpg",
    ];
  }
  setUPTextureLoader() {
    return new THREE.TextureLoader();
  }

  setUpLight() {
    this.ambientLight = new THREE.AmbientLight("white", 0.5);
    this.lights = [];
    this.lights[0] = new THREE.DirectionalLight(0xffffff, 1);
    this.lights[1] = new THREE.DirectionalLight(0x11e8bb, 1);
    this.lights[2] = new THREE.DirectionalLight(0x8200c9, 1);
  }

  setPositions() {
    this.outline.position.x = 3;
    this.shape.position.x = 3;
    this.shape.rotation.x = -0.5;
    this.camera.position.z = 19;
    let camPos = { camPos: 19 };
    new TWEEN.Tween(camPos)
      .to({ camPos: 5 }, 6000)
      .easing(TWEEN.Easing.Quadratic.Out)
      .delay(0)
      .onUpdate(() => {
        this.camera.position.z = camPos.camPos;
      })
      .start();

    this.camera.position.x = 1;
    this.camera.position.y = 0.6;
    this.ambientLight.position.z = 0;
    this.lights[0].position.set(1, 0, 0);
    this.lights[1].position.set(0.75, 1, 0.5);
    this.lights[2].position.set(-0.75, -1, 0.5);
  }

  setUpRenderer() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
  initializeRenderer() {
    this.renderer.render(this.scene, this.camera);
  }
  setUpParticles(particleCount = 5000) {
    //buffer
    let positionArray = new Float32Array(particleCount * 3); // 3= x y z
    for (let i = 0; i < particleCount * 3; i++) {
      // positionArray[i] = Math.random();
      // positionArray[i] = Math.random() - 0.5; //for positioning at center
      positionArray[i] = (Math.random() - 0.5) * 15; //increase the sixe
    }
    this.planeBuffer.setAttribute(
      "position",
      new THREE.BufferAttribute(positionArray, 3)
    );
    this.planeparticle = new THREE.Points(
      this.planeBuffer,
      this.particlesMaterial
    );
  }

  setUpScene() {
    this.scene.add(this.outline);
    this.scene.add(this.lights[0]);
    this.scene.add(this.lights[1]);
    this.scene.add(this.lights[2]);
    this.scene.add(this.ambientLight);
    this.scene.add(this.shape);
    this.scene.add(this.planeparticle);
  }
  setUpControlls(condition) {
    if (condition) {
      this.controls = new THREE.OrbitControls(
        this.camera,
        this.renderer.domElement
      );
      this.controls.enableZoom = false;
    }
  }
  saveMarkup(html) {
    this.markup.data = html;
  }
  getMArkup() {
    return this.markup.data;
  }
  setUpWho() {
    let planeGeometry = new THREE.PlaneGeometry(2, 2, 2, 2);
    let options = {
      //transparent: true,
      depthTest: false,
      side: THREE.DoubleSide,
    };
    let planeMaterial = new THREE.MeshStandardMaterial(options);
    let textureLoader = this.setUPTextureLoader();
    planeMaterial.map = textureLoader.load("Techkey/js/MVC/media/who.png");
    this.plane = new THREE.Mesh(planeGeometry, planeMaterial);
    this.plane.position.y = 15;

    let shape = this.scene.getObjectByName("mainShape");
    let outline = this.scene.getObjectByName("mainOutline");

    let camPos1 = { camPos1: 4 };
    new TWEEN.Tween(camPos1)
      .to({ camPos1: 16 }, 2000)
      .easing(TWEEN.Easing.Quadratic.Out)
      .delay(0)
      .onUpdate(() => {
        this.camera.position.z = camPos1.camPos1;
      })
      .start();
    // this.camera.position.z = 15;
    let camPos = { camPos: 15 };
    new TWEEN.Tween(camPos)
      .to({ camPos: 4 }, 4000)
      .easing(TWEEN.Easing.Quadratic.Out)
      .delay(3000)
      .onUpdate(() => {
        this.camera.position.z = camPos.camPos;
      })
      .start();
    //shape z position
    let shapePos = { shapePos: 0 };
    new TWEEN.Tween(shapePos)
      .to({ shapePos: -8 }, 4000)
      .easing(TWEEN.Easing.Quadratic.Out)
      .delay(500)
      .onUpdate(() => {
        this.shape.position.z = shapePos.shapePos;
      })
      .start();

    //shape x position
    let shapePosX = { shapePosX: 3 };
    new TWEEN.Tween(shapePosX)
      .to({ shapePosX: -6 }, 4000)
      .easing(TWEEN.Easing.Quadratic.Out)
      .delay(1000)
      .onUpdate(() => {
        this.shape.position.x = shapePosX.shapePosX;
      })
      .start();

    // shape scale
    let shapeScale = { shapeScale: 1 };
    new TWEEN.Tween(shapeScale)
      .to({ shapeScale: 4 }, 4000)
      .easing(TWEEN.Easing.Quadratic.Out)
      .delay(6000)
      .onUpdate(() => {
        this.shape.scale.x = shapeScale.shapeScale;
        this.shape.scale.y = shapeScale.shapeScale;
        this.shape.scale.z = shapeScale.shapeScale;
        // this.shape.rotation.x = 0;
      })
      .start();
    //text
    let text = this.scene.getObjectByName("mainText");
    let textPos = { textPos: -4 };
    new TWEEN.Tween(textPos)
      .to({ textPos: 19 }, 4000)
      .easing(TWEEN.Easing.Quadratic.Out)
      .delay(2000)
      .onUpdate(() => {
        text.position.z = textPos.textPos;
      })
      .start();

    //Add the plane
    let planePos = { planePos: 15 };
    new TWEEN.Tween(planePos)
      .to({ planePos: 0 }, 4000)
      .easing(TWEEN.Easing.Quadratic.Out)
      .delay(2000)
      .onUpdate(() => {
        this.plane.position.y = planePos.planePos;
      })
      .start();

    this.scene.add(this.plane);
  }

  setupModel() {
    try {
      let Gltloader = new THREE.GLTFLoader();
      Gltloader.load(
        "./Techkey/js/MVC/media/model/laptop/scene.gltf",
        function (gltf) {
          this.globalHelper.push(gltf.scene);
        }.bind(this),
        undefined,
        function (error) {
          console.error(error);
        }
      );
    } catch (error) {
      console.log(error);
    }
  }
  welcomeAnimation() {
    //Welcome animation

    let pullCamera = { pullCamera: 5 };
    new TWEEN.Tween(pullCamera)
      .to({ pullCamera: 11 }, 3000)
      .easing(TWEEN.Easing.Quadratic.Out)
      .delay(0)
      .onUpdate(() => {
        this.camera.position.z = pullCamera.pullCamera;
      })
      .start();

    //  this.camera.position.z = 11;
    //this.camera.position.y = 2;
    let pullCameraUp = { pullCameraUp: 0 };
    new TWEEN.Tween(pullCameraUp)
      .to({ pullCameraUp: 2 }, 2000)
      .easing(TWEEN.Easing.Quadratic.Out)
      .delay(0)
      .onUpdate(() => {
        this.camera.position.y = pullCameraUp.pullCameraUp;
      })
      .start();

    this.camera.position.x = 2;

    let animateModel = { animateModel: 0 };
    new TWEEN.Tween(animateModel)
      .to({ animateModel: -6.2 }, 9000)
      .easing(TWEEN.Easing.Quadratic.Out)
      .delay(3500)
      .onUpdate(() => {
        this.scene.rotation.y = animateModel.animateModel;
      })
      .start();

    let pushCamera = { pushCamera: 11 };
    new TWEEN.Tween(pushCamera)
      .to({ pushCamera: 5 }, 3000)
      .easing(TWEEN.Easing.Quadratic.Out)
      .delay(10500)
      .onUpdate(() => {
        this.camera.position.z = pushCamera.pushCamera;
      })
      .start();
    let pushCameradown = { pushCameradown: 2 };
    new TWEEN.Tween(pushCameradown)
      .to({ pushCameradown: 0 }, 3000)
      .easing(TWEEN.Easing.Quadratic.Out)
      .delay(10500)
      .onUpdate(() => {
        this.camera.position.y = pushCameradown.pushCameradown;
      })
      .start();
  }
  animateModel() {
    let objs = this.globalHelper[0];
    if (!objs) {
      return;
    }

    // objs.scale.x = 0.5;
    // objs.scale.y = 0.5;
    // objs.scale.z = 0.5;
    objs.rotation.y = 1.5;
    objs.rotation.x = 0.7;
    objs.position.z = -7;
    objs.position.x = 3;
    objs.position.y = 8;
    this.scene.add(objs);

    //Add the plane
    let animateModel = { animateModel: 8 };
    new TWEEN.Tween(animateModel)
      .to({ animateModel: 1.5 }, 3000)
      .easing(TWEEN.Easing.Quadratic.Out)
      .delay(500)
      .onUpdate(() => {
        objs.position.y = animateModel.animateModel;
      })
      .start();
  }
  returnModel() {
    setTimeout(() => {
      this.animateModel();
    }, 2000);
    //console.log("this.globalHelper[0]", this.globalHelper[0]);
  }
}

export default new App();
