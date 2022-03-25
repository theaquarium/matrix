const sorter = Sortable.create(matrixList, {
    animation: 150,
    ghostClass: 'is-sorting',
    store: {
        set: (sortable) => {
            const order = sortable.toArray();
            matrices = order.map((id) => {
                return matrices.find((mat) => mat.id === parseInt(id));
            });

            draw();
        },
    },
});

tippy('#basis-header', {
    content: `
    <p>See how the î and ĵ vectors are affected by the transformation.</p>
    `,
    allowHTML: true,
    placement: 'bottom-start',
    arrow: false,
    animation: 'fade',
});

tippy('#matrices-header', {
    content: `
    <p>Add matrices to transform the space.</p>
    <p>
        Matrices are applied top to bottom. Drag the matrix cards to
        change the order. Drag a cell to change its value.
    </p>
    `,
    allowHTML: true,
    placement: 'bottom-start',
    arrow: false,
    animation: 'fade',
});

tippy('#vectors-header', {
    content: `
    <p>Observe how the position of vectors changes.</p>
    <p>Drag a cell to change its value.</p>
    `,
    allowHTML: true,
    placement: 'bottom-start',
    arrow: false,
    animation: 'fade',
});

tippy('#points-header', {
    content: `
    <p>Observe how the position of points changes.</p>
    <p>Drag a cell to change its value.</p>
    `,
    allowHTML: true,
    placement: 'bottom-start',
    arrow: false,
    animation: 'fade',
});
