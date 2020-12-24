<template>
  <v-container fluid>
    <div :style="gridContainerStyles" class="mx-auto">
      <div class="grid-container pa-4">
        <v-row v-for="(tRow, r) in grid" :key="'row-'+r" no-gutters>
          <Terrain cols="1" v-for="(tSquare, c) in tRow" :key="'ti-'+r+'-'+c" :value="tSquare" :row="r" :col="c" />
        </v-row>
      </div>
    </div>
    <v-container>
    <v-row class="mt-10" justify="center">
      
        <v-btn small @click="startLifecycle" :disabled="!pause">START</v-btn>
        <v-btn small @click="stopLifecycle" :disabled="pause">STOP</v-btn>
    </v-row>
    <v-row class="mt-10" justify="center">
      <v-btn small @click="timeOut=timeOut+200">SLOWER</v-btn>
      <v-btn small @click="timeOut>50 ? timeOut=timeOut-50 : timeOut=timeOut">FASTER</v-btn>
      <v-btn small @click="evaluateGrid">EVAL</v-btn>
      <v-btn small @click="stopLifecycle">RESET</v-btn>
    </v-row>
    <v-row class="mt-10" justify="center">
      <v-col cols="12" v-if="!pause" class="text-center">
        <p>Running</p>
        {{timeOut}}
      </v-col>
    </v-row>
    </v-container>
  </v-container>
</template>

<style lang="scss" scoped>
.grid-container {
  overflow: hidden;
  background: #A1887F;
}
</style>

<script lang="ts">
import Vue from 'vue';
// import workerpool from 'workerpool';
// import chance from 'chance';
import Terrain from '@/components/Terrain.vue';

import { MediumGrid as grid } from '@/forest-data';

// const Chance = new chance();

function randn(n: number) {
  const num = Math.floor(Math.random() * 1000) + 1;
  return n >= num;
}
function randnf(n: number) {
  const num = Math.floor(Math.random() * 10000) + 1;
  return n >= num;
}
// const pool = workerpool.pool();

