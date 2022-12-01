document.querySelector('#menu-header').addEventListener('click', (e) => {
    document.querySelector('#menu').classList.toggle('is-closed');
});

document.querySelector('#rainbow').addEventListener('click', (e) => {
    drawRainbows = !drawRainbows;
    e.target.innerText = `${
        drawRainbows ? 'Turn off' : 'Turn on'
    } rainbow points`;
    // draw();
});

document.querySelector('#basisvecs').addEventListener('click', (e) => {
    drawBasisVecs = !drawBasisVecs;
    e.target.innerText = `${drawBasisVecs ? 'Turn off' : 'Turn on'} î and ĵ`;
    // draw();
});

document.querySelector('#grid').addEventListener('click', (e) => {
    drawGridLines = !drawGridLines;
    e.target.innerText = `${drawGridLines ? 'Turn off' : 'Turn on'} grid`;
    // draw();
});

document.querySelector('#veclabels').addEventListener('click', (e) => {
    drawVectorLabels = !drawVectorLabels;
    e.target.innerText = `${
        drawVectorLabels ? 'Turn off' : 'Turn on'
    } object labels`;
    // draw();
});

document.querySelector('#speed').addEventListener('click', (e) => {
    animSpeed = (animSpeed + 1) % ANIM_SPEEDS.length;
    e.target.innerText = `Change animation speed (${ANIM_SPEEDS[animSpeed].name})`;
    // draw();
});

document.querySelector('#size').addEventListener('click', (e) => {
    gridSize = (gridSize + 1) % GRID_SIZES.length;
    e.target.innerText = `Change grid size (${GRID_SIZES[gridSize].name})`;
    // draw();
});

const draggablesContainer = document.querySelector('#draggables-container');

const vectorTemplate = document.querySelector('#vector-card');
const vectorList = document.querySelector('#vectorlist');
const addVector = document.querySelector('#addvector');

let vecIdTracker = 0;

addVector.addEventListener('click', () => {
    const vectorCard = vectorTemplate.content.firstElementChild.cloneNode(true);
    const id = vecIdTracker++;

    vectorCard.dataset.id = id;

    const draggingCursor = document.createElement('div');
    draggingCursor.classList.add('dragging-cursor');
    draggablesContainer.appendChild(draggingCursor);

    vectors.push({
        id,
        isActive: true,
        color: colorToString(randomColor()),
        vec: { x: 1, y: 1 },
        cursor: draggingCursor,
    });
    // draw();

    vectorCard.querySelector('.delete').addEventListener('click', () => {
        vectorCard.remove();
        const index = vectors.findIndex((vec) => vec.id === id);
        if (index > -1) vectors.splice(index, 1);
        // draw();
    });

    const checkbox = vectorCard.querySelector('.enable');

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
        // draw();
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
            // draw();
        }
    };

    cellX.addEventListener('input', readVectorValues);
    cellY.addEventListener('input', readVectorValues);
    makeDraggable(cellX, readVectorValues);
    makeDraggable(cellY, readVectorValues);
    addDblClick(cellX, readVectorValues);
    addDblClick(cellY, readVectorValues);

    // dragging cursor
    addDraggingCursor(
        draggingCursor,
        () => {
            const index = vectors.findIndex((vec) => vec.id === id);
            return vectors[index].vec;
        },
        ({ x, y }) => {
            const index = vectors.findIndex((vec) => vec.id === id);
            vectors[index] = {
                ...vectors[index],
                vec: {
                    x: x,
                    y: y,
                },
            };
        },
        ({ x, y }) => {
            cellX.value = x.toFixed(2);
            cellY.value = y.toFixed(2);
        },
    );

    vectorList.append(vectorCard);
});

const pointTemplate = document.querySelector('#point-card');
const pointList = document.querySelector('#pointlist');
const addPoint = document.querySelector('#addpoint');

let pointIdTracker = 0;

