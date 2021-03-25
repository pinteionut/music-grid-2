import config from './config.js';
import {
    toggleNoteActive,
    pausePlaying,
    startPlaying,
    resetRows,
    updateCurrentRow,
    changeScale
} from './music.js';

export function initDom() {
    drawGrid();
    addEventListeners();
}

function drawGrid() {
    const gridElement = document.getElementById('grid');
    for(let i = 0; i < config.rowsNumber; i++) {
        const rowElement = document.createElement('div');
        rowElement.classList.add('grid-row');
        for(let j = 0; j < config.cellsPerRow; j++) {
        const cellElement = document.createElement('div');
        cellElement.classList.add('grid-cell');
        rowElement.appendChild(cellElement);
        }
        gridElement.appendChild(rowElement);
    }
};

function addEventListeners() {
    addGridCellEventListeners();
    addButtonsEventListeners();
}

function addGridCellEventListeners() {
    Array.from(document.getElementsByClassName('grid-cell')).forEach(function(gridCell, index) {
            gridCell.addEventListener('mouseenter', mouseEnterGridCell);
            gridCell.addEventListener('mouseleave', mouseLeaveGridCell);
            gridCell.addEventListener('click', clickGridCell);
            gridCell.addEventListener('click', function() {
            toggleNoteActive(index);
        });
    });
}

function mouseEnterGridCell(e) {
    toggleMouseOverGriddCell(e.target, true);
  }
  
function mouseLeaveGridCell(e) {
    toggleMouseOverGriddCell(e.target, false);
}

export function toggleMouseOverGriddCell(element, value) {
    if (value) {
        element.classList.add('grid-cell-mouse-over');
    } else {
        element.classList.remove('grid-cell-mouse-over');
    }
}

function clickGridCell(e) {
    toggleGridCellActive(e.target);
}

export function toggleGridCellActive(element) {
    if (element.classList.contains('grid-cell-active')) {
      element.classList.remove('grid-cell-active');
    } else {
      element.classList.add('grid-cell-active');
    }
}

function addButtonsEventListeners() {
    document.getElementById('toggle-play-btn').addEventListener('click', togglePlay);
    document.getElementById('stop-btn').addEventListener('click', stopPlaying);
    document.getElementById('reset-btn').addEventListener('click', reset);
    document.getElementById('scales').addEventListener('change', changeScale);
}

export function togglePlay() {
    if (config.isPlaying) {
        document.getElementById('toggle-play-btn').innerHTML = 'Play';
        pausePlaying();
    } else {
        document.getElementById('toggle-play-btn').innerHTML = 'Pause';
        startPlaying();
    }
}

function stopPlaying() {
    document.getElementById('toggle-play-btn').innerHTML = 'Play';
    pausePlaying();
    updateCurrentRow(0);
}
  
export function reset() {
    resetRows();
    Array.from(document.getElementsByClassName('grid-cell')).forEach(function(gridCell) {
        gridCell.classList.remove('grid-cell-active');
    });
}

export function startPlayingAnimation() {
    const gridRow = Array.from(document.getElementsByClassName('grid-row'))[config.currentRow];
    gridRow.classList.add('is-playing');
    gridRow.classList.remove('has-played');
    setTimeout(function() {
        gridRow.classList.remove('is-playing');
        gridRow.classList.add('has-played');
    }, 500);
}
