const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');

let drawRainbows = false;
let drawBasisVecs = true;
let drawGridLines = true;
let drawVectorLabels = false;
let animSpeed = 1;

let vectors = [];

let matrices = [];

let zoomFactor = 1;

const MIN_UNITS = 3.5;
const EXTRA_FACTOR = 1;
const ANIM_SPEEDS = [
    {
        speed: 0,
        name: 'None',
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

function niceRound(n) {
    return Math.round((n + Number.EPSILON) * 100) / 100;
}

function flippedFloor(n) {
    return (
        Math.max(Math.abs(Math.floor(n)), Math.abs(Math.ceil(n))) *
        (n < 0 ? -1 : 1)
    );
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

    for (
        let x = -1 * EXTRA_FACTOR * safetyX;
        x <= EXTRA_FACTOR * safetyX;
        x += 1
    ) {
        ctx.beginPath();

        if (x === 0) {
            ctx.lineWidth = 5;
        } else {
            ctx.lineWidth = 2;
        }

        const pntStart = point(trans({ x, y: -1 * EXTRA_FACTOR * safetyY }));
        const pntEnd = point(trans({ x, y: EXTRA_FACTOR * safetyY }));
        ctx.moveTo(pntStart.x, pntStart.y);
        ctx.lineTo(pntEnd.x, pntEnd.y);
        ctx.stroke();
    }

    for (
        let y = -1 * EXTRA_FACTOR * safetyY;
        y <= EXTRA_FACTOR * safetyY;
        y += 1
    ) {
        ctx.beginPath();

        if (y === 0) {
            ctx.lineWidth = 5;
        } else {
            ctx.lineWidth = 2;
        }

        const pntStart = point(trans({ x: -1 * EXTRA_FACTOR * safetyX, y }));
        const pntEnd = point(trans({ x: EXTRA_FACTOR * safetyX, y }));
        ctx.moveTo(pntStart.x, pntStart.y);
        ctx.lineTo(pntEnd.x, pntEnd.y);
        ctx.stroke();
    }
}

function drawVector({ x, y }, color) {
    ctx.beginPath();

    ctx.strokeStyle = color;
    ctx.lineWidth = 5;

    const pntStart = point({ x: 0, y: 0 });
    const pntEnd = point({ x, y });
    ctx.moveTo(pntStart.x, pntStart.y);
    ctx.lineTo(pntEnd.x, pntEnd.y);
    ctx.stroke();

    // base of equil triangle
    const TRIANGLE_SIZE = 25;
    const theta = Math.atan2(y, x);

    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.moveTo(
        pntEnd.x - (Math.sin(theta) * TRIANGLE_SIZE) / 2,
        pntEnd.y - (Math.cos(theta) * TRIANGLE_SIZE) / 2,
    );

    // height of triangle
    const h = TRIANGLE_SIZE * Math.sin(Math.PI / 3);
    ctx.lineTo(pntEnd.x + Math.cos(theta) * h, pntEnd.y - Math.sin(theta) * h);
    ctx.lineTo(
        pntEnd.x + (Math.sin(theta) * TRIANGLE_SIZE) / 2,
        pntEnd.y + (Math.cos(theta) * TRIANGLE_SIZE) / 2,
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

function drawRainbowPoints() {
    const countX = (safetyX - 1) * 2 + 1;
    const countY = (safetyY - 1) * 2 + 1;
    const totalPoints = countX * countY;

    for (let y = -1 * safetyY + 1; y < safetyY; y += 1) {
        for (let x = -1 * safetyX + 1; x < safetyX; x += 1) {
            const pointId = (safetyY - 1 - y) * countX + x + safetyX - 1;
            const color = HSVtoRGB(pointId / totalPoints, 0.75, 1);
            drawPoint(trans({ x, y }), colorToString(color));
        }
    }
}

function matrixProduct() {
    let result = { i: { x: 1, y: 0 }, j: { x: 0, y: 1 } };

    matrices.forEach((matrix) => {
        if (!matrix.isActive) return;

        const oldIX = result.i.x;
        const oldIY = result.i.y;
        const oldJX = result.j.x;
        const oldJY = result.j.y;
        result.i.x = oldIX * matrix.i.x + oldJX * matrix.i.y;
        result.i.y = oldIY * matrix.i.x + oldJY * matrix.i.y;

        result.j.x = oldIX * matrix.j.x + oldJX * matrix.j.y;
        result.j.y = oldIY * matrix.j.x + oldJY * matrix.j.y;
    });

    return result;
}

function isSameMatrix(a, b) {
    return (
        a.i.x === b.i.x && a.i.y === b.i.y && a.j.x === b.j.x && a.j.y === b.j.y
    );
}

function lerpNum(a, b, t) {
    const diff = b - a;
    return a + diff * t;
}

function lerpMatrix(a, b, t) {
    return {
        i: { x: lerpNum(a.i.x, b.i.x, t), y: lerpNum(a.i.y, b.i.y, t) },
        j: { x: lerpNum(a.j.x, b.j.x, t), y: lerpNum(a.j.y, b.j.y, t) },
    };
}

const iX = document.querySelector('#i-x');
const iY = document.querySelector('#i-y');
const jX = document.querySelector('#j-x');
const jY = document.querySelector('#j-y');

function draw(timestamp) {
    const newMatrix = matrixProduct();
    if (ANIM_SPEEDS[animSpeed].speed === 0) {
        startMatrix = endMatrix;
        endMatrix = newMatrix;
        liveMatrix.matrix = newMatrix;
    } else if (!isSameMatrix(newMatrix, endMatrix)) {
        liveMatrix.animating = true;
        liveMatrix.animStart = 0;
        startMatrix = endMatrix;
        endMatrix = newMatrix;
        requestAnimationFrame(draw);
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
        liveMatrix.matrix = lerpMatrix(startMatrix, endMatrix, t);

        if (t === 1) {
            liveMatrix.animating = false;
        } else {
            requestAnimationFrame(draw);
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

    vectors.forEach((vec) => {
        if (!vec.isActive) return;

        drawVector(trans(vec.vec), vec.color);
        if (drawVectorLabels) {
            const transVec = trans(vec.vec);
            labelledText(
                `[${niceRound(transVec.x)}, ${niceRound(transVec.y)}]`,
                transVec,
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
        draw();
    }, 500);
});

let throttlePause;
window.addEventListener('resize', () => {
    if (throttlePause) return;
    throttlePause = true;

    setTimeout(() => {
        // Reconfigure canvas
        init();

        // Rerender
        draw();

        throttlePause = false;
    }, 100);
});
