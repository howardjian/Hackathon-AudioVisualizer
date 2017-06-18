let scene = new THREE.Scene();

let camera = new THREE.PerspectiveCamera(75, window.innerWidth/ window.innerHeight, .1, 1000);

camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 30;


let renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight);
document.body.appendChild( renderer.domElement );

// LIGHT: without light, the metallic surface (phongmaterial) will not show

let lightA = new THREE.AmbientLight(0x505050);
scene.add(lightA);

var directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(0, 1, 1);
scene.add(directionalLight);

directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(1, 1, 0);
scene.add(directionalLight);


directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(0, -1, -1);
scene.add(directionalLight);

directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
directionalLight.position.set(-1, -1, 0);
scene.add(directionalLight);



// CUBES RENDERING
// cool color from Three.js example: 0x2194ce
let geometry = new THREE.CubeGeometry( 1, 1, 1 );
// let geometry = new THREE.SphereGeometry( 1, 32, 32 );



let cubes = [];
let cube;

// Begin to make a 3D sphere:
// For we make vertical slices on the Y array, with each level being 2 meters apart:
// increment = true,
// yCoords = 0,
// radius = 0


for(let yCoords = 0; yCoords < 22; yCoords += 2){
  let incrementing = yCoords < 10;
  let y = yCoords;
  let radius = incrementing ? y : 20 - y;
  let degree = 0;
  let numCubes = incrementing ? 4 * (yCoords / 2) + 1 : 4 * (20 - yCoords) / 2 + 1 ;

  // In order to influence the scaling provided the music and only pulse the outward-facing faces of the cube, I need to determine which quandrants each physical object is in the 3D space

  let verticalHalf, horizontalHalf, zHalf, convert;
  if(y < 10) verticalHalf = '-'
  else if(y === 10) verticalHalf = '='
  else verticalHalf = '+';

  // Each slice of the sphere (a circle whose variable points are on the X-axis and Z-axis) should contain 16 points, 1 for each major direction and 3 in each quandrant

  // There should also be a incrementing variable and a decrementing variable depending on the y value. Once we reach the halfway point, we want to make the radius decrease in size

  // To create each node, we start at 12 o'clock (the origin) and go counterclockwise

  // Each node will be pi/8 rad apart, and the coordinates can be calculated as follows:

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


    // octant = horizontalHalf + verticalHalf + zHalf

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
  cube.translateY(-10);
  console.log(cube);
})

// Functions

// To generate colors, Math.random() will be used on the chars values
function generateRandomColor() {
  let chars = '0123456789ABCDEF';
  let color = '#';
  let i = 0;
  while(i < 6){
    color += chars[Math.floor(Math.random()*16)];
    i++
  }
  return color;
}

function render() {
  requestAnimationFrame( render );

  // this will be added to the scaling factor to add a 'randomization' to each cube object within the sphere
  let i = 0;
  cubes.forEach( cube => {
    i += 1;
    if( i === 10) {
      i = 0
    };


    cube.scale.x = cubeAudioScale && (cube.userData.horizontal !== '=') ?
    (cube.userData.horizontal === '+' ? (i/20 + cubeAudioScale / 100) :
    -i/20 - cubeAudioScale/100) : 1

    cube.scale.y = cubeAudioScale && (cube.userData.vertical !== '=') ?
    (cube.userData.vertical === '+' ? (i/20 + cubeAudioScale / 100) :
    -i/20 - cubeAudioScale/100) : 1

    cube.scale.z = cubeAudioScale && (cube.userData.zHalf !== '=') ?
    (cube.userData.zHalf === '+' ? (i/20 + cubeAudioScale / 100) :
    -i/20 - cubeAudioScale/100) : 1

  })
  renderer.render( scene, camera );
}

render();
