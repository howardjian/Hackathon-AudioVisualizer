// ## Instructions for decoding, analyzing and relaying audio stream

// 1. Set the Audio context as determined by browser
// 2. Create an XMLHttpRequest, as this has a response type of "ArrayBuffer", used to handle async requests such as audio buffers
// 3. Decode the audio data found in the audio context, handling the callback and errors
// 4. create a ScriptProcessingNode to handle processing/analyzing of audio via JS
// 5. create a buffer source node



let context, JSAudioNode, audioSourceNode, analyzerNode;
// context = window.AudioContext || window.webkitAudioContext;
let cubeAudioScale = 0;

try {
    if(typeof webkitAudioContext === 'function') { // webkit-based
        context = new webkitAudioContext();
    }
    else { // other browsers that support AudioContext
        context = new AudioContext();
    }
}
catch(e) {
    // Web Audio API is not supported in this browser
    alert("Web Audio API is not supported in this browser");
}

let url = './Assets/sounds/cant-stop-the-feeling.ogg';

let request = new XMLHttpRequest();
// true is specified to indicate async processing
request.open("GET", url, true );
// use array buffer as per w3c
request.responseType = "arraybuffer";

request.onload = function() {
  context.decodeAudioData(request.response)
  .then(function(decodedDataBuffer) {
    if(!decodedDataBuffer) {
      // something wrong with the decoded data
      console.log('no decodedData');
      return;
    }

    // creating nodes
    JSAudioNode = context.createScriptProcessor(2048, 1, 1);
    analyzerNode = context.createAnalyser();
    audioSourceNode = context.createBufferSource();

    // setting the fourier transform size to determine domain of frequencyBinCount. the frequencyBinCount is half of this value
    // choosing a fft size of 512 sets a frequencyBinCount of 256 (half of this), which allows us to use Uint8array which takes up to 8 bits of info (256)
    // This allows us to manage, send and respond to smaller bytes of frequency data (as opposed to the float 32)
    analyzerNode.fftSize = 512;
    // connecting Nodes
    // JSAudioNode.connect(AudioContext.destination);
    JSAudioNode.buffer = decodedDataBuffer;
    audioSourceNode.connect(analyzerNode);
    analyzerNode.connect(JSAudioNode);
    audioSourceNode.connect(context.destination) // speakers

    JSAudioNode.onaudioprocess = (event) => {
      let audioFreqArr = new Uint8Array(analyzerNode.frequencyBinCount);
      analyzerNode.getByteFrequencyData(audioFreqArr);

      // to scale the cube's size, we need to get the average frequency in the audioFreqArr
      audioFreqArr.forEach(freq => cubeAudioScale += freq);
      cubeAudioScale / audioFreqArr.length
    }

    audioSourceNode.start();

  })
  .catch(error => {
    // some kind of decoding error
    console.error(error);
  })
}










//
// let camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);
//
// // audio listener that is added to the camera
// let listener = new THREE.AudioListener();
// camera.add(listener);
//
// // global audio source
// let sound = new THREE.Audio(listener);
//
// let audioLoader = new THREE.AudioLoader();
//
// audioLoader.load(url, function (buffer){
//   sound.setBuffer(buffer);
//   sound.setLoop(true);
//   sound.setVolume(0.5);
//   sound.play();
// })
