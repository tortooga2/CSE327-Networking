export const CompareFuncs = {
    id: (sortOrder) => (a, b) => {
        const fa = a[sortOrder.field];
        const fb = b[sortOrder.field];

        return sortOrder.order === "desc" ? fb - fa : fa - fb;
    },
};
