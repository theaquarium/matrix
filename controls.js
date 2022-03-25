document.querySelector('#rainbow').addEventListener('click', (e) => {
    drawRainbows = !drawRainbows;
    e.target.innerText = `${
        drawRainbows ? 'Turn off' : 'Turn on'
    } rainbow points`;
    draw();
});

document.querySelector('#basisvecs').addEventListener('click', (e) => {
    drawBasisVecs = !drawBasisVecs;
    e.target.innerText = `${drawBasisVecs ? 'Turn off' : 'Turn on'} î and ĵ`;
    draw();
});

document.querySelector('#grid').addEventListener('click', (e) => {
    drawGridLines = !drawGridLines;
    e.target.innerText = `${drawGridLines ? 'Turn off' : 'Turn on'} grid`;
    draw();
});

document.querySelector('#veclabels').addEventListener('click', (e) => {
    drawVectorLabels = !drawVectorLabels;
    e.target.innerText = `${
        drawVectorLabels ? 'Turn off' : 'Turn on'
    } vector labels`;
    draw();
});

document.querySelector('#speed').addEventListener('click', (e) => {
    animSpeed = (animSpeed + 1) % ANIM_SPEEDS.length;
    e.target.innerText = `Change animation speed (${ANIM_SPEEDS[animSpeed].name})`;
    draw();
});

const vectorTemplate = document.querySelector('#vector-card');
const vectorList = document.querySelector('#vectorlist');
const addVector = document.querySelector('#addvector');

let vecIdTracker = 0;

addVector.addEventListener('click', () => {
    const vectorCard = vectorTemplate.content.firstElementChild.cloneNode(true);
    const id = vecIdTracker++;

    vectorCard.dataset.id = id;

    vectors.push({
        id,
        isActive: true,
        color: colorToString(randomColor()),
        vec: { x: 1, y: 1 },
    });
    draw();

    vectorCard.querySelector('.delete').addEventListener('click', () => {
        vectorCard.remove();
        const index = vectors.findIndex((vec) => vec.id === id);
        if (index > -1) vectors.splice(index, 1);
        draw();
    });

    const checkbox = vectorCard.querySelector('.enable');
    // it's allowed here because we just added it
    const index = vectors.findIndex((vec) => vec.id === id);
    checkbox.style.backgroundColor = checkbox.checked
        ? vectors[index].color
        : null;

    checkbox.addEventListener('change', () => {
        const index = vectors.findIndex((vec) => vec.id === id);
        vectors[index] = {
            ...vectors[index],
            isActive: checkbox.checked,
        };
        checkbox.style.backgroundColor = checkbox.checked
            ? vectors[index].color
            : null;
        draw();
    });

    const cellX = vectorCard.querySelector('.cell.x');
    const cellY = vectorCard.querySelector('.cell.y');

    const readVectorValues = () => {
        const asNumX = parseFloat(cellX.value);
        const asNumY = parseFloat(cellY.value);
        if (!isNaN(asNumX) && !isNaN(asNumY)) {
            const index = vectors.findIndex((vec) => vec.id === id);
            vectors[index] = {
                ...vectors[index],
                vec: {
                    x: asNumX,
                    y: asNumY,
                },
            };
            draw();
        }
    };

    cellX.addEventListener('input', readVectorValues);
    cellY.addEventListener('input', readVectorValues);
    makeDraggable(cellX, readVectorValues);
    makeDraggable(cellY, readVectorValues);
    addDblClick(cellX, readVectorValues);
    addDblClick(cellY, readVectorValues);

    vectorList.append(vectorCard);
});

const matrixTemplate = document.querySelector('#matrix-card');
const matrixList = document.querySelector('#matrixlist');
const addMatrix = document.querySelector('#addmatrix');

let matrixIdTracker = 0;

