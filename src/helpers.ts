interface GridMap {
  [key: string]: number;
}

interface NeighborMap {
  [key: string]: string[];
}

// extended neighbors

interface FullEcosystem {
  grid: GridMap;
  neighbors: NeighborMap;
}

class GridEcosystem {

  rows: number;
  cols: number;
  grid: GridMap;
  neighbors: NeighborMap;
  extendedNeighbors: NeighborMap;

  // extended neighbors

  constructor(rows: number, cols: number) {
    this.rows = rows;
    this.cols = cols;

    const { grid, neighbors, extendedNeighbors } = this.createGrid();
    this.grid = grid;
    this.neighbors = neighbors;
    this.extendedNeighbors = extendedNeighbors;
    // extended neighbors
  }

  createGrid(): FullEcosystem {

    const rows = this.rows;
    const cols = this.cols;

    const grid = {};
    const neighbors = {};
    const extendedNeighbors = {};
  
    for(let $r=0; $r<rows; $r++) {
      for(let $c=0; $c<cols; $c++) {
        const cellKey = this.cellKey($r, $c);
        grid[cellKey] = 0;
        neighbors[cellKey] = this.validNeighbors($r, $c);
        extendedNeighbors[cellKey] = this.validExtendedNeighbors($r, $c);
        // extended neighbors
      }
    }
  
    return {
      grid,
      neighbors,
      extendedNeighbors
    }
  
  }

  cellKey(r: number, c: number): string {
    return `r${r}c${c}`;
  }
  
  validNeighbors(r: number, c: number): string[] {
    const validNeighbors = [
      { r: r-1, c: c-1 }, // upper left
      { r: r-1, c }, // top center
      { r: r-1, c: c+1 }, // upper right
      { r, c: c+1 }, // right col
      { r: r+1, c: c+1 }, // lower right col
      { r: r+1, c }, // bottom center
      { r: r+1, c: c-1 }, // bottom left
      { r, c: c-1 } // left col
    ]
    .filter((coord) => this.validGridCoord(coord.r, coord.c))
    .map((coord) => this.cellKey(coord.r, coord.c));
  
    return validNeighbors;
  }

  validExtendedNeighbors(r: number, c: number): string[] {
    const validExtNeighbors = [
      { r: r-2, c }, // top center
      { r, c: c+2 }, // center right
      { r: r+2, c }, // bottom center
      { r, c: c-2 }, // center left

    // { r: r-2, c: c-1 }, // top center left
    // { r: r-2, c: c+1 }, // top center right
    // { r: r+2, c: c-1 }, //bottom center left
    // { r: r+2, c: c+1 }, // bottom center right
    // { r: r-1, c: c-2 }, // center left top
    // { r: r+1, c: c-2 }, // center left
    // { r: r-1, c: c+2 }, // center right
    // { r: r+1, c: c+2 } // center right
    ]
    .filter((coord) => this.validGridCoord(coord.r, coord.c))
    .map((coord) => this.cellKey(coord.r, coord.c));
  
    return validExtNeighbors;
  }

  validGridCoord(r: number, c: number): boolean {
    if(r < 0 || r > this.rows - 1) return false;
    if(c < 0 || c > this.cols - 1) return false;
    return true;
  }

}

function createNeighborMap(rows: number, columns: number): NeighborMap {
  return {
    'r1c1': []
  }
}


export {
  GridEcosystem
}