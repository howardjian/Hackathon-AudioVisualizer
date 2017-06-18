// ## Instructions for decoding, analyzing and relaying audio stream

// 1. Set the Audio context as determined by browser
// 2. Create an XMLHttpRequest, as this has a response type of "ArrayBuffer", used to handle async requests such as audio buffers
// 3. Decode the audio data found in the audio context, handling the callback and errors
// 4. create a script processing node and audio buffer source as well as an analyzer node
// 5. set the appropriate size of fourier transform, which will also set the binfrequency size
// 6. connect Nodes
// 7. create a scaling factor to be used globally (in the visual file) that scales with the average frequency size, which is obtained from getByteFrequencyData method, called off of the analyzerNode

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
    JSAudioNode.buffer = decodedDataBuffer;
    audioSourceNode.buffer = decodedDataBuffer;
    audioSourceNode.loop = true;

    // connecting Nodes
    JSAudioNode.connect(context.destination);
    audioSourceNode.connect(analyzerNode);
    analyzerNode.connect(JSAudioNode);
    audioSourceNode.connect(context.destination) // speakers

    // handles the event that fires off when audio is being processed
    JSAudioNode.onaudioprocess = (event) => {
      let audioFreqArr = new Uint8Array(analyzerNode.frequencyBinCount);

      // this normalizes the frequency data to an 8-byte number (0-255)
      // as opposed to the Float32 array which normalizes to 1024
      analyzerNode.getByteFrequencyData(audioFreqArr);

      // to scale the cube's size, we need to get the average frequency in the audioFreqArr
      audioFreqArr.forEach(freq => {
        // console.log(freq);
        cubeAudioScale += freq
      });

      cubeAudioScale /= audioFreqArr.length
      // console.log(cubeAudioScale);
    }
    // start the song once everything is hooked up
    audioSourceNode.start();
  })
  .catch(error => {
    // some kind of decoding error
    console.error(error);
  })
};

request.send();
