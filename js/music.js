import config from './config.js';
import { startPlayingAnimation } from './dom_handler.js';

let synth;
let destinationStream;
let scales = {
  classic: [
    'B3', 'C#4', 'F#4', 'G#4',
    'C#5', 'D#5', 'E5', 'G#5',
    'B5', 'C#6', 'F#6', 'G#6'
    ],
    pentatonic: [
      'C4', 'D4', 'E4', 'G4',
      'A4', 'C5', 'D5', 'E5',
      'G5', 'A5', 'C6', 'D6',
    ],
    chromatic: [
      'C5', 'C#5', 'D5', 'Eb5',
      'E5', 'F5', 'F#5', 'G5',
      'G#5','A5', 'Bb5', 'B5',
    ],
    major: [
      'C4', 'D4', 'E4', 'F4',
      'G4', 'A4', 'B4', 'C5',
      'D5', 'E5', 'F5', 'G5',
    ],
    harmonic_minor: [
      'A4', 'B4', 'C5', 'D5',
      'E5', 'F5', 'G#5', 'A5',
      'B5', 'C6', 'D6', 'E6',
    ],
};

export const initAudio = async () => {
  destinationStream  = Tone.context.createMediaStreamDestination();
  synth = new Tone.PolySynth().toDestination();
  synth.set({ oscillator: { type: 'triangle' }});
  synth.connect(destinationStream);
  synth.set({ 'detune': -1200 });
  await Tone.start();
  await Tone.context.resume();
  console.log('audio is ready');
}

export const playRow = async (row) => {
  let currentScale = scales[config.scale];
  if(!synth) {
    await initAudio();
  }
  let notesToPlay = []
  for (let i = row.length - 1; i >= 0; i--) {
    if(row[i]) {
      notesToPlay.push(currentScale[i]);
    }
  }
  synth.triggerAttackRelease(notesToPlay, '16n');
}

export function toggleNoteActive(index) {
  const row = Math.floor(index / config.cellsPerRow);
  const col = Math.floor(index % config.cellsPerRow);
  const rows = config.rows
  if (!rows[row]) {
    rows[row] = [];
  }
  if (rows[row][col]) {
    delete rows[row][col];
  } else {
    rows[row][col] = true;
  }
}

export function pausePlaying() {
  config.isPlaying = false;
  clearInterval(config.playingInterval);
}

export function startPlaying() {
  config.isPlaying = true;
  config.playingInterval = setInterval(playLoop, 500);
}

export function resetRows() {
  config.rows = [];
}

export function updateCurrentRow(newValue) {
  config.currentRow = newValue;
}

export function changeScale(e) {
  config.scale = e.target.value;
}

function playLoop() {
  startPlayingAnimation();
  if (config.rows[config.currentRow]) {
    playRow(config.rows[config.currentRow]);
  }
  updateCurrentRow(config.currentRow + 1);
  if (config.currentRow >= config.rowsNumber) {
    updateCurrentRow(0);
  }
}
