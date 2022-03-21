const context = new AudioContext({
    sampleRate: 48000,
    channelCount: 2
});

// DOM points
const mainOscillator = document.getElementById('main-oscillator');
const mainOscillatorDetune = document.getElementById('main-oscillator-detune');
const sideOscillatorDetune = document.getElementById('side-oscillator-detune');
const noiseFilter = document.getElementById('noise-filter');

const freqDiv1Bank1 = document.getElementById('freq-div-1-bank1');
const freqDiv2Bank1 = document.getElementById('freq-div-2-bank1');
const freqDiv3Bank1 = document.getElementById('freq-div-3-bank1');
const freqDiv4Bank1 = document.getElementById('freq-div-4-bank1');

const freqDiv1Bank2 = document.getElementById('freq-div-1-bank2');
const freqDiv2Bank2 = document.getElementById('freq-div-2-bank2');
const freqDiv3Bank2 = document.getElementById('freq-div-3-bank2');
const freqDiv4Bank2 = document.getElementById('freq-div-4-bank2');

const subHarmGain1Slider = document.getElementById('sub-harm-gain-1');
const subHarmGain2Slider = document.getElementById('sub-harm-gain-2');
const subHarmGain3Slider = document.getElementById('sub-harm-gain-3');
const subHarmGain4Slider = document.getElementById('sub-harm-gain-4');

const formant1Freq = document.getElementById('formant-1-freq');
const formant2Freq = document.getElementById('formant-2-freq');
const formant3Freq = document.getElementById('formant-3-freq');
const formant4Freq = document.getElementById('formant-4-freq');

const formant1Q = document.getElementById('formant-1-Q');
const formant2Q = document.getElementById('formant-2-Q');
const formant3Q = document.getElementById('formant-3-Q');
const formant4Q = document.getElementById('formant-4-Q');

const formant1Type = document.getElementById('formant-type-1');
const formant2Type = document.getElementById('formant-type-2');
const formant3Type = document.getElementById('formant-type-3');
const formant4Type = document.getElementById('formant-type-4');

const formantAmp1 = document.getElementById('formant-amp-1');
const formantAmp2 = document.getElementById('formant-amp-2');
const formantAmp3 = document.getElementById('formant-amp-3');
const formantAmp4 = document.getElementById('formant-amp-4');

const mixerSliderCh1 = document.getElementById('mixer-ch1');
const mixerSliderCh2 = document.getElementById('mixer-ch2');
const mixerSliderCh3 = document.getElementById('mixer-ch3');
const mixerSliderCh4 = document.getElementById('mixer-ch4');

const setElementXPosition = document.getElementById('x-position');
const setElementYPosition = document.getElementById('y-position');
const setElementZPosition = document.getElementById('z-position');



let mainOsc = context.createOscillator();
mainOsc.type = 'square';
mainOsc.frequency = 220;
// Add octave switch
mainOsc.start();


let subHarmonicGen1 = context.createOscillator();
subHarmonicGen1.type = 'sawtooth';
subHarmonicGen1.frequency.value = 220 / freqDiv1Bank1.value;
let subHarmonicGen2 = context.createOscillator();
subHarmonicGen2.type = 'sawtooth';
subHarmonicGen2.frequency.value = 220 / freqDiv2Bank1.value;
let subHarmonicGen3 = context.createOscillator();
subHarmonicGen3.type = 'sawtooth';
subHarmonicGen3.frequency.value = 220 / freqDiv3Bank1.value;
let subHarmonicGen4 = context.createOscillator();
subHarmonicGen4.type = 'sawtooth';
subHarmonicGen4.frequency.value = 220 / freqDiv4Bank1.value;
subHarmonicGen1.start();
subHarmonicGen2.start();
subHarmonicGen3.start();
subHarmonicGen4.start();

let subHarmGain1 = context.createGain();
let subHarmGain2 = context.createGain();
let subHarmGain3 = context.createGain();
let subHarmGain4 = context.createGain();


