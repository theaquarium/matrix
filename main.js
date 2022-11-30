const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');

let drawRainbows = false;
let drawBasisVecs = true;
let drawGridLines = true;
let drawVectorLabels = false;
let animSpeed = 1;
let gridSize = 0;

let vectors = [];
let points = [];
let matrices = [];
let funcs = [];

let zoomFactor = 1;

const MIN_UNITS = 3.5;
const EXTRA_FACTOR = 1;
const ANIM_SPEEDS = [
    {
        speed: 0,
        name: 'Off',
    },
    {
        speed: 120,
        name: 'Fast',
    },
    {
        speed: 1000,
        name: 'Medium',
    },
    {
        speed: 6000,
        name: 'Slow',
    },
];
const GRID_SIZES = [
    {
        size: 5,
        name: 'Small',
    },
    {
        size: 10,
        name: 'Medium',
    },
    {
        size: 25,
        name: 'Large',
    },
];

let pixelWidth = 0;
let pixelHeight = 0;

// how big to draw grid lines
let safetyX = 5;
let safetyY = 5;

// animation
let startMatrix = {
    i: { x: 1, y: 0 },
    j: { x: 0, y: 1 },
};
let startMatrixRT = {
    iRT: { theta: 0, r: 1 },
    jRT: { theta: Math.PI / 2, r: 1 },
};
let liveMatrix = {
    animStart: 0,
    animating: false,
    matrix: {
        i: { x: 1, y: 0 },
        j: { x: 0, y: 1 },
    },
};
let endMatrix = {
    i: { x: 1, y: 0 },
    j: { x: 0, y: 1 },
};
let endMatrixRT = {
    iRT: { theta: 0, r: 1 },
    jRT: { theta: Math.PI / 2, r: 1 },
};

// Setup Canvases
function init() {
    // Set Canvas Sizes
    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    pixelWidth = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    pixelHeight = canvas.offsetHeight * window.devicePixelRatio;

    // calculateSafeties();
}

// function calculateSafeties() {
//     // const transPnt = trans({ x: 1, y: 1 });
//     // // const transformedScale = transPnt.x * transPnt.y;

//     // let transformedScale = 1;

//     // get the small factor
//     let scaleFactor = Math.min(
//         pixelWidth / (2 * MIN_UNITS),
//         pixelHeight / (2 * MIN_UNITS),
//     );
//     const max = Math.max(
//         Math.ceil(pixelWidth / (2 * scaleFactor)),
//         Math.ceil(pixelHeight / (2 * scaleFactor)),
//     );
//     safetyX = max;
//     safetyY = max;
// }

function labelledText(text, coordPoint, font = 25, fontFamily = 'Roboto Mono') {
    const { x, y } = point(coordPoint);

    ctx.textAlign = 'start';
    ctx.textBaseline = 'top';
    ctx.font = `${font}px ${fontFamily}`;
    const textXOffset = 18;
    const textYOffset = 15;
    const labelXPadding = 8;
    const labelYPadding = 5;
    const border = 3;

    const pointText = ctx.measureText(text);

    ctx.fillStyle = '#eeeb';
    ctx.fillRect(
        x + textXOffset - labelXPadding - border,
        y + textYOffset - labelYPadding - border,
        pointText.width + 2 * labelXPadding + 2 * border,
        pointText.actualBoundingBoxDescent + 2 * labelYPadding + 2 * border,
    );

    ctx.fillStyle = '#222b';
    ctx.fillRect(
        x + textXOffset - labelXPadding,
        y + textYOffset - labelYPadding,
        pointText.width + 2 * labelXPadding,
        pointText.actualBoundingBoxDescent + 2 * labelYPadding,
    );
    ctx.fillStyle = '#eee';
    ctx.fillText(text, x + textXOffset, y + textYOffset);
}

function point({ x, y }) {
    let scaleFactor =
        Math.min(pixelWidth / (2 * MIN_UNITS), pixelHeight / (2 * MIN_UNITS)) /
        zoomFactor;

    return {
        x: x * scaleFactor + pixelWidth / 2,
        y: -1 * y * scaleFactor + pixelHeight / 2,
    };
}

