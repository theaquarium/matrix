/* accepts parameters
 * h  Object = {h:x, s:y, v:z}
 * OR
 * h, s, v
 */
function HSVtoRGB(h, s, v) {
    var r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
        (s = h.s), (v = h.v), (h = h.h);
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0:
            (r = v), (g = t), (b = p);
            break;
        case 1:
            (r = q), (g = v), (b = p);
            break;
        case 2:
            (r = p), (g = v), (b = t);
            break;
        case 3:
            (r = p), (g = q), (b = v);
            break;
        case 4:
            (r = t), (g = p), (b = v);
            break;
        case 5:
            (r = v), (g = p), (b = q);
            break;
    }
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255),
    };
}

function randomColor() {
    return HSVtoRGB(Math.random(), 0.75, 0.85);
}

function colorToString({ r, g, b }) {
    return `rgb(${r}, ${g}, ${b})`;
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

function matrixProduct(matrices) {
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