let sideOsc = context.createOscillator();
sideOsc.type = 'triangle';
// Add octave switch
sideOsc.start();

// Create Noise Generator
let noiseSource;
let bufferSize = 2 * context.sampleRate,
    noiseBuffer = context.createBuffer(1, bufferSize, context.sampleRate),
    output = noiseBuffer.getChannelData(0);
for (let i = 0; i < bufferSize; i++) {
    output[i] = Math.random() * 2 - 1;
}
noiseSource = context.createBufferSource();
noiseSource.buffer = noiseBuffer;
noiseSource.loop = true;
noiseSource.start(0);

let noiseSourceFilter = context.createBiquadFilter();
noiseSourceFilter.type = 'bandpass';


let mixerCh1 = context.createGain();
mixerCh1.gain.value = 0;
let mixerCh2 = context.createGain();
mixerCh2.gain.value = 0;
let mixerCh3 = context.createGain();
mixerCh3.gain.value = 0;
let mixerCh4 = context.createGain();
mixerCh4.gain.value = 0;

let mixerOutput = context.createGain();
mixerOutput.gain = 1;

let formantFilter1 = context.createBiquadFilter();
formantFilter1.type = 'bandpass';
formantFilter1.Q = 3;

let formantFilter2 = context.createBiquadFilter();
formantFilter2.type = 'bandpass';
formantFilter2.Q = 3;

let formantFilter3 = context.createBiquadFilter();
formantFilter3.type = 'bandpass';
formantFilter3.Q = 3;

let formantFilter4 = context.createBiquadFilter();
formantFilter4.type = 'bandpass';
formantFilter4.Q = 3;

let formantMixer1 = context.createGain();
let formantMixer2 = context.createGain();
let formantMixer3 = context.createGain();
let formantMixer4 = context.createGain();

let vca1 = context.createGain();

function logSlider(position, minValue, maxValue) {
    var minp = 0;
    var maxp = 999;
    var minv = Math.log(minValue);
    var maxv = Math.log(maxValue);
    var scale = (maxv - minv) / (maxp - minp);
    return Math.exp(minv + scale * (position - minp));
}

// One-liner to resume playback when user interacted with the page.
document.querySelector('button').addEventListener('click', function () {
    context.resume().then(() => {
        console.log('Playback resumed successfully');
    });
});

let freqDivided = false;


// Modularize these next
mainOscillator.addEventListener('input', function () {
    if (freqDivided == true) {
        mainOsc.frequency.value = logSlider((mainOscillator.value), 20, 5000);
        sideOsc.frequency.value = logSlider((mainOscillator.value), 20, 5000);
        subHarmonicGen1.frequency.value = logSlider((mainOscillator.value), 20, 5000) / freqDiv1Bank2.value;
        subHarmonicGen2.frequency.value = logSlider((mainOscillator.value), 20, 5000) / freqDiv2Bank2.value;
        subHarmonicGen3.frequency.value = logSlider((mainOscillator.value), 20, 5000) / freqDiv3Bank2.value;
        subHarmonicGen4.frequency.value = logSlider((mainOscillator.value), 20, 5000) / freqDiv4Bank2.value;
    } else {
        mainOsc.frequency.value = logSlider((mainOscillator.value), 20, 5000);
        sideOsc.frequency.value = logSlider((mainOscillator.value), 20, 5000);
        subHarmonicGen1.frequency.value = logSlider((mainOscillator.value), 20, 5000) / freqDiv1Bank1.value;
        subHarmonicGen2.frequency.value = logSlider((mainOscillator.value), 20, 5000) / freqDiv2Bank1.value;
        subHarmonicGen3.frequency.value = logSlider((mainOscillator.value), 20, 5000) / freqDiv3Bank1.value;
        subHarmonicGen4.frequency.value = logSlider((mainOscillator.value), 20, 5000) / freqDiv4Bank1.value;
    }
})