function trans({ x, y }) {
    return {
        x: x * liveMatrix.matrix.i.x + y * liveMatrix.matrix.j.x,
        y: x * liveMatrix.matrix.i.y + y * liveMatrix.matrix.j.y,
    };
}

function drawOrientGrid() {
    const orientColor = '#ccc';

    // draw orient axes
    ctx.strokeStyle = orientColor;

    for (
        let x = flippedFloor(-1 * safetyX * zoomFactor);
        x <= flippedFloor(safetyX * zoomFactor);
        x += 1
    ) {
        ctx.beginPath();

        if (x === 0) {
            ctx.lineWidth = 5;
        } else {
            ctx.lineWidth = 2;
        }

        const pnt = point({ x, y: 0 });
        ctx.moveTo(pnt.x, 0);
        ctx.lineTo(pnt.x, pixelHeight);
        ctx.stroke();
    }

    for (
        let y = flippedFloor(-1 * safetyY * zoomFactor);
        y <= flippedFloor(safetyY * zoomFactor);
        y += 1
    ) {
        ctx.beginPath();

        if (y === 0) {
            ctx.lineWidth = 5;
        } else {
            ctx.lineWidth = 2;
        }

        const pnt = point({ x: 0, y });
        ctx.moveTo(0, pnt.y);
        ctx.lineTo(pixelWidth, pnt.y);
        ctx.stroke();
    }
}

function drawTransGrid() {
    const gridsColor = '#797979';

    // draw axes
    ctx.strokeStyle = gridsColor;

    const gridCount = GRID_SIZES[gridSize].size;

    for (
        let x = -1 * EXTRA_FACTOR * gridCount;
        x <= EXTRA_FACTOR * gridCount;
        x += 1
    ) {
        ctx.beginPath();

        if (x === 0) {
            ctx.lineWidth = 5;
        } else {
            ctx.lineWidth = 2;
        }

        const pntStart = point(trans({ x, y: -1 * EXTRA_FACTOR * gridCount }));
        const pntEnd = point(trans({ x, y: EXTRA_FACTOR * gridCount }));
        ctx.moveTo(pntStart.x, pntStart.y);
        ctx.lineTo(pntEnd.x, pntEnd.y);
        ctx.stroke();
    }

    for (
        let y = -1 * EXTRA_FACTOR * gridCount;
        y <= EXTRA_FACTOR * gridCount;
        y += 1
    ) {
        ctx.beginPath();

        if (y === 0) {
            ctx.lineWidth = 5;
        } else {
            ctx.lineWidth = 2;
        }

        const pntStart = point(trans({ x: -1 * EXTRA_FACTOR * gridCount, y }));
        const pntEnd = point(trans({ x: EXTRA_FACTOR * gridCount, y }));
        ctx.moveTo(pntStart.x, pntStart.y);
        ctx.lineTo(pntEnd.x, pntEnd.y);
        ctx.stroke();
    }
}

