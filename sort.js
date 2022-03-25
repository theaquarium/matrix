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