// FINE TUNE
mainOscillatorDetune.addEventListener('input', function () {
    mainOsc.detune.value = mainOscillatorDetune.value;
    subHarmonicGen1.detune.value = mainOscillatorDetune.value;
    subHarmonicGen2.detune.value = mainOscillatorDetune.value;
    subHarmonicGen3.detune.value = mainOscillatorDetune.value;
    subHarmonicGen4.detune.value = mainOscillatorDetune.value;

})
sideOscillatorDetune.addEventListener('input', function () {
    sideOsc.detune.value = sideOscillatorDetune.value;
})

noiseFilter.addEventListener('input', function () {
    noiseSourceFilter.frequency.value = logSlider((noiseFilter.value), 20, 20000);
})



window.addEventListener('keydown', function () {
    if (freqDivided == false) {
        freqDivided = true;
        subHarmonicGen1.frequency.value = mainOscillator.value / freqDiv1Bank2.value;
        subHarmonicGen2.frequency.value = mainOscillator.value / freqDiv2Bank2.value;
        subHarmonicGen3.frequency.value = mainOscillator.value / freqDiv3Bank2.value;
        subHarmonicGen4.frequency.value = mainOscillator.value / freqDiv4Bank2.value;
    }

})

window.addEventListener('keyup', function () {
    freqDivided = false;
    subHarmonicGen1.frequency.value = mainOscillator.value / freqDiv1Bank1.value;
    subHarmonicGen2.frequency.value = mainOscillator.value / freqDiv2Bank1.value;
    subHarmonicGen3.frequency.value = mainOscillator.value / freqDiv3Bank1.value;
    subHarmonicGen4.frequency.value = mainOscillator.value / freqDiv4Bank1.value;
})

subHarmGain1Slider.addEventListener('input', function () {
    subHarmGain1.gain.value = subHarmGain1Slider.value / 100.0;
})
subHarmGain2Slider.addEventListener('input', function () {
    subHarmGain2.gain.value = subHarmGain2Slider.value / 100.0;
})
subHarmGain3Slider.addEventListener('input', function () {
    subHarmGain3.gain.value = subHarmGain3Slider.value / 100.0;
})
subHarmGain4Slider.addEventListener('input', function () {
    subHarmGain4.gain.value = subHarmGain4Slider.value / 100.0;
})

formant1Freq.addEventListener('input', function () {
    formantFilter1.frequency.value = logSlider(formant1Freq.value, 50, 5000);
})
formant1Q.addEventListener('input', function () {
    formantFilter1.Q.value = logSlider(formant1Q.value, 1, 10);
})
formant1Type.addEventListener('input', function () {
    if (formant1Type.checked == true) {
        formantFilter1.type = 'lowpass';
    } else {
        formantFilter1.type = 'bandpass';
    }
})

formant2Freq.addEventListener('input', function () {
    formantFilter2.frequency.value = logSlider(formant2Freq.value, 50, 5000);
})
formant2Q.addEventListener('input', function () {
    formantFilter2.Q.value = logSlider(formant2Q.value, 1, 10);
})
formant2Type.addEventListener('input', function () {
    if (formant2Type.checked == true) {
        formantFilter2.type = 'lowpass';
    } else {
        formantFilter2.type = 'bandpass';
    }
})

formant3Freq.addEventListener('input', function () {
    formantFilter3.frequency.value = logSlider(formant3Freq.value, 50, 5000);
})
formant3Q.addEventListener('input', function () {
    formantFilter3.Q.value = logSlider(formant3Q.value, 1, 10);
})
formant3Type.addEventListener('input', function () {
    if (formant3Type.checked == true) {
        formantFilter3.type = 'lowpass';
    } else {
        formantFilter3.type = 'bandpass';
    }
})

formant4Freq.addEventListener('input', function () {
    formantFilter4.frequency.value = logSlider(formant4Freq.value, 50, 5000);
})
formant4Q.addEventListener('input', function () {
    formantFilter4.Q.value = logSlider(formant4Q.value, 1, 10);
})
formant4Type.addEventListener('input', function () {
    if (formant4Type.checked == true) {
        formantFilter4.type = 'lowpass';
    } else {
        formantFilter4.type = 'bandpass';
    }
})