function drawVector({ x, y }, color) {
    ctx.beginPath();

    ctx.strokeStyle = color;
    ctx.lineWidth = 5;

    // base of equil triangle
    const TRIANGLE_SIZE = 25;
    const theta = Math.atan2(y, x);

    const triangleXOffset =
        -1 * Math.cos(theta) * (Math.sqrt(3) / 2) * TRIANGLE_SIZE;
    const triangleYOffset =
        Math.sin(theta) * (Math.sqrt(3) / 2) * TRIANGLE_SIZE;

    // vector line
    const pntStart = point({ x: 0, y: 0 });
    const pntEnd = point({ x, y });
    ctx.moveTo(pntStart.x, pntStart.y);
    ctx.lineTo(pntEnd.x + triangleXOffset, pntEnd.y + triangleYOffset);
    ctx.stroke();

    // bottom left vertex
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.moveTo(
        pntEnd.x - (Math.sin(theta) * TRIANGLE_SIZE) / 2 + triangleXOffset,
        pntEnd.y - (Math.cos(theta) * TRIANGLE_SIZE) / 2 + triangleYOffset,
    );

    // height of triangle
    const h = TRIANGLE_SIZE * Math.sin(Math.PI / 3);

    // top vertex
    ctx.lineTo(
        pntEnd.x + Math.cos(theta) * h + triangleXOffset,
        pntEnd.y - Math.sin(theta) * h + triangleYOffset,
    );

    // bottom right vertex
    ctx.lineTo(
        pntEnd.x + (Math.sin(theta) * TRIANGLE_SIZE) / 2 + triangleXOffset,
        pntEnd.y + (Math.cos(theta) * TRIANGLE_SIZE) / 2 + triangleYOffset,
    );

    ctx.closePath();
    ctx.fill();
}

function drawPoint({ x, y }, color) {
    const pnt = point({ x, y });
    ctx.beginPath();
    ctx.fillStyle = 'black';
    ctx.arc(pnt.x, pnt.y, 12, 0, Math.PI * 2, false);
    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(pnt.x, pnt.y, 10, 0, Math.PI * 2, false);
    ctx.fill();
}

function drawFunc(funcExp, rainbow, colorPreset) {
    const gridCount = GRID_SIZES[gridSize].size;

    const countX = gridCount * 2 + 1;

    if (rainbow) {
        const intervalSize = 0.25;

        for (let x = -1 * gridCount; x <= gridCount; x += intervalSize) {
            const pointId = x + gridCount;
            const color = colorToString(HSVtoRGB(pointId / countX, 0.75, 1));

            const y = funcExp.evaluate({ x });

            const pnt = point(trans({ x, y }));
            ctx.beginPath();
            ctx.fillStyle = 'black';
            ctx.arc(pnt.x, pnt.y, 8, 0, Math.PI * 2, false);
            ctx.fill();

            ctx.beginPath();
            ctx.fillStyle = color;
            ctx.arc(pnt.x, pnt.y, 6, 0, Math.PI * 2, false);
            ctx.fill();
        }
    } else {
        let y = funcExp.evaluate({ x: -1 * gridCount });

        ctx.beginPath();

        ctx.strokeStyle = colorPreset;
        ctx.lineWidth = 5;

        const pntStart = point(trans({ x: -1 * gridCount, y }));
        ctx.moveTo(pntStart.x, pntStart.y);

        const intervalSize = 0.25;

        for (
            let x = -1 * gridCount + intervalSize;
            x <= gridCount;
            x += intervalSize
        ) {
            y = funcExp.evaluate({ x });

            const pnt = point(trans({ x, y }));
            ctx.lineTo(pnt.x, pnt.y);
        }

        ctx.stroke();
    }
}

function drawRainbowPoints() {
    const gridCount = GRID_SIZES[gridSize].size;

    const countX = (gridCount - 1) * 2 + 1;
    const countY = (gridCount - 1) * 2 + 1;
    const totalPoints = countX * countY;

    for (let y = -1 * gridCount + 1; y < gridCount; y += 1) {
        for (let x = -1 * gridCount + 1; x < gridCount; x += 1) {
            const pointId = (gridCount - 1 - y) * countX + x + gridCount - 1;
            const color = HSVtoRGB(pointId / totalPoints, 0.75, 1);
            drawPoint(trans({ x, y }), colorToString(color));
        }
    }
}

const iX = document.querySelector('#i-x');
const iY = document.querySelector('#i-y');
const jX = document.querySelector('#j-x');
const jY = document.querySelector('#j-y');

