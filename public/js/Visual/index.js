let scene = new THREE.Scene();

let camera = new THREE.PerspectiveCamera(75, window.innerWidth/ window.innerHeight, .1, 1000);

camera.position.x = 0;
camera.position.y = 10;
camera.position.z = 30;


let renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight);
document.body.appendChild( renderer.domElement );

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
let geometry = new THREE.CubeGeometry( 1.5, 1.5, 1.5 );


let cubes = [];
let cube;
// Being to make a 3D sphere:
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

  // Each slice of the sphere (a circle whose variable points are on the X-axis and Z-axis) should contain 16 points, 1 for each major direction and 3 in each quandrant

  // There should also be a incrementing variable and a decrementing variable depending on the y value. Once we reach the halfway point, we want to make the radius decrease in size

  // To create each node, we start at 12 o'clock (the origin) and go counterclockwise

  // Each node will be pi/8 rad apart, and the coordinates can be calculated as follows:

  // X coordinate: Sin(degrees) * radius
  // Z coordinate: Cos(degrees) * radius
  for(let currentCube = 0; currentCube < numCubes; currentCube++) {
    let x = radius * Math.sin(degree);
    let z = radius * Math.cos(degree);
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
    degree += Math.PI/(numCubes/2);
    cubes.push(cube);
  }
}

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
  cubes.forEach( cube => {
    cube.rotation.x += Math.random()/10;
    cube.rotation.y += Math.random()/10;
  })
  renderer.render( scene, camera );
}

render();