addPoint.addEventListener('click', () => {
    const pointCard = pointTemplate.content.firstElementChild.cloneNode(true);
    const id = pointIdTracker++;

    pointCard.dataset.id = id;

    const draggingCursor = document.createElement('div');
    draggingCursor.classList.add('dragging-cursor');
    draggablesContainer.appendChild(draggingCursor);

    points.push({
        id,
        isActive: true,
        color: colorToString(randomColor()),
        coord: { x: 1, y: 1 },
        cursor: draggingCursor,
    });
    // draw();

    pointCard.querySelector('.delete').addEventListener('click', () => {
        pointCard.remove();
        const index = points.findIndex((pnt) => pnt.id === id);
        if (index > -1) points.splice(index, 1);
        // draw();
    });

    const checkbox = pointCard.querySelector('.enable');

    const index = points.findIndex((pnt) => pnt.id === id);
    checkbox.style.backgroundColor = checkbox.checked
        ? points[index].color
        : null;

    checkbox.addEventListener('change', () => {
        const index = points.findIndex((pnt) => pnt.id === id);
        points[index] = {
            ...points[index],
            isActive: checkbox.checked,
        };
        checkbox.style.backgroundColor = checkbox.checked
            ? points[index].color
            : null;
        // draw();
    });

    const cellX = pointCard.querySelector('.cell.x');
    const cellY = pointCard.querySelector('.cell.y');

    const readPointValues = () => {
        const asNumX = parseFloat(cellX.value);
        const asNumY = parseFloat(cellY.value);
        if (!isNaN(asNumX) && !isNaN(asNumY)) {
            const index = points.findIndex((pnt) => pnt.id === id);
            points[index] = {
                ...points[index],
                coord: {
                    x: asNumX,
                    y: asNumY,
                },
            };
            // draw();
        }
    };

    cellX.addEventListener('input', readPointValues);
    cellY.addEventListener('input', readPointValues);
    makeDraggable(cellX, readPointValues);
    makeDraggable(cellY, readPointValues);
    addDblClick(cellX, readPointValues);
    addDblClick(cellY, readPointValues);

    // dragging cursor
    addDraggingCursor(
        draggingCursor,
        () => {
            const index = points.findIndex((pnt) => pnt.id === id);
            return points[index].coord;
        },
        ({ x, y }) => {
            const index = points.findIndex((pnt) => pnt.id === id);
            points[index] = {
                ...points[index],
                coord: {
                    x: x,
                    y: y,
                },
            };
        },
        ({ x, y }) => {
            cellX.value = x.toFixed(2);
            cellY.value = y.toFixed(2);
        },
    );

    pointList.append(pointCard);
});

const funcTemplate = document.querySelector('#func-card');
const funcList = document.querySelector('#funclist');
const addFunc = document.querySelector('#addfunc');

let funcIdTracker = 0;

addFunc.addEventListener('click', () => {
    const funcCard = funcTemplate.content.firstElementChild.cloneNode(true);
    const id = funcIdTracker++;

    funcCard.dataset.id = id;

    funcs.push({
        id,
        isActive: true,
        color: colorToString(randomColor()),
        isRainbow: false,
        func: '',
        mathExp: null,
    });
    // draw();

    funcCard.querySelector('.delete').addEventListener('click', () => {
        funcCard.remove();
        const index = funcs.findIndex((func) => func.id === id);
        if (index > -1) funcs.splice(index, 1);
        // draw();
    });

    const checkbox = funcCard.querySelector('.enable');

    const index = funcs.findIndex((func) => func.id === id);
    checkbox.style.backgroundColor = checkbox.checked
        ? funcs[index].color
        : null;

    checkbox.addEventListener('change', () => {
        const index = funcs.findIndex((func) => func.id === id);
        funcs[index] = {
            ...funcs[index],
            isActive: checkbox.checked,
        };
        checkbox.style.backgroundColor = checkbox.checked
            ? funcs[index].color
            : null;
        // draw();
    });

    const rainbowCheckbox = funcCard.querySelector('.rainbow-check');

    rainbowCheckbox.addEventListener('change', () => {
        const index = funcs.findIndex((func) => func.id === id);
        funcs[index] = {
            ...funcs[index],
            isRainbow: rainbowCheckbox.checked,
        };
        // draw();
    });

    const funcInput = funcCard.querySelector('.func-eqn');

    funcInput.addEventListener('input', () => {
        try {
            const compiledEquation = math.compile(funcInput.value);
            // test equation
            compiledEquation.evaluate({ x: 0 });

            funcInput.classList.remove('has-error');

            const index = funcs.findIndex((func) => func.id === id);
            funcs[index] = {
                ...funcs[index],
                func: funcInput.value,
                mathExp: compiledEquation,
            };
            // draw();
        } catch (e) {
            funcInput.classList.add('has-error');
            // console.log(e);
            return;
        }
    });

    funcList.append(funcCard);
});

const matrixTemplate = document.querySelector('#matrix-card');
const matrixList = document.querySelector('#matrixlist');
const addMatrix = document.querySelector('#addmatrix');

let matrixIdTracker = 0;

