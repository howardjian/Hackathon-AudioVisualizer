let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);

camera.position.set(0, 0, 100);
camera.lookAt(new THREE.Vector3(0, 0, 0));

let scene = new THREE.Scene();

let loader = new THREE.FontLoader();

loader.load( 'fonts/helvetiker_regular.typeface.json', function ( font ) {
	var geometry = new THREE.TextGeometry( 'Hello three.js!', {
		font: font,
		size: 80,
		height: 5,
		curveSegments: 12,
		bevelEnabled: true,
		bevelThickness: 10,
		bevelSize: 8,
		bevelSegments: 5
	});
});

// TextGeometry(text, parameters)
//
// text — The text that needs to be shown.
// parameters — Object that can contains the following parameters.
// font — an instance of THREE.Font.
// size — Float. Size of the text. Default is 100.
// height — Float. Thickness to extrude text. Default is 50.
// curveSegments — Integer. Number of points on the curves. Default is 12.
// bevelEnabled — Boolean. Turn on bevel. Default is False.
// bevelThickness — Float. How deep into text bevel goes. Default is 10.
// bevelSize — Float. How far from text outline is bevel. Default is 8.
// bevelSegments — Integer. Number of bevel segments. Default is 3.
