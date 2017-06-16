// creates a new AudioListener and add it to the camera
let camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);

let listener = new THREE.AudioListener();
camera.add( listener );

// creates a new global audio source
let sound = new THREE.Audio( listener );

let audioLoader = new THREE.AudioLoader();


audioLoader.load( './Assets/sounds/poker_chips.ogg', function(buffer){
  sound.setBuffer(buffer);
  sound.setLoop(true);
  sound.setVolume(0.5);
  sound.play();
})