const addMatrixCard = () => {
    const matrixCard = matrixTemplate.content.firstElementChild.cloneNode(true);
    const id = matrixIdTracker++;

    matrixCard.dataset.id = id;

    matrices.push({
        id,
        isActive: true,
        i: { x: 1, y: 0 },
        j: { x: 0, y: 1 },
        // this marks matrices created by dragging basis vectors
        isDragged: false,
    });
    // draw();

    matrixCard.querySelector('.delete').addEventListener('click', () => {
        matrixCard.remove();
        const index = matrices.findIndex((mat) => mat.id === id);
        if (index > -1) matrices.splice(index, 1);
        // draw();
    });

    const checkbox = matrixCard.querySelector('.enable');

    checkbox.addEventListener('change', () => {
        const index = matrices.findIndex((mat) => mat.id === id);
        matrices[index] = {
            ...matrices[index],
            isActive: checkbox.checked,
        };
        checkbox.style.backgroundColor = checkbox.checked
            ? matrices[index].color
            : null;
        // draw();
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
                // once a user modifies it, we have to make a new one for dragging
                isDragged: false,
            };
            // draw();
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

    // returned for dragging basis vectors
    return matrixCard;
};

addMatrix.addEventListener('click', addMatrixCard);

// basis vector dragging
basisDraggingCursorI = document.createElement('div');
basisDraggingCursorI.classList.add('dragging-cursor');
draggablesContainer.appendChild(basisDraggingCursorI);

basisDraggingCursorJ = document.createElement('div');
basisDraggingCursorJ.classList.add('dragging-cursor');
draggablesContainer.appendChild(basisDraggingCursorJ);

let currentDraggingId = null;
let currentDraggingCells = {
    iX: null,
    iY: null,
    jX: null,
    jY: null,
};
addDraggingCursor(
    basisDraggingCursorI,
    () => {
        const index = matrices.findIndex((mat) => mat.id === currentDraggingId);
        if (
            currentDraggingId === null ||
            index < 0 ||
            !matrices[index].isDragged
        ) {
            matrices.forEach((_, index) => {
                matrices[index].isActive = false;
            });

            const matrixCard = addMatrixCard();
            const draggingMatrix = matrices[matrices.length - 1];
            draggingMatrix.isDragged = true;
            currentDraggingId = draggingMatrix.id;
            currentDraggingCells = {
                iX: matrixCard.querySelector('.cell.i-x'),
                iY: matrixCard.querySelector('.cell.i-y'),
                jX: matrixCard.querySelector('.cell.j-x'),
                jY: matrixCard.querySelector('.cell.j-y'),
            };
        }
        return liveMatrix.matrix.i;
    },
    ({ x, y }) => {
        const index = matrices.findIndex((mat) => mat.id === currentDraggingId);
        matrices[index] = {
            ...matrices[index],
            i: {
                x: x,
                y: y,
            },
        };
    },
    ({ x, y }) => {
        currentDraggingCells.iX.value = x.toFixed(2);
        currentDraggingCells.iY.value = y.toFixed(2);
    },
    true,
);

const buttonStrength = 1.2;
document.querySelector('#zoomout').addEventListener('click', () => {
    zoomFactor = Math.min(50, zoomFactor * buttonStrength);
    // init();
    // draw();
});

document.querySelector('#zoomin').addEventListener('click', () => {
    zoomFactor = Math.max(0.3, zoomFactor / buttonStrength);
    // init();
    // if (zoomFactor > 0.1) {
    //     // draw();
    // }
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
        }, 80);
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
draggablesContainer.addEventListener('wheel', (e) => {
    e.preventDefault();

    zoomFactor = Math.min(Math.max(0.3, zoomFactor + e.deltaY * 0.01), 50);

    if (zoomThrottlePause) return;
    zoomThrottlePause = true;

    setTimeout(() => {
        // draw();

        zoomThrottlePause = false;
    }, 10);
});

function addDraggingCursor(
    cursor,
    // getCurrentPoint MUST only be called once on mousedown, it can have side effects
    getCurrentPoint,
    changeCallback,
    // expensive callback is throttled (use for changing DOM, etc)
    expensiveChangeCallback,
    // useRawPoints disables translating (used for basis vectors)
    useRawPoints,
) {
    let startingPoint = { x: 0, y: 0 };
    let mouseStartPosition = {
        x: 0,
        y: 0,
    };
    let scaleFactor = 1;

    function mousedown(e) {
        startingPoint = useRawPoints
            ? getCurrentPoint()
            : trans(getCurrentPoint());
        mouseStartPosition = {
            x: e.pageX,
            y: e.pageY,
        };
        scaleFactor = getScaleFactor() / window.devicePixelRatio;

        cursor.classList.add('is-dragging');

        // add listeners for mousemove, mouseup
        window.addEventListener('mousemove', mousemove);
        window.addEventListener('mouseup', mouseup);
    }

    let throttlePause;
    function mousemove(e) {
        const diffX = (mouseStartPosition.x - e.pageX) / scaleFactor;
        const diffY = (mouseStartPosition.y - e.pageY) / scaleFactor;
        const newPoint = {
            x: startingPoint.x - diffX,
            y: startingPoint.y + diffY,
        };

        const unTrans = useRawPoints ? newPoint : inverseTrans(newPoint);

        changeCallback(unTrans);

        if (throttlePause) return;
        throttlePause = true;

        setTimeout(() => {
            expensiveChangeCallback(unTrans);

            throttlePause = false;
        }, 100);
    }

    function mouseup() {
        // add listeners for mousemove, mouseup
        cursor.classList.remove('is-dragging');
        window.removeEventListener('mousemove', mousemove);
        window.removeEventListener('mouseup', mouseup);
    }

    cursor.addEventListener('mousedown', mousedown);
}
