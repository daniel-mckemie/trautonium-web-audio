const context = new AudioContext({
    sampleRate: 48000,
    channelCount: 2
});

// DOM points
const mainOscillator = document.getElementById('main-oscillator');
const sideOscillator = document.getElementById('side-oscillator');
const subHarmButton = document.getElementById('subharmonic-divider');

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

const formantMix1 = document.getElementById('formant-mix-1');
const formantMix2 = document.getElementById('formant-mix-2');
const formantMix3 = document.getElementById('formant-mix-3');
const formantMix4 = document.getElementById('formant-mix-4');



let mainOsc = context.createOscillator();
mainOsc.type = 'square';
// Add octave switch
mainOsc.start();


let subHarmonicGen1 = context.createOscillator();
subHarmonicGen1.type = 'sawtooth';
let subHarmonicGen2 = context.createOscillator();
subHarmonicGen2.type = 'sawtooth';
let subHarmonicGen3 = context.createOscillator();
subHarmonicGen3.type = 'sawtooth';
let subHarmonicGen4 = context.createOscillator();
subHarmonicGen4.type = 'sawtooth';
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
// sideOsc.start();

// Create Noise Generator
let noiseGen;

let mixerCh1 = context.createGain();
let mixerCh2 = context.createGain();
let mixerCh3 = context.createGain();
let mixerCh4 = context.createGain();

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

// Modularize these next
mainOscillator.addEventListener('input', function () {
    mainOsc.frequency.value = logSlider((mainOscillator.value), 20, 5000);
    subHarmonicGen1.frequency.value = logSlider((mainOscillator.value), 20, 5000);
    subHarmonicGen2.frequency.value = logSlider((mainOscillator.value), 20, 5000);
    subHarmonicGen3.frequency.value = logSlider((mainOscillator.value), 20, 5000);
    subHarmonicGen4.frequency.value = logSlider((mainOscillator.value), 20, 5000);

})

sideOscillator.addEventListener('input', function () {
    sideOsc.frequency.value = logSlider((sideOscillator.value), 20, 10000);
})

let fired = false;

window.addEventListener('keydown', function () {
    if (fired == false) {
        fired = true;
        subHarmonicGen1.frequency.value /= 2;
        subHarmonicGen2.frequency.value /= 9;
        subHarmonicGen3.frequency.value /= 11;
        subHarmonicGen4.frequency.value /= 14;
    }

})

window.addEventListener('keyup', function () {
    fired = false;
    subHarmonicGen1.frequency.value *= 2;
    subHarmonicGen2.frequency.value *= 9;
    subHarmonicGen3.frequency.value *= 11;
    subHarmonicGen4.frequency.value *= 14;
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

formantMix1.addEventListener('input', function () {
    formantMixer1.gain.value = formantMix1.value;
})
formantMix2.addEventListener('input', function () {
    formantMixer2.gain.value = formantMix2.value;
})
formantMix3.addEventListener('input', function () {
    formantMixer3.gain.value = formantMix3.value;
})
formantMix4.addEventListener('input', function () {
    formantMixer4.gain.value = formantMix4.value;
})





subHarmonicGen1.connect(subHarmGain1).connect(mixerCh1).connect(mixerOutput);
subHarmonicGen2.connect(subHarmGain2).connect(mixerCh1).connect(mixerOutput);
subHarmonicGen3.connect(subHarmGain3).connect(mixerCh1).connect(mixerOutput);
subHarmonicGen4.connect(subHarmGain4).connect(mixerCh1).connect(mixerOutput);
// mainOsc.connect(mixerCh2).connect(mixerOutput);
sideOsc.connect(mixerCh3).connect(mixerOutput);
// noiseSource.connect(mixerCh4);


mixerOutput.connect(formantFilter1);
mixerOutput.connect(formantFilter2);
mixerOutput.connect(formantFilter3);
mixerOutput.connect(formantFilter4);

formantFilter1.connect(formantMixer1).connect(vca1);
formantFilter2.connect(formantMixer2).connect(vca1);
formantFilter3.connect(formantMixer3).connect(vca1);
formantFilter4.connect(formantMixer4).connect(vca1);


vca1.connect(context.destination);