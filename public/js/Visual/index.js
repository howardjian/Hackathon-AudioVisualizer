let scene, camera, renderer, camCount, cube;
let cubes =

// Add Event Listeners to play and pause
onKeyDown = (e) => {
  switch(e.which) {
    case 32:
      if(context.state === 'running') {
        context.suspend();
      } else {
        context.resume();
      }
      break;
    case 50:
      toggleShapes();
      break;
    case 49:
      cubes = [];
      scene = null;
      initCubes();
      render();
      break;
    case 51:
      toggleCam();
      break
  }
}

document.addEventListener('keydown', onKeyDown, false);



// CUBES RENDERING
var geometry = new THREE.TetrahedronGeometry(1);

// Begin to make a 3D sphere:
// For we make vertical slices on the Y array, with each level being 2 meters apart:
// increment = true,
// yCoords = 0,
// radius = 0
let toggleCam = () => {
  camera.position.x = 0;
  camera.position.y = 0;
  camera.position.z = 0;
  camera.getWorldPosition()
}


let toggleShapes = () => {
  if(cubes[0].geometry.type === 'TetrahedronGeometry') {
    while(scene.children.length) {
      scene.remove(scene.children[0]);
    }
    geometry = new THREE.CubeGeometry(1,1,1);
    cubes = [];
    scene = null;
    initCubes();
    render();
  } else {
    while(scene.children.length) {
      scene.remove(scene.children[0]);
    }
    var geometry = new THREE.TetrahedronGeometry(1);
    cubes = [];
    scene = null;
    init(geometry);
    render();
  }
}

let initCubes = () => {
  scene = scene || new THREE.Scene();

  camera = camera ||  new THREE.PerspectiveCamera(75, window.innerWidth/ window.innerHeight, .1, 1000);

  camera.position.x = 0;
  camera.position.y = 0;
  camera.position.z = 50;

  renderer = renderer || new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight);
  document.body.appendChild( renderer.domElement );

  // Figure out lights
  let directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(0, 0, -5);
  scene.add(directionalLight);

  directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
  directionalLight.position.set(3, 1, 1);
  scene.add(directionalLight);

  let lightA = new THREE.AmbientLight(0x2194ce);
  scene.add(lightA);

  let geometry = new THREE.CubeGeometry(1, 1, 1);

  // slices of squares based on Y-axis
  for(let y = 0; y < 32; y += 4) {
    // rows of squares based on z-axis
    for(let z = 0; z < 32; z += 4) {
      // individual squares based on x-axis
      for(let x = 0; x < 32; x += 4) {
        let material =
        new THREE.MeshPhongMaterial({
          color: generateRandomColor(),
          specular: 0x111111,
          shading: THREE.SmoothShading,
          shininess: 25,
          reflectivity: 5.5,
          wireframe: false
        });
        cube = new THREE.Mesh(geometry, material);
        cube.position.set(x, y, z);
        scene.add(cube);
        cubes.push(cube);
        if(z !== 0 && z !== 28 && y !== 0 && y !== 28) {
          x += 24
        }
      }
    }
  }
  cubes.forEach(cube => {
    cube.translateX(-16);
    cube.translateY(-16);
    cube.translateZ(-16);

  })
}

