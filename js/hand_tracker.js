import config from "./config.js";
import { toggleNoteActive } from "./music.js";
import { toggleGridCellActive, toggleMouseOverGriddCell, togglePlay, reset } from './dom_handler.js';
import { isHandOpen } from "./hand_gestures.js";

const videoElement = document.getElementsByClassName('input-video')[0];
const canvasElement = document.getElementsByClassName('output-canvas')[0];
const canvasCtx = canvasElement.getContext('2d');

export function initHandTracking() {
    const hands = new Hands({
        locateFile: (file) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
        }
    });
    hands.setOptions({
        maxNumHands: 1,
        minDetectionConfidence: 0.8,
        minTrackingConfidence: 0.5
    });
    hands.onResults(onResults);

    const camera = new Camera(videoElement, {
        onFrame: async () => {
            await hands.send({ image: videoElement });
        },
        width: 1024,
        height: 800
    });
    camera.start();
}



function onResults(results) {
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    // canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);
    if (results.multiHandLandmarks) { handleHandLandmarks(results); }
    canvasCtx.restore();
}

let lastTimePressed = false;
let lastActionAt = 0;

function handleHandLandmarks(results) {
    const multiHandLandmarks = results.multiHandLandmarks;
    for (const landmarks of multiHandLandmarks) {
        const indexFingerLandmark = [landmarks[8]];
        const indexFingerInsideGrid = isIndexFingerInsideGrid(indexFingerLandmark[0]);
        // DRAW HAND FORM
        drawLandmarks(canvasCtx, indexFingerLandmark, { color: 'blue', lineWidth: 2 });
        drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, { color: '#00FF00', lineWidth: 10 });
        drawLandmarks(canvasCtx, landmarks, { color: '#FF0000', lineWidth: 2 });
        const color = indexFingerInsideGrid ? 'blue' : '#FF0000';
        drawLandmarks(canvasCtx, indexFingerLandmark, { color: color, lineWidth: 2 });

        // TO DO REMOVE HARCODED VALUES BELOW
        if (indexFingerInsideGrid) {
            const gridCellIndex = getCellIndex(indexFingerLandmark[0]);
            const gridCellElement = document.getElementsByClassName('grid-cell')[gridCellIndex];
            if (!lastTimePressed && indexFingerLandmark[0].z < -0.1) {
                lastTimePressed = true;
                toggleNoteActive(gridCellIndex);
                toggleGridCellActive(gridCellElement);
            } else if (indexFingerLandmark[0].z > -0.1) {
                lastTimePressed = false;
                
                // TO DO MOVE TO DOM HANDLER
                Array.from(document.getElementsByClassName('grid-cell')).forEach(function (el, index) {
                    if (index === gridCellIndex) {
                        toggleMouseOverGriddCell(el, true);
                    } else {
                        toggleMouseOverGriddCell(el, false);
                    }
                })
            }
        } else {
            if (Date.now() - lastActionAt > 5000)
            {
                if (isHandOpen(results)) {
                    lastActionAt = Date.now();
                    togglePlay();
                }
            }
        }
    }
}

function getCellIndex(indexFingerLandmark) {
    const gridxMin = getMinXOnCanvas('grid');
    const gridxMax = getMaxXOnCanvas('grid');
    const gridyMin = getMinYOnCanvas('grid');
    const gridyMax = getMaxYOnCanvas('grid');
    const cellWidth = (gridxMax - gridxMin) / config.cellsPerRow;
    const cellHeight = (gridyMax - gridyMin) / config.rowsNumber;
    const x = Math.floor((indexFingerLandmark.x + gridxMin) / cellWidth) - 1;
    const y = Math.floor((indexFingerLandmark.y + gridyMin) / cellHeight) - 1;
    return  x + y * (config.rowsNumber);
}

function isIndexFingerInsideGrid(indexFingerLandmark) {
    const gridxMin = getMinXOnCanvas('grid');
    const gridxMax = getMaxXOnCanvas('grid');
    const gridyMin = getMinYOnCanvas('grid');
    const gridyMax = getMaxYOnCanvas('grid');
    return indexFingerLandmark.x > gridxMin &&
            indexFingerLandmark.x < gridxMax &&
            indexFingerLandmark.y > gridyMin &&
            indexFingerLandmark.y < gridyMax;

}

function getMinXOnCanvas(id) {
    const element = document.getElementById(id).getBoundingClientRect();
    const canvas = document.getElementById('canvas').getBoundingClientRect();
    return (element.x - canvas.x ) / canvas.width;
}

function getMaxXOnCanvas(id) {
    const element = document.getElementById(id).getBoundingClientRect();
    const canvas = document.getElementById('canvas').getBoundingClientRect();
    return (element.x + element.width - canvas.x ) / canvas.width;
}

function getMinYOnCanvas(id) {
    const element = document.getElementById(id).getBoundingClientRect();
    const canvas = document.getElementById('canvas').getBoundingClientRect();
    return (element.y - canvas.y ) / canvas.height;
}

function getMaxYOnCanvas(id) {
    const element = document.getElementById(id).getBoundingClientRect();
    const canvas = document.getElementById('canvas').getBoundingClientRect();
    return (element.y + element.height - canvas.y ) / canvas.height;
}
