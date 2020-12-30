function createGrid(rows: number, cols: number): number[][] {
    return new Array(rows).fill(Array(cols).fill(0));
}

const gridType: number[][] = [];

const gridDefault = createGrid(10,10);

export {
    createGrid,
    gridType,
    gridDefault
};