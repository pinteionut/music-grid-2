export const thumbFinger = (results) => {
    if (!(results && results.multiHandLandmarks)) return;
    let thumbIsOpen = false;
    const lH = results?.multiHandLandmarks[0] || [];
    if (lH.length > 2) {
        let pseudoFixKeyPoint = results?.multiHandLandmarks[0][2].x;
        if (
            results?.multiHandLandmarks[0][3].x < pseudoFixKeyPoint &&
            results?.multiHandLandmarks[0][4].x < pseudoFixKeyPoint
        ) {
            thumbIsOpen = true;
        }

        return thumbIsOpen;
    }
};

export const firstFinger = (results) => {
    if (!(results && results.multiHandLandmarks)) return;
    let firstFingerIsOpen = false;
    const lH = results?.multiHandLandmarks[0] || [];
    if (lH.length > 2) {
        let pseudoFixKeyPoint = results?.multiHandLandmarks[0][6].y;
        if (
            results?.multiHandLandmarks[0][7].y < pseudoFixKeyPoint &&
            results?.multiHandLandmarks[0][8].y < pseudoFixKeyPoint
        ) {
            firstFingerIsOpen = true;
        }

        return firstFingerIsOpen;
    }
};

export const secondFinger = (results) => {
    if (!(results && results.multiHandLandmarks)) return;
    let secondFingerIsOpen = false;
    const lH = results?.multiHandLandmarks[0] || [];
    if (lH.length > 2) {
        let pseudoFixKeyPoint = results?.multiHandLandmarks[0][10].y;
        if (
            results?.multiHandLandmarks[0][11].y < pseudoFixKeyPoint &&
            results?.multiHandLandmarks[0][12].y < pseudoFixKeyPoint
        ) {
            secondFingerIsOpen = true;
        }
        return secondFingerIsOpen;
    }
};

export const thirdFinger = (results) => {
    if (!(results && results.multiHandLandmarks)) return;
    let thirdFingerIsOpen = false;
    const lH = results?.multiHandLandmarks[0] || [];
    if (lH.length > 2) {
        let pseudoFixKeyPoint = results?.multiHandLandmarks[0][14].y;
        if (
            results?.multiHandLandmarks[0][15].y < pseudoFixKeyPoint &&
            results?.multiHandLandmarks[0][16].y < pseudoFixKeyPoint
        ) {
            thirdFingerIsOpen = true;
        }
        return thirdFingerIsOpen;
    }
};
export const fourthFinger = (results) => {
    if (!(results && results.multiHandLandmarks)) return;
    let fourthFingerIsOpen = false;
    const lH = results?.multiHandLandmarks[0] || [];
    if (lH.length > 2) {
        let pseudoFixKeyPoint = results?.multiHandLandmarks[0][18].y;
        if (
            results?.multiHandLandmarks[0][19].y < pseudoFixKeyPoint &&
            results?.multiHandLandmarks[0][20].y < pseudoFixKeyPoint
        ) {
            fourthFingerIsOpen = true;
        }
        return fourthFingerIsOpen;
    }
};

export const isHandOpen = (results) => {
    if (
        thumbFinger(results) &&
        firstFinger(results) &&
        secondFinger(results) &&
        thirdFinger(results) &&
        fourthFinger(results)
    ) {
        return true;
    }
    return false;
};

export const isLike = (results) => {
    return thumbFinger(results);
}

export const isPeace = (results) => {
    return firstFinger(results) && secondFinger(results);
}
