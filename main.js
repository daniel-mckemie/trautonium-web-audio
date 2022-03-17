const context = new AudioContext({
    sampleRate: 48000,
    channelCount: 2
});

// DOM points
const primaryOscillator = document.getElementById('primary-oscillator');
const sideOscillator = document.getElementById('side-oscillator');
const subHarmButton = document.getElementById('subharmonic-divider');

const formant1 = document.getElementById('formant-1');
const formant2 = document.getElementById('formant-2');
const formant3 = document.getElementById('formant-3');
const formant4 = document.getElementById('formant-4');

const formantMix1 = document.getElementById('formant-mix-1');
const formantMix2 = document.getElementById('formant-mix-2');
const formantMix3 = document.getElementById('formant-mix-3');
const formantMix4 = document.getElementById('formant-mix-4');



let primaryOsc = context.createOscillator();
primaryOsc.type = 'square';
// Add octave switch
primaryOsc.start();


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

// Modularize these next
primaryOscillator.addEventListener('input', function () {
    primaryOsc.frequency.value = primaryOscillator.value;
    subHarmonicGen1.frequency.value = primaryOscillator.value;
    subHarmonicGen2.frequency.value = primaryOscillator.value;
    subHarmonicGen3.frequency.value = primaryOscillator.value;
    subHarmonicGen4.frequency.value = primaryOscillator.value;

})

sideOscillator.addEventListener('input', function () {
    sideOsc.frequency.value = sideOscillator.value;
})

subHarmButton.addEventListener('mousedown', function () {
    subHarmonicGen1.frequency.value /= 2;
    subHarmonicGen2.frequency.value /= 9;
    subHarmonicGen3.frequency.value /= 11;
    subHarmonicGen4.frequency.value /= 14;
})

subHarmButton.addEventListener('mouseup', function () {
    subHarmonicGen1.frequency.value *= 2;
    subHarmonicGen2.frequency.value *= 9;
    subHarmonicGen3.frequency.value *= 11;
    subHarmonicGen4.frequency.value *= 14;
})

formant1.addEventListener('input', function () {
    formantFilter1.frequency.value = formant1.value;
})
formant2.addEventListener('input', function () {
    formantFilter2.frequency.value = formant2.value;
})
formant3.addEventListener('input', function () {
    formantFilter3.frequency.value = formant3.value;
})
formant4.addEventListener('input', function () {
    formantFilter4.frequency.value = formant4.value;
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

subHarmonicGen1.connect(subHarmGain1).connect(mixerCh1);
subHarmonicGen2.connect(subHarmGain2).connect(mixerCh1);
subHarmonicGen3.connect(subHarmGain3).connect(mixerCh1);
subHarmonicGen4.connect(subHarmGain4).connect(mixerCh1);
// primaryOsc.connect(mixerCh2)
sideOsc.connect(mixerCh3)
// noiseSource.connect(mixerCh4)

mixerCh1.connect(formantFilter1);
mixerCh2.connect(formantFilter1);
mixerCh3.connect(formantFilter1);
// mixerCh4.connect(formantFilter1);

formantFilter1.connect(formantMixer1).connect(vca1);
formantFilter2.connect(formantMixer2).connect(vca1);
formantFilter3.connect(formantMixer3).connect(vca1);
formantFilter4.connect(formantMixer4).connect(vca1);


vca1.connect(context.destination);