let init = (geo) => {
  geometry = geo || geometry
  scene = scene || new THREE.Scene();
  // scene.background = new THREE.Color( 0xffffff )

  camera = camera ||  new THREE.PerspectiveCamera(75, window.innerWidth/ window.innerHeight, .1, 1000);

  camera.position.x = 0;
  camera.position.y = 0;
  camera.position.z = 30;

  renderer = renderer || new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight);
  document.body.appendChild( renderer.domElement );

  // LIGHT: without light, the metallic surface (phongmaterial) will not show
  if(geometry.type === 'TetrahedronGeometry'){
    let directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(0, 1, 0);
    scene.add(directionalLight);

    directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
    directionalLight.position.set(-1, -1, 0);
    scene.add(directionalLight);

    var light = new THREE.AmbientLight(0x505050);
    scene.add(light);
  } // else {
  //   let directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  //   directionalLight.position.set(0, 0, -5);
  //   scene.add(directionalLight);
  //
  //   directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  //   directionalLight.position.set(1, 1, 1);
  //   scene.add(directionalLight);
  //
  //   let lightA = new THREE.AmbientLight(0x2194ce);
  //   scene.add(lightA);
  // }

  for(let yCoords = 0; yCoords < 42; yCoords += 4){
    let incrementing = yCoords < 20;
    let y = yCoords;
    let radius = incrementing ? y : 40 - y;
    let degree = 0;
    let numCubes = incrementing ? 4 * (yCoords / 2) + 1 : 4 * (40 - yCoords) / 2 + 1 ;

    // In order to influence the scaling provided the music and only pulse the outward-facing faces of the cube, I need to determine which quandrants each physical object is in the 3D space

    let verticalHalf, horizontalHalf, zHalf, convert;
    if(y < 20) verticalHalf = '-'
    else if(y === 20) verticalHalf = '='
    else verticalHalf = '+';

    // Each slice of the sphere (a circle whose variable points are on the X-axis and Z-axis) should contain variables points

    // There should also be a incrementing variable and a decrementing variable depending on the y value. Once we reach the halfway point, we want to make the radius decrease in size

    // To create each node, we start at 12 o'clock (the origin) and go counterclockwise

    // Each node will be pi/(numCubes/2) rad apart, and the coordinates can be calculated as follows:
    // X coordinate: Sin(degrees) * radius
    // Z coordinate: Cos(degrees) * radius

    for(let currentCube = 0; currentCube < numCubes; currentCube++) {
      let x = radius * Math.sin(degree);
      let z = radius * Math.cos(degree);

      if(!x) horizontalHalf = '='
      else if(x > 0) horizontalHalf = '+'
      else horizontalHalf = '-';

      if(!z) zHalf = '='
      else if(z > 0) zHalf = '-'
      else zHalf = '+';

      // To determine the octant of a sphere
      // ** If you are a middle, you do NOT pulse in that axis
      // FORMAT: horizontalHalf, verticalHalf, zHalf
      // + + + : right, top, toward
      // + + - : right, top, away
      // + - + : right, bottom, toward
      // + - - : right, bottom, away
      // - + + : left, top, toward
      // - + - : left, top, away
      // - - + : left, bottom, toward
      // - - - : left, bottom, away

      let material =
      new THREE.MeshPhongMaterial({
        color: generateRandomColor(),
        specular: 0x111111,
        shading: THREE.SmoothShading,
        shininess: 25,
        reflectivity: 5.5,
        wireframe: false
      });

      cube = new THREE.Mesh(geometry, material);

      cube.userData = {
        vertical: verticalHalf,
        horizontal: horizontalHalf,
        zDirection: zHalf
        // octant: octant
      }

      cube.position.set(x, y, z);
      scene.add(cube);
      degree += Math.PI/(numCubes/2);
      cubes.push(cube);
    }
  }

  cubes.forEach(cube => {
    cube.translateY(-20);
  })
}

// Functions

// To generate colors, Math.random() will be used on the chars values
function generateRandomColor() {
  let chars = '123456789ABCDEF';
  let color = '#';
  let i = 0;
  while(i < 6){
    color += chars[Math.floor(Math.random()*15)];
    i++
  }
  return color;
}

render = () => {
  requestAnimationFrame( render );

  // this will be added to the scaling factor to add a 'randomization' to each cube object within the sphere
  let i = 0;
  cubes.forEach( cube => {
    i += 1;
    if( i === 10) {
      i = 0
    };

    cube.scale.x = cubeAudioScale && (cube.userData.horizontal !== '=') ?
    (cube.userData.horizontal === '+' ? (i/10 + cubeAudioScale / 75) :
    -i/10 - cubeAudioScale/75) : .5

    cube.scale.y = cubeAudioScale && (cube.userData.vertical !== '=') ?
    (cube.userData.vertical === '+' ? (i/10 + cubeAudioScale / 75) :
    -i/10 - cubeAudioScale/75) : .5


    cube.scale.z = cubeAudioScale && (cube.userData.zHalf !== '=') ?
    (cube.userData.zHalf === '+' ? (i/10 + cubeAudioScale / 75) :
    -i/10 - cubeAudioScale/75) : .5

  })
  renderer.render( scene, camera );
}