function draw(timestamp) {
    requestAnimationFrame(draw);

    const newMatrix = matrixProduct(matrices);
    if (ANIM_SPEEDS[animSpeed].speed === 0) {
        startMatrix = endMatrix;
        endMatrix = newMatrix;
        liveMatrix.matrix = newMatrix;
    } else if (!isSameMatrix(newMatrix, endMatrix)) {
        liveMatrix.animating = true;
        liveMatrix.animStart = 0;
        startMatrix = endMatrix;
        startMatrixRT = matrixToRT(endMatrix);
        endMatrix = newMatrix;
        endMatrixRT = matrixToRT(newMatrix);
        // requestAnimationFrame(draw);
        return;
    }

    if (liveMatrix.animating && timestamp) {
        if (liveMatrix.animStart === 0) {
            liveMatrix.animStart = timestamp;
        }

        // max out at 1
        const t = Math.min(
            (timestamp - liveMatrix.animStart) / ANIM_SPEEDS[animSpeed].speed,
            1,
        );
        liveMatrix.matrix = matrixToXY(
            lerpRTMatrix(startMatrixRT, endMatrixRT, t),
        );
        // liveMatrix.matrix = lerpMatrix(startMatrix, endMatrix, t);

        if (t === 1) {
            liveMatrix.animating = false;
        } else {
            // requestAnimationFrame(draw);
        }
    }

    // Reset Canvas
    ctx.clearRect(0, 0, pixelWidth, pixelHeight);

    drawOrientGrid();
    if (drawGridLines) {
        drawTransGrid();
    }

    iX.innerText = niceRound(liveMatrix.matrix.i.x);
    iY.innerText = niceRound(liveMatrix.matrix.i.y);
    jX.innerText = niceRound(liveMatrix.matrix.j.x);
    jY.innerText = niceRound(liveMatrix.matrix.j.y);

    if (drawBasisVecs) {
        drawVector(liveMatrix.matrix.i, '#ff0000');
        labelledText(
            `î${
                drawVectorLabels
                    ? ` [${niceRound(liveMatrix.matrix.i.x)}, ${niceRound(
                          liveMatrix.matrix.i.y,
                      )}]`
                    : ''
            }`,
            liveMatrix.matrix.i,
        );
        drawVector(liveMatrix.matrix.j, '#0000ff');
        labelledText(
            `ĵ${
                drawVectorLabels
                    ? ` [${niceRound(liveMatrix.matrix.j.x)}, ${niceRound(
                          liveMatrix.matrix.j.y,
                      )}]`
                    : ''
            }`,
            liveMatrix.matrix.j,
        );
    }

    funcs.forEach((func) => {
        if (!func.isActive || func.mathExp === null) return;

        drawFunc(func.mathExp, func.isRainbow, func.color);
        if (drawVectorLabels) {
            const labelPoint = {
                x: 1,
                y: func.mathExp.evaluate({ x: 3 }),
            };

            const transLabelPoint = trans(labelPoint);
            labelledText(func.func, transLabelPoint);
        }
    });

    vectors.forEach((vec) => {
        if (!vec.isActive) return;

        const transVec = trans(vec.vec);
        drawVector(transVec, vec.color);
        if (drawVectorLabels) {
            labelledText(
                `[${niceRound(transVec.x)}, ${niceRound(transVec.y)}]`,
                transVec,
            );
        }
    });

    points.forEach((point) => {
        if (!point.isActive) return;

        const transPnt = trans(point.coord);
        drawPoint(transPnt, point.color);
        if (drawVectorLabels) {
            labelledText(
                `(${niceRound(transPnt.x)}, ${niceRound(transPnt.y)})`,
                transPnt,
            );
        }
    });

    if (drawRainbows) drawRainbowPoints();
}

// Start
window.addEventListener('DOMContentLoaded', () => {
    init();
    draw();

    setTimeout(() => {
        init();
    }, 500);

    setTimeout(() => {
        init();
    }, 1000);

    setTimeout(() => {
        init();
    }, 2000);
});

let throttlePause;
window.addEventListener('resize', () => {
    if (throttlePause) return;
    throttlePause = true;

    setTimeout(() => {
        // Reconfigure canvas
        init();

        // Rerender
        // draw();

        throttlePause = false;
    }, 100);
});