addMatrix.addEventListener('click', () => {
    const matrixCard = matrixTemplate.content.firstElementChild.cloneNode(true);
    const id = matrixIdTracker++;

    matrixCard.dataset.id = id;

    matrices.push({
        id,
        isActive: true,
        i: { x: 1, y: 0 },
        j: { x: 0, y: 1 },
    });
    draw();

    matrixCard.querySelector('.delete').addEventListener('click', () => {
        matrixCard.remove();
        const index = matrices.findIndex((mat) => mat.id === id);
        if (index > -1) matrices.splice(index, 1);
        draw();
    });

    const checkbox = matrixCard.querySelector('.enable');
    // it's allowed here because we just added it
    const index = matrices.findIndex((mat) => mat.id === id);
    checkbox.style.backgroundColor = checkbox.checked
        ? matrices[index].color
        : null;

    checkbox.addEventListener('change', () => {
        const index = matrices.findIndex((mat) => mat.id === id);
        matrices[index] = {
            ...matrices[index],
            isActive: checkbox.checked,
        };
        checkbox.style.backgroundColor = checkbox.checked
            ? matrices[index].color
            : null;
        draw();
    });

    const iX = matrixCard.querySelector('.cell.i-x');
    const iY = matrixCard.querySelector('.cell.i-y');
    const jX = matrixCard.querySelector('.cell.j-x');
    const jY = matrixCard.querySelector('.cell.j-y');

    const readMatrixValues = () => {
        const asNumIX = parseFloat(iX.value);
        const asNumIY = parseFloat(iY.value);
        const asNumJX = parseFloat(jX.value);
        const asNumJY = parseFloat(jY.value);
        if (
            !isNaN(asNumIX) &&
            !isNaN(asNumIY) &&
            !isNaN(asNumJX) &&
            !isNaN(asNumJY)
        ) {
            const index = matrices.findIndex((mat) => mat.id === id);
            matrices[index] = {
                ...matrices[index],
                i: { x: asNumIX, y: asNumIY },
                j: { x: asNumJX, y: asNumJY },
            };
            draw();
        }
    };

    iX.addEventListener('input', readMatrixValues);
    iY.addEventListener('input', readMatrixValues);
    jX.addEventListener('input', readMatrixValues);
    jY.addEventListener('input', readMatrixValues);
    makeDraggable(iX, readMatrixValues, matrixCard);
    makeDraggable(iY, readMatrixValues, matrixCard);
    makeDraggable(jX, readMatrixValues, matrixCard);
    makeDraggable(jY, readMatrixValues, matrixCard);
    addDblClick(iX, readMatrixValues);
    addDblClick(iY, readMatrixValues);
    addDblClick(jX, readMatrixValues);
    addDblClick(jY, readMatrixValues);

    matrixList.append(matrixCard);
});

const buttonStrength = 1.2;
document.querySelector('#zoomout').addEventListener('click', () => {
    zoomFactor *= buttonStrength;
    init();
    draw();
});

document.querySelector('#zoomin').addEventListener('click', () => {
    if (zoomFactor > 0.1) {
        zoomFactor /= buttonStrength;
        init();
        draw();
    }
});

const addDblClick = (input, callback) => {
    const defaultValue = input.value;

    input.addEventListener('dblclick', () => {
        input.value = defaultValue;
        callback();
    });
};

const makeDraggable = (input, callback, elToStopDrag) => {
    const mouseNumStartPosition = {};
    let numStart;

    function mousedownNum(e) {
        mouseNumStartPosition.y = e.pageY;
        numStart = parseFloat(input.value);
        numStart = isNaN(numStart) ? 0 : numStart;

        input.classList.add('is-dragging');
        if (elToStopDrag) elToStopDrag.draggable = false;

        // add listeners for mousemove, mouseup
        window.addEventListener('mousemove', mousemoveNum);
        window.addEventListener('mouseup', mouseupNum);
    }

    let throttlePause;
    function mousemoveNum(e) {
        const diff = (mouseNumStartPosition.y - e.pageY) / 20;
        const newLeft = numStart + diff;
        input.value = newLeft;

        if (throttlePause) return;
        throttlePause = true;

        setTimeout(() => {
            callback();

            throttlePause = false;
        }, 50);
    }

    function mouseupNum(e) {
        input.classList.remove('is-dragging');
        if (elToStopDrag) elToStopDrag.draggable = true;
        window.removeEventListener('mousemove', mousemoveNum);
        window.removeEventListener('mouseup', mouseupNum);
    }

    input.addEventListener('mousedown', mousedownNum);
};

let zoomThrottlePause;
canvas.addEventListener('wheel', (e) => {
    e.preventDefault();

    zoomFactor = Math.max(0.1, zoomFactor + e.deltaY * 0.01);

    if (zoomThrottlePause) return;
    zoomThrottlePause = true;

    setTimeout(() => {
        draw();

        zoomThrottlePause = false;
    }, 80);
});