export default Vue.extend({
  name: 'Home',
  components: {
    Terrain
  },
  computed: {
    gridContainerStyles(): string {
      const containerWidth = this.grid[0].length + 2;
      return `width: ${containerWidth}em;`;
    },
    // hashTable() {
    //   const table: { [key: string]: number } = {};
    //   this.grid.forEach((row, r) => {
    //     row.forEach((col: number, c) => {
    //       const hashKey = `r${r}c${c}`;
    //       table[hashKey] = col;
    //     });
    //   });
    //   return table;
    // }
  },
  methods:{
    evaluateGrid() {
      // this.transformGrid = JSON.parse(JSON.stringify(this.grid));
      // this.transformGrid = {};
      
      const updatedGrid = this.grid.map((row, r) => {
        return row.map((terrain, c) => {
          return this.terrainTransform(r, c, terrain);
        });
      });

      this.grid = updatedGrid;
      this.transformGrid = {};

      if(!this.pause) {
        setTimeout(() => this.evaluateGrid(), this.timeOut);
      } else if(this.resetCycle) {
        this.grid = grid;
      }
    },
    terrainTransform(r: number, c: number, value: number): number {
      let returnValue = value;
      if(value ===0) {
        // empty
        returnValue = this.evalEmpty(r, c);
      } else if(value === 1) {
        // tree
        // add logic, burn if neighbor burning
        returnValue = this.evaluateTree(r, c);
      } else if(value===2) {
        return 0;
      }
      return returnValue;
    },
    evalEmpty(r: number, c: number): number {
      const coords = [];
      const gridRowsLength = this.grid.length - 1;
      const gridColsLength = this.grid[0].length - 1;

 
      if(r > 0) coords.push({ r: r-1, c }); // top col
      if(r < gridRowsLength) coords.push({ r: r+1, c }); // lower col
      if(c > 0) coords.push({ r, c: c-1 }); // left col
      if(c < gridColsLength) coords.push({ r, c: c+1 }); // right col
      
      // ext
      if(r > 1) coords.push({ r: r-2, c }); // top + 1 col
      if(r > 1 && r < gridRowsLength-1) coords.push({ r: r+2, c }); // lower col
      if(c > 1) coords.push({ r, c: c-2 }); // left col
      if(c > 1 && c < gridColsLength-1) coords.push({ r, c: c+2 }); // right col

      if(r > 0) coords.push({ r: r-1, c: c-1 }); // upper left col
      if(r > 0 && r < gridRowsLength) coords.push({ r: r-1, c: c+1 }); // upper right

      if(r > 1 && r < gridRowsLength-1) coords.push({ r: r+1, c: c+1 }); // lower col
      if(r > 1 && r < gridRowsLength-1) coords.push({ r: r+1, c: c-1 }); // lower col
      
      let neighborsOnFire = 0;
      let neighborTrees = 0;

      coords.forEach((coord) => {
        // const kn = `r${coord.r}c${coord.c}`;
        // if(typeof this.transformGrid[kn] !== 'undefined'){
        //   return this.transformGrid[kn] == 2;
        // }
        const gridValue = this.grid[coord.r][coord.c];
        // this.transformGrid[kn] = gridValue;
        
        if(gridValue == 2) neighborsOnFire++;
        if(gridValue == 1) neighborTrees++;

      });
      let probNewTree = 40;
      if(neighborsOnFire > 0){
        probNewTree = 0;
      } else if(neighborTrees > 0) {
        probNewTree = probNewTree + (neighborTrees * 150);
      }
      // console.log(coords);
      // console.log(neighborsOnFire, neighborTrees, probNewTree);
      return randn(probNewTree) && randn(probNewTree) ? 1 : 0;
    },
    neighbors(r: number, c: number) {
      const coords = [];
      const gridRowsLength = grid.length - 1;
      const gridColsLength = grid[0].length - 1;
      if(r > 0){
        if(c > 0) coords.push({ r: r-1, c: c-1 }); // upper left col
        coords.push({ r: r-1, c }); // top center
        if(r < gridRowsLength) coords.push({ r: r-1, c: c+1 }); // upper right
      }
      if(c < gridColsLength) coords.push({ r, c: c+1 }); // right col
      if(r > 1 && r < gridRowsLength-1) coords.push({ r: r+1, c: c+1 }); // lower right col
      if(r < gridRowsLength) coords.push({ r: r+1, c }); // bottom center
      if(c > 0 && r < gridRowsLength) coords.push({ r: r+1, c: c-1 }); // bottom left
      if(c > 0) coords.push({ r, c: c-1 }); // left col


    },
    evaluateTree(r: number, c: number): number {
      const coords = [];
      const coordsExtended = [];

      const gridRowsLength = grid.length - 1;
      const gridColsLength = grid[0].length - 1;

      if(r > 0) coords.push({ r: r-1, c }); // top col
      if(r < gridRowsLength) coords.push({ r: r+1, c }); // lower col
      if(c > 0) coords.push({ r, c: c-1 }); // left col
      if(c < gridColsLength) coords.push({ r, c: c+1 }); // right col
      
      // ext
      if(r > 1) coordsExtended.push({ r: r-2, c }); // top + 1 col
      if(r > 2) coordsExtended.push({ r: r-3, c }); // top + 1 col
      if(r > 1 && r < gridRowsLength-1) coordsExtended.push({ r: r+2, c }); // lower col
      if(r < gridRowsLength-2) coordsExtended.push({ r: r+3, c }); // lower col
      if(c > 1) coordsExtended.push({ r, c: c-2 }); // left col
      if(c > 2) coordsExtended.push({ r, c: c-3 }); // left col
      if(c > 1 && c < gridColsLength-1) coordsExtended.push({ r, c: c+2 }); // right col
      if(c > 1 && c < gridColsLength-2) coordsExtended.push({ r, c: c+3 }); // right col

      if(r > 0) coordsExtended.push({ r: r-1, c: c-1 }); // upper left col
      if(r > 0 && r < gridRowsLength) coordsExtended.push({ r: r-1, c: c+1 }); // upper right

      if(r > 1 && r < gridRowsLength-1) coordsExtended.push({ r: r+1, c: c+1 }); // lower col
      if(r > 1 && r < gridRowsLength-1) coordsExtended.push({ r: r+1, c: c-1 }); // lower col
      // console.log(coordsExtended);
      const neighbors = coords.filter((coord) => {
        const kn = `r${coord.r}c${coord.c}`;
        if(typeof this.transformGrid[kn] !== 'undefined'){
          // console.log('hashkey');
          if(this.grid[coord.r][coord.c] != this.transformGrid[kn]){
            console.error('********');
            console.log('hashkey: ', kn);
            console.log('gridkey: ', `r${coord.r}c${coord.c}`);
            console.log(`grid: ${coord.r},${coord.c}`, this.grid[coord.r][coord.c]);
            console.log(`hash: ${coord.r},${coord.c}`, this.transformGrid[kn]);
            console.error('********');
          }
          return this.transformGrid[kn] == 2;
        }
        const gridValue = this.grid[coord.r][coord.c];
        this.transformGrid[kn] = gridValue;
        return gridValue == 2;
      });
      
      const neighborsExtended = coordsExtended.filter((coord) => {
        const kne = `r${coord.r}c${coord.c}`;
        if(typeof this.transformGrid[kne] !== 'undefined'){
          // return this.transformGrid[kne] == 2;
        }

        const gridValueNe = this.grid[coord.r][coord.c];
        // this.transformGrid[kne] = gridValueNe;
        return gridValueNe == 2;
      }); 

      if(neighbors.length > 0) {
        // Neighbor on fire, tree ignites
        return 2;
      } else if(neighborsExtended.length > 0) {
        const prob = neighborsExtended.length * 150;
        return randn(prob) ? 2 : 1;
      } else {
        return randnf(30) && randnf(40) ? 2 : 1;
      }
    },
    startLifecycle() {
      this.pause = false;
      this.evaluateGrid();
    },
    stopLifecycle() {
      this.pause = true;
    }
  },
  data: () => ({
    grid: grid,
    transformGrid: {} as any,
    timeOut: 10,
    resetCycle: false,
    pause: true,
    square: {
      width: 2.5,
      height: 2.5
    }
  }),
});
</script>