formantAmp1.addEventListener('input', function () {
    formantMixer1.gain.value = formantAmp1.value / 100.0;
})
formantAmp2.addEventListener('input', function () {
    formantMixer2.gain.value = formantAmp2.value / 100.0;
})
formantAmp3.addEventListener('input', function () {
    formantMixer3.gain.value = formantAmp3.value / 100.0;
})
formantAmp4.addEventListener('input', function () {
    formantMixer4.gain.value = formantAmp4.value / 100.0;
})

mixerSliderCh1.addEventListener('input', function () {
    mixerCh1.gain.value = mixerSliderCh1.value / 100.0;
})

mixerSliderCh2.addEventListener('input', function () {
    mixerCh2.gain.value = mixerSliderCh2.value / 100.0;
})

mixerSliderCh3.addEventListener('input', function () {
    mixerCh3.gain.value = mixerSliderCh3.value / 100.0;
})

mixerSliderCh4.addEventListener('input', function () {
    mixerCh4.gain.value = mixerSliderCh4.value / 100.0;
})


// VCA1 Input - Pressure from Slider
vca1.gain.value = 0.1;
// VCA2 Input - Foot Controller




subHarmonicGen1.connect(subHarmGain1).connect(mixerCh1).connect(mixerOutput);
subHarmonicGen2.connect(subHarmGain2).connect(mixerCh1).connect(mixerOutput);
subHarmonicGen3.connect(subHarmGain3).connect(mixerCh1).connect(mixerOutput);
subHarmonicGen4.connect(subHarmGain4).connect(mixerCh1).connect(mixerOutput);
mainOsc.connect(mixerCh2).connect(mixerOutput);
sideOsc.connect(mixerCh3).connect(mixerOutput);
noiseSource.connect(noiseSourceFilter).connect(mixerCh4).connect(mixerOutput);


mixerOutput.connect(formantFilter1);
mixerOutput.connect(formantFilter2);
mixerOutput.connect(formantFilter3);
mixerOutput.connect(formantFilter4);

formantFilter1.connect(formantMixer1).connect(vca1);
formantFilter2.connect(formantMixer2).connect(vca1);
formantFilter3.connect(formantMixer3).connect(vca1);
formantFilter4.connect(formantMixer4).connect(vca1);

// vca1.connect(context.destination);

// Resonance Audio/Room
let resonanceAudioScene = new ResonanceAudio(context);
let roomDimensions = {
    width: 3.1,
    height: 2.5,
    depth: 3.4,
};

let roomMaterials = {
    // Room wall materials
    left: 'marble',
    right: 'marble',
    front: 'metal',
    back: 'metal',
    // Room floor
    down: 'metal',
    // Room ceiling
    up: 'brick-bare',
};

resonanceAudioScene.setRoomProperties(roomDimensions, roomMaterials);
let resonanceSource = resonanceAudioScene.createSource();
vca1.connect(resonanceSource.input);


let xPos;
let yPos;
let zPos;
setElementXPosition.addEventListener('input', function () {
    xPos = setElementXPosition.value / 100.0;
    yPos = yPos
    zPos = zPos;
    resonanceSource.setPosition(xPos, yPos, zPos);
})
setElementYPosition.addEventListener('input', function () {
    xPos = xPos;
    yPos = setElementYPosition.value / 100.0;
    zPos = zPos;
    resonanceSource.setPosition(xPos, yPos, zPos);
})

setElementZPosition.addEventListener('input', function () {
    xPos = xPos;
    yPos = yPos;
    zPos = setElementZPosition.value / 100.0;
    resonanceSource.setPosition(xPos, yPos, zPos);
})

resonanceSource.setPosition(-0.707, -0.707, 0);
resonanceAudioScene.output.connect(context.destination);